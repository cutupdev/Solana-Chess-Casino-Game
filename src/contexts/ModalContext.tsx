import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

export enum ModalUserAction {
  CancelOffer,
  AcceptOffer,
}

export type ActionProps =
  | {
      type: ModalUserAction.CancelOffer;
      id: string;
      escrowAddress: string;
      nftAddress: string;
    }
  | {
      type: ModalUserAction.AcceptOffer;
      id: string;
      amount: number;
      escrowAddress: string;
      nftAddress: string;
    };
type Content = {
  buttonName: string;
  message: string;
  props: ActionProps;
  title: string;
};
type State = { content?: Content | undefined; show: boolean } | undefined;
type Action = { type: "SHOW_DIALOG"; input: Content } | { type: "HIDE_DIALOG" };

const ModalStateContext = createContext<State>(undefined);
const ModalDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

const modalReducer = (state: State, action: Action): State => {
  switch (action?.type) {
    case "SHOW_DIALOG":
      const content: Content = {
        ...action.input,
      };
      return {
        content,
        show: true,
      };
    case "HIDE_DIALOG":
      return {
        content: undefined,
        show: false,
      };
    default:
      return {
        ...state,
        show: false,
      };
  }
};

const initialState = {
  show: false,
};

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(modalReducer, initialState);

  return (
    <ModalStateContext.Provider value={state}>
      <ModalDispatchContext.Provider value={dispatch}>
        {children}
      </ModalDispatchContext.Provider>
    </ModalStateContext.Provider>
  );
};

export const useModalState = () => {
  const state = useContext(ModalStateContext);
  if (state === undefined) {
    throw new Error("useModalState should be used with ModalProvider");
  }
  return state;
};

export const useModalDispatch = () => {
  const dispatch = useContext(ModalDispatchContext);

  if (dispatch === undefined) {
    throw new Error("useModalDispatch should be used with ModalProvider");
  }
  return dispatch;
};
