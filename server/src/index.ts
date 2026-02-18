import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import cors from 'cors';

// 1. Configuración inicial
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// 2. Middlewares (Los porteros de la discoteca)
app.use(cors()); // Permite peticiones desde el Frontend
app.use(express.json()); // Permite leer JSON en el body de las peticiones

// 3. Conexión a Base de Datos (MongoDB Atlas)
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error}`);
    process.exit(1);
  }
};

// 4. Rutas de prueba
app.get('/', (req: Request, res: Response) => {
  res.send('API de LinkedIn Clone funcionando 🚀');
});

// 5. Encender el servidor
app.listen(port, () => {
  connectDB();
  console.log(`⚡ Servidor corriendo en http://localhost:${port}`);
});