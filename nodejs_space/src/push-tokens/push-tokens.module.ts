import { Module } from '@nestjs/common';
import { PushTokensController } from './push-tokens.controller';

@Module({
  controllers: [PushTokensController],
})
export class PushTokensModule {}
