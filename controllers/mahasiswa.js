// const connection =  require("../db/db")

// module.exports = {
//     getMhs:(req, res) => {
//         connection.query("SELECT * FROM mahasiswa", (err, data) => {
//             if (err) {
//                 console.log("error: ", err);
//                 res.status(500).send({
//                     message: err.message || "Terjadi kesalahan saat mengambil data mahasiswa"
//                 });
//             } else {
//                 res.send(data);
//             }
//         });
//     },

//     getBynim:(req, res) => {
//         const nim = req.params.nim;
//         connection.query(`SELECT * FROM mahasiswa WHERE nim = '${nim}'`, (err, data) => {
//             if (err) {
//                 console.log("error: ", err);
//                 res.status(500).send({
//                     message: err.message || "Terjadi kesalahan saat mengambil data mahasiswa"
//                 });
//             } else {
//                 res.send(data);
//             }
//         });
//     },

//     postMhs:(req, res) => {
//         const mahasiswaBaru = req.body;
//         connection.query("INSERT INTO mahasiswa SET ?", mahasiswaBaru, (err) => {
//             if (err) {
//                 console.log("error: ", err);
//                 res.status(500).send({
//                     message: err.message || "Terjadi kesalahan saat menyimpan data mahasiswa"
//                 });
//             } else {
//                 res.send(mahasiswaBaru);
//             }
//         });
//     },

//     updateMhs:(req, res) => {
//         const nim = req.params.nim;
//         const mhs = req.body;
//         const qstring = `UPDATE mahasiswa
//                         SET nama = '${mhs.nama}', angkatan = '${mhs.angkatan}', prodi = '${mhs.prodi}'
//                         WHERE nim = '${nim}'`;
//         connection.query(qstring, (err, data) => {
//             if (err) {
//                 res.status(500).send({
//                     message: "Error update mahasiswa with NIM" + nim
//                 });
//             } else if (data.affectedRows === 0) {
//                 res.status(404).send({
//                     message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.`
//                 });
//             } else {
//                 console.log("Update mahasiswa: ", { nim: nim, ...mhs });
//                 res.send({ nim: nim, ...mhs });
//             }
//         });
//     },

//     deleteMhs:(req, res) => {
//         const nim = req.params.nim;
//         const qstring = `DELETE FROM mahasiswa WHERE nim = '${nim}'`;
//         connection.query(qstring, (err, data) => {
//             if (err) {
//                 res.status(500).send({
//                     message: "Error deleting mahasiswa with NIM: " + nim
//                 });
//             } else if (data.affectedRows === 0) {
//                 res.status(404).send({
//                     message: `Mahasiswa dengan NIM ${nim} tidak ditemukan.`
//                 });
//             } else {
//                 res.send(`Mahasiswa dengan NIM ${nim} telah terhapus`);
//             }
//         });
//     },
// }

const Mahasiswa = require('../models/mhsEmbedded')

module.exports = {
    insert: async(req, res) => {
        const data = new Mahasiswa({
            nim: req.body.nim,
            nama: req.body.nama,
            angkatan: req.body.angkatan,
            prodi: req.body.prodi
        })

        try{
            const dataToSave = await data.save();
            res.status(200).json(dataToSave)
        } catch (error) {
            res.status(400).json({message: error.message})
        }
    },

    insertNilai : async (req,res) => {
        const nim = req.params.nim;

        try {
            await Mahasiswa.updateOne(
                {"nim": nim },
                {
                    $push: {
                        "nilai": {
                            "kdMk": req.body.kdMk,
                            "matakuliah": req.body.matakuliah,
                            "dosen": req.body.dosen,
                            "semester": req.body.semester,
                            "nilai": req.body.nilai,
                        }
                    }
                })
            res.send('nilai telah disimpan')
        } catch (error) {
            res.status(400).json({ message: error.message})
        }
    },

    getNilaiByNim: async (req, res ) => {
        const nim = req.params.nim;
        try {
            const result = await Mahasiswa.findOne({"nim": nim}, {"_id":0, "nilai":1})
            res.json(result)
        } catch (error) {
            res.status(400).json({ message: error.message})
        }
    },

    getMahasiswa: async (req,res) => {
        try {
            const data = await Mahasiswa.find();
            res.json(data)
        } catch (error) {
            res.status(500).json({message: error.message})
        }
    },


    getMahasiswaByNim: async(req, res) => {
        const nim = req.params.nim
        try {
            const data = await Mahasiswa.find().where('nim').equals(nim);
            res.json(data)
        } catch (error) {
            res.status(500).json({ message:error.message})
        }
    },

    update: async(req, res) => {
        const filter = {nim: req.params.nim}
        const updatedData= {
            nim: req.params.nim,
            nama: req.body.nama,
            angkatan: req.body.angkatan,
            prodi: req.body.prodi
        }

        try{
            await Mahasiswa.updateOne(filter, updatedData)
            res.status(200).json(updatedData)
        } catch (error) {
            res.status(409).json({message: error.message})
        }
    },

    delete: async(req, res) => {
        const filter = {nim: req.params.nim}
        try {
            await Mahasiswa.deleteOne(filter)
            res.send("data telah terhapus")
        } catch (error) {
            res.status(409).json({message: error.message})
        }
    }
}