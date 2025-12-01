<template>
  <div style="background-color: #f5e6d3" class="rounded-3xl shadow-xl p-8 border-0">
    <form class="space-y-6" @submit.prevent="handleSubmit">
      <!-- Email Input -->
      <div>
        <label for="email" class="block text-xl font-bold text-green-800 mb-2">
          Modtager
        </label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="w-full px-4 py-3 border-3 border-cream-dark rounded-2xl focus:border-green-700 focus:outline-none transition-colors bg-white"
          placeholder=""
          :disabled="isSubmitting"
        >
      </div>

      <!-- Message Textarea -->
      <div>
        <label for="message" class="block text-xl font-bold text-green-800 mb-2">
          Besked
        </label>
        <textarea
          id="message"
          v-model="formData.message"
          rows="6"
          class="w-full px-4 py-3 border-3 border-cream-dark rounded-2xl focus:border-green-700 focus:outline-none resize-none transition-colors bg-white"
          placeholder=""
          :disabled="isSubmitting"
        />
      </div>

      <!-- File Input -->
      <div>
        <label for="files" class="block text-xl font-bold text-green-800 mb-2">
          Vedhæftninger (maks 3)
        </label>
        <input
          id="files"
          ref="fileInput"
          type="file"
          multiple
          class="w-full px-4 py-3 border-3 border-cream-dark rounded-2xl focus:border-green-700 focus:outline-none transition-colors bg-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-100 file:text-green-800 hover:file:bg-green-200"
          :disabled="isSubmitting"
          @change="handleFileChange"
        >
      </div>

      <!-- File List -->
      <div v-if="selectedFiles.length > 0" class="space-y-2">
        <p class="text-sm font-medium text-green-800">Valgte filer:</p>
        <div
          v-for="(file, index) in selectedFiles"
          :key="index"
          class="flex items-center justify-between bg-white px-4 py-2 rounded-xl border-2 border-cream-dark"
        >
          <div class="flex items-center space-x-2">
            <span class="text-2xl">📄</span>
            <div>
              <p class="text-sm font-medium text-gray-900">{{ file.name }}</p>
              <p class="text-xs text-gray-500">{{ formatFileSize(file.size) }}</p>
            </div>
          </div>
          <button
            type="button"
            class="text-red-600 hover:text-red-800 text-xl font-bold"
            :disabled="isSubmitting"
            @click="removeFile(index)"
          >
            ×
          </button>
        </div>
      </div>

      <!-- Submit Button -->
      <button
        type="submit"
        :disabled="isSubmitting"
        class="w-full bg-green-800 hover:bg-green-900 disabled:bg-gray-400 text-white font-bold py-4 px-6 rounded-3xl text-2xl transition-colors shadow-lg"
      >
        {{ isSubmitting ? 'Sender...' : 'Send' }}
      </button>
    </form>

    <!-- Feedback Message -->
    <FeedbackMessage
      v-if="feedback"
      :type="feedback.type"
      :message="feedback.message"
      @close="feedback = null"
    />
  </div>
</template>

<script setup lang="ts">
const formData = ref({
  email: '',
  message: ''
});

const selectedFiles = ref<File[]>([]);
const fileInput = ref<HTMLInputElement | null>(null);
const isSubmitting = ref(false);
const feedback = ref<{ type: 'success' | 'error'; message: string } | null>(null);

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const newFiles = Array.from(target.files);

    // Check total number of files
    if (selectedFiles.value.length + newFiles.length > 3) {
      feedback.value = {
        type: 'error',
        message: 'Du kan maksimalt vedhæfte 3 filer'
      };
      return;
    }

    selectedFiles.value = [...selectedFiles.value, ...newFiles];

    // Reset file input
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  }
};

const removeFile = (index: number) => {
  selectedFiles.value.splice(index, 1);
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

const handleSubmit = async () => {
  isSubmitting.value = true;
  feedback.value = null;

  try {
    // Create FormData
    const data = new FormData();
    data.append('email', formData.value.email);
    data.append('message', formData.value.message);

    // Append files
    selectedFiles.value.forEach((file) => {
      data.append('files', file);
    });

    // Send request
    const response = await $fetch('/api/send-email', {
      method: 'POST',
      body: data
    });

    if (response.success) {
      feedback.value = {
        type: 'success',
        message: '🎉 Beskeden er sendt! Din drillenisse er på vej!'
      };

      // Reset form
      formData.value = { email: '', message: '' };
      selectedFiles.value = [];
    } else {
      feedback.value = {
        type: 'error',
        message: response.error || 'Der skete en fejl. Prøv igen.'
      };
    }
  } catch (error) {
    feedback.value = {
      type: 'error',
      message: 'Der skete en fejl ved afsendelse. Prøv igen senere.'
    };
  } finally {
    isSubmitting.value = false;
  }
};
</script>
