import { LOGO_PATHS } from "@/lib/logos";
import { companyColor, companyName } from "@/lib/data";

export function CompanyLogo({
  companyId,
  size = 14,
  color,
  className,
}: {
  companyId: string;
  size?: number;
  color?: string;
  className?: string;
}) {
  const logo = LOGO_PATHS[companyId];
  const fill = color ?? companyColor(companyId);
  if (!logo) {
    // unknown company — fall back to the color dot
    return (
      <span
        aria-hidden
        className={className}
        style={{
          display: "inline-block",
          width: size,
          height: size,
          borderRadius: "9999px",
          background: fill,
        }}
      />
    );
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      role="img"
      aria-label={companyName(companyId)}
      className={className}
    >
      <path d={logo.path} fill={fill} />
    </svg>
  );
}
