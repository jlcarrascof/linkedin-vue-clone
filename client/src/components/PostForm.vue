<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';
import { ImageIcon, X } from 'lucide-vue-next';

const userStore = useUserStore();
// Declaramos que este componente puede emitir un evento llamado 'post-created'
const emit = defineEmits(['post-created']);

// 1. Estados Reactivos
const text = ref('');
const previewUrl = ref<string | null>(null);
const selectedFile = ref<File | null>(null);
const isSubmitting = ref(false);  
const isOpen = ref(false); // NUEVO: Controla si el Modal está abierto o cerrado

// Referencia al input oculto del DOM
const fileInputRef = ref<HTMLInputElement | null>(null);

// 2. Manejadores de Eventos
const openModal = () => {
  isOpen.value = true;
};

const closeModal = () => {
  isOpen.value = false;
  // Opcional: Podríamos limpiar el formulario aquí, pero si lo cerramos por accidente, 
  // es mejor mantener el borrador. Se limpiará al publicar con éxito.
};

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
    previewUrl.value = URL.createObjectURL(file);
  }
};

// Quitar la foto seleccionada
const removeImage = () => {
  selectedFile.value = null;
  previewUrl.value = null;
  if (fileInputRef.value) fileInputRef.value.value = '';
};

// Enviar el Post al Backend (Lógica Intacta)
const handleSubmit = async () => {
  if (!text.value && !selectedFile.value) return;

  console.log("Preparando envío multimedia...");
  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('text', text.value);

    const userData = {
      firstName: userStore.user?.firstName || 'Javier',
      lastName: userStore.user?.lastName || 'Martinez',
      userImage: userStore.user?.imageUrl || '',
      title: 'Full Stack Developer'
    };
    formData.append('user', JSON.stringify(userData));

    if (selectedFile.value) {
      formData.append('image', selectedFile.value);
    }

    const response = await fetch('http://localhost:3000/api/posts', {
      method: 'POST',
      body: formData 
    });

    if (response.ok) {
      const savedPost = await response.json();
      console.log('✅ ¡Éxito! Post guardado con foto:', savedPost);
      
      // Limpiamos el formulario y CERRAMOS EL MODAL
      text.value = '';
      removeImage();
      isOpen.value = false; 

      // 👇 NUEVO: Le gritamos al padre que el post se creó 👇
      emit('post-created');
    } else {
      console.error('❌ Error del servidor al guardar');
    }

  } catch (error) {
    console.error('❌ Error de conexión con el Backend:', error);
  } finally {
    isSubmitting.value = false;
  }
};
</script>    

<template>
  <div v-if="userStore.isSignedIn">
    
    <div class="bg-white rounded-lg shadow-sm p-4 mb-4 border border-gray-200">
      <div class="flex space-x-3 items-center mb-2">
        <img 
          :src="userStore.user?.imageUrl || 'https://github.com/shadcn.png'" 
          alt="Avatar" 
          class="h-12 w-12 rounded-full object-cover border border-gray-200 cursor-pointer"
        />
        <button 
          @click="openModal"
          class="flex-1 rounded-full border border-gray-400 py-3 px-4 text-left font-semibold text-gray-500 hover:bg-gray-100 transition focus:outline-none focus:bg-gray-100"
        >
          Crear publicación
        </button>
      </div>
      
      <div class="flex justify-between items-center px-2 pt-2">
        <button @click="openModal" class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition text-gray-500 font-semibold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-blue-500 fill-blue-100"><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
          <span class="hidden sm:inline">Contenido multimedia</span>
        </button>
        <button @click="openModal" class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition text-gray-500 font-semibold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-amber-600 fill-amber-100"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="m9 16 2 2 4-4"/></svg>
          <span class="hidden sm:inline">Evento</span>
        </button>
        <button @click="openModal" class="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md transition text-gray-500 font-semibold text-sm">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-orange-500 fill-orange-100"><path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/><path d="M18 14h-8"/><path d="M15 18h-5"/><path d="M10 6h8v4h-8V6Z"/></svg>
          <span class="hidden sm:inline">Escribir artículo</span>
        </button>
      </div>
    </div>

    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 bg-black/60 backdrop-blur-sm transition-opacity">
      
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-[600px] mx-4 flex flex-col max-h-[85vh] overflow-hidden">
        
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 class="text-xl font-semibold text-gray-800">Crear publicación</h2>
          <button @click="closeModal" class="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition">
            <X :size="24" />
          </button>
        </div>

        <div class="p-6 flex-1 overflow-y-auto">
          
          <div class="flex items-center space-x-3 mb-4">
            <img 
              :src="userStore.user?.imageUrl || 'https://github.com/shadcn.png'" 
              class="w-12 h-12 rounded-full object-cover" 
            />
            <div>
              <h3 class="font-bold text-gray-900 leading-tight">
                {{ userStore.user?.firstName }} {{ userStore.user?.lastName }}
              </h3>
              <p class="text-xs font-semibold text-gray-500 mt-0.5">Publicar para Cualquiera</p>
            </div>
          </div>

          <textarea 
            v-model="text"
            placeholder="¿Sobre qué quieres hablar?" 
            class="w-full min-h-[140px] resize-none focus:outline-none text-lg text-gray-800 placeholder-gray-400 bg-transparent"
          ></textarea>

          <div v-if="previewUrl" class="relative mt-2 border border-gray-200 rounded-lg overflow-hidden bg-slate-50">
            <img :src="previewUrl" alt="Preview" class="w-full object-contain max-h-[300px]" />
            <button 
              @click="removeImage"
              class="absolute top-2 right-2 bg-gray-900/70 text-white rounded-full p-1.5 hover:bg-gray-900 transition"
            >
              <X :size="18" />
            </button>
          </div>
        </div>

        <div class="px-6 py-4 border-t border-gray-100 flex justify-between items-center">
          <div class="flex items-center">
            <button 
              @click="handleImageClick"
              class="p-3 hover:bg-gray-100 rounded-full transition text-gray-500"
              title="Añadir contenido multimedia"
            >
              <ImageIcon :size="24" class="text-gray-600" />
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
            class="bg-blue-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Publicando...' : 'Publicar' }}
          </button>
        </div>

      </div>
    </div>
    
  </div>
  
  <div v-else class="bg-white rounded-lg shadow-sm p-8 text-center border border-gray-200 mb-4">
    <h3 class="text-lg font-semibold text-gray-700">¡Hola, visitante!</h3>
    <p class="text-gray-500 mb-4">Inicia sesión para compartir tus ideas con el mundo.</p>
  </div>  
</template>

    