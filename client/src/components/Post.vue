<script setup lang="ts">
import { computed } from 'vue';

// 1. Definimos la misma interfaz para tipar el Prop que recibiremos
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

// 2. Declaramos que este componente RECIBE un prop llamado "post"
const props = defineProps<{
  post: PostData;
}>();

// 3. Pequeña utilidad para formatear la fecha
const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
});
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