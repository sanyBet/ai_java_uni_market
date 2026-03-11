import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import type { Address } from './AddressManagePage';

const orderItems = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
    title: '时尚运动鞋 男女同款',
    spec: '颜色:黑色 尺码:42',
    price: 299,
    quantity: 1,
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
    title: '智能手表 运动健康监测',
    spec: '颜色:银色',
    price: 899,
    quantity: 1,
  },
];

const paymentMethods = [
  {
    id: 'wechat',
    name: '微信支付',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-6 h-6">
        <path fill="#09BB07" d="M385.3 631.5c-13.5 13.5-31.6 21.5-51.4 21.5-40.3 0-72.9-32.6-72.9-72.9s32.6-72.9 72.9-72.9c19.8 0 37.9 8 51.4 21.5l161.5-75.4c-3.8-14.4-5.9-29.4-5.9-45 0-91.4 74.1-165.5 165.5-165.5s165.5 74.1 165.5 165.5-74.1 165.5-165.5 165.5c-39.4 0-75.5-13.8-104-36.8L385.3 631.5zm321.2-253.4c-31.8 0-57.6 25.8-57.6 57.6s25.8 57.6 57.6 57.6 57.6-25.8 57.6-57.6-25.8-57.6-57.6-57.6zM333.9 565.2c-24.7 0-44.7 20-44.7 44.7s20 44.7 44.7 44.7 44.7-20 44.7-44.7-20-44.7-44.7-44.7z" />
        <path fill="#09BB07" d="M891.7 637.4c5-17.3 7.7-35.6 7.7-54.6 0-109.3-88.6-197.9-197.9-197.9S503.6 473.5 503.6 582.8s88.6 197.9 197.9 197.9c38.7 0 74.8-11.1 105.3-30.3l137.5 67.8-52.6-180.8z" />
      </svg>
    ),
  },
  {
    id: 'alipay',
    name: '支付宝',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-6 h-6">
        <path fill="#1677FF" d="M789.8 364.8c46.4 0 84 37.6 84 84v262.4c0 46.4-37.6 84-84 84H234.2c-46.4 0-84-37.6-84-84V448.8c0-46.4 37.6-84 84-84h555.6m0-64H234.2c-81.6 0-148 66.4-148 148v262.4c0 81.6 66.4 148 148 148h555.6c81.6 0 148-66.4 148-148V448.8c0-81.6-66.4-148-148-148z" />
        <path fill="#1677FF" d="M768.5 573.9c-58.7-27.7-120.5-57.6-163.2-80.9 13.1-21.1 24.1-43.7 32.5-67.4h97.6v-28.1H572.2v-48.7h-51.8v48.7H357.2v28.1h169.9c-7.5 28.1-18.7 54.7-33.4 79.1-42.9-26.1-82.7-49.9-116.5-69.9l-25.6 39.9c37.5 22.1 80.1 48.1 125.9 76.1-59.2 74.6-140.8 136.5-229.4 175.3l29.4 44.7c91.2-41.5 174.9-103.1 236.8-175.9 65.6 41.5 136.5 87.4 207.4 133.9l26.2-50.6c-70.9-45.9-141.8-91.2-207.4-132.7 36.2-50.6 64.3-106.8 82.7-167.4h0.6c39.3 19.3 107.4 52.4 165.5 78.7l24.7-50z" />
      </svg>
    ),
  },
  {
    id: 'balance',
    name: '余额支付',
    icon: (
      <svg viewBox="0 0 1024 1024" className="w-6 h-6">
        <path fill="#FF6A00" d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z" />
        <path fill="#FF6A00" d="M559.7 488.8l91.1-91.1c6.3-6.3 6.3-16.4 0-22.6l-22.6-22.6c-6.3-6.3-16.4-6.3-22.6 0l-91.1 91.1-91.1-91.1c-6.3-6.3-16.4-6.3-22.6 0l-22.6 22.6c-6.3 6.3-6.3 16.4 0 22.6l91.1 91.1-91.1 91.1c-6.3 6.3-16.4 6.3-22.6 0l22.6 22.6c6.3 6.3 16.4 6.3 22.6 0l91.1-91.1 91.1 91.1c6.3 6.3 16.4 6.3 22.6 0l22.6-22.6c6.3-6.3 6.3-16.4 0-22.6l-91.1-91.1z" />
        <path fill="#FF6A00" d="M420 517h184c4.4 0 8 3.6 8 8v48c0 4.4-3.6 8-8 8H420c-4.4 0-8-3.6-8-8v-48c0-4.4 3.6-8 8-8z" />
      </svg>
    ),
  },
];

