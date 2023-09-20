import React, { forwardRef } from "react";

export const Photo = forwardRef(
  ({ url, index, faded, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          opacity: faded ? "0.2" : "1",
          transformOrigin: "0 0",
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          // backgroundColor: "black",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 10px",
          ...style,
        }}
        {...props}
        className={`rounded-xl ${
          index === 0 ? "md:col-span-2 mb-0" : "md:mb-0"
        } ${
          index === 0 ? "h-[410px]" : "h-[350px] lg:h-[280px]"
        } block`}
      />
    );
  }
);
