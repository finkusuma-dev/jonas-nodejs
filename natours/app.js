const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.json({ success: true });
});

app.post('/', (req, res) => {
  res.json({ success: true, message: 'You can post' });
});

const port = 3000;
app.listen(port, () => {
  console.log(`server listening port ${port}`);
});
