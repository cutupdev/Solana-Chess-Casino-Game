import React from "react";
import { Toaster } from "react-hot-toast";
import { HeaderOriginal } from "./HeaderOriginal";

export const Layout = ({
  children,
}: {
  children: React.ReactNode;
}) => {


  return (
    <div className="flex flex-col h-screen">
      <HeaderOriginal />
      <div className="w-fullscreen flex-grow">{children}</div>
      <footer className="flex items-center justify-center py-2 px-10">
        <div className="text-xs text-gray-600 px-3">
          2022 Chess2Earn - All rights reserved
      </div>
      </footer>
      <Toaster />
    </div>
  )
}
