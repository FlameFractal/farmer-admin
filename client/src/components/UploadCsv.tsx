import React, { useState } from 'react';
import {
  Button, CircularProgress, Grid, Typography,
} from '@mui/material';
import axios from '../axiosConfig';

export default function UploadCsv() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);

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
    setIsUploading(true);

    try {
      await axios.post('/farmers', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setMessage(`File ${file.name} uploaded successfully!`);
    } catch (err: any) {
      setMessage(`${err?.response?.data?.message}. Please check the format of the CSV file.`);
    } finally {
      setIsUploading(false);
      setFile(null);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body1" component="p" gutterBottom>
          Please upload a CSV file in the following format:
          <a
            style={{ marginLeft: '5px' }}
            href="https://docs.google.com/spreadsheets/d/1qBGhSATMGB6DtAsHNcw9zWW5PcPDzRbBH-eBSvYR4o0/edit#gid=0"
            target="_blank"
            rel="noreferrer"
          >
            sample.csv
          </a>
        </Typography>

        <p>
          <strong>CSV Format:</strong>
          <ul>
            <li>
              have following columns in this order:
              phone_number, farmer_name, state_name, district_name, village_name

            </li>
            <li>have a header row.</li>
            <li>have data in all the columns.</li>
            <li>have all the data in English.</li>
            <li>have unique phone_number for each farmer.</li>
            <li>have row count maximum in the order of 1000s.</li>
          </ul>
        </p>
      </Grid>

      <Grid item xs={12}>
        {isUploading ? (
          <Typography variant="body1" component="div" color="text.secondary" sx={{ mt: 2 }}>
            Uploading...
            <CircularProgress />
          </Typography>
        ) : (

          <>
            <label htmlFor="csv-file-input" style={{ display: 'inline-block' }}>
              <Button component="span" variant="contained" sx={{ mt: 1 }}>
                {file ? file.name : 'Select File'}
              </Button>
              <input
                id="csv-file-input"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
            </label>

            <Button variant="contained" disabled={!file} onClick={handleFileUpload} sx={{ mt: 1, ml: 1 }}>
              Upload
            </Button>
          </>
        )}
      </Grid>

      <Grid item xs={12}>
        {message && <Typography variant="body1" component="div" color="text.secondary" sx={{ mt: 2 }}>{message}</Typography>}
      </Grid>
    </Grid>
  );
}
