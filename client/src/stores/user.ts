import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  imageUrl: string;
  email: string;
}

export const useUserStore = defineStore('user', () => {
  // 2. Usamos <User | null> para decirle: "Puedes ser un User O puedes ser null"
  const user = ref<User | null>(null);
 
  // Getter: ¿Estamos logueados?
  // (Equivalente al hook `isSignedIn` de Clerk)
  const isSignedIn = computed(() => user.value !== null);

  // Acción: Iniciar Sesión (Simulado por ahora)
  function signIn() {
    user.value = {
      id: '123',
      firstName: 'Sonny',
      lastName: 'Sangha',
      imageUrl: 'https://github.com/shadcn.png', // Avatar de ejemplo
      email: 'sonny@react.com'
    };
  }

  // Acción: Cerrar Sesión
  function signOut() {
    user.value = null;
  }

  return { user, isSignedIn, signIn, signOut };


})