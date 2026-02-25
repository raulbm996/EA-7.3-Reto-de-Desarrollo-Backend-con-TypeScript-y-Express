import express from 'express';
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { Dinosaur } from './models/Dinosaur.js'; // Requerir extensión .js para ES modules

// Configuración de las variables de entorno (.env)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

const app = express();
const port = process.env.PORT || 3000;

// Configuración del Pool de MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'dinosaurios_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Middleware para procesar JSON en las peticiones
app.use(express.json());

// Fase 3: Ruta GET /
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>API de Dinosaurios Extintos (MySQL)</title>
        <style>
          body { font-family: 'Arial', sans-serif; background-color: #2c3e50; color: #ecf0f1; text-align: center; padding: 50px; }
          h1 { color: #f1c40f; }
          p { font-size: 1.2em; }
          a { color: #3498db; text-decoration: none; font-weight: bold; }
          a:hover { text-decoration: underline; }
          .badge { display: inline-block; padding: 0.25em 0.4em; font-size: 75%; font-weight: 700; line-height: 1; text-align: center; white-space: nowrap; vertical-align: baseline; border-radius: 0.25rem; background-color: #3498db; }
        </style>
      </head>
      <body>
        <h1>¡Bienvenido a la API de Dinosaurios Extintos! </h1>
        <p>Este es un catálogo de criaturas prehistóricas increíbles que caminaron sobre la Tierra hace millones de años.</p>
        <p>Para ver los datos, visita: <a href="/api/datos">/api/datos</a></p>
      </body>
    </html>
  `);
});

// Fase 4: Ruta GET /api/datos
app.get('/api/datos', async (req, res) => {
  try {
    // Consultar datos y asignar el tipado estricto al array de respuesta
    // El método query devuelve un tupla [rows, fields]. Usamos destructuración.
    const [rows] = await pool.query<mysql.RowDataPacket[]>('SELECT * FROM dinosaurios');

    // Asignamos la información estricta asegurando a TypeScript que cada objeto cumple la interface
    const typedDinosaurs = rows as unknown as Dinosaur[];

    // En mysql2, devolver el campo booleano suele venir como 0 o 1 (TINYINT). Vamos a mapearlo a booleanos reales.
    const mappedDinosaurs = typedDinosaurs.map(dino => ({
      ...dino,
      carnivoro: Boolean(dino.carnivoro)
    }));

    // Devolver array tipado
    res.json(mappedDinosaurs);
  } catch (error: any) {
    console.error('Error en la consulta a la base de datos:', error);
    if (error.code === 'ECONNREFUSED' || error.code === 'ER_BAD_DB_ERROR') {
      res.status(500).json({ error: 'La base de datos MySQL no está accesible o no existe.' });
    } else {
      res.status(500).json({ error: 'Error al recuperar los datos de los dinosaurios' });
    }
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor de Dinosaurios escuchando en el puerto ${port}`);
  console.log(`   Prueba la API en: http://localhost:${port}/`);
});
