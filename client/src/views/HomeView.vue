<script setup lang="ts">
import Sidebar from '@/components/Sidebar.vue';
import PostForm from '@/components/PostForm.vue';
import PostFeed from '@/components/PostFeed.vue';
</script>

<template>
  <div class="grid grid-cols-1 md:grid-cols-8 gap-x-6 gap-y-6">
    
    <aside class="hidden md:block col-span-2">
      <Sidebar />
    </aside>

    <section class="col-span-1 md:col-span-6 lg:col-span-4 space-y-4">
      <PostForm />
      <PostFeed />
    </section>

    <aside class="hidden lg:block col-span-2">
      <div class="bg-white rounded-lg shadow p-4">
        <h2 class="text-sm font-semibold text-gray-600">LinkedIn News</h2>
      </div>
    </aside>

  </div>
</template>