import React, { useState } from "react";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("upload the image file");
  return (
    <form>
      <label htmlFor="image">{fileName}</label>
      <input
        id="image"
        type="file"
        onChange={(event) => {
          const imageFile = event.target.files[0];
          setFile(imageFile);
          setFileName(imageFile.name);
        }}
      />
      <button type="submit">제출</button>
    </form>
  );
};

export default UploadForm;
