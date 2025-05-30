import React from "react";
import HeaderLanding from "./HeaderLanding";
import FooterLanding from "./FooterLanding";

const LayoutLanding = ({ children }) => {
  return (
    <>
      <HeaderLanding />
      {children}
      <FooterLanding />
    </>
  );
};

export default LayoutLanding;
