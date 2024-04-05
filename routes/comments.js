const express = require("express");
const comments = express.Router();
const CommentModel = require("../models/comments");

// GET: Ottieni tutti i commenti per un libro specifico
comments.get("/comments/:bookId", async (req, res) => {
  const { bookId } = req.params;
  try {
    const comments = await CommentModel.find({ bookId });
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// POST: Aggiungi un nuovo commento
comments.post("/comments/create", async (req, res) => {
  try {
    const newComment = new CommentModel(req.body);
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

// DELETE: Elimina un commento specifico
comments.delete("/comments/:commentId", async (req, res) => {
  const { commentId } = req.params;
  try {
    const deletedComment = await CommentModel.findByIdAndDelete(commentId);
    if (!deletedComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = comments;
