import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import connectDB from './config/database';
import logger from './utils/logger';

// Load environment variables
dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 8080;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('combined'));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '60'),
  message: { ok: false, error: { code: 'TOO_MANY_REQUESTS', message: 'Too many requests' } }
});

app.use('/api/', limiter);

// Routes
app.use('/api/v1', routes);

// Health check
app.get('/health', (req: Request, res: Response) => {
  res.json({ ok: true, status: 'healthy', timestamp: new Date().toISOString() });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({ ok: false, error: { code: 'NOT_FOUND', message: 'Route not found' } });
});

// Error handler
app.use(errorHandler);

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV}`);
    console.log(`🔗 API: http://localhost:${PORT}/api/v1`);
    logger.info(`Server started in ${process.env.NODE_ENV} mode`);
  });
}).catch((error) => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

