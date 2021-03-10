import { useState } from 'react';

import { useDropzone } from 'react-dropzone';

const ImageDrop = () => {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, { preview: URL.createObjectURL(file) })
        )
      );
    },
  });

  const image = files.map((file) => (
    <div key={file.name}>
      <div>
        <img src={file.preview} style={{ width: '200px' }} alt='preview' />
      </div>
    </div>
  ));

  return (
    <div>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <p>Drop image here</p>
      </div>
      <div>{image}</div>
    </div>
  );
};

export default ImageDrop;
