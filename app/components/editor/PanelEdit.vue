<script setup lang="ts">
import { 
  ArrowLeft, Save, Loader2, Upload, Wand2 
} from 'lucide-vue-next'

interface EditorControl {
  selectedPath: any
  selectedLabel: any
  isSaving: any
  isRewriting: any
  rewritePrompt: any
  previewContent: any
  getValue: (path: string) => any
  updateTextData: (path: string, field: string | null, value: any) => void
  handleSmartRewrite: (text: string) => Promise<string>
  handleImageUpload: (e: Event) => void
  handleSaveDraft: () => Promise<boolean>
  updateScale: (val: number) => void
  getScale: () => number
}

const props = defineProps<{
  control: EditorControl
  publicationType?: 'TRIANGLE' | 'DUSKVOL'
}>()

const currentScale = computed({
    get: () => props.control.getScale(),
    set: (val: number) => props.control.updateScale(val)
})

const isDuskvol = computed(() => props.publicationType === 'DUSKVOL')

// Helper to avoid prop drilling for big objects if not needed, but here we just use control
</script>

<template>
  <div id="panel-edit" class="animate-in slide-in-from-right-4 duration-300">
    <div id="header-actions">
        <button 
            @click="control.selectedPath = null"
            id="btn-back"
        >
            <ArrowLeft class="w-3 h-3" /> Back
        </button>
          <button
            @click="control.handleSaveDraft"
            :disabled="control.isSaving"
            id="btn-quick-save"
            >
            <Save v-if="!control.isSaving" class="w-3 h-3" />
            <Loader2 v-else class="w-3 h-3 animate-spin" />
            Save
        </button>
    </div>

    <div id="section-indicator">
      <span class="indicator-dot"></span>
      <h3 class="indicator-text">
        {{ control.selectedLabel }}
      </h3>
    </div>

    <!-- Typography Control -->
    <div id="layout-control">
        <div class="layout-header">
            <label>Layout Weight: {{ currentScale.toFixed(1) }}</label>
            <button @click="currentScale = 1" title="Reset Size">Reset</button>
        </div>
        <input 
            type="range" 
            v-model.number="currentScale" 
            min="0.5" 
            max="2.0" 
            step="0.1"
            class="range-slider"
        >
    </div>


    <!-- Date Editor -->
    <div v-if="control.selectedPath === 'date'" class="field-group">
      <label>Date</label>
      <input 
        class="text-input" 
        :value="control.previewContent?.textData.date" 
        @input="(e) => control.updateTextData('date', null, (e.target as HTMLInputElement).value)" 
      />
    </div>

    <!-- Image Upload -->
    <div v-else-if="control.selectedPath === 'image'" class="field-group">
      <label>Main Image</label>
      <label class="upload-box">
        <input type="file" class="hidden" accept="image/*" @change="control.handleImageUpload" />
        <Upload class="w-6 h-6" /> 
        <span>Upload new image</span>
      </label>
      <p v-if="!isDuskvol" class="help-text">目前暂不支持 AI 局部重绘图片，请上传本地图片替代。</p>
    </div>

    <!-- Object Editor -->
    <template v-else>
      <div v-if="control.getValue(control.selectedPath) && typeof control.getValue(control.selectedPath) === 'object'" class="space-y-6">
        <!-- Title -->
        <div class="field-group">
          <label>Title</label>
          <input 
            class="text-input font-bold" 
            :value="control.getValue(control.selectedPath).title" 
            @input="(e) => control.updateTextData(control.selectedPath!, 'title', (e.target as HTMLInputElement).value)" 
          />
          <div class="ai-input-group">
            <input 
              type="text" 
              placeholder="AI instruction..." 
              v-model="control.rewritePrompt"
              @keydown.enter="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!).title); control.updateTextData(control.selectedPath!, 'title', t) }"
            />
            <button 
              @click="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!).title); control.updateTextData(control.selectedPath!, 'title', t) }"
              :disabled="control.isRewriting || !control.rewritePrompt"
            >
              <Loader2 v-if="control.isRewriting" class="w-3 h-3 animate-spin" />
              <Wand2 v-else class="w-3 h-3" />
            </button>
          </div>
        </div>

        <!-- Content -->
        <div class="field-group">
          <div class="flex justify-between items-baseline">
            <label>Content</label>
            <div class="help-text-mono">MD: **bold** *italic* # Large</div>
          </div>
          <textarea 
            class="text-area h-48" 
            :value="control.getValue(control.selectedPath).content" 
            @input="(e) => control.updateTextData(control.selectedPath!, 'content', (e.target as HTMLTextAreaElement).value)" 
          />
          <div class="ai-input-group">
            <input 
              type="text" 
              placeholder="AI instruction..." 
              v-model="control.rewritePrompt"
              @keydown.enter="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!).content); control.updateTextData(control.selectedPath!, 'content', t) }"
            />
            <button 
              @click="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!).content); control.updateTextData(control.selectedPath!, 'content', t) }"
              :disabled="control.isRewriting || !control.rewritePrompt"
            >
              <Loader2 v-if="control.isRewriting" class="w-3 h-3 animate-spin" />
              <Wand2 v-else class="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
      
      <!-- String Editor -->
      <div v-else class="field-group">
        <div class="flex justify-between items-baseline">
          <label>Text Content</label>
          <div class="help-text-mono">MD: **bold** *italic*</div>
        </div>
        <textarea 
          class="text-area h-32" 
          :value="control.getValue(control.selectedPath)" 
          @input="(e) => control.updateTextData(control.selectedPath!, null, (e.target as HTMLTextAreaElement).value)" 
        />
        <div class="ai-input-group">
          <input 
            type="text" 
            placeholder="AI instruction..." 
            v-model="control.rewritePrompt"
            @keydown.enter="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!)); control.updateTextData(control.selectedPath!, null, t) }"
          />
          <button 
            @click="async () => { const t = await control.handleSmartRewrite(control.getValue(control.selectedPath!)); control.updateTextData(control.selectedPath!, null, t) }"
            :disabled="control.isRewriting || !control.rewritePrompt"
          >
            <Loader2 v-if="control.isRewriting" class="w-3 h-3 animate-spin" />
            <Wand2 v-else class="w-3 h-3" />
          </button>
        </div>
      </div>
    </template>

    <div id="tip-box">
      Tips: Changes are reflected in real-time. Click outside to finish.
    </div>
  </div>
