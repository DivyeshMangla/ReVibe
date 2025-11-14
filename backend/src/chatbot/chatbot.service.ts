import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SendMessageDto } from './dto/send-message.dto';
import { StubLlmAdapter, LlmAdapterInterface } from './adapters/llm-adapter.interface';

@Injectable()
export class ChatbotService {
  private prisma = new PrismaClient();
  private llmAdapter: LlmAdapterInterface;

  constructor() {
    this.llmAdapter = new StubLlmAdapter();
  }

  async sendMessage(sendMessageDto: SendMessageDto, userId: string) {
    const { message } = sendMessageDto;

    const response = await this.llmAdapter.sendMessage(message, { userId });

    const chatMessage = await this.prisma.chatMessage.create({
      data: {
        userId,
        message,
        response
      }
    });

    return {
      id: chatMessage.id,
      message: chatMessage.message,
      response: chatMessage.response,
      timestamp: chatMessage.timestamp
    };
  }

  async getHistory(userId: string) {
    return this.prisma.chatMessage.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
      take: 50
    });
  }

  setLlmAdapter(adapter: LlmAdapterInterface) {
    this.llmAdapter = adapter;
  }
}
