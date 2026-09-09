import { Link, useNavigate } from "react-router-dom";

import Header from "../../Layouts/Header";
import Button from "../../Components/ui/Button";
import useCartStore from "../../Stores/cartStore";

function formatMoney(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function CartPage() {
  const navigate = useNavigate();

  const items = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const cleanCart = useCartStore((state) => state.cleanCart);

  const cartCount = items.reduce((total, item) => total + item.quantity, 0);

  const subTotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const shippingFee = subTotal === 0 ? 0 : subTotal >= 199 ? 0 : 10;
  const total = subTotal + shippingFee;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header
        cartCount={cartCount}
        cartTotal={total}
        onSearch={(event) => event.preventDefault()}
      />

      <main className="max-w-[1360px] mx-auto px-4 py-10">
        <h1 className="text-3xl font-extrabold text-slate-900">
          Shopping Cart
        </h1>
        {items.length > 0 && (
          <button
            type="button"
            onClick={cleanCart}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-500 hover:border-red-300 hover:text-red-500 transition-colors"
          >
            <i className="fa-solid fa-trash-can" />
            Xóa tất cả
          </button>
        )}
        {items.length === 0 ? (
          <div className="mt-8 rounded-2xl bg-white border border-slate-200 p-12 text-center">
            <i className="fa-solid fa-cart-shopping text-5xl text-slate-300" />

            <p className="mt-4 text-slate-500">Giỏ hàng của bạn đang trống.</p>

            <Link
              to="/"
              className="inline-flex mt-6 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
            >
              Tiếp tục mua hàng
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <section className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="flex flex-col sm:flex-row gap-4 rounded-2xl bg-white border border-slate-200 p-4"
                >
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full sm:w-32 h-32 rounded-xl object-cover bg-slate-100"
                  />

                  <div className="flex-1">
                    <div className="flex justify-between gap-4">
                      <h2 className="font-bold text-slate-900">{item.title}</h2>

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-slate-400 hover:text-red-500"
                        aria-label="Xóa sản phẩm"
                      >
                        <i className="fa-solid fa-trash" />
                      </button>
                    </div>

                    <p className="mt-2 font-bold text-emerald-600">
                      {formatMoney(item.price)}
                    </p>

                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center border border-slate-200 rounded-xl">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                          className="w-9 h-9 hover:text-emerald-600"
                        >
                          −
                        </button>

                        <span className="w-9 text-center font-bold">
                          {item.quantity}
                        </span>

                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                          className="w-9 h-9 hover:text-emerald-600"
                        >
                          +
                        </button>
                      </div>

                      <strong className="text-slate-900">
                        {formatMoney(item.price * item.quantity)}
                      </strong>
                    </div>
                  </div>
                </article>
              ))}
            </section>

            <aside className="h-fit rounded-2xl bg-white border border-slate-200 p-6">
              <h2 className="text-lg font-extrabold text-slate-900">
                Order Summary
              </h2>

              <div className="mt-6 space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <strong>{formatMoney(subTotal)}</strong>
                </div>

                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <strong>
                    {shippingFee === 0 ? "FREE" : formatMoney(shippingFee)}
                  </strong>
                </div>

                <div className="border-t border-slate-200 pt-4 flex justify-between text-lg">
                  <span className="font-bold">Total</span>
                  <strong className="text-emerald-600">
                    {formatMoney(total)}
                  </strong>
                </div>
              </div>

              <Button
                className="w-full mt-6"
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </Button>
            </aside>
          </div>
        )}
      </main>
    </div>
  );
}
export default CartPage;
