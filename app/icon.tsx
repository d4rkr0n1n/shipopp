import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: "50%",
        background: "#101614",
        color: "#c7ff29",
        fontSize: 38,
        fontWeight: 900,
        fontFamily: "Arial, sans-serif",
      }}
    >
      S
    </div>,
    size,
  );
}
