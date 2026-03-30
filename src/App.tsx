import { useEffect, useRef, useState } from 'react';

interface ChatPart {
  text: string;
}

interface ChatContent {
  role: 'user' | 'model' | 'assistant';
  parts: ChatPart[];
}

interface ChatResponse {
  response: string;
  history: ChatContent[];
}

function App() {
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<ChatContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 메시지가 추가될 때마다 하단으로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const handleSend = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    const userPrompt = prompt;
    setPrompt('');

    // 1. 사용자의 질문을 즉시 히스토리에 추가
    const newUserTurn: ChatContent = {
      role: 'user',
      parts: [{ text: userPrompt }],
    };
    const updatedHistoryWithUser = [...history, newUserTurn];
    setHistory(updatedHistoryWithUser);

    try {
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: userPrompt,
          history: history,
        }),
      });

      if (!response.body) return;

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let aiFullResponse = '';

      // AI 답변을 위한 새로운 턴 추가 (초기값은 비어있음)
      const aiInitialTurn: ChatContent = {
        role: 'model',
        parts: [{ text: '' }],
      };
      setHistory(prev => [...prev, aiInitialTurn]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiFullResponse += chunk;

        // 가장 최근의 AI 답변을 실시간으로 업데이트
        setHistory(prev => {
          const newHistory = [...prev];
          const lastIndex = newHistory.length - 1;
          newHistory[lastIndex] = {
            role: 'model',
            parts: [{ text: aiFullResponse }],
          };
          return newHistory;
        });
      }

      // 스트리밍 완료 후 최종적으로 상태 확정 (이미 위에서 실시간으로 하고 있으나,
      // 명시적으로 히스토리가 유지되도록 합니다.)
    } catch (error) {
      console.error('채팅 중 에러 발생:', error);
      alert('AI와 대화 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50 p-4 md:p-8 dark:bg-slate-900">
      <div className="mx-auto flex w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-slate-800">
        {/* Header */}
        <div className="bg-blue-600 p-4 text-center text-white shadow-md">
          <h1 className="text-xl font-bold">UOS AI Chatbot</h1>
          <p className="text-sm opacity-80">
            Connected to Gemini 3.1 Flash Lite
          </p>
        </div>

        {/* Chat Window */}
        <div
          ref={scrollRef}
          className="min-h-100 flex-1 space-y-4 overflow-y-auto p-4"
        >
          {history.length === 0 && (
            <div className="flex h-full items-center justify-center text-gray-400">
              대화를 시작해 보세요!
            </div>
          )}
          {history.map((item, index) => (
            <div
              key={index}
              className={`flex ${
                item.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                  item.role === 'user'
                    ? 'rounded-tr-none bg-blue-500 text-white'
                    : 'rounded-tl-none bg-gray-200 text-gray-800 dark:bg-slate-700 dark:text-gray-100'
                }`}
              >
                {item.parts.map((p, i) => (
                  <p key={i} className="whitespace-pre-wrap">
                    {p.text}
                  </p>
                ))}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] animate-pulse rounded-2xl rounded-tl-none bg-gray-200 px-4 py-2 dark:bg-slate-700">
                답변을 생성 중입니다...
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4 dark:border-slate-700">
          <div className="flex gap-2">
            <input
              type="text"
              className="flex-1 rounded-full border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none dark:border-slate-600 dark:bg-slate-700 dark:text-white"
              placeholder="메시지를 입력하세요..."
              value={prompt}
              onChange={e => setPrompt(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button
              onClick={handleSend}
              disabled={isLoading}
              className="rounded-full bg-blue-600 px-6 py-2 font-semibold text-white transition-colors hover:bg-blue-700 disabled:bg-gray-400"
            >
              전송
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
