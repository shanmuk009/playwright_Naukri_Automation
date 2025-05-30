// utils/logger.js

const { createLogger, format, transports } = require('winston');

// Configure the logger
const logger = createLogger({
    level: 'info', // Set log level (e.g., 'info', 'debug', 'error')
    format: format.combine(
        format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        format.printf(({ level, message, timestamp }) => {
            return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
        })
    ),
    transports: [
        new transports.Console(), // Log to console
        new transports.File({ filename: 'logs/app.log' }) // Log to a file
    ]
});

// Export the logger
module.exports = logger;
