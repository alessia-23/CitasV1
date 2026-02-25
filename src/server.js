// Importaciones
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Importación de rutas
import authRoutes from './routes/authRoutes.js';
import pacientesRoutes from './routes/pacienteRoutes.js';
import especialidadRoutes from './routes/especialidadRoutes.js';
// Inicialización
const app = express();

// Middlewares
app.use(express.json());
app.use(cors());


// Ruta de prueba
app.get('/', (req, res) => {
res.send('Server on');
});
// Rutas
app.use('/api/auth', authRoutes); // Ruta login y registro
app.use('/api/pacientes',pacientesRoutes); // Rutas CRUD de pacientes
app.use('/api/especialidades',especialidadRoutes); // Rutas CRUD de especialidades

// Exportar app
export default app;