import React from "react";
import ImageUploader from "./ImageUploader";

export function Grid({ children, columns }) {
  return (
    <div>
      <ImageUploader />
      <div
        style={{
          display: "grid",
          // gridTemplateColumns: `repeat(${columns}, 2fr)`,
          gridGap: 12,
          padding: 10,
        }}
        className="md:grid-cols-3 lg:flex lg:items-center mx-2" // Set the number of columns for medium screens and larger
      >
        {children}
      </div>
    </div>
  );
}
