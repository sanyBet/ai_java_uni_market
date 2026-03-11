import { ChevronLeft } from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { ReviewDialog } from '../components/ReviewDialog';
import toast from 'react-hot-toast';

const tabs = [
  { id: 'all', label: '全部' },
  { id: 'pending', label: '待发货' },
  { id: 'shipping', label: '待收货' },
  { id: 'completed', label: '已完成' },
  { id: 'refund', label: '退款/售后' },
];

interface Order {
  id: string;
  status: 'pending' | 'shipping' | 'completed' | 'refund';
  items: {
    id: number;
    image: string;
    title: string;
    spec: string;
    price: number;
    quantity: number;
  }[];
  total: number;
  orderNumber: string;
  orderTime: string;
}

const orders: Order[] = [
  {
    id: '1',
    status: 'pending',
    orderNumber: '202603100001',
    orderTime: '2026-03-10 10:30',
    total: 299,
    items: [
      {
        id: 1,
        image: 'https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400',
        title: '时尚运动鞋 男女同款',
        spec: '颜色:黑色 尺码:42',
        price: 299,
        quantity: 1,
      },
    ],
  },
  {
    id: '2',
    status: 'pending',
    orderNumber: '202603090002',
    orderTime: '2026-03-09 15:20',
    total: 899,
    items: [
      {
        id: 2,
        image: 'https://images.unsplash.com/photo-1662724174411-06358407f6c1?w=400',
        title: '智能手表 运动健康监测',
        spec: '颜色:银色',
        price: 899,
        quantity: 1,
      },
    ],
  },
  {
    id: '3',
    status: 'shipping',
    orderNumber: '202603080003',
    orderTime: '2026-03-08 09:15',
    total: 398,
    items: [
      {
        id: 3,
        image: 'https://images.unsplash.com/photo-1609255386725-b9b6a8ad829c?w=400',
        title: '无线蓝牙耳机 降噪',
        spec: '颜色:白色',
        price: 199,
        quantity: 2,
      },
    ],
  },
  {
    id: '4',
    status: 'completed',
    orderNumber: '202603050004',
    orderTime: '2026-03-05 14:30',
    total: 4599,
    items: [
      {
        id: 4,
        image: 'https://images.unsplash.com/photo-1729655669048-a667a0b01148?w=400',
        title: '专业单反相机',
        spec: '型号:标准版',
        price: 4599,
        quantity: 1,
      },
    ],
  },
];

const statusConfig = {
  pending: { label: '待发货', color: 'text-orange-500' },
  shipping: { label: '待收货', color: 'text-blue-500' },
  completed: { label: '已完成', color: 'text-green-500' },
  refund: { label: '退款中', color: 'text-red-500' },
};

export function OrdersPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const statusParam = searchParams.get('status');
  const [activeTab, setActiveTab] = useState(
    statusParam && tabs.find((t) => t.id === statusParam) ? statusParam : 'all'
  );
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<{
    name: string;
    image: string;
  } | null>(null);

  const filteredOrders =
    activeTab === 'all'
      ? orders
      : orders.filter((order) => order.status === activeTab);

  const handleReview = (productName: string, productImage: string) => {
    setReviewingProduct({ name: productName, image: productImage });
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = (review: {
    rating: number;
    content: string;
    images: string[];
  }) => {
    toast.success('评价提交成功');
    console.log('Review submitted:', review);
  };

  const getActionButtons = (status: Order['status'], order: Order) => {
    switch (status) {
      case 'pending':
        return (
          <>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm">
              取消订单
            </button>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm">
              查看物流
            </button>
          </>
        );
      case 'shipping':
        return (
          <>
            <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-full text-sm">
              查看物流
            </button>
            <button className="px-4 py-2 bg-red-500 text-white rounded-full text-sm">
              确认收货
            </button>
          </>
        );
      case 'completed':
        return (
          <button
            className="px-4 py-2 bg-red-500 text-white rounded-full text-sm"
            onClick={() =>
              handleReview(order.items[0].title, order.items[0].image)
            }
          >
            去评价
          </button>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-16">
      {/* Header */}
      <div className="bg-white px-4 py-3 sticky top-0 z-10 border-b">
        <div className="flex items-center">
          <button onClick={() => navigate(-1)}>
            <ChevronLeft className="w-6 h-6" />
          </button>
          <h1 className="flex-1 text-lg font-semibold text-center">我的订单</h1>
          <div className="w-6" />
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white sticky top-14 z-10">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm ${
                activeTab === tab.id
                  ? 'text-red-500 border-b-2 border-red-500'
                  : 'text-gray-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Order List */}
      <div className="mt-2">
        {filteredOrders.length === 0 ? (
          <div className="bg-white py-20 text-center">
            <p className="text-gray-400">暂无订单</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="bg-white mb-2 p-4">
              {/* Order Header */}
              <div className="flex items-center justify-between mb-3 pb-3 border-b">
                <div className="text-sm text-gray-600">
                  订单号：{order.orderNumber}
                </div>
                <div
                  className={`text-sm font-medium ${
                    statusConfig[order.status].color
                  }`}
                >
                  {statusConfig[order.status].label}
                </div>
              </div>

              {/* Order Items */}
              {order.items.map((item) => (
                <div key={item.id} className="flex gap-3 mb-3">
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
                      <span className="text-red-500 font-semibold">
                        ¥{item.price}
                      </span>
                      <span className="text-sm text-gray-600">
                        x{item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Order Footer */}
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-600">
                    下单时间：{order.orderTime}
                  </span>
                  <div>
                    <span className="text-sm text-gray-600">共计：</span>
                    <span className="text-red-500 font-semibold ml-1">
                      ¥{order.total}
                    </span>
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  {getActionButtons(order.status, order)}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Review Dialog */}
      {reviewingProduct && (
        <ReviewDialog
          open={reviewDialogOpen}
          onOpenChange={setReviewDialogOpen}
          productName={reviewingProduct.name}
          productImage={reviewingProduct.image}
          onSubmit={handleSubmitReview}
        />
      )}
    </div>
  );
}