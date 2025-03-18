const mysql = require('mysql2');

// Datos de conexión
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'testdb'
};

// Crear tabla y datos de ejemplo
const createTable = `CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  price FLOAT
)`;
const insertData = `INSERT INTO products (name, price) VALUES ('Producto 1', 10.5), ('Producto 2', 20.0)`;
const selectData = `SELECT * FROM products`;

// 1. Conexión básica
function basicConnection() {
  const startTime = Date.now();
  const connection = mysql.createConnection(config);
  connection.connect((err) => {
    if (err) throw err;
    console.log('Basic Connection: Connected to MySQL Database!');

    connection.query(createTable, (err) => {
      if (err) throw err;
      connection.query(insertData, (err) => {
        if (err) throw err;
        connection.query(selectData, (err, results) => {
          if (err) throw err;
          const endTime = Date.now();
          console.log('Basic Connection Results:', results);
          console.log(`Basic Connection Time: ${endTime - startTime} ms`);
          connection.end();
        });
      });
    });
  });
}

// 2. Conexión con Promesas
async function promiseConnection() {
  const startTime = Date.now();
  const connection = mysql.createConnection(config).promise();
  try {
    await connection.connect();
    console.log('Promise Connection: Connected to MySQL Database!');

    await connection.query(createTable);
    await connection.query(insertData);
    const [results] = await connection.query(selectData);
    const endTime = Date.now();
    console.log('Promise Connection Results:', results);
    console.log(`Promise Connection Time: ${endTime - startTime} ms`);
    connection.end();
  } catch (err) {
    console.error(err);
  }
}

// 3. Conexión con Pooling
async function poolConnection() {
  const startTime = Date.now();
  const pool = mysql.createPool(config).promise();
  try {
    console.log('Pool Connection: Connected to MySQL Database!');
    await pool.query(createTable);
    await pool.query(insertData);
    const [results] = await pool.query(selectData);
    const endTime = Date.now();
    console.log('Pool Connection Results:', results);
    console.log(`Pool Connection Time: ${endTime - startTime} ms`);
  } catch (err) {
    console.error(err);
  } finally {
    pool.end();
  }
}

// Ejecutar pruebas
basicConnection();
promiseConnection();
poolConnection();
