export default function AccountHeader({ displayName, email, avatar }) {
  const firstLetter = displayName ? displayName.charAt(0).toUpperCase() : "U";

  return (
    <div className="bg-[#F8FAFC] border border-slate-100 rounded-2xl p-6 mb-4 text-center w-full">
      {/* Khung Avatar vuông bo tròn góc */}
      <div className="w-full aspect-square max-w-[220px] mx-auto bg-[#D1FAE5]/60 rounded-2xl overflow-hidden mb-4 flex items-center justify-center border border-emerald-100">
        {avatar ? (
          <img
            src={avatar}
            alt={displayName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full text-emerald-700 font-extrabold text-6xl flex items-center justify-center select-none">
            {firstLetter}
          </div>
        )}
      </div>

      <h2 className="text-lg font-bold text-slate-900 mb-0.5 tracking-tight truncate">
        {displayName}
      </h2>
      <p className="text-xs text-slate-400 font-medium truncate">{email}</p>
    </div>
  );
}
