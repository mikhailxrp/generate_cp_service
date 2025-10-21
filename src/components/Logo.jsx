import Image from "next/image";
import Link from "next/link";
import PropTypes from "prop-types";

export default function Logo({ alt = "logo", variant }) {
  const src = variant === "mini" ? "/brand/logo-min.svg" : "/brand/logo.svg";
  return (
    <Link
      href="/"
      style={{
        position: "relative",
        display: "block",
        width: "100%",
        height: "100%",
      }}
    >
      <Image src={src} alt={alt} fill style={{ objectFit: "contain" }} />
    </Link>
  );
}

Logo.propTypes = {
  variant: PropTypes.oneOf(["mini", "full"]),
  alt: PropTypes.string,
};
