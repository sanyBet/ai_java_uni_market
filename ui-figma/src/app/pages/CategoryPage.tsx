import { useState } from 'react';
import { ShoppingCart, X } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router';
import * as Dialog from '@radix-ui/react-dialog';

const categories = [
  {
    id: 1,
    name: '鞋靴',
    products: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
        title: '时尚运动鞋',
        price: 299,
      },
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?w=400',
        title: '专业跑步鞋',
        price: 399,
      },
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
        title: '休闲板鞋',
        price: 259,
      },
    ],
  },
  {
    id: 2,
    name: '数码',
    products: [
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1741061961703-0739f3454314?w=400',
        title: '5G智能手机',
        price: 2999,
      },
      {
        id: 5,
        image: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=400',
        title: '笔记本电脑',
        price: 5299,
      },
      {
        id: 6,
        image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?w=400',
        title: '无线耳机',
        price: 199,
      },
    ],
  },
  {
    id: 3,
    name: '服饰',
    products: [
      {
        id: 7,
        image: 'https://images.unsplash.com/photo-1705675451868-014a161e591b?w=400',
        title: '时尚外套',
        price: 459,
      },
      {
        id: 8,
        image: 'https://images.unsplash.com/photo-1648544365218-188e3d07dcac?w=400',
        title: '休闲T恤',
        price: 89,
      },
      {
        id: 9,
        image: 'https://images.unsplash.com/photo-1705675451868-014a161e591b?w=400',
        title: '牛仔裤',
        price: 199,
      },
    ],
  },
  {
    id: 4,
    name: '美妆',
    products: [
      {
        id: 10,
        image: 'https://images.unsplash.com/photo-1723150512429-bfa92988d845?w=400',
        title: '护肤套装',
        price: 399,
      },
      {
        id: 11,
        image: 'https://images.unsplash.com/photo-1723150512429-bfa92988d845?w=400',
        title: '彩妆盘',
        price: 259,
      },
      {
        id: 12,
        image: 'https://images.unsplash.com/photo-1723150512429-bfa92988d845?w=400',
        title: '口红套装',
        price: 189,
      },
    ],
  },
  {
    id: 5,
    name: '配饰',
    products: [
      {
        id: 13,
        image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
        title: '智能手表',
        price: 899,
      },
      {
        id: 14,
        image: 'https://images.unsplash.com/photo-1648544365218-188e3d07dcac?w=400',
        title: '时尚包包',
        price: 599,
      },
      {
        id: 15,
        image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
        title: '太阳镜',
        price: 299,
      },
    ],
  },
  {
    id: 6,
    name: '家居',
    products: [
      {
        id: 16,
        image: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=400',
        title: '简约台灯',
        price: 159,
      },
      {
        id: 17,
        image: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=400',
        title: '北欧抱枕',
        price: 59,
      },
      {
        id: 18,
        image: 'https://images.unsplash.com/flagged/photo-1576697010739-6373b63f3204?w=400',
        title: '收纳盒',
        price: 39,
      },
    ],
  },
  {
    id: 7,
    name: '运动',
    products: [
      {
        id: 19,
        image: 'https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?w=400',
        title: '瑜伽垫',
        price: 99,
      },
      {
        id: 20,
        image: 'https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?w=400',
        title: '健身手套',
        price: 49,
      },
      {
        id: 21,
        image: 'https://images.unsplash.com/photo-1765914448113-ebf0ce8cb918?w=400',
        title: '运动水杯',
        price: 69,
      },
    ],
  },
  {
    id: 8,
    name: '摄影',
    products: [
      {
        id: 22,
        image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=400',
        title: '单反相机',
        price: 4599,
      },
      {
        id: 23,
        image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=400',
        title: '三脚架',
        price: 299,
      },
      {
        id: 24,
        image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=400',
        title: '相机包',
        price: 199,
      },
    ],
  },
];

const colors = ['黑色', '白色', '灰色'];
const sizes = ['39', '40', '41', '42', '43'];

export function CategoryPage() {
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const navigate = useNavigate();
  const [showSpecDialog, setShowSpecDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{
    id: number;
    image: string;
    title: string;
    price: number;
  } | null>(null);
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[2]);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = (product: {
    id: number;
    image: string;
    title: string;
    price: number;
  }) => {
    setSelectedProduct(product);
    setShowSpecDialog(true);
  };

  const handleConfirmAddToCart = () => {
    setShowSpecDialog(false);
    toast.success(`${selectedProduct?.title} 已加入购物车`);
    // 重置数量
    setQuantity(1);
  };

  return (
    <div className="flex h-screen pb-16 bg-gray-50">
      {/* Left Category List */}
      <div className="w-24 bg-white overflow-y-auto">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => setSelectedCategory(category)}
            className={`py-4 text-center text-sm cursor-pointer border-l-2 ${
              selectedCategory.id === category.id
                ? 'bg-gray-50 border-red-500 text-red-500'
                : 'border-transparent text-gray-700'
            }`}
          >
            {category.name}
          </div>
        ))}
      </div>

      {/* Right Product List */}
      <div className="flex-1 overflow-y-auto p-4">
        <h2 className="text-lg font-semibold mb-4">{selectedCategory.name}</h2>
        <div className="grid grid-cols-2 gap-3">
          {selectedCategory.products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg overflow-hidden shadow-sm"
              onClick={() => navigate(`/product/${product.id}`)}
            >
              <div className="aspect-square bg-gray-100">
                <ImageWithFallback
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm text-gray-800 line-clamp-2 mb-2">
                  {product.title}
                </h3>
                <div className="flex items-center justify-between">
                  <span className="text-red-500 text-lg font-semibold">
                    ¥{product.price}
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(product);
                    }}
                    className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
                    aria-label="加入购物车"
                  >
                    <ShoppingCart className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Specification Dialog */}
      <Dialog.Root open={showSpecDialog} onOpenChange={setShowSpecDialog}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-w-[390px] mx-auto">
            <Dialog.Title className="sr-only">选择商品规格</Dialog.Title>
            <Dialog.Description className="sr-only">
              选择颜色、尺码和数量后添加到购物车
            </Dialog.Description>
            
            {selectedProduct && (
              <div className="p-4">
                <div className="flex items-start gap-4 mb-6">
                  <ImageWithFallback
                    src={selectedProduct.image}
                    alt={selectedProduct.title}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <div className="text-red-500 text-xl font-semibold mb-1">
                      ¥{selectedProduct.price}
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
                  onClick={handleConfirmAddToCart}
                  className="w-full py-3 bg-red-500 text-white rounded-full font-medium"
                >
                  加入购物车
                </button>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}