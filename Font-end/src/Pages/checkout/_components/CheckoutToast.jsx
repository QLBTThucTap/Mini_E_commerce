export default function CheckoutToast({ toastMessage }) {
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 transform transition-all duration-300 bg-[#213145] text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-4 max-w-md animate-bounce">
      <div className="w-9 h-9 rounded-full bg-[#006948] flex items-center justify-center text-white shrink-0">
        <span className="material-symbols-outlined text-[20px]">done</span>
      </div>
      <div>
        <h5 className="text-sm font-bold">{toastMessage.title}</h5>
        <p className="text-xs text-white/80 mt-0.5">{toastMessage.desc}</p>
      </div>
    </div>
  );
}
