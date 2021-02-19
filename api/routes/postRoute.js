const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const songSchema = new mongoose.Schema({
  songlinkJSON: String,
  entryID: { type: String, unique: true }
});

const Song = mongoose.model('Song', songSchema);

// gets all posts
router.get('/songs/', async (req, res, next) => {
  const songs = await Song.find();
  res.send(songs.map(song => JSON.parse(song.songlinkJSON)));
});

router.post('/songs/', (req, res, next) => {
  const song = new Song({
    songlinkJSON: JSON.stringify(req.body),
    entryID: req.body.entityUniqueId,
  });

  song.save((err, doc) => {
    if (err) {
      res.status(400).send(`Something went wrong: ${err}`);
    }

    res.status(200).send(doc);
  });
});

module.exports = router;
