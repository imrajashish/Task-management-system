const express = require("express");
const router = express.Router();
const { auth, adminAuth } = require("../middleware/auth");
const {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", auth, getAllTasks);
router.post("/", adminAuth, createTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", adminAuth, deleteTask);

module.exports = router;
