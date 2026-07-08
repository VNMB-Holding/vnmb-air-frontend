import React from "react";

interface SvgIconProps {
  name: string;
  className?: string;
  size?: number | string;
}

export const SvgIcon: React.FC<SvgIconProps> = ({ name, className = "w-5 h-5", size }) => {
  const iconName = name.endsWith(".svg") ? name : `${name}.svg`;
  const style: React.CSSProperties = {
    maskImage: `url(/icons/${iconName})`,
    WebkitMaskImage: `url(/icons/${iconName})`,
    maskSize: "contain",
    WebkitMaskSize: "contain",
    maskRepeat: "no-repeat",
    WebkitMaskRepeat: "no-repeat",
    display: "inline-block",
    backgroundColor: "currentColor",
    width: size ? (typeof size === "number" ? `${size}px` : size) : undefined,
    height: size ? (typeof size === "number" ? `${size}px` : size) : undefined,
  };

  return <span className={className} style={style} aria-hidden="true" />;
};
