import React, { useState, useCallback, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Pressable, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAiControllerChat } from '@/src/api/generated/api';
import { useUserControllerGetPlan } from '@/src/api/generated/api';
import type { ChatMessageDto } from '@/src/api/generated/schemas';
import { colors, spacing, borderRadius } from '@/src/theme';

const SUGGESTED_PROMPTS = [
  'What did I spend most on?',
  'How can I save money?',
  'Compare this month to last',
  'What subscriptions can I cancel?',
];

export default function ChatScreen() {
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string | undefined>(undefined);
  const listRef = useRef<FlatList>(null);

  const chatMutation = useAiControllerChat();
  const plan = useUserControllerGetPlan();
  const planData = plan?.data;
  const queriesUsed = planData?.aiQueriesUsed ?? 0;
  const queriesLimit = planData?.aiQueriesLimit ?? 10;
  const isFree = planData?.tier === 'FREE';
  const isExhausted = isFree && queriesLimit > 0 && queriesUsed >= queriesLimit;

  const sendMessage = useCallback(async (text: string) => {
    if (!text?.trim()) return;
    const userMsg: ChatMessageDto = { id: Date.now().toString(), role: 'user', content: text, createdAt: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');

    chatMutation.mutate(
      { data: { message: text, conversationId } },
      {
        onSuccess: (data) => {
          if (data?.conversationId) setConversationId(data.conversationId);
          if (data?.message) {
            setMessages((prev) => [...prev, data.message]);
          }
          plan.refetch();
        },
        onError: () => {
          setMessages((prev) => [...prev, { id: 'err-' + Date.now(), role: 'assistant', content: 'Sorry, I could not process your request. Please try again.', createdAt: new Date().toISOString() }]);
        },
      },
    );
  }, [conversationId, chatMutation, plan]);

  return (
    <KeyboardAvoidingView style={[styles.container, { paddingTop: insets.top }]} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={styles.header}>
        <Ionicons name="sparkles" size={24} color={colors.accent} />
        <Text style={styles.title}>AI Assistant</Text>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item?.id ?? Math.random().toString()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item?.role === 'user' ? styles.userBubble : styles.aiBubble]}>
            <Text style={[styles.bubbleText, item?.role === 'user' ? styles.userText : styles.aiText]}>{item?.content ?? ''}</Text>
          </View>
        )}
        contentContainerStyle={styles.chatList}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListEmptyComponent={
          <View style={styles.emptyChat}>
            <Ionicons name="chatbubble-ellipses-outline" size={64} color={colors.muted} />
            <Text style={styles.emptyTitle}>Ask me anything about your finances</Text>
            <View style={styles.promptsRow}>
              {SUGGESTED_PROMPTS.map((p) => (
                <Pressable key={p} style={styles.promptChip} onPress={() => sendMessage(p)}>
                  <Text style={styles.promptText}>{p}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        }
      />

      {chatMutation.isPending && (
        <View style={styles.typingRow}>
          <ActivityIndicator size="small" color={colors.accent} />
          <Text style={styles.typingText}>AI is thinking...</Text>
        </View>
      )}

      <View style={[styles.inputBar, { paddingBottom: Math.max(insets.bottom, spacing.sm) }]}>
        {isFree && !isExhausted && (
          <Text style={styles.queryCounter}>{queriesUsed}/{queriesLimit} queries</Text>
        )}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder={isExhausted ? 'Upgrade to Pro for unlimited queries' : 'Ask about your finances...'}
            placeholderTextColor={colors.muted}
            value={input}
            onChangeText={setInput}
            editable={!isExhausted && !chatMutation.isPending}
            multiline
          />
          <Pressable
            style={[styles.sendButton, (!input?.trim() || chatMutation.isPending) && { opacity: 0.5 }]}
            onPress={() => sendMessage(input)}
            disabled={!input?.trim() || chatMutation.isPending || isExhausted}
          >
            <Ionicons name="send" size={20} color={colors.white} />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.base },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.md, gap: spacing.sm },
  title: { color: colors.heading, fontSize: 24, fontWeight: '700' },
  chatList: { flexGrow: 1, paddingHorizontal: spacing.lg, paddingBottom: spacing.md },
  bubble: { maxWidth: '80%', paddingHorizontal: spacing.md, paddingVertical: 10, borderRadius: borderRadius.lg, marginBottom: spacing.sm },
  userBubble: { alignSelf: 'flex-end', backgroundColor: colors.primary },
  aiBubble: { alignSelf: 'flex-start', backgroundColor: colors.card, borderWidth: 1, borderColor: colors.accent + '30' },
  bubbleText: { fontSize: 15, lineHeight: 22 },
  userText: { color: colors.white },
  aiText: { color: colors.body },
  emptyChat: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyTitle: { color: colors.muted, fontSize: 16, marginTop: spacing.md, textAlign: 'center' },
  promptsRow: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginTop: spacing.lg, gap: spacing.sm },
  promptChip: { backgroundColor: colors.surface, paddingHorizontal: 14, paddingVertical: 8, borderRadius: borderRadius.full, borderWidth: 1, borderColor: colors.cardBorder },
  promptText: { color: colors.body, fontSize: 13 },
  typingRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.lg, paddingVertical: spacing.xs, gap: spacing.sm },
  typingText: { color: colors.muted, fontSize: 13 },
  inputBar: { borderTopWidth: 1, borderTopColor: colors.cardBorder, paddingHorizontal: spacing.lg, paddingTop: spacing.sm },
  queryCounter: { color: colors.accent, fontSize: 12, marginBottom: 4, textAlign: 'right' },
  inputRow: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.sm },
  input: { flex: 1, backgroundColor: colors.inputBg, borderRadius: borderRadius.lg, paddingHorizontal: spacing.md, paddingVertical: 10, color: colors.heading, fontSize: 15, maxHeight: 100 },
  sendButton: { width: 40, height: 40, borderRadius: 20, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
});
