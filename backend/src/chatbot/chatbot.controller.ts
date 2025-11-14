import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { ChatbotService } from './chatbot.service';
import { SendMessageDto } from './dto/send-message.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('chatbot')
@UseGuards(JwtAuthGuard)
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @Post('message')
  sendMessage(@Body() sendMessageDto: SendMessageDto, @Request() req) {
    return this.chatbotService.sendMessage(sendMessageDto, req.user.userId);
  }

  @Get('history/:userId')
  getHistory(@Param('userId') userId: string) {
    return this.chatbotService.getHistory(userId);
  }
}
