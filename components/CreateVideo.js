import React, { useState } from "react";

const useSelectFile = () => {
  const [selectedFile, setSelectedFile] = useState(null);

  const onSelectedFile = (event) => {
    if (!event.target.files?.length) return; // ✅ Avoid errors if no file is selected

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (readerEvent) => {
      if (readerEvent.target?.result) {
        setSelectedFile(readerEvent.target.result);
      }
    };
  };

  return { selectedFile, setSelectedFile, onSelectedFile };
};

export default useSelectFile;
