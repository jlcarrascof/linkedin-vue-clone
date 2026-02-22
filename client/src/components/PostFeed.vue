<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Post from './Post.vue';

// 1. Tipamos los datos (Renombrado a PostData para no chocar con el componente Post)
interface PostData {
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
const posts = ref<PostData[]>([]);
const loading = ref(true);

// 3. Función para buscar los posts al backend
const fetchPosts = async () => {
  loading.value = true; // 👇 NUEVO: Reiniciamos el estado de carga al recargar
  try {
    const response = await fetch('http://localhost:3000/api/posts');
    if (response.ok) {
      posts.value = await response.json();
      console.log('✅ Posts recargados en el Feed');
    } else {
      console.error('❌ Error del servidor al obtener los posts');
    }
  } catch (error) {
    console.error('❌ Error de red al conectar con el backend:', error);
  } finally {
    loading.value = false;
  }
};

// 4. Ciclo de vida: Llamar a la API apenas el componente se monte
onMounted(() => {
  fetchPosts();
});

// 5. 👇 NUEVO: Exponemos la función para que HomeView pueda ejecutarla
defineExpose({
  fetchPosts
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
      <Post 
        v-for="post in posts" 
        :key="post._id" 
        :post="post" 
      />
    </div>
  </div>
</template>