import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App.jsx";
import "./index.css";
import "./App.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {/* Ang Provider ang gumagawa para ma-access ng App at lahat ng
        components sa loob nito ang Redux store. */}
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);