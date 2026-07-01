const express = require('express');

const app = express();
const port = process.env.PORT || 4000;

app.get('/health', (req, res) => {
  res.json({ ok: true });
});

app.listen(port);
