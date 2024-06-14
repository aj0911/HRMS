import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { onValue, ref, set } from 'firebase/database';
import { db } from './firebase';
import { uid } from 'uid';
import { MODES, Roles, encryptData } from './Helper/Helper';
import { Provider } from "react-redux"
import store from "./store.js"
import { PersistGate } from "redux-persist/integration/react"
import { persistStore } from "redux-persist"
import SettingService from './Services/SettingService.js';

const loadSuperAdmin = () => {
  onValue(ref(db, `users/`), (snapshot) => {
    const data = snapshot.val();
    if (data === null || Object.keys(data).length === 0) {
      const id = uid();
      //Creating an admin
      set(ref(db, 'users/' + id), {
        id,
        name:process.env.REACT_APP_SUPERADMIN_NAME,
        email: process.env.REACT_APP_SUPERADMIN_EMAIL,
        pass: encryptData(process.env.REACT_APP_SUPERADMIN_PASSWORD),
        role: Roles.SUPER_ADMIN,
        time: Date.now()
      });

      //Creating Settings for admin
      SettingService.create({
        user:id,
        mobile_notify:false,
        desktop_notify:false,
        email_notify:true
      })
    }
  });
}

loadSuperAdmin()

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate persistor={persistStore(store)}>
          <App />
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
