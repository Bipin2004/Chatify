const express = require('express');
const { getMessages, sendMessage } = require('../controllers/chatController');
const auth = require('../middleware/authmiddleware');
const { messageValidator } = require('../validators/chatValidators');

const router = express.Router();
router.route('/:chatId/messages')
  .get(auth, getMessages)
  .post(auth, messageValidator, sendMessage);

module.exports = router;
