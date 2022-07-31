import React from "react";
import {FaRocket} from "react-icons/fa";
import {toast} from "react-toastify";

interface IProps {
    shareableLink: string;
}

/**
 * Sharing button for the link.
 * @constructor
 */
export const SharingButton = ({shareableLink}: IProps) => {


    /**
     * Copy the link to the clipboard.
     */
    async function copyToClipboard() {
        await navigator.clipboard.writeText(shareableLink);
        toast.success('Link copied!', {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            draggable: true,
            progress: undefined,
        });
    }

    return (
            <div className="p-4 sm:px-0 bg-gray-700 p-3 rounded-xl mt-8">
                <div className="flex flex-col justify-center items-center rounded-md text-white py-3 px-6 w-84">
                    <FaRocket size={30}/>
                    <h3 className="text-lg font-medium leading-6">
                        Share this game to continue. 
                        Post the link in the Discord to find players.
                    </h3>
                    <input type="text" name="" id="" className="input text-black" style={{width: '500px'}} readOnly value={shareableLink}/>
                    <button
                        className="cursor-pointer py-2 px-4 rounded transition text-center mt-2"
                        style={{backgroundColor: '#F0D9B5', color: '#000000'}}
                        onClick={copyToClipboard}
                    >
                        Copy Link
                    </button>
                </div>
            </div>
    )
}
