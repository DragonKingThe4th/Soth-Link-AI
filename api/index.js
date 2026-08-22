const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: "Debug API is working" });
});

module.exports = app;
