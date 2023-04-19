import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import multer from 'multer';
import express from 'express';
import mongoose from 'mongoose';

import FarmerController from './controllers/farmer';

const port = process.env.PORT || 5656;
const upload = multer({ dest: 'uploads/' });
const app = express();

// Declare the API routes

app.use(cors());

app.get('/health', (_, res) => {
  res.status(200).send({ message: 'Health check pass!' });
});

app.get('/farmers/:phone_number', async (req, res) => {
  try {
    if (!req.params.phone_number) {
      throw new Error('No phone number provided');
    }

    const farmer = await FarmerController.getFarmer(req.params.phone_number);
    res.status(200).send(farmer);
  } catch (error: any) {
    res.status(500).send({ message: `Error getting farmer! ${error.message}` });
  }
});

app.get('/farmers', async (req, res) => {
  try {
    const farmers = await FarmerController.getFarmersByLanguage(
      req.query.language as string,
      parseInt(req.query.offset as string, 10),
      parseInt(req.query.limit as string, 10),
    );
    res.status(200).send(farmers);
  } catch (error: any) {
    res.status(500).send({ message: `Error getting farmers! ${error.message}` });
  }
});

// TODO: Took 20 seconds to upload 500 farmers, and was non-blocking to other API requests
app.post('/farmers', upload.single('farmer-data'), async (req, res) => {
  try {
    if (!req.file) {
      throw new Error('No file uploaded');
    }

    await FarmerController.upsertFarmersCSV(req.file);
    res.status(200).send({ message: 'File uploaded successfully!' });
  } catch (error: any) {
    res.status(500).send({ message: `Error uploading file! ${error.message}` });
  }

  if (req.file) fs.unlink(req.file.path, () => {});
});

// Connect to the database and start the server

(async () => {
  try {
    mongoose.set('maxTimeMS', 10000);
    await mongoose.connect(process.env.MONGODB_CONNECTION_URI || 'mongodb://localhost');
    console.log('Connected to the database!');

    app.listen(port, () => {
      console.log(`Server listening on port ${port}`);
    });
  } catch (error) {
    console.error('Error connecting to the database!');
    console.error(error);
  }
})();
