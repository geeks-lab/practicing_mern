import React, { useState, useEffect } from "react";
import axios from "axios";
import UploadForm from "./components/UploadForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ImageList from "./components/ImageList";

const App = () => {
  const [images, setImages] = useState([]);
  useEffect(() => {
    axios
      .get("/images") // localhost:5000 is not necessary at here thanks to the proxy
      .then((result) => setImages(result.data))
      .catch((err) => console.error(err));
  }, []);
  return (
    <div style={{ maxwidth: 600, margin: "auto" }}>
      <ToastContainer />
      <h2>사진첩</h2>
      <UploadForm images={images} setImages={setImages} />
      <ImageList images={images} />
    </div>
  );
};

export default App;
