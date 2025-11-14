import { useState } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { apiClient } from '@/api/client';

export function ChatbotPanel() {
  const [message, setMessage] = useState('');

  const { data: history } = useQuery({
    queryKey: ['chat-history'],
    queryFn: () => apiClient.get('/chatbot/history/user-id-stub').then(res => res.data),
  });

  const sendMutation = useMutation({
    mutationFn: (msg: string) => 
      apiClient.post('/chatbot/message', { message: msg }).then(res => res.data),
    onSuccess: () => {
      setMessage('');
    },
  });

  const handleSend = () => {
    if (message.trim()) {
      sendMutation.mutate(message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">HR Chatbot</h1>

      <div className="bg-white rounded-lg shadow h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {history?.map((chat: any) => (
            <div key={chat.id} className="space-y-2">
              <div className="flex justify-end">
                <div className="bg-primary-600 text-white rounded-lg px-4 py-2 max-w-md">
                  {chat.message}
                </div>
              </div>
              {chat.response && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2 max-w-md">
                    {chat.response}
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {sendMutation.isPending && (
            <div className="flex justify-start">
              <div className="bg-gray-200 text-gray-900 rounded-lg px-4 py-2">
                Thinking...
              </div>
            </div>
          )}
        </div>

        <div className="border-t p-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Ask me anything about HR or payroll..."
              className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <button
              onClick={handleSend}
              disabled={!message.trim() || sendMutation.isPending}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
