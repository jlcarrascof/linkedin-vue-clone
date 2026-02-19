import multer from 'multer';

// Configuramos Multer para que guarde el archivo temporalmente en la memoria RAM del servidor
// (No queremos que guarde fotos basura en el disco duro de tu computadora)
const storage = multer.memoryStorage();

// Creamos el middleware con un límite de tamaño (ej. 5MB para evitar que saturen tu servidor)
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 Megabytes
  },
});

export default upload;