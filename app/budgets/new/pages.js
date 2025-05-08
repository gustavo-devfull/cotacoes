// app/budgets/new/page.js
'use client';

import { useState } from 'react';
import { extractDataFromExcel, extractImagesFromExcel } from '@/lib/excelUtils';
import { firestore } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import AWS from 'aws-sdk';
import awsConfig from '../config/aws.config';

AWS.config.update({
  accessKeyId: awsConfig.accessKeyId,
  secretAccessKey: awsConfig.secretAccessKey,
  region: awsConfig.region,
  endpoint: awsConfig.endpoint,
  s3ForcePathStyle: awsConfig.s3ForcePathStyle,
});

const s3 = new AWS.S3();

export default function NewBudget() {
  const [file, setFile] = useState(null);
  const [extractedData, setExtractedData] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setExtractedData([]);
  };

  const handleExtractData = async () => {
    if (file) {
      try {
        const data = await extractDataFromExcel(file);
        setExtractedData(data);
        alert('Dados da planilha extraídos com sucesso!');
      } catch (error) {
        console.error('Erro ao extrair dados:', error);
        alert('Erro ao extrair dados da planilha.');
      }
    } else {
      alert('Por favor, selecione um arquivo.');
    }
  };

  const handleUpload = async () => {
    if (!file || extractedData.length === 0) {
      alert('Por favor, selecione um arquivo e extraia os dados primeiro.');
      return;
    }

    setUploading(true);
    setUploadProgress(0);
    setUploadError(null);

    try {
      const images = await extractImagesFromExcel(file);
      const imageUrls = {};

      for (const image of images) {
        const imageNameParts = image.name.split('.');
        const baseName = imageNameParts.slice(0, -1).join('.');
        const fileExtension = imageNameParts.pop().toLowerCase();
        const s3Key = `images/${Date.now()}-${baseName}.${fileExtension}`;

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: s3Key,
          Body: await image.data,
        };

        await s3.upload(params).promise();
        imageUrls[baseName] = `${process.env.AWS_ENDPOINT}/${process.env.AWS_S3_BUCKET_NAME}/${s3Key}`;
      }

      const docRef = await addDoc(collection(firestore, 'budgets'), {
        data: extractedData,
        imageUrls: imageUrls,
        createdAt: new Date(),
      });

      setUploading(false);
      alert(`Orçamento salvo com ID: ${docRef.id}`);
      setFile(null);
      setExtractedData([]);
    } catch (error) {
      console.error('Erro ao processar e fazer upload:', error);
      setUploadError('Erro ao processar e fazer upload dos dados e imagens.');
      setUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Novo Orçamento</h1>
      <div className="mb-4">
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
      </div>
      {file && (
        <button
          onClick={handleExtractData}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mb-4"
        >
          Extrair Dados da Planilha
        </button>
      )}
      {extractedData.length > 0 && (
        <div className="mb-4">
          <h2 className="text-xl font-semibold mb-2">Dados Extraídos:</h2>
          <pre>{JSON.stringify(extractedData, null, 2)}</pre>
          <button
            onClick={handleUpload}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={uploading}
          >
            {uploading ? 'Enviando...' : 'Salvar Orçamento e Upload de Imagens'}
          </button>
          {uploadError && <p className="text-red-500 mt-2">{uploadError}</p>}
        </div>
      )}
    </div>
  );
}