export default function LoadingOverlay({ show }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-neutral-200 border-t-[#7A1315]"></div>
        <p className="text-sm font-bold tracking-widest text-[#7A1315]">LOADING...</p>
      </div>
    </div>
  );
}
