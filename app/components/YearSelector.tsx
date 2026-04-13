"use client";

import { useRouter, usePathname } from "next/navigation";

export default function YearSelector({ year }: { year: number }) {
  const router = useRouter();
  const pathname = usePathname();

  function go(delta: number) {
    router.push(`${pathname}?year=${year + delta}`);
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => go(-1)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors text-sm font-medium"
        title="Año anterior"
      >
        ‹
      </button>
      <span className="text-sm font-semibold text-gray-700 tabular-nums min-w-[3rem] text-center">
        {year}
      </span>
      <button
        onClick={() => go(+1)}
        className="w-7 h-7 flex items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-800 transition-colors text-sm font-medium"
        title="Año siguiente"
      >
        ›
      </button>
    </div>
  );
}
