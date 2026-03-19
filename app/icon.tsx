import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0a0a0a",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "2px solid #D4AF37",
          color: "#D4AF37",
          fontSize: 16,
          fontFamily: "serif",
          fontWeight: 600,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
