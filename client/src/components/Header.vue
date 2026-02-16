<script setup lang="ts">
import { 
  Search, 
  Home, 
  Users, 
  Briefcase, 
  MessageSquare, 
  Bell 
} from 'lucide-vue-next';
import { useUserStore } from '@/stores/user';
import SignInButton from './SignInButton.vue';
import UserButton from './UserButton.vue';

// 1. Instanciamos el Store (Este es tu nuevo cerebro)
const userStore = useUserStore();

// 2. Datos de navegación estáticos
const navItems = [
  { icon: Home, label: 'Inicio', active: true },
  { icon: Users, label: 'Mi Red', active: false },
  { icon: Briefcase, label: 'Empleos', active: false },
  { icon: MessageSquare, label: 'Mensajes', active: false },
  { icon: Bell, label: 'Notificaciones', active: false },
];

</script>

<template>
  <header class="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div class="flex items-center px-4 max-w-7xl mx-auto h-16 justify-between">
      
      <div class="flex items-center gap-x-4">
        <img 
          src="https://cdn-icons-png.flaticon.com/512/174/174857.png" 
          alt="LinkedIn Logo" 
          class="h-10 w-10 object-contain"
        />

        <div class="flex items-center space-x-1 bg-slate-100 p-2 rounded-md transition-all duration-300 focus-within:ring-2 focus-within:ring-blue-400 focus-within:bg-transparent">
            <Search :size="20" class="text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar" 
              class="bg-transparent border-none focus:outline-none flex-1 w-24 md:w-60 text-sm placeholder-gray-500"
            />
        </div>
      </div>

      <nav class="flex items-center gap-x-6">
        <ul class="flex items-center gap-x-6">
          <li v-for="item in navItems" :key="item.label" class="flex flex-col items-center cursor-pointer text-gray-500 hover:text-black transition duration-200 group">
             <component :is="item.icon" :size="24" :class="{ 'text-black fill-current': item.active }" />
             <span class="text-xs hidden md:block group-hover:font-semibold">{{ item.label }}</span>
          </li>
        </ul>

        <div class="h-8 w-px bg-gray-200 hidden md:block"></div>

        <div class="ml-auto flex items-center space-x-4">
          <div v-if="!userStore.isSignedIn" class="flex items-center gap-2">
              <button class="text-gray-500 font-semibold text-sm hover:text-blue-600">Unirse ahora</button>
              <SignInButton />
          </div>

          <UserButton v-else />
        </div>
 
      </nav>

    </div>
  </header>
</template>