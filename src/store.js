import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { Auth } from "./Reducers/Auth";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  REHYDRATE,
  persistReducer,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { Theme } from "./Reducers/Theme";

const rootReducer = combineReducers({
  auth: Auth.reducer,
  theme: Theme.reducer,
});

const store = configureStore({
  reducer: persistReducer(
    {
      key: "root",
      version: 1,
      storage,
    },
    rootReducer
  ),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export default store;
