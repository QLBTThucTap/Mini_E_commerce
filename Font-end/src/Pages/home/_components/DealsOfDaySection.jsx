import { Link } from "react-router-dom";
import Card from "../../../Components/ui/Card";
import Badge from "../../../Components/ui/Badge";
import Button from "../../../Components/ui/Button";
import PriceTag from "../../../Components/ui/PriceTag";
import CountdownTimer from "../../../Components/common/CountdownTimer";

export default function DealsOfDaySection({ product, timeLeft, onAddToCart }) {
  if (!product) return null;

  return (
    <Card padding="p-0" className="overflow-hidden shadow-xs">
      <div className="bg-emerald-600 text-white px-6 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className="fa-solid fa-bolt text-yellow-300 text-lg" />
          <h3 className="font-extrabold text-sm sm:text-base tracking-wider uppercase">
            Today's Discounted Products
          </h3>
        </div>
        <Badge tone="warning">Limited quantity</Badge>
      </div>

      <div className="p-6 grid grid-cols-12 gap-8 items-center">
        <div className="col-span-12 md:col-span-5 bg-slate-50 rounded-2xl p-6 border border-slate-100 flex items-center justify-center relative min-h-[280px]">
          <span className="absolute top-3 left-3 z-10">
            <Badge tone="discount">SALE</Badge>
          </span>
          <img
            src={product.image}
            alt={product.title}
            className="max-h-60 object-contain hover:scale-105 transition-transform"
          />
        </div>

        <div className="col-span-12 md:col-span-7 space-y-4">
          <h4 className="text-xl font-extrabold text-slate-900">
            <Link
              to={`/product/${product.id}`}
              className="hover:text-emerald-600"
            >
              {product.title}
            </Link>
          </h4>
          <PriceTag
            price={product.price}
            compareAtPrice={product.price * 1.25}
            tone="sale"
            size="lg"
          />
          <p className="text-xs text-slate-500 line-clamp-2">
            {product.description}
          </p>
          <div className="pt-2">
            <CountdownTimer
              value={timeLeft}
              label="Hurry Up! Promotion will expire in:"
            />
          </div>
          <Button
            variant="primary"
            icon="fa-solid fa-cart-shopping"
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </Card>
  );
}
