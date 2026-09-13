import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import CategoryLink from "../../../Components/common/CategoryLink";
import Card from "../../../Components/ui/Card";
import Badge from "../../../Components/ui/Badge";
import Button from "../../../Components/ui/Button";
import IconButton from "../../../Components/ui/IconButton";
import PriceTag from "../../../Components/ui/PriceTag";

export default function HeroShowcase({ categoryLinks, heroSlides }) {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slide = heroSlides[currentSlide];

  return (
    <section className="grid grid-cols-12 gap-6">
      <Card
        padding="p-3.5"
        className="col-span-12 lg:col-span-3 flex flex-col justify-between"
      >
        <div className="space-y-1">
          {categoryLinks.map((item) => (
            <CategoryLink key={item.label} {...item} />
          ))}
        </div>
      </Card>

      {/* Main Hero Slider & Sub-banners */}
      <div className="col-span-12 lg:col-span-9 grid grid-cols-12 gap-6">
        <div
          className={`col-span-12 md:col-span-8 rounded-2xl bg-gradient-to-br ${slide.bgGradient} p-8 border border-slate-200 relative overflow-hidden flex flex-col justify-between min-h-[380px] transition-all duration-300`}
        >
          <div className="z-10 max-w-xs space-y-3">
            <Badge tone="sale">{slide.tag}</Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {slide.title}
            </h2>
            <p className="text-xs text-slate-500 leading-relaxed">
              {slide.desc}
            </p>
            <div className="pt-2">
              <Button
                variant="primary"
                icon="fa-solid fa-arrow-right"
                iconPosition="right"
                onClick={() => navigate(`/products?category=${slide.category}`)}
              >
                BUY NOW
              </Button>
            </div>
          </div>

          {/* Vòng tròn trang trí & hình ảnh sản phẩm nổi bật của Banner */}
          <div className="absolute -right-10 -bottom-10 w-72 sm:w-96 h-72 sm:h-96 opacity-90 pointer-events-none flex items-center justify-center">
            <div className="w-64 h-64 rounded-full border-[24px] border-slate-300/40 relative flex items-center justify-center">
              <div className="w-48 h-48 rounded-full bg-white shadow-2xl flex items-center justify-center overflow-hidden p-4">
                <img
                  src={slide.icon}
                  alt={slide.title}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>

          {/* Controls Carousel bên dưới */}
          <div className="z-10 flex items-center justify-between pt-6 border-t border-slate-200/60 mt-4">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-white/70 px-3 py-1 rounded-full backdrop-blur-xs">
              <span>
                {currentSlide + 1} / {heroSlides.length}
              </span>
            </div>
            <div className="flex space-x-2">
              <IconButton
                icon="fa-solid fa-chevron-left"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentSlide(
                    (p) => (p - 1 + heroSlides.length) % heroSlides.length,
                  )
                }
              />
              <IconButton
                icon="fa-solid fa-chevron-right"
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrentSlide((p) => (p + 1) % heroSlides.length)
                }
              />
            </div>
          </div>
        </div>

        {/* Sub Banners */}
        <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
          <Card
            hoverable
            className="flex-1 flex items-center justify-between relative overflow-hidden group"
          >
            <div className="space-y-2 z-10 max-w-[150px]">
              <span className="text-[10px] font-extrabold uppercase text-slate-400">
                LAPTOPS
              </span>
              <h3 className="text-sm font-bold text-slate-900 leading-snug">
                MacBook Air & Pro Series
              </h3>
              <Link
                to="/products?category=laptop"
                className="inline-block mt-1 text-xs font-extrabold text-slate-900 underline decoration-emerald-500 underline-offset-4 hover:text-emerald-600"
              >
                BUY NOW
              </Link>
            </div>
            <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center p-2 shadow-inner group-hover:scale-110 transition-transform">
              <img
                src="https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/macbook-air-m2-gray-1.jpg"
                alt="Laptop"
                className="w-full h-full object-contain"
              />
            </div>
          </Card>

          <div className="flex-1 bg-slate-900 text-white rounded-2xl p-5 flex items-center justify-between relative overflow-hidden group shadow-xs">
            <div className="space-y-1.5 z-10 max-w-[140px]">
              <Badge tone="success">SMARTPHONE</Badge>
              <h3 className="text-sm font-extrabold leading-tight">
                iPhone 15 Pro Max
              </h3>
              <div className="pt-1">
                <span className="text-[10px] text-slate-400">CHỈ TỪ</span>
                <PriceTag price={1199} tone="sale" size="md" />
              </div>
            </div>
            <div className="w-20 h-20 bg-slate-800 rounded-2xl border border-slate-700 flex items-center justify-center p-2 group-hover:scale-110 transition-transform">
              <img
                src="https://bizweb.dktcdn.net/thumb/1024x1024/100/459/953/products/iphone-17-pro-cosmic-orange-1.jpg"
                alt="Phone"
                className="w-full h-full object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
