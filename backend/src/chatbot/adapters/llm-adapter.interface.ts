export interface LlmAdapterInterface {
  sendMessage(message: string, context?: any): Promise<string>;
  streamResponse?(message: string, context?: any): AsyncGenerator<string>;
}

export class StubLlmAdapter implements LlmAdapterInterface {
  async sendMessage(message: string, context?: any): Promise<string> {
    const lowerMessage = message.toLowerCase();

    if (lowerMessage.includes('salary') || lowerMessage.includes('payroll')) {
      return 'You can view your salary slip in the Payroll section. If you need corrections, submit a request through the Salary Corrections page.';
    }

    if (lowerMessage.includes('leave') || lowerMessage.includes('vacation')) {
      return 'For leave requests, please contact your manager or use the leave management system.';
    }

    if (lowerMessage.includes('promotion')) {
      return 'Promotion proposals are reviewed by management. You can check the status in the Promotions panel.';
    }

    if (lowerMessage.includes('job profile') || lowerMessage.includes('role')) {
      return 'Your current job profile and history can be viewed in the Employee Profile section.';
    }

    return `Thank you for your message: "${message}". This is a stub response. Real LLM integration can be added via the adapter interface.`;
  }
}
