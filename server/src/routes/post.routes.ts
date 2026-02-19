import { Router, Request, Response } from 'express';
import Post from '../models/Post'; // Importamos el modelo que creaste ayer

const router = Router();

// Endpoint para CREAR un post
router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    // 1. Extraemos los datos que nos envía el Frontend
    const { text, imageUrl, user } = req.body;

    // 2. Validamos que venga lo mínimo necesario
    if (!text) {
      res.status(400).json({ message: 'El texto del post es obligatorio' });
      return;
    }

    // 3. Creamos el nuevo Post en memoria
    const newPost = new Post({
      text,
      imageUrl,
      user: user || {
        firstName: 'Usuario',
        lastName: 'Invitado',
      }
    });

    // 4. Lo guardamos en la Base de Datos (MongoDB)
    const savedPost = await newPost.save();

    // 5. Respondemos al Frontend que todo salió bien
    res.status(201).json(savedPost);

  } catch (error) {
    console.error('Error al crear el post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint temporal para OBTENER los posts (lo usaremos luego)
router.get('/', async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 }); // Los más recientes primero
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los posts' });
  }
});

export default router;