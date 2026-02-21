<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Post from './Post.vue';

// 1. Tipamos los datos para que TypeScript nos ayude con el autocompletado
interface Post {
  _id: string;
  text: string;
  imageUrl?: string;
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
    title?: string;
  };
  createdAt: string;
}

// 2. Estados Reactivos
const posts = ref<Post[]>([]);
const loading = ref(true);

// 3. Función para buscar los posts al backend
const fetchPosts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/posts');
    if (response.ok) {
      posts.value = await response.json();
      console.log('✅ Posts cargados en el Feed:', posts.value);
    } else {
      console.error('❌ Error del servidor al obtener los posts');
    }
  } catch (error) {
    console.error('❌ Error de red al conectar con el backend:', error);
  } finally {
    loading.value = false;
  }
};

// 4. Ciclo de vida: Llamar a la API apenas el componente se monte en pantalla
onMounted(() => {
  fetchPosts();
});
</script>

<template>
  <div class="space-y-4">
    <div v-if="loading" class="text-center text-gray-500 py-4 font-semibold animate-pulse">
      Cargando publicaciones...
    </div>

    <div v-else-if="posts.length === 0" class="text-center text-gray-500 py-4">
      No hay publicaciones aún. ¡Sé el primero en compartir algo!
    </div>

    <div v-else>
      <div 
        v-for="post in posts" 
        :key="post._id" 
        class="bg-white rounded-lg shadow p-4 border border-gray-200 mb-4"
      >
        <p class="font-bold text-gray-800">{{ post.user.firstName }} {{ post.user.lastName }}</p>
        <p class="text-sm text-gray-500 mb-2">{{ post.user.title }}</p>
        
        <p class="text-gray-700 mt-2">{{ post.text }}</p>
        
        <img 
          v-if="post.imageUrl" 
          :src="post.imageUrl" 
          alt="Post adjunto" 
          class="mt-4 rounded-md max-h-96 w-full object-cover bg-gray-50" 
        />
      </div>
    </div>
  </div>
</template>