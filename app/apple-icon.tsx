import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 38,
        background: "#101614",
        color: "#c7ff29",
        fontSize: 108,
        fontWeight: 900,
        fontFamily: "Arial, sans-serif",
      }}
    >
      S
    </div>,
    size,
  );
}
