<script setup lang="ts">
import Header from '@/components/Header.vue';
import Sidebar from '@/components/Sidebar.vue';
import PostForm from '@/components/PostForm.vue';
import PostFeed from '@/components/PostFeed.vue';
</script>

<template>
  <div class="min-h-screen flex flex-col bg-slate-100">
    
    <Header />

    <main class="flex-1 w-full max-w-7xl mx-auto px-0 md:px-4 py-6">
       <div class="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-6">
         
         <aside class="hidden md:block col-span-2">
            <Sidebar />
         </aside>

         <section class="col-span-1 md:col-span-6 lg:col-span-4 space-y-4">
            <PostForm />
            <PostFeed />
            <div class="bg-white rounded-lg shadow p-4 text-center text-slate-400">
               <p>Próximamente: Lista de Posts...</p>
            </div>
         </section>

         <aside class="hidden lg:block col-span-2">
            <div class="bg-white rounded-lg shadow p-4">
                <h2 class="text-sm font-semibold text-gray-600">LinkedIn News</h2>
                </div>
         </aside>

       </div>
    </main>

  </div>
</template>