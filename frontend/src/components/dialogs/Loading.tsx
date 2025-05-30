import { Dialog } from "@headlessui/react";
import { useLoadingState } from "../../contexts/LoadingContext";

export const Loading = () => {
  const state = useLoadingState();

  return (
    <Dialog
      open={state.show}
      onClose={() => {}}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-2 sm:align-middle sm:p-6">
          <div className="flex justify-center self-center">
            <div className="animate-spin rounded-full h-24 w-24 border-t-2 border-b-2 border-purple-500"></div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
