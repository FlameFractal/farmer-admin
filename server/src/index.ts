import fs from 'fs';
import * as dotenv from 'dotenv';
dotenv.config();

import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

import FarmerController from './controllers/farmer';
import AuthController from './controllers/auth';
import bodyParser from 'body-parser';

const port = process.env.API_PORT || 5656;
const upload = multer({ dest: 'uploads/' });
const app = express();

// Declare the API routes

app.get('/health', (_, res) => {
  res.status(200).send({ message: 'Health check pass!' });
});

app.use(cors());
app.use(bodyParser.json());

app.post('/auth/login', async (req, res) => {
  try {
    if (!req.body || !req.body.username || !req.body.password) {
      throw new Error('No username or password provided');
    }

    const token = await AuthController.login(
      req.body.username as string,
      req.body.password as string,
    );

    res.status(200).send({ token });
  } catch (error: any) {
    console.error(error);
    res.status(500).send({ message: `Error logging in! ${error.message}` });
  }
});

app.get('/auth/me', authMiddleware, async (_, res) => {
  res.send({ username: 'admin' });
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
app.post('/farmers', authMiddleware, upload.single('farmer-data'), async (req, res) => {
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

function authMiddleware(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    jwt.verify(token, process.env.JWT_SECRET || '');
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: 'Invalid token' });
  }
}
