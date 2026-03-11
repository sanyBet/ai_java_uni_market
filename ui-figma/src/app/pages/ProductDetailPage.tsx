import { useState } from 'react';
import { ChevronLeft, Star, X } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import * as Dialog from '@radix-ui/react-dialog';
import toast from 'react-hot-toast';

const productImages = [
  'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=800',
  'https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?w=800',
  'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=800',
];

const reviews = [
  {
    id: 1,
    user: '用户1234',
    rating: 5,
    comment: '质量很好，非常舒适，值得购买！',
    date: '2026-03-08',
    images: [
      'https://images.unsplash.com/photo-1719523677291-a395426c1a87?w=400',
      'https://images.unsplash.com/photo-1600185652960-c9d8869d015c?w=400',
    ],
  },
  {
    id: 2,
    user: '用户5678',
    rating: 4,
    comment: '物流很快，鞋子很不错，推荐！',
    date: '2026-03-05',
    images: [
      'https://images.unsplash.com/photo-1695459468644-717c8ae17eed?w=400',
    ],
  },
];

const colors = ['黑色', '白色', '灰色'];
const sizes = ['39', '40', '41', '42', '43'];

export function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentImage, setCurrentImage] = useState(0);
  const [showSpecDialog, setShowSpecDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [quantity, setQuantity] = useState(1);
  const [actionType, setActionType] = useState<'cart' | 'buy'>('cart');

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-20 bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-[390px] mx-auto flex items-center px-4 py-3">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative mt-14">
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-300"
            style={{ transform: `translateX(-${currentImage * 100}%)` }}
          >
            {productImages.map((image, index) => (
              <div key={index} className="w-full flex-shrink-0">
                <ImageWithFallback
                  src={image}
                  alt={`Product ${index + 1}`}
                  className="w-full aspect-square object-cover"
                />
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {productImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentImage(index)}
                className={`w-2 h-2 rounded-full ${
                  index === currentImage ? 'bg-red-500' : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="px-4 py-4">
        <div className="mb-2">
          <span className="text-red-500 text-2xl font-semibold">¥299</span>
          <span className="text-gray-400 text-sm line-through ml-2">¥599</span>
        </div>
        <h1 className="text-lg font-semibold text-gray-800 mb-2">
          时尚运动鞋 男女同款 透气舒适跑步鞋
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>销量 1520</span>
          <span>好评率 98%</span>
        </div>
      </div>

      {/* Spec Selection */}
      <button
        onClick={() => setShowSpecDialog(true)}
        className="w-full px-4 py-4 bg-gray-50 flex items-center justify-between"
      >
        <span className="text-sm text-gray-600">选择规格</span>
        <span className="text-sm text-gray-400">
          {selectedColor} {selectedSize} &gt;
        </span>
      </button>

      {/* Reviews */}
      <div className="mt-2 px-4 py-4 bg-gray-50">
        <h2 className="font-semibold mb-4">商品评价</h2>
        {reviews.map((review) => (
          <div key={review.id} className="bg-white rounded-lg p-4 mb-3">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">{review.user}</span>
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${
                      i < review.rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
            {review.images && review.images.length > 0 && (
              <div className="flex gap-2 mb-2">
                {review.images.map((img, idx) => (
                  <ImageWithFallback
                    key={idx}
                    src={img}
                    alt={`Review ${review.id} Image ${idx + 1}`}
                    className="w-20 h-20 rounded-lg object-cover"
                  />
                ))}
              </div>
            )}
            <span className="text-xs text-gray-400">{review.date}</span>
          </div>
        ))}
      </div>

      {/* Product Detail */}
      <div className="mt-2 px-4 py-4">
        <h2 className="font-semibold mb-4">商品详情</h2>
        <div className="space-y-2 text-sm text-gray-700">
          <p>• 品牌：时尚运动</p>
          <p>• 材质：透气网面+橡胶底</p>
          <p>• 适用场景：跑步、健身、日常休闲</p>
          <p>• 产品特点：轻便透气、防滑耐磨、舒适减震</p>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-10">
        <div className="max-w-[390px] mx-auto flex gap-3 px-4 py-3">
          <button
            onClick={() => {
              setShowSpecDialog(true);
              setActionType('cart');
            }}
            className="flex-1 py-3 border border-red-500 text-red-500 rounded-full font-medium"
          >
            加入购物车
          </button>
          <button
            onClick={() => {
              setShowSpecDialog(true);
              setActionType('buy');
            }}
            className="flex-1 py-3 bg-red-500 text-white rounded-full font-medium"
          >
            立即购买
          </button>
        </div>
      </div>

      {/* Spec Selection Dialog */}
      <Dialog.Root open={showSpecDialog} onOpenChange={setShowSpecDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-w-[390px] mx-auto">
            <div className="p-4">
              <div className="flex items-start gap-4 mb-6">
                <ImageWithFallback
                  src={productImages[0]}
                  alt="Product"
                  className="w-24 h-24 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <div className="text-red-500 text-xl font-semibold mb-1">
                    ¥299
                  </div>
                  <div className="text-sm text-gray-600">
                    已选：{selectedColor} {selectedSize}
                  </div>
                </div>
                <Dialog.Close className="text-gray-400">
                  <X className="w-6 h-6" />
                </Dialog.Close>
              </div>

              {/* Color Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">颜色</h3>
                <div className="flex gap-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`px-4 py-2 rounded-full text-sm ${
                        selectedColor === color
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">尺码</h3>
                <div className="flex gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-12 h-12 rounded-lg text-sm ${
                        selectedSize === size
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <h3 className="text-sm font-medium mb-3">数量</h3>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center"
                  >
                    -
                  </button>
                  <span className="w-16 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSpecDialog(false);
                  if (actionType === 'cart') {
                    toast.success('已添加到购物车');
                  } else {
                    // 立即购买，跳转到结算页面
                    navigate('/checkout');
                  }
                }}
                className="w-full py-3 bg-red-500 text-white rounded-full font-medium"
              >
                确定
              </button>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}