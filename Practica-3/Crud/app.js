const express = require("express");
const mysql = require("mysql2");
const bodyParser = require("body-parser"); // Añadido para manejar los datos de PUT

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "crud_mvc"
});

db.connect(err => {
    if (err) console.error("Error al conectar con MySQL:", err);
    else console.log("Conectado a MySQL");
});

// Ruta para obtener todos los elementos
app.get("/items", (req, res) => {
    db.query("SELECT * FROM items", (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Ruta para crear un nuevo elemento
app.post("/create", (req, res) => {
    const { nombre, descripcion } = req.body;
    db.query("INSERT INTO items (nombre, descripcion) VALUES (?, ?)", [nombre, descripcion], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Elemento agregado" });
    });
});

// Ruta para actualizar un elemento
app.put("/update/:id", (req, res) => {
    const { nombre, descripcion } = req.body;
    const { id } = req.params;
    db.query("UPDATE items SET nombre = ?, descripcion = ? WHERE id = ?", [nombre, descripcion, id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Elemento actualizado" });
    });
});

// Ruta para eliminar un elemento
app.delete("/delete/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM items WHERE id = ?", [id], err => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(200).json({ message: "Elemento eliminado" });
    });
});

// Inicia el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
