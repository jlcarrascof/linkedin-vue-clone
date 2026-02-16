<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <button 
    @click="userStore.signIn()"
    class="border border-blue-600 text-blue-600 rounded-full px-5 py-1.5 font-semibold hover:bg-blue-50 transition text-sm"
  >
    Iniciar sesión
  </button>
</template>