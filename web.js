const express = require('express');

const app = express();
const port = process.argv[2] || 80;

app.post('/github/build', (req, res) => {
  const urlToCheckout = req.commits[0].url;
  res.send(urlToCheckout);
});

app.listen(port, () => {
  console.log(`GraphCI is ALIVE (on port ${port}). No disassemble.`);
});
