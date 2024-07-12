const mongoose = require('mongoose')
const mhsEmbedded = new mongoose.Schema({
    nim: {
        require: true,
        type: String
    },
    nama: {
        require: true,
        type: String
    },
    angkatan: {
        require: true,
        type: String
    },
    prodi: {
        require: true,
        type: String
    },
    nilai: [{
        kdMk: String,
        matakuliah: String,
        dosen: String,
        semester: Number,
        nilai: String
    }]
})

module.exports = mongoose.model('Mahasiswa', mhsEmbedded,'mahasiswa')