import React from "react";


const FooterLanding = () => {
  return (
    <div className="bg-square-white pt-2 pb-2 mt-16">
      <div className="max-w-screen-xl w-full mx-auto px-6 sm:px-8 lg:px-16 grid grid-rows-6 sm:grid-rows-1 grid-flow-row sm:grid-flow-col grid-cols-3 sm:grid-cols-12 gap-4">
        <div className="row-span-2 sm:col-span-4 col-start-1 col-end-4 sm:col-end-5 flex flex-col items-start ">
          <p className="mb-4">
            <strong className="font-medium">Chess2Earn</strong> is the first chess game on the Solana Blockchain          </p>
          <div className="flex w-full mt-2 mb-8 -mx-2">
          </div>
          <p className="text-black">©2022 - Chess2Earn</p>
        </div>
        <div className=" row-span-2 sm:col-span-2 sm:col-start-7 sm:col-end-9 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Product</p>
          <ul className="text-gray-500 ">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
            <a href="https://get-chess-pieces.chess2earn.com" target="_blank"
                        rel="noreferrer">

              Chess Pieces{" "}
              </a>
            </li>
          </ul>
        </div>
        <div className="row-span-2 sm:col-span-2 sm:col-start-9 sm:col-end-11 flex flex-col">
          <p className="text-black-600 mb-4 font-medium text-lg">Engage</p>
          <ul className="text-gray-500">
            <li className="my-2 hover:text-orange-500 cursor-pointer transition-all">
            <a href="https://discord.gg/waFXw4Jq5e" target="_blank"
                        rel="noreferrer">

              Discord{" "}
             </a> 
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
};

export default FooterLanding;