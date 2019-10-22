import app from './app';

const port = process.env.PORT || 3000;
app.listen(port);

// for debug.
console.log(`http://localhost:${port}`);
