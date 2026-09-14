import React from "react";

// dub.co-style tile: 1px gradient border around a white face.
export const IconContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <div
      className={`relative flex-shrink-0 rounded-[14px] bg-gradient-to-b from-neutral-200 to-neutral-300 p-px
    shadow-[0_1px_2px_0_rgba(0,0,0,0.05),0_8px_16px_-8px_rgba(0,0,0,0.10)]
    hover:scale-[0.98] transition duration-200
    `}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-[13px] bg-white">
        <div className="h-8 w-8 rounded-md overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
