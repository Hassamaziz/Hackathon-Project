import "bootstrap/dist/js/bootstrap.bundle";

import "./App.css";
import React, { useEffect, useState } from "react";
import Routing from "../src/Pages/Frontend/Routing";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "../src/Config/Global";
import AuthContextProvider from "./Contexts/AuthContext";
function App() {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);
  return (
    <>
      {isLoading ? (
        <div className="d-flex justify-content-center align-items-center vh-100">
          <h1 >
          <div className="spinner spinner-grow spinner-grow-sm"></div>
          </h1>
        </div>
      ) : (
        <>
          <AuthContextProvider>
            <Routing />
          </AuthContextProvider>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
          />
        </>
      )}
    </>
  );
}

export default App;