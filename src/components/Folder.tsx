/** macOS 스타일 파란 폴더 아이콘 (탭 + 몸통 + 라벨) */
export function Folder({ label }: { label: string }) {
  return (
    <span
      className="relative block h-[50px] w-[62px] before:absolute before:top-0.5 before:left-[3px] before:h-2.5 before:w-[26px] before:rounded-t before:bg-[#5aa7f5] before:content-[''] after:absolute after:inset-x-0 after:top-[7px] after:bottom-0 after:rounded-[5px] after:bg-[linear-gradient(#8cc7ff,#62aef7)] after:shadow-[inset_0_1px_0_rgba(255,255,255,.55)] after:content-['']"
    >
      <span className="absolute inset-x-0 top-5 z-[1] text-center text-[13px] font-extrabold text-[rgba(18,72,140,.75)]">{label}</span>
    </span>
  );
}
