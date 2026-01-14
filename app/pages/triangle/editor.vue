<script setup lang="ts">
import { 
  Loader2, Wand2, Save, Layout, Lock, Upload, Undo2, 
  MousePointerClick, ArrowLeft, BookOpen, RefreshCw, Calendar 
} from 'lucide-vue-next'
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
    // This function was trying to mimic loadIssueList logic but specifically for 'latest'.
    // Since loadIssueList is now available and filters by date, we can just use the first item?
    // But original code had specific getLatestIssue call. useIssues does not expose it via useNewsEditor easily?
    // Actually init() calls loadIssueList. 
    // We can just rely on the list.
    alert("请从下方列表中选择最新一期报纸。")
}
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
        <div v-if="!previewContent" class="space-y-4 animate-in fade-in duration-300">
          <div class="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800">
            <h3 class="font-bold mb-1 flex items-center gap-2"><Layout class="w-4 h-4" /> 开始创建</h3>
            <p>输入主题，AI 将为您生成日报。</p>
          </div>
          
          <div>
            <label class="block text-xs font-bold uppercase mb-1">主题 / Topic</label>
            <textarea 
              v-model="topic"
              class="w-full p-3 bg-stone-50 border-2 border-stone-200 focus:border-red-500 rounded-none outline-none font-serif text-sm h-20 resize-none"
              placeholder="例如：2050年火星殖民地的日常生活..."
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase mb-1">发行日期 / Date</label>
            <input 
              type="date" 
              v-model="date"
              class="w-full p-2 bg-stone-50 border-2 border-stone-200 focus:border-red-500 rounded-none outline-none font-sans"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase mb-1">配色风格 / Theme</label>
            <div class="grid grid-cols-2 gap-2">
              <button
                v-for="t in Object.values(ThemeType)" :key="t"
                @click="theme = t"
                class="p-2 text-xs font-bold border-2 transition-all"
                :class="theme === t ? 'border-black bg-stone-800 text-white' : 'border-stone-200 text-stone-500 hover:border-stone-400'"
              >
                {{ THEME_NAMES[t] }}
              </button>
            </div>
          </div>

          <button
            @click="handleGenerate"
            :disabled="loading"
            class="w-full py-4 text-white font-black uppercase tracking-widest transition-all mt-4"
            :class="loading ? 'bg-stone-400 cursor-not-allowed' : 'bg-stone-800 hover:bg-black shadow-[4px_4px_0px_0px_#ccc] active:translate-y-1 active:shadow-none'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Loader2 class="animate-spin w-4 h-4" /> {{ loadingStep }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Wand2 class="w-4 h-4" /> AI 生成预览
            </span>
          </button>

          <button
            @click="handleManualCreate"
            class="w-full py-2 text-stone-600 font-bold uppercase tracking-widest transition-all mt-2 border-2 border-stone-300 hover:bg-stone-50"
          >
            <span class="flex items-center justify-center gap-2">
              <Layout class="w-4 h-4" /> 手动创建空白模板
            </span>
          </button>

          <button
            @click="handleLoadLatest"
            class="w-full py-2 text-blue-600 font-bold uppercase tracking-widest transition-all mt-2 border-2 border-blue-300 hover:bg-blue-50"
          >
            <span class="flex items-center justify-center gap-2">
              <BookOpen class="w-4 h-4" /> 加载最新发布
            </span>
          </button>
        </div>

        <!-- Previous Chronicles List -->
        <div v-if="!previewContent" class="mt-8 border-t border-stone-100 pt-6">
           <div class="flex items-center justify-between mb-4">
             <h3 class="text-xs font-bold uppercase text-stone-400">Previous Chronicles</h3>
             <button @click="loadIssueList" class="text-stone-400 hover:text-stone-600 transition-colors" title="Refresh">
               <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': loadingIssues }" />
             </button>
           </div>
           
           <div class="space-y-2">
             <div v-if="allIssues.length === 0 && !loadingIssues" class="text-xs text-stone-400 italic">
               No archives found.
             </div>
             <button
               v-for="issue in allIssues"
               :key="issue.id"
               @click="handleSelectIssue(issue)"
               class="w-full text-left p-3 border rounded hover:border-red-300 hover:bg-red-50 transition-all group"
             >
               <div class="flex justify-between items-start mb-1">
                 <span class="text-[10px] font-bold text-stone-500 flex items-center gap-1">
                   <Calendar class="w-3 h-3" /> {{ issue.textData.date }}
                 </span>
                 <span class="text-[10px] bg-stone-100 px-1 rounded text-stone-500">{{ issue.publishedAt ? new Date(issue.publishedAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Draft' }}</span>
               </div>
               <h4 class="text-xs font-bold text-stone-700 leading-tight group-hover:text-red-700 font-sans">
                 {{ issue.textData.frontPage.headline }}
               </h4>
             </button>
           </div>
        </div>

        <!-- STATE 2: DASHBOARD (Content Exists, Nothing Selected) -->
        <div v-else-if="!selectedPath" class="space-y-6 animate-in slide-in-from-left-4 duration-300">
          <div class="p-4 bg-green-50 border border-green-200 rounded text-sm text-green-800">
            <h3 class="font-bold mb-1 flex items-center gap-2"><MousePointerClick class="w-4 h-4" /> 交互编辑模式</h3>
            <p>在右侧预览图中<strong>点击任意板块</strong>，即可进行修改或 AI 重写。</p>
          </div>
          
          <div class="border-t border-b border-stone-100 py-4 space-y-4">
            <h3 class="text-xs font-bold uppercase text-stone-400">全局设置</h3>
            <button 
              @click="previewContent = null"
              class="w-full py-2 border border-stone-300 text-stone-600 text-xs font-bold hover:bg-stone-50 flex items-center justify-center gap-2"
            >
              <Undo2 class="w-3 h-3" /> 重置 / 新建
            </button>
            
            <button
              @click="handleSaveDraft"
              :disabled="isSaving"
              class="w-full py-3 text-stone-600 font-bold uppercase tracking-widest transition-all border border-stone-300 hover:bg-stone-50"
            >
                <span v-if="isSaving" class="flex items-center justify-center gap-2"><Loader2 class="animate-spin w-4 h-4" /> 保存中...</span>
                <span v-else class="flex items-center justify-center gap-2"><Save class="w-4 h-4" /> 保存草稿</span>
            </button>


            <button
              @click="handlePublish"
              :disabled="isPublishing"
              class="w-full py-4 text-white font-black uppercase tracking-widest transition-all"
              :class="isPublishing ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700 shadow-[4px_4px_0px_0px_#991b1b] active:translate-y-1 active:shadow-none'"
            >
              <span v-if="isPublishing" class="flex items-center justify-center gap-2"><Loader2 class="animate-spin w-4 h-4" /> 发布中...</span>
              <span v-else class="flex items-center justify-center gap-2"><Save class="w-4 h-4" /> 确认发布</span>
            </button>
          </div>
        </div>

        <!-- STATE 3: EDITOR (Specific Section Selected) -->
        <div v-else class="space-y-4 animate-in slide-in-from-right-4 duration-300">
             <div class="flex justify-between items-center mb-4">
                <button 
                    @click="selectedPath = null"
                    class="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-800"
                >
                    <ArrowLeft class="w-3 h-3" /> 返回全局菜单
                </button>
                 <button
                    @click="handleSaveDraft"
                    :disabled="isSaving"
                    class="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-800 border border-stone-200 px-2 py-1 rounded bg-white"
                    >
                    <Save v-if="!isSaving" class="w-3 h-3" />
                    <Loader2 v-else class="w-3 h-3 animate-spin" />
                    保存
                </button>
            </div>

          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h3 class="font-black uppercase tracking-tight text-lg text-red-600">
              正在编辑: {{ selectedLabel }}
            </h3>
          </div>

          <!-- Typography Control -->
           <div class="bg-stone-50 p-3 rounded border border-stone-200">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[10px] font-bold uppercase text-stone-500">板块权重 (Layout Weight): {{ currentScale.toFixed(1) }}</label>
                    <button @click="currentScale = 1" class="text-[10px] text-red-400 hover:text-red-300" title="重置">重置</button>
                </div>
                <input 
                    type="range" 
                    v-model.number="currentScale" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    class="w-full h-1 bg-stone-300 rounded-lg appearance-none cursor-pointer range-sm"
                >
            </div>


          <!-- Date Editor -->
          <div v-if="selectedPath === 'date'" class="space-y-4">
            <label class="block text-xs font-bold uppercase text-stone-400">日期 / Date</label>
            <input 
              class="w-full p-2 border text-sm" 
              :value="previewContent?.textData.date" 
              @input="(e) => updateTextData('date', null, (e.target as HTMLInputElement).value)" 
            />
          </div>

          <!-- Image Upload -->
          <div v-else-if="selectedPath === 'image'" class="space-y-4">
            <label class="block text-xs font-bold uppercase text-stone-400">头版图片 / Main Image</label>
            <label class="flex-1 cursor-pointer bg-stone-100 hover:bg-stone-200 p-8 text-center text-xs font-bold border-2 border-dashed border-stone-300 rounded text-stone-600 flex flex-col items-center gap-2">
              <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
              <Upload class="w-6 h-6" /> 
              <span>点击上传新图片</span>
            </label>
            <p class="text-[10px] text-stone-400">目前暂不支持 AI 局部重绘图片，请上传本地图片替代。</p>
          </div>

          <!-- Object Editor (Title + Content) -->
          <template v-else>
            <div v-if="typeof getValue(selectedPath) === 'object'" class="space-y-6">
              <!-- Title Input -->
              <div v-if="'title' in getValue(selectedPath)" class="space-y-1">
                <label class="block text-xs font-bold uppercase text-stone-400">标题 / Title</label>
                <input 
                  class="w-full p-2 border text-sm font-bold" 
                  :value="getValue(selectedPath).title" 
                  @input="(e) => updateTextData(selectedPath!, 'title', (e.target as HTMLInputElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI 指令 (例: 更幽默一点)" 
                    class="flex-1 text-xs border border-stone-200 p-1 px-2 rounded"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).title); updateTextData(selectedPath!, 'title', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).title); updateTextData(selectedPath!, 'title', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-800 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-black disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
              
              <!-- Content Input -->
              <div v-if="'content' in getValue(selectedPath)" class="space-y-1">
                <div class="flex justify-between items-baseline">
                  <label class="block text-xs font-bold uppercase text-stone-400">内容 / Content</label>
                  <div class="text-[10px] text-stone-400 font-mono">MD: **bold** *ital* # L ## M</div>
                </div>
                <textarea 
                  class="w-full p-2 border text-sm h-48 font-mono" 
                  :value="getValue(selectedPath).content" 
                  @input="(e) => updateTextData(selectedPath!, 'content', (e.target as HTMLTextAreaElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI 指令 (例: 缩短字数)" 
                    class="flex-1 text-xs border border-stone-200 p-1 px-2 rounded"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).content); updateTextData(selectedPath!, 'content', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).content); updateTextData(selectedPath!, 'content', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-800 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-black disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- String Editor -->
            <div v-else class="space-y-1">
              <div class="flex justify-between items-baseline">
                <label class="block text-xs font-bold uppercase text-stone-400">文本内容 / Text</label>
                <div class="text-[10px] text-stone-400 font-mono">MD: **bold** *ital* # L ## M</div>
              </div>
              <textarea 
                class="w-full p-2 border text-sm h-32 font-mono" 
                :value="getValue(selectedPath)" 
                @input="(e) => updateTextData(selectedPath!, null, (e.target as HTMLTextAreaElement).value)" 
              />
              <div class="flex gap-2 mt-1">
                <input 
                  type="text" 
                  placeholder="AI 指令" 
                  class="flex-1 text-xs border border-stone-200 p-1 px-2 rounded"
                  v-model="rewritePrompt"
                  @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!)); updateTextData(selectedPath!, null, t) }"
                />
                <button 
                  @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!)); updateTextData(selectedPath!, null, t) }"
                  :disabled="isRewriting || !rewritePrompt"
                  class="bg-stone-800 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-black disabled:opacity-50"
                >
                  <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                  <Wand2 v-else class="w-3 h-3" />
                </button>
              </div>
            </div>
          </template>

          <div class="p-3 bg-stone-50 text-[10px] text-stone-400 mt-8 rounded border border-stone-100">
            提示：修改内容后，右侧预览将实时更新。点击其他区域可切换编辑对象。
          </div>
        </div>
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