export function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedPayment, setSelectedPayment] = useState('wechat');
  const [currentAddress, setCurrentAddress] = useState<Address>({
    id: '1',
    name: '张三',
    phone: '138****8888',
    province: '浙江省',
    city: '杭州市',
    district: '西湖区',
    detail: '文三路XX号XX大厦XX室',
    isDefault: true,
  });

  // 监听从地址管理页面返回的选中地址
  useEffect(() => {
    if (location.state?.selectedAddress) {
      setCurrentAddress(location.state.selectedAddress);
    }
  }, [location.state]);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const shipping = 10;
  const discount = 20;
  const total = subtotal + shipping - discount;

  const handleAddressClick = () => {
    navigate('/address?select=true');
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">确认订单</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="bg-white mt-2 px-4 py-4 cursor-pointer" onClick={handleAddressClick}>
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-red-500 mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium">{currentAddress.name}</span>
              <span className="text-gray-600">{currentAddress.phone}</span>
            </div>
            <p className="text-sm text-gray-600">
              {currentAddress.province}
              {currentAddress.city}
              {currentAddress.district}
              {currentAddress.detail}
            </p>
          </div>
          <ChevronRight className="w-5 h-5 text-gray-400 mt-1" />
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-semibold mb-4">商品清单</h2>
        {orderItems.map((item) => (
          <div key={item.id} className="flex gap-3 mb-4 last:mb-0">
            <div className="w-20 h-20 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
              <ImageWithFallback
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">
                {item.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{item.spec}</p>
              <div className="flex items-center justify-between">
                <span className="text-red-500 font-semibold">¥{item.price}</span>
                <span className="text-sm text-gray-600">x{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Price Details */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-semibold mb-4">价格明细</h2>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">商品金额</span>
            <span className="text-gray-800">¥{subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">运费</span>
            <span className="text-gray-800">¥{shipping}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">优惠</span>
            <span className="text-red-500">-¥{discount}</span>
          </div>
          <div className="border-t pt-3 flex justify-between">
            <span className="font-semibold">实付款</span>
            <span className="text-red-500 text-lg font-semibold">¥{total}</span>
          </div>
        </div>
      </div>

      {/* Payment Method */}
      <div className="bg-white mt-2 px-4 py-4">
        <h2 className="font-semibold mb-4">支付方式</h2>
        <div className="space-y-3">
          {paymentMethods.map((method) => (
            <button
              key={method.id}
              onClick={() => setSelectedPayment(method.id)}
              className="w-full flex items-center justify-between p-3 border rounded-lg"
            >
              <div className="flex items-center gap-3">
                {method.icon}
                <span className="text-gray-800">{method.name}</span>
              </div>
              <div
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  selectedPayment === method.id
                    ? 'border-red-500'
                    : 'border-gray-300'
                }`}
              >
                {selectedPayment === method.id && (
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Submit Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-[390px] mx-auto px-4 py-3 flex items-center justify-between">
          <div>
            <span className="text-sm text-gray-600">应付金额：</span>
            <span className="text-red-500 text-xl font-semibold ml-1">
              ¥{total}
            </span>
          </div>
          <button
            onClick={() => navigate('/order-success')}
            className="px-8 py-2 bg-red-500 text-white rounded-full font-medium"
          >
            提交订单
          </button>
        </div>
      </div>
    </div>
  );
}