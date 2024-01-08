import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import "./ImageList.css";

const ImageList = () => {
  const {
    images,
    myImages,
    isPublic,
    setIsPublic,
    loadMoreImages,
    imageLoading,
    imageError,
  } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const elementRef = useRef(null);

  useEffect(() => {
    if (!elementRef.current) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        loadMoreImages();
      }
    });
    observer.observe(elementRef.current);
    return () => observer.disconnect(); // when the mouse wheel goes up, the same observer
    // is makeing the error sinsce they are calling the same images
  }, [loadMoreImages]);

  const imgList = isPublic
    ? images.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === images.length ? elementRef : undefined}
        >
          <img alt="" src={`http://localhost:5000/uploads/${image.key}`} />
        </Link>
      ))
    : myImages.map((image, index) => (
        <Link
          key={image.key}
          to={`/images/${image._id}`}
          ref={index + 5 === myImages.length ? elementRef : undefined}
        >
          <img alt="" src={`http://localhost:5000/uploads/${image.key}`} />
        </Link>
      ));
  return (
    <div>
      <h3 style={{ display: "inline-block", marginRight: 10 }}>
        Image List({isPublic ? "공개" : "개인"}사진)
      </h3>
      {me && (
        <button onClick={() => setIsPublic(!isPublic)}>
          {(isPublic ? "개인" : "공개") + " 사진 보기"}
        </button>
      )}
      <div className="image-list-container">{imgList}</div>
      {imageError && <div>Error...</div>}
      {imageLoading && <div>Loading...</div>}
    </div>
  );
};

export default ImageList;
