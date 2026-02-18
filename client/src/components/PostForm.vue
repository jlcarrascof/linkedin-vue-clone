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

</script>    
    
    