<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { ImageIcon, X } from 'lucide-vue-next';

const userStore = useUserStore();

// 1. Estados Reactivos
const text = ref('');
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);

// Referencia al input oculto del DOM
const fileInputRef = ref<HTMLInputElement | null>(null);

// 2. Manejadores de Eventos

// Simula el clic en el input file oculto
const handleImageClick = () => {
  fileInputRef.value?.click();
};    

// Cuando el usuario selecciona una foto
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files[0]) {
    const file = target.files[0];
    selectedFile.value = file;
    // Magia: Creamos una URL temporal para ver la foto al instante
    previewUrl.value = URL.createObjectURL(file);
  }
};

// Quitar la foto seleccionada
const removeImage = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

// Enviar el Post (Por ahora solo loguea)
const handleSubmit = async () => {
  if (!text.value && !selectedFile.value) return;

  console.log("Enviando post...", { 
    text: text.value, 
    file: selectedFile.value 
  });

  // Resetear formulario
  text.value = '';
  removeImage();
};

</script>    

<template>
  <div v-if="userStore.isSignedIn" class="bg-white rounded-lg shadow p-4 mb-4 border border-gray-200">
    <div class="flex space-x-4 items-center mb-4">
      <img 
        :src="userStore.user?.imageUrl || 'https://github.com/shadcn.png'" 
        alt="Avatar" 
        class="h-12 w-12 rounded-full border border-gray-200"
      />
      
      <input 
        v-model="text"
        type="text" 
        placeholder="Crear publicación" 
        class="flex-1 rounded-full border border-gray-400 py-3 px-4 font-semibold text-gray-600 hover:bg-gray-100 transition focus:outline-none focus:ring-1 focus:ring-gray-400 cursor-text"
        @keyup.enter="handleSubmit"
      />
    </div>

    <div v-if="previewUrl" class="relative mb-4">
      <img :src="previewUrl" alt="Preview" class="w-full object-contain max-h-60 rounded-md bg-gray-50" />
      <button 
        @click="removeImage"
        class="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-1 hover:bg-gray-600 transition"
      >
        <X :size="16" />
      </button>
    </div>    
  </div>  
</template>    

    