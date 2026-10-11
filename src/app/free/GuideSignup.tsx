"use client";

import { useEffect, useRef } from "react";

// Kit's own embed script (not a hand-rolled POST): it runs reCAPTCHA and handles Kit's spam check ("quarantined"),
// which a plain POST without a token fails silently. Styled below to match the site.
export function GuideSignup({ uid, src }: { uid: string; src: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const box = ref.current;
    if (!box || box.querySelector("script")) return;
    const s = document.createElement("script");
    s.async = true;
    s.src = src;
    s.dataset.uid = uid;
    box.appendChild(s);
  }, [uid, src]);
  return (
    <div ref={ref} className="kit-guide min-h-[52px]">
      <style>{`
        .kit-guide .formkit-form { max-width: none !important; background: transparent !important; border: 0 !important; padding: 0 !important; font-family: inherit !important; }
        .kit-guide .formkit-form [data-style="clean"] { padding: 0 !important; }
        .kit-guide .formkit-fields { margin: 0 !important; gap: 12px; }
        .kit-guide .formkit-input { height: 44px !important; border-radius: 8px !important; border: 1px solid #d4d4d4 !important; background: #fff !important; font-size: 15px !important; color: #171717 !important; padding: 0 16px !important; }
        .kit-guide .formkit-input:focus { border-color: #171717 !important; box-shadow: 0 0 0 4px rgba(0,0,0,.05) !important; }
        .kit-guide .formkit-submit { height: 44px !important; border-radius: 8px !important; background: #171717 !important; font-size: 14px !important; font-weight: 500 !important; }
        .kit-guide .formkit-submit > span { padding: 0 20px !important; }
        .kit-guide .formkit-powered-by-convertkit-container { margin: 10px 0 0 !important; justify-content: flex-start !important; }
        .kit-guide .formkit-alert-success { border-radius: 10px !important; font-size: 14px !important; }
      `}</style>
    </div>
  );
}
