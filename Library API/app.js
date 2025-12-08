import express from 'express';
import BookRouter from './routes/bookRoutes.js';
// Load .env file
process.loadEnvFile();

const app = express();

app.use(express.json());

app.use('/api/books', BookRouter);

export default app;
