import 'dotenv/config'; // Esto carga las variables instantáneamente al iniciar
import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import postRoutes from './routes/post.routes';

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI as string);
    console.log(`✅ MongoDB Conectado: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ Error de conexión: ${error}`);
    process.exit(1);
  }
};

app.get('/', (req: Request, res: Response) => {
  res.send('API de LinkedIn Clone funcionando 🚀');
});

// 2. USAR LA RUTA (Todo lo que vaya a /api/posts será manejado por postRoutes)
app.use('/api/posts', postRoutes); 

app.listen(port, () => {
  connectDB();
  console.log(`⚡ Servidor corriendo en http://localhost:${port}`);
});