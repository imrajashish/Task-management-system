const Chat = require("../models/Chat");
const User = require("../models/User");

const getChatMessages = async (req, res) => {
  try {
    const { receiverId } = req.params;

    const messages = await Chat.find({
      $or: [
        { sender: req.user._id, receiver: receiverId },
        { sender: receiverId, receiver: req.user._id },
      ],
    })
      .sort("createdAt")
      .populate("sender receiver", "email role");

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { receiverId, message } = req.body;

    const chat = new Chat({
      sender: req.user._id,
      receiver: receiverId,
      message,
    });

    await chat.save();

    res.status(201).json(chat);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    let users;
    if (req.user.role === "admin") {
      users = await User.find({ _id: { $ne: req.user._id } }, "email role");
    } else {
      users = await User.find({ role: "admin" }, "email role");
    }
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getChatMessages, sendMessage, getUsers };
