import avatar from "../assets/avatar.webp";
import { cn } from "../lib/cn";

/** 프로필 캐릭터 — 파스텔 원 위에 얹고, 마우스를 올리면 살짝 기울어요 */
export function Avatar({
  size,
  className,
  alt = "송기영 프로필 캐릭터",
}: {
  size: number;
  className?: string;
  alt?: string;
}) {
  return (
    <span
      className={cn(
        "group grid flex-none place-items-end overflow-hidden rounded-full bg-[linear-gradient(140deg,#cfe2ff,#e6d8ff_55%,#ffe0ec)]",
        className,
      )}
      style={{ width: size, height: size }}
    >
      <img
        src={avatar}
        alt={alt}
        draggable={false}
        className="block size-full origin-[50%_90%] object-cover "
      />
    </span>
  );
}

export { avatar as avatarSrc };
