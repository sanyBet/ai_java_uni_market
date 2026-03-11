import { useState } from 'react';
import { Star, X, Upload } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import toast from 'react-hot-toast';

interface ReviewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  productName: string;
  productImage: string;
  onSubmit: (review: { rating: number; content: string; images: string[] }) => void;
}

export function ReviewDialog({
  open,
  onOpenChange,
  productName,
  productImage,
  onSubmit,
}: ReviewDialogProps) {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);

  const handleSubmit = () => {
    if (!content.trim()) {
      toast.error('请输入评价内容');
      return;
    }

    onSubmit({ rating, content, images });
    // 重置表单
    setRating(5);
    setContent('');
    setImages([]);
    onOpenChange(false);
  };

  const handleImageUpload = () => {
    // 模拟上传图片
    const mockImageUrl = `https://images.unsplash.com/photo-1633464130613-0a9154299ac2?w=400&t=${Date.now()}`;
    if (images.length < 3) {
      setImages([...images, mockImageUrl]);
      toast.success('图片添加成功');
    } else {
      toast.error('最多只能上传3张图片');
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[350px] p-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>商品评价</DialogTitle>
          <DialogDescription>为这个商品打分并写下您的评价</DialogDescription>
        </DialogHeader>

        <div className="p-6">
          {/* Product Info */}
          <div className="flex gap-3 mb-6 pb-4 border-b">
            <img
              src={productImage}
              alt={productName}
              className="w-16 h-16 rounded-lg object-cover"
            />
            <div className="flex-1">
              <p className="text-sm text-gray-800 line-clamp-2">{productName}</p>
            </div>
          </div>

          {/* Rating */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">商品评分</h3>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  className="transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-8 h-8 ${
                      star <= rating
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">评价内容</h3>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="说说你的使用体验吧..."
              rows={4}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none text-sm"
              maxLength={200}
            />
            <p className="text-xs text-gray-400 text-right mt-1">
              {content.length}/200
            </p>
          </div>

          {/* Images */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-3">上传图片（选填，最多3张）</h3>
            <div className="flex gap-3 flex-wrap">
              {images.map((image, index) => (
                <div key={index} className="relative w-20 h-20">
                  <img
                    src={image}
                    alt={`评价图片${index + 1}`}
                    className="w-full h-full rounded-lg object-cover"
                  />
                  <button
                    onClick={() => handleRemoveImage(index)}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-gray-800 text-white rounded-full flex items-center justify-center"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              {images.length < 3 && (
                <button
                  onClick={handleImageUpload}
                  className="w-20 h-20 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:border-red-500 hover:text-red-500 transition-colors"
                >
                  <Upload className="w-6 h-6 mb-1" />
                  <span className="text-xs">上传</span>
                </button>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-full font-medium"
            >
              取消
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 py-2.5 bg-red-500 text-white rounded-full font-medium"
            >
              提交评价
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
