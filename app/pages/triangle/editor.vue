

<script setup lang="ts">
import { Lock, Layout, Loader2, Wand2, Save, Upload, Undo2, MousePointerClick, ArrowLeft, BookOpen, RefreshCw, Calendar } from 'lucide-vue-next'
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
} = useNewsEditor(PublicationType.TRIANGLE)

// UI specific ref for scale to bind to slider
const currentScale = computed({
    get: () => getScale(),
    set: (val: number) => updateScale(val)
})

const displayTheme = computed(() => theme.value || ThemeType.CLASSIC_RED)

const THEME_NAMES: Record<ThemeType, string> = {
  [ThemeType.CLASSIC_RED]: '经典赤红',
  [ThemeType.DEEP_BLUE]: '深邃湛蓝',
  [ThemeType.EMERALD]: '复古翡翠',
  [ThemeType.NOIR]: '黑色电影'
}

onMounted(async () => {
    theme.value = ThemeType.CLASSIC_RED
    await init()
})

function handleManualCreate() {
    createBlankTemplate({
    date: date.value,
    location: '北京',
    frontPage: {
      headline: '点击编辑标题',
      mainStory: '点击编辑主要新闻内容...',
      mainImagePrompt: '',
      newsSnippets: [
        { title: '快讯标题 1', content: '点击编辑快讯内容...' },
        { title: '快讯标题 2', content: '点击编辑快讯内容...' },
        { title: '快讯标题 3', content: '点击编辑快讯内容...' }
      ],
      column1: { title: '专栏 1', content: '点击编辑专栏内容...' },
      column2: { title: '专栏 2', content: '点击编辑专栏内容...' },
      weirdNews: { title: '趣闻', content: '点击编辑趣闻内容...' }
    },
    secondPage: {
      editorial: { title: '社论标题', content: '点击编辑社论内容...' },
      culture: { title: '文化专栏', content: '点击编辑文化专栏内容...' },
      classifieds: [
        { title: '分类广告 1', content: '点击编辑广告内容...' },
        { title: '分类广告 2', content: '点击编辑广告内容...' },
        { title: '分类广告 3', content: '点击编辑广告内容...' }
      ],
      horoscope: '点击编辑今日箴言...'
    }
  }, ThemeType.CLASSIC_RED)
}

function handleLoadLatest() {
    alert("请从下方列表中选择最新一期报纸。")
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
  <div class="flex flex-col md:flex-row h-screen bg-stone-100">
    <!-- Sidebar Controls -->
    <div class="w-full md:w-96 bg-white shadow-xl flex flex-col z-20 border-r border-stone-200 h-full relative">
      <div class="p-6 pb-4 border-b border-stone-100">
        <h2 class="text-2xl font-black uppercase tracking-tighter text-stone-800 flex items-center gap-2">
          <Lock class="w-5 h-5" /> 三角日报编辑器
        </h2>
        <p class="text-xs font-serif text-stone-500">Triangle CMS v4.0 • Nuxt Edition</p>
      </div>

      <div class="flex-1 overflow-y-auto p-6">
        <!-- STATE 1: GENERATOR (No Content) -->
        <PanelGenerator
            v-if="!previewContent"
            :control="state"
            :show-theme-selector="true"
            @manual-create="handleManualCreate"
        />

        <!-- STATE 2: DASHBOARD (Content Exists, Nothing Selected) -->
        <PanelDashboard
            v-else-if="!selectedPath"
            :control="state"
        />

        <!-- STATE 3: EDITOR (Specific Section Selected) -->
        <PanelEdit
            v-else
            :control="state"
            publication-type="TRIANGLE"
        />
      </div>
    </div>

    <!-- Preview Area -->
    <div class="flex-1 bg-stone-200 p-8 overflow-auto flex flex-col items-center justify-center" @click="selectedPath = null">
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center text-stone-400 gap-4">
        <Layout class="w-16 h-16 opacity-20" />
        <p class="font-serif">在此处预览生成的新闻日报</p>
      </div>
      <template v-else>
        <!-- Side-by-side newspaper layout with center fold -->
        <div class="relative flex gap-1 scale-[0.35] sm:scale-[0.45] lg:scale-[0.55] xl:scale-[0.65] origin-center shadow-2xl">
          <!-- Page 1 (Left) -->
          <div class="shadow-xl">
            <Newspaper
              :data="previewContent.textData"
              :theme="displayTheme"
              :publication-type="PublicationType.TRIANGLE"
              :image-src="previewContent.imageBase64"
              :page="1"
              :on-section-select="handleSectionSelect"
              :selected-section-id="selectedPath"
            />
          </div>

          <!-- Center fold effect -->
          <div class="w-2 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 shadow-inner"></div>

          <!-- Page 2 (Right) -->
          <div class="shadow-xl">
            <Newspaper
              :data="previewContent.textData"
              :theme="displayTheme"
              :publication-type="PublicationType.TRIANGLE"
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
