import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";

const App = () => {
  return (
    <div style={{ maxwidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ToolBar />
      <Routes>
        <Route path="/auth/register" exact element={<RegisterPage />} />
        <Route path="/auth/login" exact element={<LoginPage />} />
        <Route path="/" element={<MainPage />} />
      </Routes>
    </div>
  );
};

export default App;
