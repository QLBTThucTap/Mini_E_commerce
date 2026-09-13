import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import useCartStore from "../../Stores/cartStore";
import Header from "../../Layouts/Header";
import Button from "../../Components/ui/Button";
import PriceTag from "../../Components/ui/PriceTag";
import RatingStars from "../../Components/ui/RatingStars";
import StockStatus from "../../Components/ui/StockStatus";

import { getProductById } from "../../Services/productService";
import Footer from "../../Layouts/Footer";

const FOOTER_BRAND = {
  name: "LH - 1ST NYC TECH ONLINE MARKET",
  hotline: "0824781531",
  address: "273 phố Bạch Mai, quận Hai Bà Trưng, Hà Nội",
  email: "contact@swootechmart.com",
};

const FOOTER_COLUMNS = [
  {
    title: "Top Categories",
    links: [
      { label: "Laptops", href: "#laptops" },
      { label: "PC & Computers", href: "#pc" },
      { label: "Cell Phones", href: "#phones" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About me", href: "#about" },
      { label: "Contact", href: "#contact" },
    ],
  },
  {
    title: "Help Center",
    links: [
      { label: "Customer Service", href: "#service" },
      { label: "FAQs", href: "#faqs" },
    ],
  },
  {
    title: "Partner",
    links: [
      { label: "Become a Seller", href: "#become-seller" },
      { label: "Affiliate Program", href: "#affiliate" },
      { label: "Wholesale", href: "#wholesale" },
    ],
  },
];

function ProductDetailPage() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError("");
        const data = await getProductById(productId);
        setProduct(data);
      } catch (error) {
        setError(
          error.response?.data?.message ||
            "Không thể hiển thị thông tin sản phẩm!",
        );
      } finally {
        setLoading(false);
      }
    }

    loadProduct();
  }, [productId]);

  const decreaseQuantity = () => {
    setQuantity((current) => Math.max(1, current - 1));

    //Math.max(1, ...): đảm bảo giá trị không nhỏ hơn 1
  };

  const increaseQuantity = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    addItem(product, quantity);
    setTimeout(() => {
      setMessage("");
    }, 1000);
    setMessage(`Đã thêm ${quantity} sản phẩm vào giỏ hàng`);
  };
  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartCount={0}
        cartTotal={0}
        user={null}
        onSearch={(event) => event.preventDefault()}
      />
      <main className="max-w-[1360px] mx-auto px-4 py-10">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600"
        >
          <i className="inline-flex items-center gap-2 text-sm text-slate-500 hover:text-emerald-600" />
          Quay lại trang chủ
        </Link>

        {loading && (
          <p className="py-16 text-center text-slate-500">
            Đang tải sản phẩm...
          </p>
        )}

        {error && (
          <div className="py-16 text-center">
            <p className="text-red-600">{error}</p>
            <Button className="mt-4" onClick={() => navigate("/")}>
              Về trang chủ
            </Button>
          </div>
        )}

        {!loading && !error && product && (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-8">
            <div className="rounded-2xl bg-white border border-slate-200 p-6">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[420px] object-contain rounded-xl"
              />
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 p-6 lg:p-8">
              <p className="text-sm font-bold uppercase text-emerald-600">
                {product.category}
              </p>

              <h1 className="mt-3 text-2xl lg:text-3xl font-extrabold text-slate-900">
                {product.title}
              </h1>

              <div className="mt-4">
                <RatingStars
                  value={Math.round(product.rating?.rate ?? 0)}
                  count={product.rating?.count ?? 0}
                  size="md"
                />
              </div>

              <div className="mt-6">
                <PriceTag price={product.price} size="lg" tone="sale" />
              </div>

              <div className="mt-5">
                <StockStatus status="in_stock" />
              </div>

              <p className="mt-6 text-sm leading-7 text-slate-600">
                {product.description}
              </p>

              <div className="mt-8 flex items-center gap-4">
                <span className="text-sm font-bold text-slate-700">
                  Số lượng
                </span>

                <div className="flex items-center border border-slate-200 rounded-xl">
                  <button
                    type="button"
                    onClick={decreaseQuantity}
                    className="w-10 h-10 text-slate-600 hover:text-emerald-600"
                  >
                    −
                  </button>

                  <span className="w-10 text-center font-bold">{quantity}</span>

                  <button
                    type="button"
                    onClick={increaseQuantity}
                    className="w-10 h-10 text-slate-600 hover:text-emerald-600"
                  >
                    +
                  </button>
                </div>
              </div>

              <Button
                className="w-full mt-8"
                icon="fa-solid fa-cart-shopping"
                onClick={handleAddToCart}
              >
                Thêm vào giỏ hàng
              </Button>

              {message && (
                <p className="mt-4 text-center text-sm font-semibold text-emerald-600">
                  {message}
                </p>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}

export default ProductDetailPage;
