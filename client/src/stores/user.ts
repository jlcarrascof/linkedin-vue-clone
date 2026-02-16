import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useUserStore = defineStore('user', () => {
  // Estado: Simulamos que al principio NO estamos logueados
  const user = ref(null);

  // Getter: ¿Estamos logueados?
  // (Equivalente al hook `isSignedIn` de Clerk)
  const isSignedIn = computed(() => user.value !== null);


})