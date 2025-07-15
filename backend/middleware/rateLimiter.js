const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 1 * 60 * 1000,  // 1 minute
  max: 100,                 // limit each IP
  message: { message: 'Too many requests, please try again later.' }
});
// This middleware limits the number of requests a user can make to the API within a specified time window.