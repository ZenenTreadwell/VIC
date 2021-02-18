const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
  res.send("res indicates what the response of the query will be");
});

module.exports = router;
