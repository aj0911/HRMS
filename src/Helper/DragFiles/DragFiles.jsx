import React, { useRef, useState } from "react";
import toast from "react-hot-toast";

const DragFiles = ({ children, className, acceptedFiles }) => {
  //states
  const inputRef = useRef();
  const [showImgView, setShowImgView] = useState({ val: null, show: false });

  //Methods
  const handleFileUpload = () => {
    const fileObj = inputRef.current.files && inputRef.current.files[0];
    if (!fileObj) {
      setShowImgView({ val: null, show: false });
      return;
    }
    const fileName = fileObj.name;
    const regex = new RegExp("[^.]+$");
    const extension = fileName.match(regex).toString();
    if (acceptedFiles.includes(extension.toLowerCase())) {
      const imgLink = URL.createObjectURL(fileObj);
      setShowImgView({ val: imgLink, show: true });
    } else {
      toast.error(`Only ${acceptedFiles.toString()} files are allowed.`);
      setShowImgView({ val: null, show: false });
    }
  };
  const handleFileDrop = (e) => {
    console.log(e)
    e.preventDefault();
    inputRef.current.files = e.dataTransfer.files;
    handleFileUpload();
  };

  return (
    <div className="DragFiles">
      <input
        onChange={handleFileUpload}
        ref={inputRef}
        type="file"
        name="drag-file-input"
        hidden
      />
      <form
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileDrop(e)}
        onClick={() => inputRef.current.click()}
        className={className}
      >
        {showImgView.show ? (
          <img src={showImgView.val} alt="Uploaded File" />
        ) : (
          children
        )}
      </form>
    </div>
  );
};

export default DragFiles;
