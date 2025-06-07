const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const {
  getChatMessages,
  sendMessage,
  getUsers,
} = require("../controllers/chatController");

router.get("/users", auth, getUsers);
router.get("/:receiverId", auth, getChatMessages);
router.post("/", auth, sendMessage);

module.exports = router;
