<script setup lang="ts">
import { 
  Loader2, Wand2, Save, Layout, Lock, Upload, Undo2, 
  MousePointerClick, ArrowLeft, BookOpen 
} from 'lucide-vue-next'
import { ThemeType, PublicationType, type GeneratedContent, type NewsData } from '~/types'

const router = useRouter()
const { generateNewsContent, generateNewsImage, rewriteText, loading, loadingStep } = useGemini()
const { saveIssue } = useIssues()

// Form State
const topic = ref('赛博朋克之谜')
const date = ref(new Date().toISOString().split('T')[0])
const theme = ref<ThemeType>(ThemeType.CLASSIC_RED)

// Preview State
const previewContent = ref<GeneratedContent | null>(null)
const isPublishing = ref(false)

// Selection State
const selectedPath = ref<string | null>(null)
const selectedLabel = ref('')
const isRewriting = ref(false)
const rewritePrompt = ref('')

const THEME_NAMES: Record<ThemeType, string> = {
  [ThemeType.CLASSIC_RED]: '经典赤红',
  [ThemeType.DEEP_BLUE]: '深邃湛蓝',
  [ThemeType.EMERALD]: '复古翡翠',
  [ThemeType.NOIR]: '黑色电影'
}

async function handleGenerate() {
  const textData = await generateNewsContent(topic.value, date.value, theme.value, PublicationType.TRIANGLE)
  if (!textData) {
    alert("生成失败，请重试。")
    return
  }
  
  previewContent.value = { textData, theme: theme.value, publicationType: PublicationType.TRIANGLE }
  
  const imageBase64 = await generateNewsImage(textData.frontPage.mainImagePrompt, theme.value, PublicationType.TRIANGLE)
  if (imageBase64) {
    previewContent.value = { ...previewContent.value!, imageBase64 }
  }
  
  selectedPath.value = null
}

async function handlePublish() {
  if (!previewContent.value) return
  isPublishing.value = true
  
  try {
    const result = await saveIssue(previewContent.value)
    if (result) {
      alert("发布成功！已写入后台数据库。")
      router.push('/triangle')
    } else {
      alert("发布失败。")
    }
  } finally {
    isPublishing.value = false
  }
}

function getValue(path: string): any {
  if (!previewContent.value) return ''
  const keys = path.split('.')
  let current: any = previewContent.value.textData
  for (const k of keys) {
    if (current === undefined) return ''
    current = current[k]
  }
  return current
}

function updateTextData(path: string, field: string | null, value: any) {
  if (!previewContent.value) return
  const newData = structuredClone(previewContent.value)
  const keys = path.split('.')
  if (field) keys.push(field)
  
  let current: any = newData.textData
  for (let i = 0; i < keys.length - 1; i++) {
    current = current[keys[i]]
  }
  current[keys[keys.length - 1]] = value
  previewContent.value = newData
}

function handleSectionSelect(path: string, label: string) {
  if (!path) {
    selectedPath.value = null
    return
  }
  selectedPath.value = path
  selectedLabel.value = label
  rewritePrompt.value = ''
}

async function handleSmartRewrite(currentText: string): Promise<string> {
  if (!currentText || !rewritePrompt.value) return currentText
  isRewriting.value = true
  try {
    return await rewriteText(currentText, rewritePrompt.value)
  } finally {
    isRewriting.value = false
  }
}

function handleImageUpload(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onloadend = () => {
      if (previewContent.value) {
        previewContent.value = { ...previewContent.value, imageBase64: reader.result as string }
      }
    }
    reader.readAsDataURL(file)
  }
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
              <Wand2 class="w-4 h-4" /> 生成预览
            </span>
          </button>
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
          <button 
            @click="selectedPath = null"
            class="flex items-center gap-1 text-xs font-bold text-stone-400 hover:text-stone-800 mb-4"
          >
            <ArrowLeft class="w-3 h-3" /> 返回全局菜单
          </button>

          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-stone-100">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
            <h3 class="font-black uppercase tracking-tight text-lg text-red-600">
              正在编辑: {{ selectedLabel }}
            </h3>
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
              <div v-if="getValue(selectedPath)?.title !== undefined" class="space-y-1">
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
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath).title); updateTextData(selectedPath!, 'title', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath).title); updateTextData(selectedPath!, 'title', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-800 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-black disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div v-if="getValue(selectedPath)?.content !== undefined" class="space-y-1">
                <label class="block text-xs font-bold uppercase text-stone-400">内容 / Content</label>
                <textarea 
                  class="w-full p-2 border text-sm h-48" 
                  :value="getValue(selectedPath).content" 
                  @input="(e) => updateTextData(selectedPath!, 'content', (e.target as HTMLTextAreaElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI 指令 (例: 缩短字数)" 
                    class="flex-1 text-xs border border-stone-200 p-1 px-2 rounded"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath).content); updateTextData(selectedPath!, 'content', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath).content); updateTextData(selectedPath!, 'content', t) }"
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
              <label class="block text-xs font-bold uppercase text-stone-400">文本内容 / Text</label>
              <textarea 
                class="w-full p-2 border text-sm h-32" 
                :value="getValue(selectedPath)" 
                @input="(e) => updateTextData(selectedPath!, null, (e.target as HTMLTextAreaElement).value)" 
              />
              <div class="flex gap-2 mt-1">
                <input 
                  type="text" 
                  placeholder="AI 指令" 
                  class="flex-1 text-xs border border-stone-200 p-1 px-2 rounded"
                  v-model="rewritePrompt"
                  @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath)); updateTextData(selectedPath!, null, t) }"
                />
                <button 
                  @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath)); updateTextData(selectedPath!, null, t) }"
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
    <div class="flex-1 bg-stone-200 p-8 overflow-auto flex flex-col items-center gap-8" @click="selectedPath = null">
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center text-stone-400 gap-4">
        <Layout class="w-16 h-16 opacity-20" />
        <p class="font-serif">在此处预览生成的新闻日报</p>
      </div>
      <template v-else>
        <div class="scale-[0.5] sm:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] origin-top shadow-xl transition-all duration-300">
          <Newspaper 
            :data="previewContent.textData" 
            :theme="theme" 
            :publication-type="PublicationType.TRIANGLE"
            :image-src="previewContent.imageBase64" 
            :page="1" 
            :on-section-select="handleSectionSelect"
            :selected-section-id="selectedPath"
          />
        </div>
        <div class="scale-[0.5] sm:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] origin-top shadow-xl transition-all duration-300">
          <Newspaper 
            :data="previewContent.textData" 
            :theme="theme" 
            :publication-type="PublicationType.TRIANGLE"
            :page="2" 
            :on-section-select="handleSectionSelect"
            :selected-section-id="selectedPath"
          />
        </div>
      </template>
    </div>
  </div>
</template>
