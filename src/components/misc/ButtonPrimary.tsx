import React from "react";

interface IProps {
  children: any;
  isColorBlack: boolean;
}

const ButtonPrimary = ({ children, isColorBlack }: IProps) => {

  if (isColorBlack) {
    return (
      <button
        className={
          "py-3 lg:py-4 px-12 lg:px-16 text-white bg-square-black font-semibold rounded-lg hover:shadow-square-black-md transition-all outline-none "
        }
      >
        {children}
      </button>
    );  
  } else {
    return (
      <button
        className={
          "py-3 lg:py-4 px-12 lg:px-16 text-black bg-square-white font-semibold rounded-lg hover:shadow-square-black-md transition-all outline-none "
        }
      >
        {children}
      </button>
    );  
  }
};

export default ButtonPrimary;