</template>

<style scoped>
#panel-edit {
    @apply space-y-4;
}

#header-actions {
    @apply flex justify-between items-center mb-4;
}

#btn-back {
    @apply flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-800 transition-colors;
}

#btn-quick-save {
    @apply flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 border border-stone-200 px-2 py-1 rounded bg-white transition-all;
}

#section-indicator {
    @apply flex items-center gap-2 mb-4 pb-2 border-b border-stone-200;
}

.indicator-dot {
    @apply w-2 h-2 rounded-full bg-red-500 animate-pulse;
}

.indicator-text {
    @apply font-black uppercase tracking-tight text-lg text-red-600 truncate;
}

#layout-control {
    @apply bg-stone-50 p-3 rounded border border-stone-200;
}

.layout-header {
    @apply flex justify-between items-center mb-1;
}

.layout-header label {
    @apply text-[10px] font-bold uppercase text-stone-500;
}

.layout-header button {
    @apply text-[10px] text-red-400 hover:text-red-300;
}

.range-slider {
    @apply w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer;
}

.field-group {
    @apply space-y-1;
}

.field-group label {
    @apply block text-xs font-bold uppercase text-stone-400;
}

.text-input {
    @apply w-full p-2 border text-sm border-stone-200 focus:border-red-500 outline-none;
}

.text-area {
    @apply w-full p-2 border text-sm font-mono border-stone-200 focus:border-red-500 outline-none;
}

.help-text {
    @apply text-[10px] text-stone-400;
}

.help-text-mono {
    @apply text-[10px] text-stone-400 font-mono;
}

.upload-box {
    @apply block flex-1 cursor-pointer bg-stone-100 hover:bg-stone-200 p-8 text-center text-xs font-bold border-2 border-dashed border-stone-300 rounded text-stone-600 flex flex-col items-center gap-2 transition-colors;
}

.ai-input-group {
    @apply flex gap-2 mt-1;
}

.ai-input-group input {
    @apply flex-1 text-xs border border-stone-200 p-1 px-2 rounded outline-none focus:border-stone-400;
}

.ai-input-group button {
    @apply bg-stone-800 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-black disabled:opacity-50 transition-colors;
}

#tip-box {
    @apply p-3 bg-stone-50 text-[10px] text-stone-400 mt-8 rounded border border-stone-100;
}

/* Duskvol Overrides */
/* We can use a class applied to the root if isDuskvol, or strict CSS variables. 
   For now, since we are moving towards ID based, we can use specific overrides or scoped styles logic. 
   However, strictly mapping "colors" via CSS classes might be cleaner if we want to support multiple themes easily.
   Given the requirement, I'll stick to a clean base and maybe add a class for dusky mode.
*/
</style>
