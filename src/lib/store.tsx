import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Provider, useSelector } from "react-redux";
import { encrypt } from "./crypto";

export type User = {
  id: string;
  avatar: string;
  createdAt: string;
  email: string;
  name: string;
  password: string;
};

export const KeyStore = "#store";

type StoreData = { user?: User; loggedIn: boolean };

const storeContext = createSlice({
  name: KeyStore,
  initialState: {} as StoreData,
  reducers: {
    setSession: (state, action: PayloadAction<User>) => {
      localStorage.setItem(KeyStore, encrypt(JSON.stringify(action.payload)));
      state.loggedIn = true;
      state.user = action.payload;
    },
    clearSession: (state) => {
      localStorage.removeItem(KeyStore);
      state.loggedIn = false;
      state.user = undefined;
    },
  },
});

const store = configureStore({
  reducer: { [KeyStore]: storeContext.reducer },
});

export const actions = storeContext.actions;

export const StoreProvider: FC<{}> = (props) => (
  <Provider store={store}>{props.children}</Provider>
);

// hook

export const useStore = (): StoreData =>
  useSelector((state: ReturnType<typeof store.getState>) => state[KeyStore]);

export const useStoreUser = (): User => (useStore().user || {}) as User;

export const useStoreLoggedIn = (): boolean => Boolean(useStore().loggedIn);
