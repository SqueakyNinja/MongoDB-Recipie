import { useDropzone } from "react-dropzone";

import styles from "./ImageDrop.module.scss";

const ImageDrop = ({ parentCallback }) => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ["image/png", "image/jpeg", "image/jpg"],
    multiple: false,
    onDrop: (acceptedFiles) => {
      return parentCallback(acceptedFiles);
    },
  });

  return (
    <div className={styles.centered}>
      <div className={styles.dropContainer} {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Click or drag and drop image here</p>
      </div>
    </div>
  );
};

export default ImageDrop;
