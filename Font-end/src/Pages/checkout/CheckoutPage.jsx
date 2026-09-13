import Header from "../../Layouts/Header";
import Footer from "../../Layouts/Footer";
import { FOOTER_BRAND, FOOTER_COLUMNS } from "./_utils/checkoutUtils";
import { useCheckout } from "./_hooks/useCheckout";
import {
  CheckoutBreadcrumb,
  CheckoutPrompts,
  BillingForm,
  PaymentMethods,
  OrderSummary,
  CheckoutQrModal,
  CheckoutSuccessModal,
  CheckoutToast,
} from "./_components";

export default function CheckoutPage() {
  const {
    items,
    user,
    isAuthenticated,
    formData,
    errors,
    pricing,
    showVoucherInput,
    setShowVoucherInput,
    voucherCode,
    setVoucherCode,
    appliedDiscount,
    voucherMessage,
    paymentMethod,
    setPaymentMethod,
    isSubmitting,
    toastMessage,
    orderSuccessData,
    showQrModal,
    setShowQrModal,
    copiedField,
    qrCodeUrl,
    bankInfo,
    handleInputChange,
    handleApplyVoucher,
    handlePlaceOrder,
    handleConfirmPaid,
    handleCopy,
  } = useCheckout();

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans">
      <Header onSearch={(e) => e.preventDefault()} />

      <main className="flex-1 w-full pb-16">
        <CheckoutBreadcrumb />

        <div className="max-w-[1360px] mx-auto px-4 pt-8">
          <div className="flex flex-col gap-6" id="checkout-direct-section">
            <CheckoutPrompts
              isAuthenticated={isAuthenticated}
              user={user}
              showVoucherInput={showVoucherInput}
              setShowVoucherInput={setShowVoucherInput}
              voucherCode={voucherCode}
              setVoucherCode={setVoucherCode}
              appliedDiscount={appliedDiscount}
              voucherMessage={voucherMessage}
              onApplyVoucher={handleApplyVoucher}
            />

            <form
              onSubmit={handlePlaceOrder}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <BillingForm
                formData={formData}
                errors={errors}
                onChange={handleInputChange}
              />

              <OrderSummary
                items={items}
                pricing={pricing}
                appliedDiscount={appliedDiscount}
                paymentMethod={paymentMethod}
                isSubmitting={isSubmitting}
              >
                <PaymentMethods
                  paymentMethod={paymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  bankInfo={bankInfo}
                  qrCodeUrl={qrCodeUrl}
                />
              </OrderSummary>
            </form>
          </div>
        </div>
      </main>

      <CheckoutToast toastMessage={toastMessage} />

      <CheckoutQrModal
        show={showQrModal}
        orderData={orderSuccessData}
        bankInfo={bankInfo}
        copiedField={copiedField}
        onCopy={handleCopy}
        onConfirmPaid={handleConfirmPaid}
        onClose={() => setShowQrModal(false)}
      />

      <CheckoutSuccessModal
        show={Boolean(orderSuccessData && !showQrModal)}
        orderData={orderSuccessData}
        isAuthenticated={isAuthenticated}
      />

      <Footer brand={FOOTER_BRAND} columns={FOOTER_COLUMNS} />
    </div>
  );
}
