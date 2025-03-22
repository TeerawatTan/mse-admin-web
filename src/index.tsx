import React from 'react'
import { BrowserRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { setAuthorizationToken } from './api';

import App from './App.js'
import { store } from "./redux/store.js";

const accessToken = localStorage.getItem("accessToken");
if (accessToken) {
  setAuthorizationToken(accessToken)
}
const container = document.getElementById('konrix');
if (container) {
  const root = createRoot(container);
  root.render(
    <Provider store={store}>
      <React.Fragment>
        <BrowserRouter basename={'/Admin'}>
          <App />
        </BrowserRouter>
      </React.Fragment>
    </Provider>
  )
}
