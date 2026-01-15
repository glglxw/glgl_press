<script setup lang="ts">
import PanelGenerator from '~/components/editor/PanelGenerator.vue'
import PanelDashboard from '~/components/editor/PanelDashboard.vue'
import PanelEdit from '~/components/editor/PanelEdit.vue'
import { ThemeType, PublicationType } from '~/types'
import { getEditorConfig } from '~/config/editorConfig'

const route = useRoute()
const publication = computed(() => (route.params.publication as string) || 'triangle')
const config = computed(() => getEditorConfig(publication.value))

const {
    topic, date, theme, previewContent, isPublishing, isSaving,
    selectedPath, selectedLabel, isRewriting, rewritePrompt,
    loading, loadingStep, allIssues, loadingIssues,
    init, loadIssueList, createBlankTemplate, handleGenerate,
    handlePublish, handleSaveDraft, handleSelectIssue, getValue,
    updateTextData, handleSectionSelect, handleSmartRewrite,
    handleImageUpload, updateScale, getScale
} = useNewsEditor(config.value.publicationType)

// UI specific ref for scale to bind to slider
const currentScale = computed({
    get: () => getScale(),
    set: (val: number) => updateScale(val)
})

const displayTheme = computed(() => theme.value || config.value.defaultTheme)

onMounted(async () => {
    theme.value = config.value.defaultTheme
    await init()
})

