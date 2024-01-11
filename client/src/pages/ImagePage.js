import React, { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router";
import { ImageContext } from "../context/ImageContext";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router";

const ImagePage = () => {
  const navigate = useNavigate();
  const { imageId } = useParams();
  const { images, setImages, setMyImages } = useContext(ImageContext);
  const [me] = useContext(AuthContext);
  const [hasLiked, setHasLiked] = useState(false);
  const [image, setImage] = useState();
  const [error, setError] = useState(false);
  const imageRef = useRef();

  useEffect(() => {
    imageRef.current = images.find((image) => image._id === imageId);
  }, [images, imageId]);

  // imageId가 바뀔 때만 호출(맨 처음에만)
  useEffect(() => {
    if (imageRef.current) {
      // 배열에 이미지가 존재할 때
      setImage(imageRef.current);
    } else {
      // 배열에 이미지가 존재하지 않으면 무조건 서버 호출
      axios
        .get(`/images/${imageId}`)
        .then(({ data }) => {
          setError(false);
          setImage(data);
        })
        .catch((error) => {
          setError(true);
          toast.error(error.response.data.message);
        });
    }
  }, [imageId]);

  useEffect(() => {
    if (me && image && image.likes.includes(me.userId)) {
      setHasLiked(true);
    }
  }, [me, image]);
  if (error) return <h3>Error...</h3>;
  else if (!image) return <h3>Loading...</h3>;

  const updateImage = (images, image) =>
    [...images.filter((image) => image._id !== imageId), image].sort(
      (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );

  const onSubmit = async () => {
    const result = await axios.patch(
      `/images/${imageId}/${hasLiked ? "unlike" : "like"}`
    );
    if (result.data.public) {
      setImages((prevData) => updateImage(prevData, result.data)); // 공개 사진일 떄
    }
    setMyImages((prevData) => updateImage(prevData, result.data)); // 비공개 사진일 때
    setHasLiked(!hasLiked);
  };

  const deleteHandler = async () => {
    try {
      if (!window.confirm("정말 삭제하시겠습니까?")) return;
      const result = await axios.delete(`/images/${imageId}`);
      toast.success(result.data.message);
      setImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      setMyImages((prevData) =>
        prevData.filter((image) => image._id !== imageId)
      );
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error({ message: error.message });
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "auto", paddingTop: "20px" }}>
      {/* 추가된 부분: 게시 날짜와 작성자 정보 */}
      <div style={{ marginBottom: "10px", textAlign: "right" }}>
        <p style={{ margin: 0 }}>
          게시 날짜: {new Date(image.createdAt).toLocaleString()}
        </p>
        <p style={{ margin: 0 }}>작성자: ({image.user.username})</p>
      </div>

      <img
        style={{ width: "100%", marginBottom: "10px" }}
        alt={imageId}
        src={`http://localhost:5000/uploads/${image.key}`}
      />
      <div style={{ marginBottom: "10px", textAlign: "left" }}>
        <span style={{ marginRight: "10px" }}>좋아요 {image.likes.length}</span>
        <div style={{ float: "right" }}>
          {me && image.user._id === me.userId && (
            <button style={{ marginRight: "10px" }} onClick={deleteHandler}>
              삭제
            </button>
          )}
        </div>
        <button style={{ marginRight: "10px" }} onClick={onSubmit}>
          {hasLiked ? "좋아요 취소" : "좋아요"}
        </button>
      </div>

      {/* 추가된 부분: 이미지에 글 */}
      {image.texts && (
        <div style={{ border: "1px solid #ddd", padding: "10px" }}>
          <p style={{ margin: 0 }}>{image.texts}</p>
        </div>
      )}
    </div>
  );
};

export default ImagePage;
