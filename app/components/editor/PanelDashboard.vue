<script setup lang="ts">
import { 
  Undo2, Save, Loader2 
} from 'lucide-vue-next'

const { t } = useI18n()

interface EditorControl {
  previewContent: any
  isSaving: any
  isPublishing: any
  handleSaveDraft: () => Promise<boolean>
  handlePublish: () => Promise<boolean>
  handleReset?: () => void
}

const props = defineProps<{
  control: EditorControl
}>()
</script>

<template>
  <div id="panel-dashboard" class="animate-in slide-in-from-left-4 duration-300">
    <div id="interactive-mode-banner">
      <h3 class="banner-title">{{ t('editor.interactiveMode') }}</h3>
      <p>{{ t('editor.clickToEdit') }}</p>
    </div>
    
    <div id="global-actions">
      <h3 class="section-title">{{ t('editor.globalActions') }}</h3>
      <button 
        @click="control.handleReset ? control.handleReset() : (control.previewContent = null)"
        id="btn-back"
      >
        <span class="btn-content"><Undo2 class="w-4 h-4" /> {{ t('editor.back') }}</span>
      </button>
      
      <button
        @click="control.handleSaveDraft"
        :disabled="control.isSaving"
        id="btn-save"
      >
          <span v-if="control.isSaving" class="btn-content"><Loader2 class="animate-spin w-4 h-4" /> {{ t('editor.saving') }}</span>
          <span v-else class="btn-content"><Save class="w-4 h-4" /> {{ t('editor.saveDraft') }}</span>
      </button>

      <button
        @click="control.handlePublish"
        :disabled="control.isPublishing"
        id="btn-publish"
      >
        <span v-if="control.isPublishing" class="btn-content"><Loader2 class="animate-spin w-4 h-4" /> {{ t('editor.publishing') }}</span>
        <span v-else class="btn-content"><Save class="w-4 h-4" /> {{ t('editor.publish') }}</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
#panel-dashboard {
    @apply space-y-6;
}

#interactive-mode-banner {
    @apply p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800;
}

.banner-title {
    @apply font-bold mb-1 flex items-center gap-2;
}

#global-actions {
    @apply border-t border-b border-stone-100 py-4 space-y-4;
}

.section-title {
    @apply text-xs font-bold uppercase text-stone-400;
}

#btn-back {
    @apply w-full py-3 border border-stone-300 text-stone-600 font-bold hover:bg-stone-50 flex items-center justify-center gap-2 transition-colors;
}

#btn-save {
    @apply w-full py-3 text-stone-600 font-bold uppercase tracking-widest transition-all border border-stone-300 hover:bg-stone-50;
}

#btn-publish {
    @apply w-full py-4 text-white font-black uppercase tracking-widest transition-all bg-red-600 hover:bg-red-700 shadow-[4px_4px_0px_0px_#991b1b] active:translate-y-1 active:shadow-none;
}

.btn-content {
    @apply flex items-center justify-center gap-2;
}
</style>
