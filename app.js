const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const app = express();

// Konfigurasi Express
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// Koneksi ke Database SQLite (akan membuat file database.db otomatis)
const db = new sqlite3.Database('./database.db');

// Membuat tabel jika belum ada
db.run("CREATE TABLE IF NOT EXISTS tugas (id INTEGER PRIMARY KEY AUTOINCREMENT, isi TEXT)");

// Rute Utama: Menampilkan semua data
app.get('/', (req, res) => {
    db.all("SELECT * FROM tugas", [], (err, rows) => {
        res.render('index', { daftarTugas: rows });
    });
});

// Rute Tambah Data: Menyimpan ke database
app.post('/tambah', (req, res) => {
    const isiTugas = req.body.item;
    db.run("INSERT INTO tugas (isi) VALUES (?)", [isiTugas], () => {
        res.redirect('/');
    });
});
// Rute Hapus Data: Menghapus berdasarkan ID
app.post('/hapus/:id', (req, res) => {
    const id = req.params.id;
    db.run("DELETE FROM tugas WHERE id = ?", [id], (err) => {
        if (err) {
            console.error(err.message);
        }
        res.redirect('/');
    });
});

// Jalankan Server
app.listen(3000, () => {
    console.log('Server berjalan di http://localhost:3000');
});