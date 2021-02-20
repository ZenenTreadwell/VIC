const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  songlinkJSON: String,
  user: Number,
  tags: [String],
  commentary: String,
  URIs: String,
  entryID: { type: String, unique: true }
}, { timestamps: true });

const Song = mongoose.model('Song', songSchema);

// gets all posts
router.get('/songs/', async (req, res, next) => {
  const songs = await Song.find();

  const data = songs.map(song => ({
    songlink: JSON.parse(song.songlinkJSON),
    tags: song.tags,
    user: song.user,
    commentary: song.commentary,
    URIs: JSON.parse(song.URIs),
    entryID: song.entryID,
    created_at: song.createdAt,
  }));

  res.send(data);
});

router.post('/songs/', (req, res, next) => {
  const song = new Song({
    songlinkJSON: JSON.stringify(req.body.postData),
    user: req.body.user,
    tags: req.body.tags,
    commentary: req.body.songCommentary,
    URIs: JSON.stringify(req.body.URIs),
    entryID: req.body.uniqueID,
  });

  song.save((err, doc) => {
    if (err) {
      res.status(400).send(`Something went wrong: ${err}`);
    }

    res.status(200).send(doc);
  });
});

module.exports = router;
