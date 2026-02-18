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

  </div>  
</template>    

    