import React, { useEffect, useState } from "react";
import axios from "axios";

const ImageList = ({ images }) => {
  // getting the image as props from the parent
  const imgList = images.map((image) => (
    <img
      key={image.key}
      style={{ width: "100%" }}
      src={`http://localhost:5000/uploads/${image.key}`}
    />
  ));
  return (
    <div>
      <h3>Image List</h3>
      {imgList}
    </div>
  );
};

export default ImageList;
