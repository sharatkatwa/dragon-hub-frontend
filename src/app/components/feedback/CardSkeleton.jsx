const CardSkeleton = () => {
  return (
    <div className="surface-panel animate-pulse rounded-xl p-4">
      <div className="aspect-[16/9] rounded-lg bg-white/35" />
      <div className="mt-4 h-4 w-2/3 rounded bg-white/35" />
      <div className="mt-3 h-3 w-full rounded bg-white/25" />
      <div className="mt-2 h-3 w-4/5 rounded bg-white/25" />
      <div className="mt-4 flex gap-2">
        <div className="h-7 w-16 rounded-lg bg-white/25" />
        <div className="h-7 w-20 rounded-lg bg-white/25" />
      </div>
    </div>
  );
};

export default CardSkeleton;
