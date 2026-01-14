<script setup lang="ts">
import { Ghost } from 'lucide-vue-next'
import PanelGenerator from '~/components/editor/PanelGenerator.vue'
import PanelDashboard from '~/components/editor/PanelDashboard.vue'
import PanelEdit from '~/components/editor/PanelEdit.vue'
import { ThemeType, PublicationType, type GeneratedContent, type NewsData } from '~/types'

const { 
    topic, date, theme, previewContent, isPublishing, isSaving,
    selectedPath, selectedLabel, isRewriting, rewritePrompt,
    loading, loadingStep, allIssues, loadingIssues,
    init, loadIssueList, createBlankTemplate, handleGenerate, 
    handlePublish, handleSaveDraft, handleSelectIssue, getValue, 
    updateTextData, handleSectionSelect, handleSmartRewrite, 
    handleImageUpload, updateScale, getScale
} = useNewsEditor(PublicationType.DUSKVOL)

// UI specific ref for scale to bind to slider
const currentScale = computed({
    get: () => getScale(),
    set: (val: number) => updateScale(val)
})

const displayTheme = computed(() => theme.value || ThemeType.NOIR)

onMounted(async () => {
    theme.value = ThemeType.NOIR
    await init()
})

function handleManualCreate() {
    createBlankTemplate({
    date: date.value,
    location: 'Duskvol',
    frontPage: {
      headline: 'Click to Edit Headline',
      mainStory: 'Click to edit main story content...',
      mainImagePrompt: '',
      newsSnippets: [
        { title: 'Whisper 1', content: 'Click to edit whisper...' },
        { title: 'Whisper 2', content: 'Click to edit whisper...' },
        { title: 'Whisper 3', content: 'Click to edit whisper...' }
      ],
      column1: { title: 'Column 1', content: 'Click to edit column content...' },
      column2: { title: 'Column 2', content: 'Click to edit column content...' },
      weirdNews: { title: 'Dark News', content: 'Click to edit dark news...' }
    },
    secondPage: {
      editorial: { title: 'Editorial Title', content: 'Click to edit editorial...' },
      culture: { title: 'Culture', content: 'Click to edit culture section...' },
      classifieds: [
        { title: 'Classified 1', content: 'Click to edit...' },
        { title: 'Classified 2', content: 'Click to edit...' },
        { title: 'Classified 3', content: 'Click to edit...' }
      ],
      horoscope: 'Click to edit dark wisdom...'
    }
  }, ThemeType.NOIR)
}

const state = reactive({
    topic,
    date,
    theme,
    loading,
    loadingStep,
    allIssues,
    loadingIssues,
    previewContent,
    isSaving,
    isPublishing,
    selectedPath,
    selectedLabel,
    isRewriting,
    rewritePrompt,
    
    // Methods
    loadIssueList,
    handleGenerate,
    handleSelectIssue,
    createBlankTemplate,
    handleSaveDraft,
    handlePublish,
    getValue,
    updateTextData,
    handleSmartRewrite,
    handleImageUpload,
    updateScale,
    getScale,
    handleReset: () => {
        previewContent.value = null
        selectedPath.value = null
        topic.value = ''
    }
})
</script>

