import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
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

  useEffect(() => {
    setImageLoading(true);
    axios
      .get(imageUrl) // localhost:5000 is not necessary at here thanks to the proxy
      .then((result) => {
        //either way works
        //setImages((prevData) => [...prevData, ...result.data]);
        //setImages([...images, ...result.data]);
        // but the second one needs to add images to the dependency [imageUrl, images]
        setImages((prevData) => [...prevData, ...result.data]);
      })
      .catch((err) => {
        console.error(err);
        setImageError(err);
      })
      .finally(() => setImageLoading(false));
  }, [imageUrl]);
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

  const lastImageId = images.length > 0 ? images[images.length - 1]._id : null;

  const loadMoreImages = useCallback(() => {
    if (imageLoading || !lastImageId) return;
    setImageUrl(`/images?lastid=${lastImageId}`);
  }, [images, imageLoading]);

  return (
    <ImageContext.Provider
      value={{
        images,
        setImages,
        myImages,
        setMyImages,
        isPublic,
        setIsPublic,
        loadMoreImages,
        imageLoading,
        imageError,
      }}
    >
      {prop.children}
    </ImageContext.Provider>
  );
};