function handleManualCreate() {
    const template = { ...config.value.blankTemplate }
    template.date = date.value
    createBlankTemplate(template, config.value.defaultTheme)
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
  <div 
    class="flex flex-col md:flex-row h-screen" 
    :class="config.isDark ? 'bg-stone-900' : 'bg-stone-100'"
    :data-theme="config.isDark ? 'dark' : 'light'"
  >
    <!-- Sidebar Controls -->
    <div 
      class="w-full md:w-96 shadow-xl flex flex-col z-20 border-r h-full relative"
      :class="config.isDark 
        ? 'bg-stone-800 border-stone-700 text-stone-200' 
        : 'bg-white border-stone-200'"
    >
      <div class="p-6 pb-4 border-b" :class="config.isDark ? 'border-stone-700' : 'border-stone-100'">
        <h2 class="text-2xl font-black uppercase tracking-tighter flex items-center gap-2"
            :class="config.isDark ? 'text-stone-100' : 'text-stone-800'">
          <component :is="config.icon" class="w-5 h-5" />
          {{ config.title }}
        </h2>
        <p class="text-xs font-serif" :class="config.isDark ? 'text-stone-400 italic' : 'text-stone-500'">
          {{ config.subtitle }}
        </p>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <!-- STATE 1: GENERATOR -->
        <PanelGenerator
            v-if="!previewContent"
            :control="state as any"
            :show-theme-selector="config.showThemeSelector"
            :publication-type="publication.toUpperCase() as 'TRIANGLE' | 'DUSKVOL'"
            @manual-create="handleManualCreate"
        />

        <!-- STATE 2: DASHBOARD -->
        <PanelDashboard
            v-else-if="!selectedPath"
            :control="state as any"
        />

        <!-- STATE 3: EDITOR -->
        <PanelEdit
            v-else
            :control="state as any"
            :publication-type="publication.toUpperCase() as 'TRIANGLE' | 'DUSKVOL'"
        />
      </div>
    </div>

    <!-- Preview Area -->
    <div 
      class="flex-1 p-8 overflow-auto flex flex-col items-center justify-center"
      :class="config.isDark ? 'bg-stone-950' : 'bg-stone-200'"
      @click="selectedPath = null"
    >
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center gap-4"
           :class="config.isDark ? 'text-stone-600' : 'text-stone-400'">
        <component :is="config.icon" class="w-16 h-16 opacity-20" />
        <p class="font-serif" :class="config.isDark ? 'italic' : ''">{{ config.emptyStateText }}</p>
      </div>
      <template v-else>
        <!-- Side-by-side newspaper layout with center fold -->
        <div class="relative flex gap-1 scale-[0.35] sm:scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] origin-center shadow-2xl">
          <!-- Page 1 (Left) -->
          <div class="shadow-xl">
            <Newspaper
              :data="previewContent.textData"
              :theme="displayTheme"
              :publication-type="config.publicationType"
              :image-src="previewContent.imageBase64"
              :page="1"
              :on-section-select="handleSectionSelect"
              :selected-section-id="selectedPath"
            />
          </div>

          <!-- Center fold effect -->
          <div 
            class="w-2 shadow-inner"
            :class="config.isDark 
              ? 'bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700' 
              : 'bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400'"
          ></div>

          <!-- Page 2 (Right) -->
          <div class="shadow-xl">
            <Newspaper
              :data="previewContent.textData"
              :theme="displayTheme"
              :publication-type="config.publicationType"
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
/* Dark theme overrides for child components */
[data-theme="dark"] :deep(#welcome-message) {
    @apply bg-stone-700/50 border-stone-600 text-stone-300;
}
[data-theme="dark"] :deep(.input-label) {
    @apply text-stone-400;
}
[data-theme="dark"] :deep(.topic-input),
[data-theme="dark"] :deep(.date-input) {
    @apply bg-stone-700 border-stone-600 focus:border-stone-400 text-stone-100;
}
[data-theme="dark"] :deep(#btn-generate) {
    @apply bg-stone-600 hover:bg-stone-500 shadow-[4px_4px_0px_0px_#1c1917];
}
[data-theme="dark"] :deep(#btn-manual) {
    @apply text-stone-400 border-stone-600 hover:bg-stone-700;
}
[data-theme="dark"] :deep(#history-section) {
    @apply border-stone-700;
}
[data-theme="dark"] :deep(.history-title) {
    @apply text-stone-500;
}
[data-theme="dark"] :deep(.issue-item) {
    @apply bg-stone-700 hover:bg-stone-600 border-stone-600;
}
[data-theme="dark"] :deep(.issue-headline) {
    @apply text-stone-300;
}
[data-theme="dark"] :deep(.issue-date) {
    @apply text-stone-500;
}
[data-theme="dark"] :deep(.issue-time) {
    @apply bg-stone-600 text-stone-500;
}
[data-theme="dark"] :deep(.empty-msg) {
    @apply text-stone-500;
}

/* Dashboard Overrides */
[data-theme="dark"] :deep(#interactive-mode-banner) {
    @apply bg-stone-700/50 border-stone-600 text-stone-300;
}
[data-theme="dark"] :deep(#global-actions) {
    @apply border-stone-700;
}
[data-theme="dark"] :deep(.section-title) {
    @apply text-stone-500;
}
[data-theme="dark"] :deep(#btn-reset) {
    @apply border-stone-600 text-stone-400 hover:bg-stone-700;
}
[data-theme="dark"] :deep(#btn-save) {
    @apply text-stone-300 border-stone-600 hover:bg-stone-700;
}
[data-theme="dark"] :deep(#btn-publish) {
    @apply bg-stone-500 hover:bg-stone-400 shadow-[4px_4px_0px_0px_#0c0a09];
}

/* Edit Panel Overrides */
[data-theme="dark"] :deep(#btn-back) {
    @apply text-stone-500 hover:text-stone-300;
}
[data-theme="dark"] :deep(#btn-quick-save) {
    @apply text-stone-500 hover:text-stone-300 border-stone-700 bg-stone-800;
}
[data-theme="dark"] :deep(#section-indicator) {
    @apply border-stone-700;
}
[data-theme="dark"] :deep(.indicator-dot) {
    @apply bg-blue-500;
}
[data-theme="dark"] :deep(.indicator-text) {
    @apply text-blue-400;
}
[data-theme="dark"] :deep(#layout-control) {
    @apply bg-stone-700/30 border-stone-700;
}
[data-theme="dark"] :deep(.layout-header label) {
    @apply text-stone-500;
}
[data-theme="dark"] :deep(.layout-header button) {
    @apply text-blue-400 hover:text-blue-300;
}
[data-theme="dark"] :deep(.range-slider) {
    @apply bg-stone-600;
}
[data-theme="dark"] :deep(.field-group label) {
    @apply text-stone-500;
}
[data-theme="dark"] :deep(.text-input),
[data-theme="dark"] :deep(.text-area) {
    @apply bg-stone-700 border-stone-600 text-stone-100;
}
[data-theme="dark"] :deep(.upload-box) {
    @apply bg-stone-700 hover:bg-stone-600 border-stone-500 text-stone-400;
}
[data-theme="dark"] :deep(.ai-input-group input) {
    @apply bg-stone-700 border-stone-600 text-stone-200;
}
[data-theme="dark"] :deep(.ai-input-group button) {
    @apply bg-stone-600 hover:bg-stone-500;
}
[data-theme="dark"] :deep(#tip-box) {
    @apply bg-stone-700/50 text-stone-500 border-stone-700;
}
</style>
