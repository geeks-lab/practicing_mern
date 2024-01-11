import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import MainPage from "./pages/MainPage";
import { Routes, Route } from "react-router-dom";
import ToolBar from "./components/ToolBar";
import ImagePage from "./pages/ImagePage";
import { ImageProvider } from "./context/ImageContext"; // Import ImageContext

const App = () => {
  return (
    <div style={{ maxwidth: 600, margin: "auto" }}>
      <ToastContainer />
      <ImageProvider>
        <ToolBar />
        <Routes>
          <Route path="/images/:imageId" exact element={<ImagePage />} />
          <Route path="/auth/register" exact element={<RegisterPage />} />
          <Route path="/auth/login" exact element={<LoginPage />} />
          <Route path="/" element={<MainPage />} />
        </Routes>
      </ImageProvider>
    </div>
  );
};

export default App;
