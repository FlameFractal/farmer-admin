/* eslint-disable no-console */
/* eslint-disable import/first */
import fs from 'fs';
import cors from 'cors';
import multer from 'multer';
import jwt from 'jsonwebtoken';
import * as dotenv from 'dotenv';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import express, { NextFunction, Request, Response } from 'express';

dotenv.config();

import FarmerController from './controllers/farmer';
import AuthController from './controllers/auth';

const port = process.env.PORT || 5656;
const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Declare the API routes

app.get('/health', (_, res) => {
  res.status(200).send({ message: 'Health check pass!' });
});

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
    res.status(500).send({ message: `Error logging in! ${error.message}` });
  }
});

app.post('/auth/register', async (req, res) => {
  try {
    if (!req.body || !req.body.username || !req.body.password) {
      throw new Error('No username or password provided');
    }

    const user = await AuthController.createUser({
      username: req.body.username as string,
      password: req.body.password as string,
    });

    res.status(200).send(user);
  } catch (error: any) {
    res.status(500).send({ message: `Error registering user! ${error.message}` });
  }
});

// Authentication middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || '';
    jwt.verify(token, process.env.JWT_SECRET || '');
    next();
  } catch (error: any) {
    res.status(401).json({ message: `Invalid token. ${error.message}` });
  }
});

app.get('/auth/me', async (_, res) => {
  res.send({ username: 'admin' });
});

app.get('/farmers/count', async (req, res) => {
  try {
    const count = await FarmerController.getFarmersCount();
    res.status(200).send({ count });
  } catch (error: any) {
    res.status(500).send({ message: `Error getting farmers count! ${error.message}` });
  }
});

app.get('/farmers', async (req, res) => {
  try {
    const farmers = await FarmerController.getFarmers(
      parseInt(req.query.offset as string, 10),
      parseInt(req.query.limit as string, 10),
    );
    res.status(200).send(farmers);
  } catch (error: any) {
    res.status(500).send({ message: `Error getting farmers! ${error.message}` });
  }
});

// TODO: Took 20 seconds to upload 500 farmers
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
  } catch (error: any) {
    console.error(`Error connecting to the database! ${error.message}`);
  }
})();
