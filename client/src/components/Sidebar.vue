<script setup lang="ts">
import { useUserStore } from '@/stores/user';

const userStore = useUserStore();
</script>

<template>
  <div class="space-y-2 min-w-[225px]">
    
    <div class="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden text-center relative pb-4">
      
      <div class="h-16 w-full bg-gradient-to-tr from-blue-300 to-blue-600"></div>

      <div class="h-16 w-16 bg-white rounded-full border-2 border-white mx-auto -mt-8 overflow-hidden cursor-pointer">
        <img 
          :src="userStore.user?.imageUrl || 'https://www.w3schools.com/howto/img_avatar.png'" 
          alt="Avatar" 
        />
      </div>

      <div class="mt-2 px-4">
        <h2 class="font-semibold hover:underline cursor-pointer">
          {{ userStore.user?.firstName || 'Usuario Invitado' }} 
          {{ userStore.user?.lastName || '' }}
        </h2>
        <p class="text-xs text-gray-500 mt-1">
          {{ userStore.isSignedIn ? 'Desarrollador Full Stack en Formación' : '¡Únete para ver tu perfil!' }}
        </p>
      </div>

      <div v-if="userStore.isSignedIn" class="border-t border-gray-200 mt-4 text-left">
        <div class="px-4 py-3 hover:bg-gray-100 cursor-pointer transition">
          <div class="flex justify-between text-xs font-semibold text-gray-500">
             <span>Contactos</span>
             <span class="text-blue-600">88</span>
          </div>
          <p class="text-xs font-bold text-black">Amplía tu red</p>
        </div>
        <div class="px-4 py-3 hover:bg-gray-100 cursor-pointer transition border-t border-gray-200">
             <div class="flex justify-between text-xs font-semibold text-gray-500">
                <span>Quién vio tu perfil</span>
                <span class="text-blue-600">32</span>
             </div>
        </div>
      </div>
      
      <div class="border-t border-gray-200 px-4 py-3 hover:bg-gray-100 cursor-pointer text-left flex items-center gap-2 text-xs font-semibold text-gray-600">
         <span>🔖</span> Elementos guardados
      </div>
    </div>

    <div class="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-4 text-left hidden md:block sticky top-20">
        <p class="text-xs font-semibold pb-2">Recientes</p>
        <div class="flex flex-col gap-2 text-xs text-gray-500 font-semibold">
            <span class="hover:text-black cursor-pointer group flex items-center gap-2">
                <span class="text-lg">#</span> <span class="group-hover:underline">vuejs</span>
            </span>
             <span class="hover:text-black cursor-pointer group flex items-center gap-2">
                <span class="text-lg">#</span> <span class="group-hover:underline">alegra_devs</span>
            </span>
             <span class="hover:text-black cursor-pointer group flex items-center gap-2">
                <span class="text-lg">#</span> <span class="group-hover:underline">javascript</span>
            </span>
        </div>
    </div>
  </div>
</template>