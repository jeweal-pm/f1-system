export function GmsMark() {
  return (
    <div className="flex items-center gap-2.5" aria-label="GMS Gemstone Management System">
      <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" role="img" aria-hidden="true">
        <path d="M3 8 35 5 19 14 4 12Z" fill="#006c68" />
        <path d="m4 14 12 1-7 18-6-7Z" fill="#19a78f" />
        <path d="m18 17 18-9-18 27-7-1Z" fill="#006c68" />
        <path d="m11 32 5-13 4 1Z" fill="#89c6b5" />
      </svg>
      <div className="leading-none">
        <div className="text-[23px] font-bold tracking-[0.09em] text-[#006c68]">GMS</div>
        <div className="mt-1 text-[7px] tracking-wide text-[#48716c]">Gemstone Management System</div>
      </div>
    </div>
  );
}
