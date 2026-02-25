import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Cargar variables de entorno
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, '../../.env') });

async function initializeDatabase() {
    const host = process.env.DB_HOST || 'localhost';
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const databaseName = process.env.DB_NAME || 'dinosaurios_db';

    console.log(`Conectando a MySQL en: ${host} como usuario ${user}...`);

    try {
        const connection = await mysql.createConnection({
            host,
            user,
            password,
            database: databaseName
        });

        console.log('Creando tabla de dinosaurios (si no existe)...');
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS dinosaurios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(255) NOT NULL,
        peso_toneladas FLOAT NOT NULL,
        carnivoro BOOLEAN NOT NULL
      )
    `);

        console.log('Limpiando registros antiguos...');
        await connection.execute('TRUNCATE TABLE dinosaurios');

        console.log('Insertando 5 registros inventados de dinosaurios...');

        const dinosaurios = [
            ['Tiranosaurio Rex', 8.4, true],
            ['Triceratops', 6.1, false],
            ['Velociraptor', 0.015, true],
            ['Braquiosaurio', 58.0, false],
            ['Espinosaurio', 7.4, true]
        ];

        const [result] = await connection.query(
            'INSERT INTO dinosaurios (nombre, peso_toneladas, carnivoro) VALUES ?',
            [dinosaurios]
        );

        console.log(`Base de datos inicializada correctamente. Registros insertados: ${(result as any).affectedRows}`);

        await connection.end();
    } catch (err: any) {
        if (err.code === 'ER_BAD_DB_ERROR') {
            console.error(`Error: La base de datos '${databaseName}' no existe. Por favor creala en MySQL (CREATE DATABASE ${databaseName};)`);
        } else if (err.code === 'ECONNREFUSED') {
            console.error('Error: No se pudo conectar a MySQL. Asegúrate de que XAMPP y el módulo MySQL estén iniciados.');
        } else {
            console.error('Error inicializando la base de datos MySQL:', err);
        }
        process.exit(1);
    }
}

initializeDatabase();
