import type { NextPage } from "next";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/dist/client/router";
import { auth } from '../firebase'
import { backgroundBlackOrWhite, DescriptionGame } from "../components/DescriptionGame";
import { MyChessPieces } from "../components/MyChessPieces";
import { useAuthState } from "react-firebase-hooks/auth";
import LayoutLanding from "../components/LayoutLanding/LayoutLanding";

const SignIn: NextPage = () => {
  const [user, _, _error] = useAuthState(auth)
  const router = useRouter();

  const [userName, setUserName] = useState('');

  const handleChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value ? e.target.value.toString() : "");
  };

  /**
   * Sign in the username with Firebase.
   * @param e
   */
  const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    // TODO: Save the username in Firebase when sign in
    localStorage.setItem('userName', userName);
    await auth.signInAnonymously();
  };

  useEffect(() => {
    if (user) {
      // Return to the previous page.
      const returnUrl = router.query.returnUrl || '/';

      // @ts-ignore
      router.push(returnUrl);
    }
  }, [user, router])


  return (
    <LayoutLanding>

      {/* Play Section */}

      <div className="flex flex-col justify-center items-center mb-10 mt-10" id="play">
        <h2 className="title-presentation" style={{ marginTop: '100px' }}>Play Chess</h2>
        <div className="dividerBlue" />
      </div>

      <div className="flex flex-col justify-center items-center">
        {/* The form to sign in and register. */}
        <div className="mb-6 mt-2">
          <div className="flex flex-row items-center">
            <div>
              <label className="block text-gray-500 font-bold md:text-right mb-1 md:mb-0 pr-4"
                htmlFor="inline-full-name">
                Username
                    </label>
            </div>
            <input
              type="text"
              name="seller-address"
              id="seller-address"
              placeholder="Enter your username"
              className="min-w-full focus:ring-indigo-500 focus:border-indigo-500 w-full shadow-sm  sm:text-sm border-gray-300 rounded-md"
              onChange={handleChangeUsername}
              value={userName}
            />
          </div>
          <button
            className="w-24 cursor-pointer py-2 px-4 rounded transition text-left text-purple-50 bg-yellow-700 disabled:opacity-30 mt-1"
            onClick={handleSignIn}
          >
            Sign In
                </button>
        </div>

        <div style={{ marginBottom: '20px' }} />

        <MyChessPieces />

        <div style={{ marginBottom: '20px' }} />

      </div>

      <div className="flex flex-col justify-center items-center mt-40" id="concept">
        <h2 className="title-presentation">How to get started</h2>
        <div className="dividerBlue" />
        
        <DescriptionGame />
      </div>



    </LayoutLanding>);
};

export default SignIn;



