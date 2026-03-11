import { Search, Zap, Tag, Gift, Flame } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState, useEffect } from 'react';

const banners = [
  'https://images.unsplash.com/photo-1766524871302-88590e1fa1bf?w=800',
  'https://images.unsplash.com/photo-1768839721483-c4501b5d6eb3?w=800',
  'https://images.unsplash.com/photo-1687524690542-2659f268cde8?w=800',
];

const quickLinks = [
  { icon: Zap, name: '秒杀', color: 'bg-orange-100 text-orange-500' },
  { icon: Tag, name: '优惠券', color: 'bg-red-100 text-red-500' },
  { icon: Gift, name: '新品', color: 'bg-blue-100 text-blue-500' },
  { icon: Flame, name: '热卖', color: 'bg-pink-100 text-pink-500' },
];

const products = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
    title: '时尚运动鞋 男女同款 透气舒适跑步鞋',
    price: 299,
    sales: 1520,
    tag: '热卖',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
    title: '智能手表 运动健康监测 多功能腕表',
    price: 899,
    sales: 856,
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?w=400',
    title: '无线蓝牙耳机 降噪音质好 长续航',
    price: 199,
    sales: 2341,
    tag: '新品',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=400',
    title: '专业单反相机 高清摄影 旅行必备',
    price: 4599,
    sales: 234,
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=400',
    title: '超薄笔记本电脑 办公学习 轻便高效',
    price: 5299,
    sales: 567,
  },
  {
    id: 6,
    image: 'https://images.unsplash.com/photo-1741061961703-0739f3454314?w=400',
    title: '5G智能手机 高性能处理器 拍照神器',
    price: 2999,
    sales: 1890,
    tag: '热卖',
  },
];

export function HomePage() {
  const [currentBanner, setCurrentBanner] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50 pb-16">
      {/* Search Bar */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="搜索商品"
            className="flex-1 bg-transparent border-none outline-none ml-2 text-sm"
          />
        </div>
      </div>

      {/* Banner Carousel */}
      <div className="relative overflow-hidden bg-white">
        <div
          className="flex transition-transform duration-500"
          style={{ transform: `translateX(-${currentBanner * 100}%)` }}
        >
          {banners.map((banner, index) => (
            <div key={index} className="w-full flex-shrink-0">
              <ImageWithFallback
                src={banner}
                alt={`Banner ${index + 1}`}
                className="w-full h-48 object-cover"
              />
            </div>
          ))}
        </div>
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1">
          {banners.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full transition-all ${
                index === currentBanner ? 'bg-white w-4' : 'bg-white/50'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white mt-2 px-4 py-4">
        <div className="grid grid-cols-4 gap-4">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <div key={link.name} className="flex flex-col items-center">
                <div className={`w-12 h-12 rounded-full ${link.color} flex items-center justify-center mb-2`}>
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs text-gray-700">{link.name}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <div className="mt-2 bg-white px-4 py-4">
        <h2 className="text-lg font-semibold mb-4">热门商品</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </div>
    </div>
  );
}