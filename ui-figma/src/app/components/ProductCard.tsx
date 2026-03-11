import { ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  id: number;
  image: string;
  title: string;
  price: number;
  sales?: number;
  tag?: string;
}

export function ProductCard({ id, image, title, price, sales, tag }: ProductCardProps) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-lg overflow-hidden shadow-sm"
      onClick={() => navigate(`/product/${id}`)}
    >
      <div className="relative aspect-square bg-gray-100">
        <ImageWithFallback
          src={image}
          alt={title}
          className="w-full h-full object-cover"
        />
        {tag && (
          <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
            {tag}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-sm text-gray-800 line-clamp-2 mb-2 min-h-[40px]">
          {title}
        </h3>
        <div className="flex items-center justify-between">
          <div>
            <span className="text-red-500 text-lg font-semibold">
              ¥{price}
            </span>
            {sales && (
              <span className="text-xs text-gray-400 ml-2">{sales}人付款</span>
            )}
          </div>
          <button
            className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center"
            onClick={(e) => {
              e.stopPropagation();
              // Add to cart logic
            }}
          >
            <ShoppingCart className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
