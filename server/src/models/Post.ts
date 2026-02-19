import mongoose, { Document, Schema, model } from 'mongoose';

// 1. Definimos la Interfaz (Tipos para TypeScript)
export interface IPost extends Document {
  text: string;
  imageUrl?: string;
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
    title?: string;
  };
  likes: string[];
  createdAt: Date;
  updatedAt: Date;
}

// 2. Definimos el Esquema (Reglas para MongoDB)
const PostSchema = new Schema<IPost>(
  {
    text: {
      type: String,
      required: [true, 'El texto del post es obligatorio'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: false,
    },
    user: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      userImage: { type: String },
      title: { type: String, default: 'Usuario de LinkedIn' },
    },
    likes: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// 3. Exportamos el Modelo
const Post = model<IPost>('Post', PostSchema);
export default Post;