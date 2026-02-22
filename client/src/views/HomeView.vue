<script setup lang="ts">
import { ref } from 'vue';
import Sidebar from '@/components/Sidebar.vue';
import PostForm from '@/components/PostForm.vue';
import PostFeed from '@/components/PostFeed.vue';

// Creamos una referencia al componente PostFeed
const feedRef = ref<InstanceType<typeof PostFeed> | null>(null);

// Función que se dispara cuando PostForm emite 'post-created'
const handlePostCreated = () => {
  if (feedRef.value) {
    feedRef.value.fetchPosts(); // Forzamos la recarga del muro
  }
};
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-6">
    <aside class="hidden md:block col-span-2">
      <Sidebar />
    </aside>

    <section class="col-span-1 md:col-span-6 lg:col-span-4 space-y-4">
      <PostForm @post-created="handlePostCreated" />
      
      <PostFeed ref="feedRef" />
    </section>

    <aside class="hidden lg:block col-span-2">
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-sm font-semibold text-gray-600">LinkedIn News</h2>
      </div>
    </aside>
  </div>
</template>