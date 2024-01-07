import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();
export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [me] = useContext(AuthContext);
  const [isPublic, setIsPublic] = useState(false);
  useEffect(() => {
    // 로그인 안해도 보이는 리스트
    axios
      .get("/images") // localhost:5000 is not necessary at here thanks to the proxy
      .then((result) => {
        setImages(result.data);
      })
      .catch((err) => console.error(err));
  }, []);
  useEffect(() => {
    // 로그인 했을 때 보이는 리스트
    if (me) {
      setTimeout(() => {
        axios
          .get("/users/me/images")
          .then((result) => setMyImages(result.data))
          .catch((err) => console.error(err));
      }, 0);
    } else {
      setMyImages([]);
      setIsPublic(true);
    }
  }, [me]);
  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
