import React, { useState } from 'react';
import axios from '../axiosConfig';

export default function UploadCsv() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files ? e.target.files[0] : null;
    setFile(selectedFile);
    setMessage('');
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('farmer-data', file);

    try {
      await axios.post('/farmers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage('File uploaded successfully!');
    } catch (err) {
      setMessage('An error occurred.');
    }
  };

  return (
    <div>
      <h2>Upload CSV</h2>
      <p>
        Please upload a CSV file with the following columns:
        <b>phone_number, farmer_name, state_name, district_name, village_name</b>
      </p>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      {file && <button type="button" onClick={handleFileUpload}>Upload</button>}
      {message && <div>{message}</div>}
    </div>
  );
}
