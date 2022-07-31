import {
  createContext,
  Dispatch,
  ReactNode,
  useContext,
  useReducer,
} from "react";

type State = { show: boolean } | undefined;
type Action = { type: "SHOW_LOADING" } | { type: "HIDE_LOADING" };

const LoadingStateContext = createContext<State>(undefined);
const LoadingDispatchContext = createContext<Dispatch<Action> | undefined>(
  undefined
);

const reducer = (state: State, action: Action): State => {
  switch (action?.type) {
    case "SHOW_LOADING":
      return {
        show: true,
      };
    case "HIDE_LOADING":
      return {
        show: false,
      };
    default:
      return {
        show: false,
      };
  }
};

const initialState = {
  show: false,
};

export const LoadingProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <LoadingStateContext.Provider value={state}>
      <LoadingDispatchContext.Provider value={dispatch}>
        {children}
      </LoadingDispatchContext.Provider>
    </LoadingStateContext.Provider>
  );
};

export const useLoadingState = () => {
  const state = useContext(LoadingStateContext);
  if (state === undefined) {
    throw new Error("useLoadingState should be used with LoadingProvider");
  }
  return state;
};

export const useLoadingDispatch = () => {
  const dispatch = useContext(LoadingDispatchContext);

  if (dispatch === undefined) {
    throw new Error("useLoadingDispatch should be used with LoadingProvider");
  }
  return dispatch;
};
