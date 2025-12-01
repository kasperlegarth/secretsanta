<template>
  <div
    v-if="type"
    :class="[
      'mt-6 p-4 rounded-lg border-2 animate-slide-in',
      type === 'success'
        ? 'bg-green-50 border-green-500 text-green-800'
        : 'bg-red-50 border-red-500 text-red-800'
    ]"
  >
    <div class="flex items-center justify-between">
      <p class="font-medium">{{ message }}</p>
      <button
        @click="$emit('close')"
        class="text-2xl hover:opacity-70 transition-opacity ml-4"
      >
        ×
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  type: 'success' | 'error';
  message: string;
}>();

defineEmits<{
  close: [];
}>();
</script>

<style scoped>
@keyframes slide-in {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
