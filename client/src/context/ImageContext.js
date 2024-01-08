import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useRef,
} from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

export const ImageContext = createContext();
export const ImageProvider = (prop) => {
  const [images, setImages] = useState([]);
  const [myImages, setMyImages] = useState([]);
  const [isPublic, setIsPublic] = useState(false);
  const [imageUrl, setImageUrl] = useState("/images");
  const [imageLoading, setImageLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [me] = useContext(AuthContext);
  const pastImageUrlRef = useRef();

  useEffect(() => {
    if (pastImageUrlRef.current === imageUrl) return; // isPublic이 바뀔 때도 호출 되는것을 막기위함
    setImageLoading(true);
    axios
      .get(imageUrl) // localhost:5000 is not necessary at here thanks to the proxy
      .then((result) => {
        //either way works
        //setImages((prevData) => [...prevData, ...result.data]);
        //setImages([...images, ...result.data]);
        // but the second one needs to add images to the dependency [imageUrl, images]
        isPublic
          ? setImages((prevData) => [...prevData, ...result.data])
          : setMyImages((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => {
        setImageLoading(false);
        pastImageUrlRef.current = imageUrl;
      });
  }, [imageUrl, isPublic]);
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
        images: isPublic ? images : myImages,
        setImages: isPublic ? setImages : setMyImages,
        isPublic,
        setIsPublic,
        setImageUrl,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
