import { useEffect, useState } from "react";
// import Header from "../../Layouts/Header";
import Header from "../../Layouts/Header";
import Card from "../../Components/ui/Card";
import PriceTag from "../../Components/ui/PriceTag";
import RatingStars from "../../Components/ui/RatingStars";
import StockStatus from "../../Components/ui/StockStatus";
import Button from "../../Components/ui/Button";
import SectionHeader from "../../Components/common/SectionHeader";
import Footer from "../../Layouts/Footer";
import { Link } from "react-router-dom";
import useCartStore from "../../Stores/cartStore";

const API_URL = "http://localhost:4000";

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
const PARTNERS = [
  { name: "SamSung" },
  { name: "Apple" },
  { name: "Oppo" },
  { name: "Xiaomi" },
  { name: "Huawei" },
  { name: "Nokia" },
];

function HomePage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [addprId, setAddprId] = useState(null);
  const addItem = useCartStore((state) => state.addItem);
  const handleAddToCart = (event, product) => {
    event.preventDefault(); //tránh bị link cha điều hướng sang trang chi tiết
    event.stopPropagation();
    addItem(product, 1);
    setAddprId(product.id);

    setTimeout(() => {
      setAddprId((curr) => (curr === product.id ? null : curr));
    }, 2500);
  };

  useEffect(() => {
    const controller = new AbortController();

    async function fetchProducts() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`${API_URL}/products`, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error(`Không lấy được sản phẩm: HTTP ${response.status}`);
        }

        const data = await response.json();

        // API /products trả về trực tiếp một array
        setProducts(Array.isArray(data) ? data : data.items || []);
      } catch (error) {
        if (error.name !== "AbortError") {
          setError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchProducts();

    return () => controller.abort();
  }, []);

  const handleSearch = (event) => {
    event.preventDefault();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-left">
      <Header cartCount={0} cartTotal={0} onSearch={handleSearch} />
      <section className="max-w-[1360px] mx-auto px-4 pb-10">
        <SectionHeader title="Our Partners" bordered={false} />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
          {PARTNERS.map((partner) => (
            <Card
              key={partner.name}
              hoverable
              className="flex items-center justify-center h-20 grayscale hover:grayscale-0 transition-all"
            >
              <span className="text-sm font-extrabold text-slate-400 hover:text-emerald-600 tracking-wide uppercase">
                {partner.name}
              </span>
            </Card>
          ))}
        </div>
      </section>
      <main className="max-w-[1360px] mx-auto px-4 py-10">
        <SectionHeader title="Featured products" viewAllHref="#" />

        {loading && (
          <p className="py-10 text-center text-slate-500">
            Đang tải sản phẩm...
          </p>
        )}

        {error && <p className="py-10 text-center text-red-600">{error}</p>}

        {!loading && !error && products.length === 0 && (
          <p className="py-10 text-center text-slate-500">Chưa có sản phẩm.</p>
        )}

        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {Array.isArray(products) &&
              products.map((product) => (
                <Card key={product.id} hoverable>
                  <Link to={`/product/${product.id}`}>
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full h-52 object-cover rounded-xl bg-slate-100"
                    />
                  </Link>

                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold uppercase text-emerald-600">
                        {product.category}
                      </span>

                      <StockStatus status="in_stock" />
                    </div>

                    <h2 className="font-bold text-slate-900 line-clamp-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="hover:text-emerald-600"
                      >
                        {product.title}
                      </Link>
                    </h2>

                    <RatingStars
                      value={Math.round(product.rating?.rate ?? 0)}
                      count={product.rating?.count ?? 0}
                    />

                    <PriceTag price={product.price} />

                    <Button
                      className="w-full"
                      icon="fa-solid fa-cart-shopping"
                      onClick={(event) => handleAddToCart(event, product)}
                    >
                      Add to cart
                    </Button>
                    {addprId === product.id && (
                      <p className="mt-4 text-center text-sm font-semibold text-emerald-600">
                        Đã thêm 1 sản phẩm vào giỏ hàng
                      </p>
                    )}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </main>

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS}></Footer>
    </div>
  );
}

export default HomePage;
