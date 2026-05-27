import dotenv from 'dotenv';
import { createServer } from 'http';
import app from './app.js';
import logger from '#config/logger.js';
import { testConnection } from '#config/database.js';
// import { initializeSocket } from './socket/index.js';
// import chatJobs from './jobs/chatJobs.js';
// import userNotificationService from '#services/userNotificationService.js';
import { SUCCESS_MESSAGES, ERROR_MESSAGES } from '#utils/constants/messages.js';

dotenv.config();

const NODE_ENV = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT 
  ? parseInt(process.env.PORT, 10) 
  : NODE_ENV === 'production' ? 5005 : 5000;

const SERVER_START_TIME = Date.now();

const getUptime = () => {
  const uptimeMs = Date.now() - SERVER_START_TIME;
  const uptimeSeconds = Math.floor(uptimeMs / 1000);
  
  const days = Math.floor(uptimeSeconds / 86400);
  const hours = Math.floor((uptimeSeconds % 86400) / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;
  
  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds: uptimeSeconds,
    formatted: `${days}d ${hours}h ${minutes}m ${seconds}s`,
    startTime: new Date(SERVER_START_TIME).toISOString()
  };
};

const startServer = async () => {
  try {
    logger.info('Testing database connection...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      logger.error(ERROR_MESSAGES.DB_CONNECTION_FAILED);
      process.exit(1);
    }
    
    logger.info(SUCCESS_MESSAGES.DB_CONNECTED);
    
    const server = createServer(app);
    
    // Socket.IO and Chat disabled for Phase 1
    // const { io, chatHandler, unreadCountHandler } = initializeSocket(server);
    // app.set('io', io);
    // app.set('chatHandler', chatHandler);
    // app.set('unreadCountHandler', unreadCountHandler);
    app.set('getUptime', getUptime);

    // userNotificationService.setSocketIO(io);
    // chatJobs.initialize(app);
    
    server.listen(PORT, () => {
      const isProduction = NODE_ENV === 'production';
      const protocol = isProduction ? 'https' : 'http';
      const domain = process.env.BACKEND_URL || `localhost:${PORT}`;
      const httpUrl = isProduction ? `${protocol}://${domain}` : `${protocol}://localhost:${PORT}`;
      
      logger.info(SUCCESS_MESSAGES.SERVER_STARTED);
      logger.info(`Server running on ${httpUrl}`);
      logger.info(`Environment: ${NODE_ENV}`);
      logger.info(`Server started at: ${new Date(SERVER_START_TIME).toISOString()}`);
      
      console.log(`\n✅ WedConnect Server Started (Phase 1)`);
      console.log(`🌐 HTTP Server: ${httpUrl}`);
      console.log(`🌍 Environment: ${NODE_ENV}`);
      console.log(`⏰ Started at: ${new Date(SERVER_START_TIME).toLocaleString()}\n`);
    });
    
    process.on('SIGTERM', () => {
      logger.info('SIGTERM signal received: closing HTTP server');
      // chatJobs.stopAll();
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
    process.on('SIGINT', () => {
      logger.info('SIGINT signal received: closing HTTP server');
      // chatJobs.stopAll();
      server.close(() => {
        logger.info('HTTP server closed');
        process.exit(0);
      });
    });
    
  } catch (error) {
    logger.error('Failed to start server:', {
      error: error.message,
      stack: error.stack
    });
    process.exit(1);
  }
};

startServer();
