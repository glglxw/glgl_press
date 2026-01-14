<script setup lang="ts">
import { 
  Loader2, Wand2, Save, Layout, Ghost, Upload, Undo2, 
  MousePointerClick, ArrowLeft, Printer 
} from 'lucide-vue-next'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'

const router = useRouter()
const { generateNewsContent, generateNewsImage, rewriteText, loading, loadingStep } = useGemini()
const { saveIssue } = useIssues()

// Form State
const topic = ref('工业区幽灵出没事件')
const date = ref(new Date().toISOString().split('T')[0])
const theme = ref<ThemeType>(ThemeType.NOIR) // Duskvol defaults to NOIR

// Preview State
const previewContent = ref<GeneratedContent | null>(null)
const isPublishing = ref(false)

// Selection State
const selectedPath = ref<string | null>(null)
const selectedLabel = ref('')
const isRewriting = ref(false)
const rewritePrompt = ref('')

async function handleGenerate() {
  const textData = await generateNewsContent(topic.value, date.value, theme.value, PublicationType.DUSKVOL)
  if (!textData) {
    alert("生成失败，请重试。")
    return
  }
  
  previewContent.value = { textData, theme: theme.value, publicationType: PublicationType.DUSKVOL }
  
  const imageBase64 = await generateNewsImage(textData.frontPage.mainImagePrompt, theme.value, PublicationType.DUSKVOL)
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
      alert("Publication complete. The Chronicle awaits its readers.")
      router.push('/duskvol')
    } else {
      alert("Publication failed. The void consumes our efforts.")
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
        <div v-if="!previewContent" class="space-y-4 animate-in fade-in duration-300">
          <div class="p-4 bg-stone-700/50 border border-stone-600 rounded text-sm text-stone-300">
            <h3 class="font-bold mb-1 flex items-center gap-2"><Printer class="w-4 h-4" /> Begin Composition</h3>
            <p>Enter the topic. Our ghostly scribes shall compose the Chronicle.</p>
          </div>
          
          <div>
            <label class="block text-xs font-bold uppercase mb-1 text-stone-400">Topic / 主题</label>
            <textarea 
              v-model="topic"
              class="w-full p-3 bg-stone-700 border-2 border-stone-600 focus:border-stone-400 rounded-none outline-none font-serif text-sm h-20 resize-none text-stone-100"
              placeholder="例如：工业区幽灵出没事件"
            />
          </div>

          <div>
            <label class="block text-xs font-bold uppercase mb-1 text-stone-400">Publication Date</label>
            <input 
              type="date" 
              v-model="date"
              class="w-full p-2 bg-stone-700 border-2 border-stone-600 focus:border-stone-400 rounded-none outline-none font-sans text-stone-100"
            />
          </div>

          <button
            @click="handleGenerate"
            :disabled="loading"
            class="w-full py-4 text-white font-black uppercase tracking-widest transition-all mt-4"
            :class="loading ? 'bg-stone-600 cursor-not-allowed' : 'bg-stone-600 hover:bg-stone-500 shadow-[4px_4px_0px_0px_#1c1917] active:translate-y-1 active:shadow-none'"
          >
            <span v-if="loading" class="flex items-center justify-center gap-2">
              <Loader2 class="animate-spin w-4 h-4" /> {{ loadingStep || 'Summoning spirits...' }}
            </span>
            <span v-else class="flex items-center justify-center gap-2">
              <Wand2 class="w-4 h-4" /> Compose Chronicle
            </span>
          </button>
        </div>

        <!-- STATE 2: DASHBOARD -->
        <div v-else-if="!selectedPath" class="space-y-6 animate-in slide-in-from-left-4 duration-300">
          <div class="p-4 bg-stone-700/50 border border-stone-600 rounded text-sm text-stone-300">
            <h3 class="font-bold mb-1 flex items-center gap-2"><MousePointerClick class="w-4 h-4" /> Interactive Editing</h3>
            <p>Click any section in the preview to edit its content.</p>
          </div>
          
          <div class="border-t border-b border-stone-700 py-4 space-y-4">
            <h3 class="text-xs font-bold uppercase text-stone-500">Global Actions</h3>
            <button 
              @click="previewContent = null"
              class="w-full py-2 border border-stone-600 text-stone-400 text-xs font-bold hover:bg-stone-700 flex items-center justify-center gap-2"
            >
              <Undo2 class="w-3 h-3" /> Reset / New
            </button>
            
            <button
              @click="handlePublish"
              :disabled="isPublishing"
              class="w-full py-4 text-white font-black uppercase tracking-widest transition-all"
              :class="isPublishing ? 'bg-stone-500' : 'bg-stone-500 hover:bg-stone-400 shadow-[4px_4px_0px_0px_#0c0a09] active:translate-y-1 active:shadow-none'"
            >
              <span v-if="isPublishing" class="flex items-center justify-center gap-2"><Loader2 class="animate-spin w-4 h-4" /> Publishing...</span>
              <span v-else class="flex items-center justify-center gap-2"><Save class="w-4 h-4" /> Publish Chronicle</span>
            </button>
          </div>
        </div>

        <!-- STATE 3: EDITOR -->
        <div v-else class="space-y-4 animate-in slide-in-from-right-4 duration-300">
          <button 
            @click="selectedPath = null"
            class="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-300 mb-4"
          >
            <ArrowLeft class="w-3 h-3" /> Back to Menu
          </button>

          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-stone-700">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 class="font-black uppercase tracking-tight text-lg text-blue-400">
              Editing: {{ selectedLabel }}
            </h3>
          </div>

          <!-- Date Editor -->
          <div v-if="selectedPath === 'date'" class="space-y-4">
            <label class="block text-xs font-bold uppercase text-stone-500">Date</label>
            <input 
              class="w-full p-2 border border-stone-600 bg-stone-700 text-sm text-stone-100" 
              :value="previewContent?.textData.date" 
              @input="(e) => updateTextData('date', null, (e.target as HTMLInputElement).value)" 
            />
          </div>

          <!-- Image Upload -->
          <div v-else-if="selectedPath === 'image'" class="space-y-4">
            <label class="block text-xs font-bold uppercase text-stone-500">Main Image</label>
            <label class="flex-1 cursor-pointer bg-stone-700 hover:bg-stone-600 p-8 text-center text-xs font-bold border-2 border-dashed border-stone-500 rounded text-stone-400 flex flex-col items-center gap-2">
              <input type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
              <Upload class="w-6 h-6" /> 
              <span>Upload new image</span>
            </label>
          </div>

          <!-- Object Editor -->
          <template v-else>
            <div v-if="typeof getValue(selectedPath) === 'object'" class="space-y-6">
              <div v-if="getValue(selectedPath)?.title !== undefined" class="space-y-1">
                <label class="block text-xs font-bold uppercase text-stone-500">Title</label>
                <input 
                  class="w-full p-2 border border-stone-600 bg-stone-700 text-sm font-bold text-stone-100" 
                  :value="getValue(selectedPath).title" 
                  @input="(e) => updateTextData(selectedPath!, 'title', (e.target as HTMLInputElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI instruction..." 
                    class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath).title); updateTextData(selectedPath!, 'title', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath).title); updateTextData(selectedPath!, 'title', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-600 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-stone-500 disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div v-if="getValue(selectedPath)?.content !== undefined" class="space-y-1">
                <label class="block text-xs font-bold uppercase text-stone-500">Content</label>
                <textarea 
                  class="w-full p-2 border border-stone-600 bg-stone-700 text-sm h-48 text-stone-100" 
                  :value="getValue(selectedPath).content" 
                  @input="(e) => updateTextData(selectedPath!, 'content', (e.target as HTMLTextAreaElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI instruction..." 
                    class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath).content); updateTextData(selectedPath!, 'content', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath).content); updateTextData(selectedPath!, 'content', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-600 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-stone-500 disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
            
            <!-- String Editor -->
            <div v-else class="space-y-1">
              <label class="block text-xs font-bold uppercase text-stone-500">Text Content</label>
              <textarea 
                class="w-full p-2 border border-stone-600 bg-stone-700 text-sm h-32 text-stone-100" 
                :value="getValue(selectedPath)" 
                @input="(e) => updateTextData(selectedPath!, null, (e.target as HTMLTextAreaElement).value)" 
              />
              <div class="flex gap-2 mt-1">
                <input 
                  type="text" 
                  placeholder="AI instruction..." 
                  class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                  v-model="rewritePrompt"
                  @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath)); updateTextData(selectedPath!, null, t) }"
                />
                <button 
                  @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath)); updateTextData(selectedPath!, null, t) }"
                  :disabled="isRewriting || !rewritePrompt"
                  class="bg-stone-600 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-stone-500 disabled:opacity-50"
                >
                  <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                  <Wand2 v-else class="w-3 h-3" />
                </button>
              </div>
            </div>
          </template>

          <div class="p-3 bg-stone-700/50 text-[10px] text-stone-500 mt-8 rounded border border-stone-700">
            Tip: Changes are reflected in real-time. Click another section to switch editing targets.
          </div>
        </div>
      </div>
    </div>

    <!-- Preview Area -->
    <div class="flex-1 bg-stone-950 p-8 overflow-auto flex flex-col items-center gap-8" @click="selectedPath = null">
      <div v-if="!previewContent" class="flex-1 flex flex-col items-center justify-center text-stone-600 gap-4">
        <Ghost class="w-16 h-16 opacity-20" />
        <p class="font-serif italic">The printing press awaits...</p>
      </div>
      <template v-else>
        <div class="scale-[0.5] sm:scale-[0.6] lg:scale-[0.7] xl:scale-[0.8] origin-top shadow-xl transition-all duration-300">
          <Newspaper 
            :data="previewContent.textData" 
            :theme="theme" 
            :publication-type="PublicationType.DUSKVOL"
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
            :publication-type="PublicationType.DUSKVOL"
            :page="2" 
            :on-section-select="handleSectionSelect"
            :selected-section-id="selectedPath"
          />
        </div>
      </template>
    </div>
  </div>
</template>
