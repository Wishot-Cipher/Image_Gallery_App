import React from "react";
import { Oval } from "react-loader-spinner";

const ReactSpinner = () => {
  return (
    <div className="spinner-container">
      <Oval
        ariaLabel="loading-indicator"
        height={120}
        width={120}
        strokeWidth={1}
        strokeWidthSecondary={2000}
        color="#32424C"
        secondaryColor="white"
      />
    </div>
  );
};

export default ReactSpinner;

export const ReactSpinnerMobile = () => {
  return (
    <div className="">
      <Oval
        ariaLabel="loading-indicator"
        height={80}
        width={90}
        strokeWidth={1}
        strokeWidthSecondary={2000}
        color="#32424C"
        secondaryColor="white"
      />
    </div>
  );
};
