const express = require('express')
const app = express()
const port = 3000

// /api/v1/convert
app.get('/api/v1/convert', (req, res) => {
  res.send({
    conversion: {
      from: '',
      to: '',
      amount: ''
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});
