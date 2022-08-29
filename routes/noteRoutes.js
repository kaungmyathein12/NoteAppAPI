const express = require("express");
const auth = require("../middleware/auth");
const { validateNote, Note } = require("./../model/Note");
const router = express.Router();
// Get Notes by userId
router.get("/", auth, async (req, res) => {
  try {
    const id = req.user;
    const notes = await Note.find({ userId: id }).sort({ createdAt: -1 });
    res.status(200).json({ status: "success", notes });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error:
        "Something went wrong. Please refresh the page again or login again",
    });
  }
});
router.get("/search/", auth, async (req, res) => {
  try {
    const id = req.user;
    const name = req.query.name;
    const notes = await Note.find({
      title: { $regex: name, $options: "$i" },
      userId: id,
    });
    res.status(200).json({ status: "success", notes });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: "The note with the given name was not found!",
    });
  }
});
router.get("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    const note = await Note.findById(id);
    res.status(200).json({ status: "success", note });
  } catch (error) {
    res.status(404).json({
      status: "fail",
      error: "The note with the given ID was not found!",
    });
  }
});

// Create Note
router.post("/create", auth, async (req, res) => {
  try {
    const userId = req.user;
    req.body = { ...req.body, userId };
    const { error } = validateNote(req.body);
    if (error) {
      return res
        .status(400)
        .json({ status: "fail", error: error.details[0].message });
    }
    await Note.create(req.body);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: "Cannot post your data because of some reason. Please try again!",
    });
  }
});
router.patch("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndUpdate(id, req.body);
    res.json({ status: "success" });
  } catch (error) {
    console.log(error);
  }
});
router.delete("/:id", auth, async (req, res) => {
  try {
    const { id } = req.params;
    await Note.findByIdAndRemove(id);
    res.status(200).json({ status: "success" });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      error: "Something went wrong! Please try again.",
    });
  }
});

module.exports = router;
