import React, { forwardRef } from "react";

export const Photo = forwardRef(
  ({ url, index, faded, style, tags, image, ...props }, ref) => {
    return (
      <div
        ref={ref}
        style={{
          opacity: faded ? "0.2" : "1",
          transformOrigin: "0 0",
          backgroundImage: url ? `url("${url.url}")` : 'none',
          backgroundSize: "cover",
          backgroundPosition: "center",
          boxShadow: "rgba(0, 0, 0, 0.3) 0px 5px 10px",
          transition: "transform 0.2s ease-in-out",
          backgroundColor: "rgba(0, 0, 0, 0.1)", // Darker smoky background
          ...style,
        }}
        {...props}
        className={`rounded-xl bg-transparent ${
          index === 0 ? "md:col-span-2 mb-0" : "md:mb-0"
        } ${
          index === 0 ? "h-[410px]" : "h-[350px] lg:h-[280px]"
        } block relative`}
      >
        {tags && (
          <div className="tags absolute bottom-4 left-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="tag bg-gradient-to-r from-pink-600 to-blue-700 border-2 border-blue-500 text-white font-bold px-3 py-1.5 rounded-xl text-sm mr-2 mb-2 inline-block"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }
);


