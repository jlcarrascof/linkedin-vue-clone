<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { ImageIcon, X } from 'lucide-vue-next';

const userStore = useUserStore();

// 1. Estados Reactivos
const text = ref('');
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);  

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

// Enviar el Post al Backend (Ahora con soporte para imágenes)
const handleSubmit = async () => {
  if (!text.value && !selectedFile.value) return;

  console.log("Preparando envío multimedia...");
  isSubmitting.value = true; // Bloqueamos el formulario

  try {
    // 1. Creamos un objeto FormData (El estándar para enviar archivos)
    const formData = new FormData();
    
    // 2. Agregamos el texto
    formData.append('text', text.value);

    // 3. Agregamos el usuario (Convertido a String porque FormData no acepta Objetos puros)
    const userData = {
      firstName: userStore.user?.firstName || 'Javier',
      lastName: userStore.user?.lastName || 'Martinez',
      userImage: userStore.user?.imageUrl || '',
      title: 'Full Stack Developer'
    };
    formData.append('user', JSON.stringify(userData));

    // 4. Agregamos el archivo de la imagen (¡Debe llamarse 'image' igual que en el backend!)
    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    // 5. Usamos Fetch API (¡OJO! No ponemos Content-Type. El navegador lo hace automático con FormData)
    const response = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      body: formData 
    });

    if (response.ok) {
      const savedPost = await response.json();
      console.log('✅ ¡Éxito! Post guardado con foto:', savedPost);
      
      // 6. Limpiamos el formulario 
      text.value = '';
      removeImage();
    } else {
      console.error('❌ Error del servidor al guardar');
    }

  } catch (error) {
    console.error('❌ Error de conexión con el Backend:', error);
  } finally {
    isSubmitting.value = false; // Desbloqueamos el formulario sin importar si falló o tuvo éxito
  }
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
    
    <div class="flex justify-between items-center pt-2">
      <div class="flex items-center">
        <button 
          @click="handleImageClick"
          class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition text-gray-500"
        >
          <ImageIcon :size="20" class="text-blue-500" />
          <span class="text-sm font-semibold text-gray-600">Media</span>
        </button>

        <input 
          ref="fileInputRef"
          type="file" 
          accept="image/*" 
          class="hidden"
          @change="handleFileChange"
        />
      </div>

      <button 
        @click="handleSubmit"
        :disabled="(!text && !selectedFile) || isSubmitting"
        class="bg-blue-600 text-white px-4 py-1.5 rounded-full font-semibold text-sm hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
      </button>
    </div>
  </div>
  
  <div v-else class="bg-white rounded-lg shadow p-8 text-center border border-gray-200 mb-4">
    <h3 class="text-lg font-semibold text-gray-700">¡Hola, visitante!</h3>
    <p class="text-gray-500 mb-4">Inicia sesión para compartir tus ideas con el mundo.</p>
  </div>  
</template>    

    