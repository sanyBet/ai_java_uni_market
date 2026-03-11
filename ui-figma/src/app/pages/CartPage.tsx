import { useState } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

interface CartItem {
  id: number;
  image: string;
  title: string;
  spec: string;
  price: number;
  quantity: number;
  selected: boolean;
}

export function CartPage() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
      title: '时尚运动鞋 男女同款',
      spec: '颜色:黑色 尺码:42',
      price: 299,
      quantity: 1,
      selected: true,
    },
    {
      id: 2,
      image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
      title: '智能手表 运动健康监测',
      spec: '颜色:银色',
      price: 899,
      quantity: 1,
      selected: true,
    },
    {
      id: 3,
      image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?w=400',
      title: '无线蓝牙耳机 降噪',
      spec: '颜色:白色',
      price: 199,
      quantity: 2,
      selected: false,
    },
  ]);

  const allSelected = cartItems.length > 0 && cartItems.every((item) => item.selected);
  const selectedItems = cartItems.filter((item) => item.selected);
  const totalPrice = selectedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const toggleSelect = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const toggleSelectAll = () => {
    setCartItems(cartItems.map((item) => ({ ...item, selected: !allSelected })));
  };

  const updateQuantity = (id: number, delta: number) => {
    setCartItems(
      cartItems.map((item) => {
        if (item.id === id) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-32">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <h1 className="text-lg font-semibold text-center">购物车</h1>
      </div>

      {/* Cart Items */}
      <div className="mt-2">
        {cartItems.map((item) => (
          <div key={item.id} className="bg-white mb-2 px-4 py-3">
            <div className="flex gap-3">
              {/* Checkbox */}
              <div className="flex items-start pt-2">
                <input
                  type="checkbox"
                  checked={item.selected}
                  onChange={() => toggleSelect(item.id)}
                  className="w-5 h-5 accent-red-500"
                />
              </div>

              {/* Product Image */}
              <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <ImageWithFallback
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Product Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-sm text-gray-800 line-clamp-2 mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500">{item.spec}</p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 font-semibold">
                    ¥{item.price}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                    >
                      <Minus className="w-3 h-3 text-gray-600" />
                    </button>
                    <span className="text-sm w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 border border-gray-300 rounded flex items-center justify-center"
                    >
                      <Plus className="w-3 h-3 text-gray-600" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Delete Button */}
              <button
                onClick={() => removeItem(item.id)}
                className="text-gray-400 p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Bar */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-[390px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={allSelected}
                onChange={toggleSelectAll}
                className="w-5 h-5 accent-red-500"
              />
              <span className="text-sm">全选</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <span className="text-sm text-gray-600">合计：</span>
                <span className="text-red-500 text-xl font-semibold ml-1">
                  ¥{totalPrice}
                </span>
              </div>
              <button
                onClick={() => navigate('/checkout')}
                disabled={selectedItems.length === 0}
                className={`px-6 py-2 rounded-full text-white font-medium ${
                  selectedItems.length > 0
                    ? 'bg-red-500'
                    : 'bg-gray-300'
                }`}
              >
                结算({selectedItems.length})
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
