<script setup lang="ts">
import { useUserStore } from '@/stores/user';
import { LogOut } from 'lucide-vue-next';

const userStore = useUserStore();
</script>

<template>
  <div class="flex items-center gap-2 cursor-pointer group relative">
    <img 
      :src="userStore.user?.imageUrl" 
      alt="Avatar" 
      class="h-8 w-8 rounded-full border border-gray-200"
    />
    
    <div class="hidden md:block text-left">
        <p class="text-sm font-semibold text-gray-700">
            {{ userStore.user?.firstName }}
        </p>
        <p class="text-xs text-gray-500">Ver perfil</p>
    </div>

    <div class="absolute top-10 right-0 bg-white border border-gray-200 shadow-lg rounded-md p-2 hidden group-hover:flex flex-col min-w-[150px] z-50">
        <button 
            @click="userStore.signOut()" 
            class="flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 p-2 rounded w-full text-left"
        >
            <LogOut :size="16" />
            Cerrar Sesión
        </button>
    </div>
  </div>
</template>