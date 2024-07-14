import { Dispatch, FC, PropsWithChildren } from "react";
import { AuthState } from "./types";
import React from "react";
import { PayloadAction, initialize, reducer } from "./reduce";
import UserService from "@/services/UserService";

export interface AuthContextType extends AuthState {
  dispatch: Dispatch<PayloadAction<AuthState>>;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isInitialized: false,
  user: null
};

export const AuthContext = React.createContext<AuthContextType>({
  ...initialState,
  dispatch: () => null
});

const AuthProvider: FC<PropsWithChildren> = ({ children }) => {
  const [authState, dispatchAuth] = React.useReducer(reducer, initialState);
  React.useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = await UserService.getProfile();
        dispatchAuth(initialize({ isAuthenticated: true, user }));
      } catch {
        dispatchAuth(initialize({ isAuthenticated: false, user: null }));
      }
    };

    fetchProfile();
  }, []);

  return (
    <AuthContext.Provider value={{ ...authState, dispatch: dispatchAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
