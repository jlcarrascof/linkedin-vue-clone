<script setup lang="ts">
import { ref, computed } from 'vue';

interface PostData {
  _id: string;
  text: string;
  imageUrl?: string;
  likes?: string[];
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
    title?: string;
  };
  createdAt: string;
}

const props = defineProps<{
  post: PostData;
}>();

const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
});

// --- LÓGICA DE LIKES (OPTIMISTIC UI) ---
// Usaremos un ID de usuario estático (simulando que Javier está logueado)
const CURRENT_USER_ID = "javier_master_123"; 

const isLiked = ref(props.post.likes?.includes(CURRENT_USER_ID) || false);
const localLikesCount = ref(props.post.likes?.length || 0);

const handleLike = async () => {
  // 1. Optimistic UI: Cambiamos la interfaz inmediatamente antes de ir al backend
  isLiked.value = !isLiked.value;
  localLikesCount.value += isLiked.value ? 1 : -1;

  try {
    // 2. Disparamos la petición al backend en segundo plano
    const response = await fetch(`http://localhost:3000/api/posts/${props.post._id}/like`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: CURRENT_USER_ID })
    });

    if (!response.ok) {
      throw new Error('El servidor rechazó el like');
    }
  } catch (error) {
    console.error('❌ Error dando like, revirtiendo estado...', error);
    // 3. Rollback: Si falla el backend, deshacemos el cambio visual
    isLiked.value = !isLiked.value;
    localLikesCount.value += isLiked.value ? 1 : -1;
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
        👍 <span class="ml-1">{{ post.likes?.length || 0 }}</span>
      </span>
      <span class="hover:text-blue-600 cursor-pointer hover:underline">
        0 comentarios
      </span>
    </div>

    <div class="flex items-center justify-between px-2 py-1 border-t border-gray-100">
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">👍</span> <span class="hidden sm:inline">Recomendar</span>
      </button>
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">💬</span> <span class="hidden sm:inline">Comentar</span>
      </button>
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">🔁</span> <span class="hidden sm:inline">Compartir</span>
      </button>
      <button class="flex-1 flex items-center justify-center gap-2 text-gray-600 hover:bg-gray-100 py-3 rounded-md transition font-semibold text-sm">
        <span class="text-lg">✈️</span> <span class="hidden sm:inline">Enviar</span>
      </button>
    </div>

  </div>
</template>