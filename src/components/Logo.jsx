import React from "react";

export function Logo({ size = 45, lightText = false }) {
  return (
    <div className="flex items-center gap-3 select-none">
      <img
        src="/logo.png"
        alt="FLTY Services"
        width={size}
        height={size}
        style={{ width: size, height: size }}
        className="object-contain shrink-0"
      />

      <div className="flex flex-col justify-center">
        <div className="text-2xl font-black tracking-tight leading-none uppercase">
          <span className="text-[#09B652]">Flty</span>
          <span className={lightText ? "text-white ml-1" : "text-[#FDCF20] ml-1"}>Services</span>
        </div>
        <span
          className={`text-[9px] font-medium tracking-wide mt-1 leading-none ${
            lightText ? "text-white/80" : "text-[#6b7a72]"
          }`}
        >
          Empowering Farmers, Enriching Lives
        </span>
      </div>
    </div>
  );
}
