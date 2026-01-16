<script setup lang="ts">
interface Props {
  selectedSectionId: string | null
  selectedLabel: string | null
  currentStyles?: SectionStyles
}

const { t, locale } = useI18n()

const props = defineProps<Props>()
const emit = defineEmits<{
  'update:style': [sectionId: string, styles: SectionStyles]
}>()

interface SectionStyles {
  fontSize?: string
  lineHeight?: string
  offsetX?: string
  offsetY?: string
}

const styles = ref<SectionStyles>({
  fontSize: '16px',
  lineHeight: '1.8',
  offsetX: '0px',
  offsetY: '0px'
})

// Sync styles when selection changes
watch(() => props.selectedSectionId, () => {
  if (props.selectedSectionId) {
    const current = props.currentStyles || {}
    styles.value = {
      fontSize: current.fontSize || '16px',
      lineHeight: current.lineHeight || '1.8',
      offsetX: current.offsetX || '0px',
      offsetY: current.offsetY || '0px'
    }
  }
}, { immediate: true })

function updateStyle(key: keyof SectionStyles, value: string) {
  styles.value[key] = value
  if (props.selectedSectionId) {
    console.log('Updating style:', props.selectedSectionId, key, value)
    emit('update:style', props.selectedSectionId, { ...styles.value })
  }
}

function handleRangeInput(key: keyof SectionStyles, event: Event, suffix = '') {
  const target = event.target as HTMLInputElement
  const value = target.value + suffix
  updateStyle(key, value)
}

function handleTextInput(key: keyof SectionStyles, event: Event) {
  const target = event.target as HTMLInputElement
  updateStyle(key, target.value)
}

function reset() {
  styles.value = {
    fontSize: '16px',
    lineHeight: '1.8',
    offsetX: '0px',
    offsetY: '0px'
  }
  if (props.selectedSectionId) {
    emit('update:style', props.selectedSectionId, { ...styles.value })
  }
}
</script>

<template>
  <div v-if="selectedSectionId" id="style-adjuster" class="border-t p-4 space-y-3">
    <div id="style-adjuster-header" class="flex items-center justify-between mb-2">
      <h3 class="font-bold text-sm">
        {{ selectedLabel || 'Section' }} {{ t('editor.styleTitle') }}
      </h3>
      <button 
        @click="reset"
        id="btn-reset-style"
        class="text-xs px-2 py-1 rounded border hover:bg-gray-100"
      >
        {{ t('editor.reset') }}
      </button>
    </div>

    <!-- Font Size -->
    <div class="style-control">
      <label class="text-xs font-semibold">{{ t('editor.fontSize') }}</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          :value="parseInt(styles.fontSize || '16')"
          @input="handleRangeInput('fontSize', $event, 'px')"
          min="8" 
          max="32" 
          step="0.5"
          class="flex-1 range-slider"
        />
        <input 
          type="text" 
          :value="styles.fontSize"
          @input="handleTextInput('fontSize', $event)"
          class="w-16 text-xs px-2 py-1 border rounded text-input"
        />
      </div>
    </div>

    <!-- Line Height -->
    <div class="style-control">
      <label class="text-xs font-semibold">{{ t('editor.lineHeight') }}</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          :value="parseFloat(styles.lineHeight || '1.8')"
          @input="handleRangeInput('lineHeight', $event)"
          min="1" 
          max="3" 
          step="0.1"
          class="flex-1 range-slider"
        />
        <input 
          type="text" 
          :value="styles.lineHeight"
          @input="handleTextInput('lineHeight', $event)"
          class="w-16 text-xs px-2 py-1 border rounded text-input"
        />
      </div>
    </div>

    <!-- Offset X -->
    <div class="style-control">
      <label class="text-xs font-semibold">{{ t('editor.offsetX') }}</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          :value="parseInt(styles.offsetX || '0')"
          @input="handleRangeInput('offsetX', $event, 'px')"
          min="-50" 
          max="50" 
          step="1"
          class="flex-1 range-slider"
        />
        <input 
          type="text" 
          :value="styles.offsetX"
          @input="handleTextInput('offsetX', $event)"
          class="w-16 text-xs px-2 py-1 border rounded text-input"
        />
      </div>
    </div>

    <!-- Offset Y -->
    <div class="style-control">
      <label class="text-xs font-semibold">{{ t('editor.offsetY') }}</label>
      <div class="flex items-center gap-2">
        <input 
          type="range" 
          :value="parseInt(styles.offsetY || '0')"
          @input="handleRangeInput('offsetY', $event, 'px')"
          min="-50" 
          max="50" 
          step="1"
          class="flex-1 range-slider"
        />
        <input 
          type="text" 
          :value="styles.offsetY"
          @input="handleTextInput('offsetY', $event)"
          class="w-16 text-xs px-2 py-1 border rounded text-input"
        />
      </div>
    </div>
  </div>

  <div v-else id="style-adjuster-empty" class="border-t p-4 text-center text-sm text-gray-500">
    {{ t('editor.selectSectionToAdjust') }}
  </div>
</template>

<style scoped>
.style-control {
  @apply space-y-1 mb-2;
}

.style-control label {
  @apply block text-stone-500;
}

#style-adjuster {
  @apply bg-stone-50;
  max-height: 400px;
  overflow-y: auto;
}

/* Base styles for inputs using stone palette to match dashboard */
.text-input {
    @apply border-stone-200 text-stone-600 focus:border-stone-400 outline-none;
}

.range-slider {
    @apply h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer;
}

#btn-reset-style {
    @apply text-stone-400 border-stone-200 hover:bg-stone-100;
}
</style>
