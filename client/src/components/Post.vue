<script setup lang="ts">
import { computed } from 'vue';

// 1. Definimos la misma interfaz para tipar el Prop que recibiremos
interface PostData {
  _id: string;
  text: string;
  imageUrl?: string;
  likes?: string[];
  user: {
    firstName: string;
    lastName: string;
    userImage?: string;
    title?: string;
  };
  createdAt: string;
}

// 2. Declaramos que este componente RECIBE un prop llamado "post"
const props = defineProps<{
  post: PostData;
}>();

// 3. Pequeña utilidad para formatear la fecha
const formattedDate = computed(() => {
  const date = new Date(props.post.createdAt);
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
});
</script>