import React from "react";

const ReactSpinner = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner-bounce">
        <div className="bounce1 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
        <div className="bounce2 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
        <div className="bounce3 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
      </div>
    </div>
  );
};

export default ReactSpinner;

export const ReactSpinnerMobile = () => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="spinner-bounce">
        <div className="bounce1 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
        <div className="bounce2 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
        <div className="bounce3 bg-gradient-to-r from-[#10132E] via-purple-950 to-indigo-950"></div>
      </div>
    </div>
  );
};
