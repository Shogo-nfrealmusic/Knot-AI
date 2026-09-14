import React from "react";

// Tuned for a white ground: faint cool/warm tints instead of the template's white glow.
export const AmbientColor = () => {
  return (
    // overflow-hidden: the rotated gradients otherwise widen the page on phones.
    <div className="absolute top-0 left-0 w-screen h-screen z-40 pointer-events-none overflow-hidden">
      <div
        style={{
          transform: "translateY(-350px) rotate(-45deg)",
          width: "560px",
          height: "1380px",
          background:
            "radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(214, 90%, 60%, .07) 0, hsla(214, 90%, 60%, .02) 50%, hsla(214, 90%, 60%, 0) 80%)",
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          transform: "rotate(-45deg) translate(5%, -50%)",
          transformOrigin: "top left",
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(14, 80%, 60%, .05) 0, hsla(14, 80%, 60%, .015) 80%, transparent 100%)",
        }}
        className="absolute top-0 left-0"
      />

      <div
        style={{
          position: "absolute",
          borderRadius: "20px",
          transform: "rotate(-45deg) translate(-180%, -70%)",
          transformOrigin: "top left",
          top: 0,
          left: 0,
          width: "240px",
          height: "1380px",
          background:
            "radial-gradient(50% 50% at 50% 50%, hsla(214, 90%, 60%, .04) 0, hsla(214, 90%, 60%, .015) 80%, transparent 100%)",
        }}
        className="absolute top-0 left-0"
      />
    </div>
  );
};
