import { Dialog } from "@headlessui/react";
import {
  ActionProps,
  useModalDispatch,
  useModalState,
} from "../../contexts/ModalContext";

interface DialogProps {
  onConfirm: (props: ActionProps) => any;
}
export const ModalDialog = ({ onConfirm }: DialogProps) => {
  const dispatch = useModalDispatch();
  const state = useModalState();

  const handleClose = () => {
    dispatch({ type: "HIDE_DIALOG" });
  };

  const handleConfirm = (props: ActionProps) => async () => {
    await onConfirm(props);
    dispatch({ type: "HIDE_DIALOG" });
  };

  return (
    <Dialog
      open={state.show}
      onClose={handleClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" />
        {state.content && (
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform sm:my-2 sm:align-middle sm:max-w-lg sm:w-full sm:max-h-full">
            <div className="px-4 pt-5 pb-4 sm:p-6">
              <div className="sm:flex sm:items-start flex-col">
                <Dialog.Title className="text-lg leading-6 font-medium text-gray-900 pt-2 pb-2">
                  {state.content.title}
                </Dialog.Title>
                <Dialog.Description className="text-md text-gray-500 pt-2 pb-2">
                  {state.content.message}
                </Dialog.Description>
                <div className="pt-4 sm:w-full">
                  <div className="sm:flex sm:flex-row-reverse gap-2">
                    <button
                      className="w-full inline-flex justify-center rounded-md border border-purple-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-purple-500 hover:bg-purple-100  sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleClose}
                    >
                      Cancel
                    </button>
                    <button
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 sm:ml-3 sm:w-auto sm:text-sm"
                      onClick={handleConfirm(state.content.props)}
                    >
                      {state.content.buttonName}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Dialog>
  );
};
