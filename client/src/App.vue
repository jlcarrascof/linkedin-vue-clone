<script setup lang="ts">
import Header from '@/components/Header.vue';
import HomeView from '@/views/HomeView.vue'; // Importamos la vista
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-100">
    
    <Header />

    <main class="flex-1 w-full max-w-7xl mx-auto px-0 md:px-4 py-6">
       <HomeView />
    </main>

  </div>
</template>