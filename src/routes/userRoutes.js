const express = require("express");
const router = express.Router();
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  patchUser
} = require("../controllers/userController");


router.post("/", createUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", updateUser);   // Full update
router.patch("/:id", patchUser);  // Partial update

module.exports = router;
