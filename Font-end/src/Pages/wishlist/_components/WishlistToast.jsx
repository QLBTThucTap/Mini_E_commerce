export default function WishlistToast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-[#0b1c30] text-white px-5 py-3.5 rounded-2xl shadow-2xl text-xs font-semibold flex items-center gap-2.5 animate-in fade-in slide-in-from-bottom-3 duration-300">
      <i className="fa-solid fa-circle-check text-emerald-400 text-sm" />
      <span>{message}</span>
    </div>
  );
}
