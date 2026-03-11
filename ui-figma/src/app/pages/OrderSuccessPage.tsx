import { CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center px-4">
      <div className="bg-white rounded-lg p-8 w-full max-w-md text-center">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-500" />
          </div>
        </div>

        <h1 className="text-2xl font-semibold text-gray-800 mb-2">支付成功</h1>
        <p className="text-gray-500 mb-8">您的订单已提交，请耐心等待商品送达</p>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/orders')}
            className="w-full py-3 bg-red-500 text-white rounded-full font-medium"
          >
            查看订单
          </button>
          <button
            onClick={() => navigate('/')}
            className="w-full py-3 border border-gray-300 text-gray-700 rounded-full font-medium"
          >
            返回首页
          </button>
        </div>
      </div>
    </div>
  );
}
