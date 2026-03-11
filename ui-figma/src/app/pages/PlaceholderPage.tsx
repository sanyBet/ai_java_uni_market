import { ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router';

interface PlaceholderPageProps {
  title: string;
  description?: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">{title}</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col items-center justify-center py-20 px-4">
        <div className="text-6xl mb-4">🚧</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
        <p className="text-gray-500 text-center">
          {description || '此功能正在开发中，敬请期待...'}
        </p>
      </div>
    </div>
  );
}

export function SupportPage() {
  return <PlaceholderPage title="客服支持" description="在线客服功能即将上线" />;
}

export function SettingsPage() {
  return <PlaceholderPage title="设置" description="设置功能即将上线" />;
}