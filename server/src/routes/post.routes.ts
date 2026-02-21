import { Router, Request, Response } from 'express';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream'; // Módulo nativo de Node para manejar flujos de datos
import Post from '../models/Post';
import upload from '../middlewares/upload'; // Tu Píldora 12

// 1. Configuramos Cloudinary con las llaves de tu .env
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const router = Router();

// 2. Función auxiliar para subir la imagen en memoria hacia Cloudinary
const uploadToCloudinary = (buffer: Buffer): Promise<string> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: 'linkedin-clone-posts' }, // Crea esta carpeta en tu Cloudinary
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    // Convertimos el Buffer de la RAM en un flujo de datos (Stream) que Cloudinary pueda leer
    Readable.from(buffer).pipe(uploadStream);
  });
};

// 3. El Endpoint. ¡Nota el middleware upload.single('image') en medio!
router.post('/', upload.single('image'), async (req: Request, res: Response): Promise<void> => {
  try {
    const text = req.body.text;
    
    // Al usar form-data, los objetos llegan como strings. Debemos parsear el JSON del usuario.
    let user;
    try {
      user = req.body.user ? JSON.parse(req.body.user) : undefined;
    } catch (e) {
      console.warn("No se pudo parsear el usuario, usando valores por defecto.");
    }

    if (!text) {
      res.status(400).json({ message: 'El texto del post es obligatorio' });
      return;
    }

    let imageUrl = '';

    // 4. ¿Multer atrapó un archivo? Si es así, lo subimos a la nube
    if (req.file) {
      console.log('🖼️ Archivo detectado, subiendo a Cloudinary...');
      imageUrl = await uploadToCloudinary(req.file.buffer);
      console.log('✅ Subida exitosa a Cloudinary:', imageUrl);
    }

    // 5. Creamos el Post con el texto y la URL de la imagen (si existe)
    const newPost = new Post({
      text,
      imageUrl,
      user: user || {
        firstName: 'Usuario',
        lastName: 'Invitado',
      }
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost);

  } catch (error) {
    console.error('❌ Error al crear el post:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

// Endpoint para OBTENER todos los posts (El Feed)
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('📡 Frontend solicitando el feed de posts...');
    
    // 1. Buscamos en MongoDB. 
    // .sort({ createdAt: -1 }) significa orden descendente (los más recientes primero)
    const posts = await Post.find().sort({ createdAt: -1 });

    // 2. Respondemos con un código 200 (OK) y la lista de posts
    res.status(200).json(posts);
    
    console.log(`✅ Se enviaron ${posts.length} posts al cliente.`);

  } catch (error) {
    console.error('❌ Error al obtener los posts:', error);
    res.status(500).json({ message: 'Error interno del servidor al cargar el feed' });
  }
});

// Endpoint para DAR/QUITAR Like (Toggle)
router.put('/:id/like', async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = req.params.id;
    // Como aún no tenemos sistema de Auth (Clerk/JWT), simularemos el ID del usuario
    // En producción, esto vendrá del token de seguridad (req.user.id)
    const { userId } = req.body; 

    if (!userId) {
      res.status(400).json({ message: 'Se requiere el userId para dar like' });
      return;
    }

    const post = await Post.findById(postId);
    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    // Lógica Toggle: Comprobamos si el usuario ya está en el array de likes
    const hasLiked = post.likes.includes(userId);
    let updatedPost;

    if (hasLiked) {
      // Si ya dio like, lo quitamos usando $pull
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $pull: { likes: userId } },
        { new: true } // Devuelve el documento actualizado
      );
      console.log(`👎 Like removido del post ${postId}`);
    } else {
      // Si no ha dado like, lo agregamos usando $addToSet (evita duplicados)
      updatedPost = await Post.findByIdAndUpdate(
        postId,
        { $addToSet: { likes: userId } },
        { new: true }
      );
      console.log(`👍 Like agregado al post ${postId}`);
    }

    res.status(200).json(updatedPost);

  } catch (error) {
    console.error('❌ Error al procesar el like:', error);
    res.status(500).json({ message: 'Error interno del servidor al procesar el like' });
  }
});

export default router;