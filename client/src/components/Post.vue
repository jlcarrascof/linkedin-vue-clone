<script setup lang="ts">
import { ref, computed } from 'vue';

// 1. Actualizamos la Interfaz agregando "comments"
interface Comment {
  _id?: string;
  text: string;
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
  };
  createdAt: string | Date;
}

interface PostData {
  _id: string;
  text: string;
  imageUrl?: string;
  likes?: string[];
  comments?: Comment[];
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
    title?: string;
  };
  createdAt: string;
}

const props = defineProps<{ post: PostData }>();

const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
});

// --- LÓGICA DE LIKES (OPTIMISTIC UI) ---
const CURRENT_USER_ID = "javier_master_123"; 
const isLiked = ref(props.post.likes?.includes(CURRENT_USER_ID) || false);
const localLikesCount = ref(props.post.likes?.length || 0);

const handleLike = async () => {
  isLiked.value = !isLiked.value;
  localLikesCount.value += isLiked.value ? 1 : -1;
  try {
    const response = await fetch(`http://localhost:3000/api/posts/${props.post._id}/like`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: CURRENT_USER_ID })
    });
    if (!response.ok) throw new Error('El servidor rechazó el like');
  } catch (error) {
    isLiked.value = !isLiked.value;
    localLikesCount.value += isLiked.value ? 1 : -1;
  }
};

// --- LÓGICA DE COMENTARIOS ---
const showComments = ref(false); // Controla si se ve la sección de comentarios
const newCommentText = ref('');
// Hacemos una copia reactiva local para aplicar Optimistic UI también en los comentarios
const localComments = ref<Comment[]>(props.post.comments || []);

const toggleComments = () => {
  showComments.value = !showComments.value;
};

const submitComment = async () => {
  if (!newCommentText.value.trim()) return;

  // Creamos el objeto del comentario falso (simulando tu sesión)
  const commentPayload = {
    text: newCommentText.value,
    user: {
      firstName: "Javier",
      lastName: "Developer",
      userImage: "" // Pon aquí una URL si quieres ver tu foto
    }
  };

  // 1. Optimistic UI (Lo agregamos a la pantalla al instante)
  const optimisticComment = { ...commentPayload, createdAt: new Date().toISOString(), _id: Math.random().toString() };
  localComments.value.push(optimisticComment);
  newCommentText.value = ''; // Limpiamos el input

  try {
    // 2. Lo enviamos al Backend
    const response = await fetch(`http://localhost:3000/api/posts/${props.post._id}/comment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(commentPayload)
    });

    if (!response.ok) throw new Error('Error al guardar comentario');
    
    // Si quisiéramos ser ultra estrictos, reemplazaríamos el array local con la respuesta real del servidor aquí.
  } catch (error) {
    console.error(error);
    // Rollback: quitamos el último comentario si falló
    localComments.value.pop(); 
  }
};
</script>

<template>
  <div class="bg-white rounded-lg shadow-sm border border-gray-200 mb-4 overflow-hidden">
    
    <div class="flex items-center p-4">
      <img 
        v-if="post.user.userImage" 
        :src="post.user.userImage" 
        alt="Avatar" 
        class="w-12 h-12 rounded-full object-cover mr-3 cursor-pointer"
      />
      <div v-else class="w-12 h-12 rounded-full bg-slate-300 flex items-center justify-center text-slate-600 font-bold mr-3 text-xl cursor-pointer">
        {{ post.user.firstName.charAt(0) }}
      </div>
      
      <div class="flex-1">
        <h3 class="font-bold text-gray-900 text-sm hover:text-blue-600 cursor-pointer">
          {{ post.user.firstName }} {{ post.user.lastName }}
        </h3>
        <p class="text-xs text-gray-500 truncate">{{ post.user.title || 'Miembro de LinkedIn' }}</p>
        <p class="text-xs text-gray-400 flex items-center mt-0.5">
          {{ formattedDate }} <span class="mx-1">•</span> 🌐
        </p>
      </div>
    </div>

    <div class="px-4 pb-2">
      <p class="text-sm text-gray-900 whitespace-pre-wrap">{{ post.text }}</p>
    </div>

    <div v-if="post.imageUrl" class="mt-2 bg-slate-50 border-t border-b border-gray-100">
      <img :src="post.imageUrl" alt="Imagen adjunta" class="w-full max-h-[500px] object-contain" />
    </div>

    <div class="px-4 py-2 flex items-center justify-between text-xs text-gray-500">
      <span class="flex items-center hover:text-blue-600 cursor-pointer">
        👍 <span class="ml-1">{{ localLikesCount }}</span>
      </span>
      <span @click="toggleComments" class="hover:text-blue-600 cursor-pointer hover:underline">
        {{ localComments.length }} comentarios
      </span>
    </div>

    <div class="flex items-center justify-between px-2 py-1 border-t border-gray-100">
      <button 
        @click="handleLike"
        :class="isLiked ? 'text-blue-600' : 'text-gray-600'"
        class="flex-1 flex items-center justify-center gap-2 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm"
      >
        <span class="text-lg">👍</span> <span class="hidden sm:inline">Recomendar</span>
      </button>
      <button @click="toggleComments" class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">💬</span> <span class="hidden sm:inline">Comentar</span>
      </button>
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">🔁</span> <span class="hidden sm:inline">Compartir</span>
      </button>
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">✈️</span> <span class="hidden sm:inline">Enviar</span>
      </button>
    </div>

    <div v-show="showComments" class="px-4 pb-4 bg-slate-50 border-t border-gray-100">
      
      <div class="flex items-start gap-2 mt-4 mb-4">
        <div class="w-8 h-8 rounded-full bg-slate-300 flex-shrink-0 flex items-center justify-center text-slate-600 font-bold text-sm mt-1">
          J
        </div>
        <form @submit.prevent="submitComment" class="flex-1 flex gap-2">
          <input 
            v-model="newCommentText" 
            type="text" 
            placeholder="Añadir un comentario..." 
            class="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
          />
          <button type="submit" v-show="newCommentText.trim().length > 0" class="text-blue-600 font-semibold text-sm px-2 hover:bg-blue-50 rounded-md transition">
            Publicar
          </button>
        </form>
      </div>

      <div class="space-y-3">
        <div v-for="comment in localComments" :key="comment._id" class="flex gap-2">
          <img v-if="comment.user.userImage" :src="comment.user.userImage" class="w-8 h-8 rounded-full object-cover mt-1" />
          <div v-else class="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold text-xs mt-1">
            {{ comment.user.firstName.charAt(0) }}
          </div>
          
          <div class="bg-gray-100 rounded-b-xl rounded-tr-xl px-3 py-2 flex-1">
            <h4 class="font-bold text-xs text-gray-900">{{ comment.user.firstName }} {{ comment.user.lastName }}</h4>
            <p class="text-sm text-gray-800 mt-0.5">{{ comment.text }}</p>
          </div>
        </div>
      </div>

    </div>

  </div>
</template>