const express = require('express');

const app = express();
const port = 3001;

// /api/v1/convert
app.get('/health', (req, res) => {
    res.send('App running Ok!');
});

app.post('/api/v1/convert', (req, res) => {
    res.send({
        conversion: {
            from: '',
            to: '',
            amount: '',
        },
    });
});

if (!module.parent) {
    app.listen(port, () => console.log(`app listening on port ${port}!`));
} else {
    app.listen(process.env.PORT, () => console.log(`app listening on port ${port}!`));
}

module.exports = app;
