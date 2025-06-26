import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { appStore } from "./app/store.js";
import { Toaster } from "react-hot-toast";

const root = document.getElementById("root");

createRoot(root).render(
  <Provider store={appStore}>
    <Toaster position="top-center" />
    <App />
  </Provider>
);
