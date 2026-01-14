<script setup lang="ts">
import { 
  Loader2, Wand2, Save, Layout, Ghost, Upload, Undo2, 
  MousePointerClick, ArrowLeft, Printer, Sidebar 
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
              <Wand2 class="w-4 h-4" /> AI Compose Chronicle
            </span>
          </button>

          <button
            @click="handleManualCreate"
            class="w-full py-2 text-stone-400 font-bold uppercase tracking-widest transition-all mt-2 border-2 border-stone-600 hover:bg-stone-700"
          >
            <span class="flex items-center justify-center gap-2">
              <Printer class="w-4 h-4" /> Manual Creation
            </span>
          </button>

          <div class="mt-4 border-t border-stone-700 pt-4">
            <h3 class="text-xs font-bold uppercase text-stone-500 mb-2">Previous Chronicles</h3>
            <div class="space-y-2 max-h-64 overflow-y-auto">
                <button
                    v-for="issue in allIssues"
                    :key="issue.id"
                    @click="handleSelectIssue(issue)"
                    class="w-full text-left p-2 text-xs bg-stone-700 hover:bg-stone-600 border border-stone-600 rounded flex flex-col gap-1"
                >
                    <span class="font-bold text-stone-300">{{ issue.textData.frontPage.headline }}</span>
                    <span class="text-[10px] text-stone-500 font-serif">{{ issue.textData.date }} • {{ issue.publishedAt ? new Date(issue.publishedAt).toLocaleTimeString() : 'Draft' }}</span>
                </button>
                 <div v-if="allIssues.length === 0" class="text-xs text-stone-500 italic p-2 text-center">
                    No archives found.
                </div>
            </div>
            
             <button
                @click="loadIssueList"
                 class="w-full py-1 text-blue-400 font-bold uppercase tracking-widest transition-all mt-2 text-[10px] hover:bg-stone-700"
            >
                <span class="flex items-center justify-center gap-2">
                <Ghost class="w-3 h-3" /> Refresh Archives
                </span>
            </button>
          </div>
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
              @click="handleSaveDraft"
              :disabled="isSaving"
              class="w-full py-3 text-stone-300 font-bold uppercase tracking-widest transition-all border border-stone-600 hover:bg-stone-700"
            >
                <span v-if="isSaving" class="flex items-center justify-center gap-2"><Loader2 class="animate-spin w-4 h-4" /> Saving...</span>
                <span v-else class="flex items-center justify-center gap-2"><Save class="w-4 h-4" /> Save Draft</span>
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
            <div class="flex justify-between items-center mb-4">
                <button 
                    @click="selectedPath = null"
                    class="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-300"
                >
                    <ArrowLeft class="w-3 h-3" /> Back
                </button>
                 <button
                    @click="handleSaveDraft"
                    :disabled="isSaving"
                    class="flex items-center gap-1 text-xs font-bold text-stone-500 hover:text-stone-300 border border-stone-700 px-2 py-1 rounded"
                    >
                    <Save v-if="!isSaving" class="w-3 h-3" />
                    <Loader2 v-else class="w-3 h-3 animate-spin" />
                    Save
                </button>
            </div>

          <div class="flex items-center gap-2 mb-4 pb-2 border-b border-stone-700">
            <span class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
            <h3 class="font-black uppercase tracking-tight text-lg text-blue-400 truncate">
              {{ selectedLabel }}
            </h3>
          </div>

          <!-- Typography Control -->
           <div class="bg-stone-700/30 p-3 rounded border border-stone-700">
                <div class="flex justify-between items-center mb-1">
                    <label class="text-[10px] font-bold uppercase text-stone-500">Layout Weight: {{ currentScale.toFixed(1) }}</label>
                    <button @click="currentScale = 1" class="text-[10px] text-blue-400 hover:text-blue-300" title="Reset Size">Reset</button>
                </div>
                <input 
                    type="range" 
                    v-model.number="currentScale" 
                    min="0.5" 
                    max="2.0" 
                    step="0.1"
                    class="w-full h-1 bg-stone-600 rounded-lg appearance-none cursor-pointer range-sm"
                >
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
            <div v-if="typeof getValue(selectedPath!) === 'object'" class="space-y-6">
              <div v-if="getValue(selectedPath!)?.title !== undefined" class="space-y-1">
                <label class="block text-xs font-bold uppercase text-stone-500">Title</label>
                <input 
                  class="w-full p-2 border border-stone-600 bg-stone-700 text-sm font-bold text-stone-100" 
                  :value="getValue(selectedPath!).title" 
                  @input="(e) => updateTextData(selectedPath!, 'title', (e.target as HTMLInputElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI instruction..." 
                    class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).title); updateTextData(selectedPath!, 'title', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).title); updateTextData(selectedPath!, 'title', t) }"
                    :disabled="isRewriting || !rewritePrompt"
                    class="bg-stone-600 text-white p-1 px-2 rounded text-xs flex items-center gap-1 hover:bg-stone-500 disabled:opacity-50"
                  >
                    <Loader2 v-if="isRewriting" class="w-3 h-3 animate-spin" />
                    <Wand2 v-else class="w-3 h-3" />
                  </button>
                </div>
              </div>
              <div v-if="getValue(selectedPath!)?.content !== undefined" class="space-y-1">
                <div class="flex justify-between items-baseline">
                  <label class="block text-xs font-bold uppercase text-stone-500">Content</label>
                  <div class="text-[10px] text-stone-500 font-mono">Markdown: **bold** *italic* # Large ## Med</div>
                </div>
                <textarea 
                  class="w-full p-2 border border-stone-600 bg-stone-700 text-sm h-48 text-stone-100 font-mono" 
                  :value="getValue(selectedPath!).content" 
                  @input="(e) => updateTextData(selectedPath!, 'content', (e.target as HTMLTextAreaElement).value)" 
                />
                <div class="flex gap-2 mt-1">
                  <input 
                    type="text" 
                    placeholder="AI instruction..." 
                    class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                    v-model="rewritePrompt"
                    @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).content); updateTextData(selectedPath!, 'content', t) }"
                  />
                  <button 
                    @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!).content); updateTextData(selectedPath!, 'content', t) }"
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
              <div class="flex justify-between items-baseline">
                <label class="block text-xs font-bold uppercase text-stone-500">Text Content</label>
                <div class="text-[10px] text-stone-500 font-mono">Markdown: **bold** *italic* # Large ## Med</div>
              </div>
              <textarea 
                class="w-full p-2 border border-stone-600 bg-stone-700 text-sm h-32 text-stone-100 font-mono" 
                :value="getValue(selectedPath!)" 
                @input="(e) => updateTextData(selectedPath!, null, (e.target as HTMLTextAreaElement).value)" 
              />
              <div class="flex gap-2 mt-1">
                <input 
                  type="text" 
                  placeholder="AI instruction..." 
                  class="flex-1 text-xs border border-stone-600 bg-stone-700 p-1 px-2 rounded text-stone-200"
                  v-model="rewritePrompt"
                  @keydown.enter="async () => { const t = await handleSmartRewrite(getValue(selectedPath!)); updateTextData(selectedPath!, null, t) }"
                />
                <button 
                  @click="async () => { const t = await handleSmartRewrite(getValue(selectedPath!)); updateTextData(selectedPath!, null, t) }"
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
            Tip: Changes are reflected in real-time. Use the slider to adjust sizing if text overflows.
          </div>
        </div>
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
