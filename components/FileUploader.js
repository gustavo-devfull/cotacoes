// components/FileUploader.js
'use client';

import { useState } from 'react';

export default function FileUploader({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    if (onFileSelect) {
      onFileSelect(file);
    }
  };

  return (
    <div>
      <label htmlFor="file-upload" className="block text-gray-700 text-sm font-bold mb-2">
        Selecione a planilha Excel:
      </label>
      <input
        id="file-upload"
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {selectedFile && <p className="mt-2 text-sm text-gray-500">Arquivo selecionado: {selectedFile.name}</p>}
    </div>
  );
}