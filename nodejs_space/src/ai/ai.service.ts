import { Injectable, ForbiddenException, NotFoundException, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

function toNum(v: any): number {
  if (v instanceof Decimal) return Number(v);
  return Number(v ?? 0);
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);

  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
  ) {}

  private async checkAndIncrementQuota(userId: string) {
    const plan = await this.prisma.userPlan.findUnique({ where: { userId } });
    if (!plan) return;
    // Reset monthly counter if needed
    const periodStart = new Date(plan.currentPeriodStart);
    const daysSince = (Date.now() - periodStart.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSince > 30) {
      await this.prisma.userPlan.update({
        where: { userId },
        data: { aiQueriesUsed: 1, currentPeriodStart: new Date() },
      });
      return;
    }
    if (plan.tier === 'FREE' && plan.aiQueriesUsed >= 10) {
      throw new ForbiddenException('Monthly AI query limit reached. Upgrade to Pro.');
    }
    await this.prisma.userPlan.update({
      where: { userId },
      data: { aiQueriesUsed: { increment: 1 } },
    });
  }

  private async buildFinancialContext(userId: string): Promise<string> {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const [subs, recentExpenses] = await Promise.all([
      this.prisma.subscription.findMany({ where: { userId } }),
      this.prisma.expense.findMany({
        where: { userId, date: { gte: monthStart, lt: monthEnd } },
        orderBy: { date: 'desc' },
        take: 20,
      }),
    ]);

    const subText = subs.length > 0
      ? subs.map((s) => `- ${s.name}: $${toNum(s.amount)}/${s.billingCycle} (${s.category})`).join('\n')
      : 'No subscriptions.';
    const expText = recentExpenses.length > 0
      ? recentExpenses.map((e) => `- ${e.title}: $${toNum(e.amount)} on ${e.date.toISOString().split('T')[0]} (${e.category})`).join('\n')
      : 'No recent expenses.';
    const totalSubMonthly = subs.reduce((acc, s) => {
      if (s.billingCycle === 'weekly') return acc + toNum(s.amount) * 4.33;
      if (s.billingCycle === 'yearly') return acc + toNum(s.amount) / 12;
      return acc + toNum(s.amount);
    }, 0);
    const totalExpMonth = recentExpenses.reduce((acc, e) => acc + toNum(e.amount), 0);

    return `User's Financial Summary:\n- Monthly subscription cost: $${totalSubMonthly.toFixed(2)}\n- This month's expenses: $${totalExpMonth.toFixed(2)}\n\nActive Subscriptions:\n${subText}\n\nRecent Expenses (this month):\n${expText}`;
  }

  async chat(userId: string, message: string, conversationId?: string) {
    await this.checkAndIncrementQuota(userId);

    let convId = conversationId;
    if (!convId) {
      const conv = await this.prisma.conversation.create({ data: { userId } });
      convId = conv.id;
    } else {
      const conv = await this.prisma.conversation.findFirst({ where: { id: convId, userId } });
      if (!conv) throw new NotFoundException('Conversation not found');
    }

    // Save user message
    await this.prisma.message.create({ data: { conversationId: convId, role: 'user', content: message } });

    // Build context and call LLM
    const financialContext = await this.buildFinancialContext(userId);
    const recentHistory = await this.prisma.message.findMany({
      where: { conversationId: convId },
      orderBy: { createdAt: 'desc' },
      take: 20,
    });
    const history = recentHistory.reverse();

    const messages = [
      {
        role: 'system',
        content: `You are an AI financial assistant. Help the user manage their subscriptions and expenses. Be concise, helpful, and provide actionable advice.\n\n${financialContext}`,
      },
      ...history.map((m) => ({ role: m.role, content: m.content })),
    ];

    let aiContent = 'I apologize, but I\'m unable to process your request right now. Please try again later.';
    try {
      const apiKey = this.configService.get<string>('ABACUSAI_API_KEY');
      const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({ messages, stream: false }),
      });
      const data = await res.json();
      aiContent = data?.choices?.[0]?.message?.content ?? aiContent;
    } catch (error: any) {
      this.logger.error('LLM API error', error?.message);
    }

    const aiMessage = await this.prisma.message.create({
      data: { conversationId: convId, role: 'assistant', content: aiContent },
    });

    // Update conversation updatedAt
    await this.prisma.conversation.update({ where: { id: convId }, data: { updatedAt: new Date() } });

    return {
      conversationId: convId,
      message: {
        id: aiMessage.id,
        role: aiMessage.role,
        content: aiMessage.content,
        createdAt: aiMessage.createdAt.toISOString(),
      },
    };
  }

  async getConversations(userId: string) {
    const convos = await this.prisma.conversation.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
      include: { messages: { orderBy: { createdAt: 'desc' }, take: 1 } },
    });
    return {
      items: convos.map((c) => ({
        id: c.id,
        lastMessage: c.messages?.[0]?.content ?? '',
        updatedAt: c.updatedAt.toISOString(),
      })),
    };
  }

  async getMessages(userId: string, conversationId: string, page = 1, limit = 50) {
    const conv = await this.prisma.conversation.findFirst({ where: { id: conversationId, userId } });
    if (!conv) throw new NotFoundException('Conversation not found');
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      this.prisma.message.findMany({
        where: { conversationId },
        orderBy: { createdAt: 'asc' },
        skip,
        take: limit,
      }),
      this.prisma.message.count({ where: { conversationId } }),
    ]);
    return {
      items: items.map((m) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        createdAt: m.createdAt.toISOString(),
      })),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getSuggestions(userId: string) {
    // Check cache
    const recent = await this.prisma.aiSuggestion.findFirst({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
    });
    if (recent) {
      const hoursSince = (Date.now() - recent.generatedAt.getTime()) / (1000 * 60 * 60);
      if (hoursSince < 24) {
        const all = await this.prisma.aiSuggestion.findMany({
          where: { userId, generatedAt: recent.generatedAt },
          orderBy: { createdAt: 'asc' },
        });
        return {
          items: all.map((s) => ({ id: s.id, title: s.title, description: s.description, category: s.category, icon: s.icon })),
          generatedAt: recent.generatedAt.toISOString(),
        };
      }
    }

    // Generate new suggestions
    const financialContext = await this.buildFinancialContext(userId);
    const prompt = `Based on this user's financial data, provide 3-5 actionable cost-saving insights. Respond in JSON format with an array of objects with fields: title, description, category, icon (one of: lightbulb, warning, trending-down, star, shield).\n\n${financialContext}\n\nRespond with raw JSON only.`;

    let suggestions: { title: string; description: string; category: string; icon: string }[] = [
      { title: 'Track Your Spending', description: 'Start logging expenses daily to find saving opportunities.', category: 'general', icon: 'lightbulb' },
      { title: 'Review Subscriptions', description: 'Check for unused subscriptions you can cancel.', category: 'subscriptions', icon: 'warning' },
      { title: 'Set a Budget', description: 'Create monthly budgets for each spending category.', category: 'budgeting', icon: 'star' },
    ];

    try {
      const apiKey = this.configService.get<string>('ABACUSAI_API_KEY');
      const res = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          messages: [{ role: 'user', content: prompt }],
          response_format: { type: 'json_object' },
          stream: false,
        }),
      });
      const data = await res.json();
      const content = data?.choices?.[0]?.message?.content;
      if (content) {
        const parsed = JSON.parse(content);
        const arr = Array.isArray(parsed) ? parsed : parsed?.suggestions ?? parsed?.items ?? parsed?.insights ?? [];
        if (arr.length > 0) suggestions = arr.slice(0, 5);
      }
    } catch (error: any) {
      this.logger.error('LLM suggestions error', error?.message);
    }

    const generatedAt = new Date();
    const created = await Promise.all(
      suggestions.map((s) =>
        this.prisma.aiSuggestion.create({
          data: {
            userId,
            title: s.title ?? 'Insight',
            description: s.description ?? '',
            category: s.category ?? 'general',
            icon: s.icon ?? 'lightbulb',
            generatedAt,
          },
        }),
      ),
    );

    return {
      items: created.map((s) => ({ id: s.id, title: s.title, description: s.description, category: s.category, icon: s.icon })),
      generatedAt: generatedAt.toISOString(),
    };
  }
}
