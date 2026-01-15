<script setup lang="ts">
import PanelGenerator from '~/components/editor/PanelGenerator.vue'
import PanelDashboard from '~/components/editor/PanelDashboard.vue'
import PanelEdit from '~/components/editor/PanelEdit.vue'
import { ThemeType, PublicationType } from '~/types'
import { getEditorConfig } from '~/config/editorConfig'

const { t } = useI18n()

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
    handleImageUpload
} = useNewsEditor(config.value.publicationType)

// Set default theme from config

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
    :class="config.styles.editorBg"
    :data-theme="config.styles.themeKey"
  >
    <!-- Sidebar Controls -->
    <div 
      class="w-full md:w-96 shadow-xl flex flex-col z-20 border-r h-full relative"
      :class="config.styles.sidebar"
    >
      <div class="p-6 pb-4 border-b" :class="config.styles.sidebarBorder">
        <h2 class="text-2xl font-black uppercase tracking-tighter flex items-center gap-2"
            :class="config.styles.sidebarTitle">
          <component :is="config.icon" class="w-5 h-5" />
          {{ t(`publication.${publication}.editor.title`) }}
        </h2>
        <p class="text-xs font-serif" :class="config.styles.sidebarSubtitle">
          {{ t(`publication.${publication}.editor.subtitle`) }}
        </p>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <!-- STATE 1: GENERATOR -->
        <PanelGenerator
            v-if="!previewContent"
            :control="state as any"
            :publication-type="publication.toUpperCase() as 'TRIANGLE' | 'DUSKVOL' | 'ADVENTURER'"
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
            :publication-type="publication.toUpperCase() as 'TRIANGLE' | 'DUSKVOL' | 'ADVENTURER'"
        />
      </div>
    </div>

    <!-- Preview Area -->
    <div 
      class="flex-1 p-8 overflow-auto flex flex-col items-center justify-center"
      :class="config.styles.previewArea"
      @click="selectedPath = null"
    >
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center gap-4"
           :class="config.styles.previewText">
        <component :is="config.icon" class="w-16 h-16 opacity-20" />
        <p class="font-serif" :class="config.isDark ? 'italic' : ''">{{ t(`publication.${publication}.editor.emptyState`) }}</p>
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
            :class="config.styles.centerFold"
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

/* Parchment theme overrides for Adventurer */
[data-theme="parchment"] :deep(#welcome-message) {
    @apply bg-[#d9cdb8] border-[#c4a97a] text-[#5c4033];
}
[data-theme="parchment"] :deep(.input-label) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.topic-input),
[data-theme="parchment"] :deep(.date-input) {
    @apply bg-[#fdfbf7] border-[#d2b48c] focus:border-[#8b5a2b] text-[#5c4033];
}
[data-theme="parchment"] :deep(#btn-generate) {
    @apply bg-[#8b4513] hover:bg-[#654321] shadow-[4px_4px_0px_0px_#c4a97a];
}
[data-theme="parchment"] :deep(#btn-manual) {
    @apply text-[#8b5a2b] border-[#d2b48c] hover:bg-[#d9cdb8];
}
[data-theme="parchment"] :deep(#history-section) {
    @apply border-[#d2b48c];
}
[data-theme="parchment"] :deep(.history-title) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.issue-item) {
    @apply bg-[#fdfbf7] hover:bg-[#e6dcc3] border-[#d2b48c];
}
[data-theme="parchment"] :deep(.issue-headline) {
    @apply text-[#5c4033];
}
[data-theme="parchment"] :deep(.issue-date) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.issue-time) {
    @apply bg-[#e6dcc3] text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.empty-msg) {
    @apply text-[#8b5a2b];
}

/* Dashboard Overrides - Parchment */
[data-theme="parchment"] :deep(#interactive-mode-banner) {
    @apply bg-[#d9cdb8] border-[#c4a97a] text-[#5c4033];
}
[data-theme="parchment"] :deep(#global-actions) {
    @apply border-[#d2b48c];
}
[data-theme="parchment"] :deep(.section-title) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(#btn-reset),
[data-theme="parchment"] :deep(#btn-back) {
    @apply border-[#d2b48c] text-[#8b5a2b] hover:bg-[#d9cdb8];
}
[data-theme="parchment"] :deep(#btn-save) {
    @apply text-[#5c4033] border-[#d2b48c] hover:bg-[#d9cdb8];
}
[data-theme="parchment"] :deep(#btn-publish) {
    @apply bg-[#8b4513] hover:bg-[#654321] shadow-[4px_4px_0px_0px_#c4a97a];
}

/* Edit Panel Overrides - Parchment */
[data-theme="parchment"] :deep(#btn-quick-save) {
    @apply text-[#8b5a2b] hover:text-[#5c4033] border-[#d2b48c] bg-[#fdfbf7];
}
[data-theme="parchment"] :deep(#section-indicator) {
    @apply border-[#d2b48c];
}
[data-theme="parchment"] :deep(.indicator-dot) {
    @apply bg-[#8b4513];
}
[data-theme="parchment"] :deep(.indicator-text) {
    @apply text-[#8b4513];
}
[data-theme="parchment"] :deep(#layout-control) {
    @apply bg-[#d9cdb8]/50 border-[#d2b48c];
}
[data-theme="parchment"] :deep(.layout-header label) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.layout-header button) {
    @apply text-[#8b4513] hover:text-[#654321];
}
[data-theme="parchment"] :deep(.range-slider) {
    @apply bg-[#d2b48c];
}
[data-theme="parchment"] :deep(.field-group label) {
    @apply text-[#8b5a2b];
}
[data-theme="parchment"] :deep(.text-input),
[data-theme="parchment"] :deep(.text-area) {
    @apply bg-[#fdfbf7] border-[#d2b48c] text-[#5c4033];
}
[data-theme="parchment"] :deep(.upload-box) {
    @apply bg-[#d9cdb8] hover:bg-[#c4a97a] border-[#8b5a2b] text-[#5c4033];
}
[data-theme="parchment"] :deep(.ai-input-group input) {
    @apply bg-[#fdfbf7] border-[#d2b48c] text-[#5c4033];
}
[data-theme="parchment"] :deep(.ai-input-group button) {
    @apply bg-[#8b5a2b] hover:bg-[#654321];
}
[data-theme="parchment"] :deep(#tip-box) {
    @apply bg-[#d9cdb8]/50 text-[#8b5a2b] border-[#d2b48c];
}
</style>
