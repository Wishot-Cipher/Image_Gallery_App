import React, { forwardRef } from "react";

export const Photo = forwardRef(
  ({ url, index, faded, style, tags, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          opacity: faded ? "0.2" : "1",
          transformOrigin: "0 0",
          backgroundImage: `url("${url}")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 10px",
          ...style,
        }}
        {...props}
        className={`rounded-xl ${
          index === 0 ? "md:col-span-2 mb-0" : "md:mb-0"
        } ${
          index === 0 ? "h-[410px]" : "h-[350px] lg:h-[280px]"
        } block relative`}
      >
        {/* {tags && (
          <div className="tags absolute bottom-4 left-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="tag bg-indigo-500 text-white px-2 py-1 rounded-full text-sm mr-2 mb-2 inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        )} */}
      </div>
    );
  }
);
