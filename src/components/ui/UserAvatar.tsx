export interface UserAvatarProps {
  name?: string | null;
  email?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

function getInitials(
  name?: string | null,
  email?: string | null
): string {
  if (name && name.trim().length > 0) {
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return parts[0].slice(0, 2).toUpperCase();
  }

  if (email && email.trim().length > 0) {
    const username = email.split("@")[0].trim();
    if (username.length > 0) {
      return username.slice(0, 2).toUpperCase();
    }
  }

  return "RF";
}

const sizeClasses: Record<NonNullable<UserAvatarProps["size"]>, string> = {
  xs: "size-6 text-[10px]",
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-16 text-xl",
  xl: "size-20 sm:size-24 text-2xl sm:text-3xl font-black",
};

export function UserAvatar({
  name,
  email,
  size = "md",
  className = "",
}: UserAvatarProps) {
  const initials = getInitials(name, email);

  return (
    <div
      role="img"
      aria-label={`Foto de perfil de ${name || email || "Usuario"}`}
      className={[
        "shrink-0 select-none rounded-full flex items-center justify-center font-extrabold tracking-wider",
        "bg-gradient-to-br from-brand via-violet-hover to-charcoal text-on-brand shadow-2xs border border-white/20",
        sizeClasses[size],
        className,
      ].join(" ")}
    >
      <span>{initials}</span>
    </div>
  );
}
