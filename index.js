const express = require('express'); 
const app = express();
const port = 5000;
const routerMahasiswa = require('./routers/mahasiswa')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(routerMahasiswa)

const mongoose = require('mongoose');
require('dotenv').config();
mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,  // Fixed here
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Connection Error: "));
db.once("open", function() {
    console.log("Sukses Terkoneksi dengan MongoDB");
});

app.listen(port, () => {
    console.log(`Server berjalan pada localhost:${port}`);
});