<template>
  <div class="flex flex-col md:flex-row h-screen bg-stone-900">
    <!-- Sidebar Controls -->
    <div class="w-full md:w-96 bg-stone-800 shadow-xl flex flex-col z-20 border-r border-stone-700 h-full relative text-stone-200">
      <div class="p-6 pb-4 border-b border-stone-700">
        <h2 class="text-2xl font-black uppercase tracking-tighter text-stone-100 flex items-center gap-2">
          <Ghost class="w-5 h-5" /> The Press Room
        </h2>
        <p class="text-xs font-serif text-stone-400 italic">Duskvol Chronicle • Printing Press</p>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <!-- STATE 1: GENERATOR -->
        <PanelGenerator 
            v-if="!previewContent"
            :control="state"
            :show-theme-selector="false"
            publication-type="DUSKVOL"
            @manual-create="handleManualCreate"
        />

        <!-- STATE 2: DASHBOARD -->
        <PanelDashboard
            v-else-if="!selectedPath"
            :control="state"
        />

        <!-- STATE 3: EDITOR -->
        <PanelEdit
            v-else
            :control="state"
            publication-type="DUSKVOL"
        />
      </div>
    </div>

    <!-- Preview Area -->
    <div class="flex-1 bg-stone-950 p-8 overflow-auto flex flex-col items-center justify-center" @click="selectedPath = null">
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center text-stone-600 gap-4">
        <Ghost class="w-16 h-16 opacity-20" />
        <p class="font-serif italic">The printing press awaits...</p>
      </div>
      <template v-else>
        <!-- Side-by-side newspaper layout with center fold -->
        <div class="relative flex gap-1 scale-[0.35] sm:scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] origin-center shadow-2xl">
          <!-- Page 1 (Left) -->
          <div class="shadow-xl">
              <Newspaper 
              :data="previewContent.textData" 
              :theme="displayTheme" 
              :publication-type="PublicationType.DUSKVOL"
              :image-src="previewContent.imageBase64" 
              :page="1" 
              :on-section-select="handleSectionSelect"
              :selected-section-id="selectedPath"
            />
          </div>
          
          <!-- Center fold effect -->
          <div class="w-2 bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 shadow-inner"></div>
          
          <!-- Page 2 (Right) -->
          <div class="shadow-xl">
            <Newspaper 
              :data="previewContent.textData" 
              :theme="displayTheme" 
              :publication-type="PublicationType.DUSKVOL"
              :page="2" 
              :on-section-select="handleSectionSelect"
              :selected-section-id="selectedPath"
            />
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
/* Duskvol Theme Overrides */
:deep(#welcome-message) {
    @apply bg-stone-700/50 border-stone-600 text-stone-300;
}
:deep(.input-label) {
    @apply text-stone-400;
}
:deep(.topic-input), :deep(.date-input) {
    @apply bg-stone-700 border-stone-600 focus:border-stone-400 text-stone-100;
}
:deep(#btn-generate) {
    @apply bg-stone-600 hover:bg-stone-500 shadow-[4px_4px_0px_0px_#1c1917];
}
:deep(#btn-manual) {
    @apply text-stone-400 border-stone-600 hover:bg-stone-700;
}
:deep(#history-section) {
    @apply border-stone-700;
}
:deep(.history-title) {
    @apply text-stone-500;
}
:deep(.issue-item) {
    @apply bg-stone-700 hover:bg-stone-600 border-stone-600;
}
:deep(.issue-headline) {
    @apply text-stone-300;
}
:deep(.issue-date) {
    @apply text-stone-500;
}
:deep(.issue-time) {
    @apply bg-stone-600 text-stone-500;
}
:deep(.empty-msg) {
    @apply text-stone-500;
}

/* Dashboard Overrides */
:deep(#interactive-mode-banner) {
    @apply bg-stone-700/50 border-stone-600 text-stone-300;
}
:deep(#global-actions) {
    @apply border-stone-700;
}
:deep(.section-title) {
    @apply text-stone-500;
}
:deep(#btn-reset) {
    @apply border-stone-600 text-stone-400 hover:bg-stone-700;
}
:deep(#btn-save) {
    @apply text-stone-300 border-stone-600 hover:bg-stone-700;
}
:deep(#btn-publish) {
    @apply bg-stone-500 hover:bg-stone-400 shadow-[4px_4px_0px_0px_#0c0a09];
}

/* Edit Panel Overrides */
:deep(#btn-back) {
    @apply text-stone-500 hover:text-stone-300;
}
:deep(#btn-quick-save) {
    @apply text-stone-500 hover:text-stone-300 border-stone-700 bg-stone-800;
}
:deep(#section-indicator) {
    @apply border-stone-700;
}
:deep(.indicator-dot) {
    @apply bg-blue-500;
}
:deep(.indicator-text) {
    @apply text-blue-400;
}
:deep(#layout-control) {
    @apply bg-stone-700/30 border-stone-700;
}
:deep(.layout-header label) {
    @apply text-stone-500;
}
:deep(.layout-header button) {
    @apply text-blue-400 hover:text-blue-300;
}
:deep(.range-slider) {
    @apply bg-stone-600;
}
:deep(.field-group label) {
    @apply text-stone-500;
}
:deep(.text-input), :deep(.text-area) {
    @apply bg-stone-700 border-stone-600 text-stone-100;
}
:deep(.upload-box) {
    @apply bg-stone-700 hover:bg-stone-600 border-stone-500 text-stone-400;
}
:deep(.ai-input-group input) {
    @apply bg-stone-700 border-stone-600 text-stone-200;
}
:deep(.ai-input-group button) {
    @apply bg-stone-600 hover:bg-stone-500;
}
:deep(#tip-box) {
    @apply bg-stone-700/50 text-stone-500 border-stone-700;
}
</style>
