<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Archive, X, ChevronRight, Calendar } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'

const { getLatestIssue, getAllIssues } = useIssues()

const loading = ref(true)
const data = ref<GeneratedContent | null>(null)
const allIssues = ref<GeneratedContent[]>([])
const showArchives = ref(false)
const theme = ref<ThemeType>(ThemeType.CLASSIC_RED)

const page1Ref = ref<HTMLDivElement | null>(null)
const page2Ref = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  try {
    const [latest, issues] = await Promise.all([
      getLatestIssue(PublicationType.TRIANGLE),
      getAllIssues()
    ])
    
    if (latest) {
      data.value = latest
      theme.value = latest.theme || ThemeType.CLASSIC_RED
    }
    
    if (issues) {
        allIssues.value = issues
        .filter(issue => issue.publicationType === PublicationType.TRIANGLE)
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
    }
  } finally {
    loading.value = false
  }
})

function handleSelectIssue(issue: GeneratedContent) {
  data.value = issue
  theme.value = issue.theme || ThemeType.CLASSIC_RED
  showArchives.value = false
}

async function handleDownload(element: HTMLDivElement | null, pageNum: number) {
  if (element) {
    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: null,
        logging: false
      })
      const link = document.createElement('a')
      link.download = `三角日报-${data.value?.textData.date || 'issue'}-第${pageNum}版.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (e) {
      alert("导出失败")
    }
  }
}
</script>

<template>
  <!-- Loading State -->
  <div v-if="loading" class="h-screen w-full flex items-center justify-center bg-stone-100 flex-col gap-4 text-stone-500">
    <Loader2 class="w-8 h-8 animate-spin" />
    <p class="font-serif tracking-widest uppercase text-xs">Connecting to News Server...</p>
  </div>

  <!-- No Data State -->
  <div v-else-if="!data" class="h-screen w-full flex items-center justify-center bg-stone-100 flex-col gap-4 text-stone-500">
    <NewspaperIcon class="w-16 h-16 opacity-20" />
    <h1 class="text-xl font-bold font-sans">暂无日报发布</h1>
    <p class="font-serif text-sm">请等待编辑部发布最新一期内容。</p>
    <NuxtLink to="/triangle/editor" class="mt-4 px-6 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700">
      前往编辑器
    </NuxtLink>
  </div>

  <!-- Reader View -->
  <div v-else class="min-h-screen p-8 flex flex-col items-center gap-12 overflow-y-auto bg-stone-200">
    <!-- Header Bar -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-white shadow z-10 flex items-center justify-between px-8">
      <div class="flex items-center gap-4">
        <button 
          @click="showArchives = !showArchives"
          class="p-2 hover:bg-stone-100 rounded text-stone-400 hover:text-stone-800 transition-colors"
          title="Open Archives"
        >
          <Archive class="w-5 h-5" />
        </button>
        <NuxtLink to="/" class="font-black text-xl tracking-tighter uppercase text-red-600 hover:text-red-700">
          Triangle Daily
        </NuxtLink>
        <div class="text-xs opacity-60 font-sans border-l pl-4 hidden sm:block border-current">
          {{ data.textData.date }} • {{ data.textData.location }}
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="handleDownload(page1Ref, 1)" class="px-4 py-2 bg-stone-800 text-white text-xs font-bold uppercase hover:bg-black flex items-center gap-2">
          <Download class="w-3 h-3" /> 头版
        </button>
        <button @click="handleDownload(page2Ref, 2)" class="px-4 py-2 bg-stone-800 text-white text-xs font-bold uppercase hover:bg-black flex items-center gap-2">
          <Download class="w-3 h-3" /> 副刊
        </button>
      </div>
    </div>

    <!-- Newspaper Pages Side-by-Side -->
    <div class="pt-20 pb-20 flex items-center justify-center">
      <div class="relative flex gap-1 scale-[0.3] sm:scale-[0.4] md:scale-[0.5] lg:scale-[0.6] xl:scale-[0.7] origin-center shadow-2xl transition-all">
        <!-- Page 1 (Left) -->
        <div ref="page1Ref" class="shadow-xl">
          <Newspaper 
            :data="data.textData" 
            :theme="theme" 
            :publication-type="PublicationType.TRIANGLE"
            :image-src="data.imageBase64" 
            :page="1" 
          />
        </div>
        
        <!-- Center fold effect -->
        <div class="w-2 bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400 shadow-inner"></div>
        
        <!-- Page 2 (Right) -->
        <div ref="page2Ref" class="shadow-xl">
          <Newspaper 
            :data="data.textData" 
            :theme="theme" 
            :publication-type="PublicationType.TRIANGLE"
            :page="2" 
          />
        </div>
      </div>
    </div>

    <!-- Theme Toggle -->
    <div class="fixed bottom-8 left-8 flex gap-2 p-2 bg-white rounded-full shadow-lg z-20">
      <button
        v-for="t in [ThemeType.CLASSIC_RED, ThemeType.DEEP_BLUE, ThemeType.EMERALD, ThemeType.NOIR]"
        :key="t"
        @click="theme = t"
        class="w-6 h-6 rounded-full border-2 transition-transform"
        :class="theme === t ? 'border-stone-800 scale-110' : 'border-transparent'"
        :style="{
          backgroundColor: t === ThemeType.CLASSIC_RED ? '#dc2626' : 
                          t === ThemeType.DEEP_BLUE ? '#1e3a8a' :
                          t === ThemeType.EMERALD ? '#047857' : '#171717'
        }"
        :title="t"
      />
    </div>

    <!-- Editor Link -->
    <NuxtLink 
      to="/triangle/editor"
      class="fixed bottom-4 right-4 z-50 px-3 py-1 bg-black text-white text-[10px] uppercase font-bold tracking-widest opacity-20 hover:opacity-100 transition-opacity rounded shadow-lg"
    >
      Editor
    </NuxtLink>

    <!-- Archives Drawer -->
    <div 
      v-if="showArchives" 
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="showArchives = false"
    ></div>
    
    <div 
      class="fixed inset-y-0 left-0 w-80 bg-stone-100 border-r border-stone-200 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col font-sans"
      :class="showArchives ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 border-b border-stone-200 flex items-center justify-between bg-white">
        <h2 class="font-black uppercase tracking-tighter text-red-600 flex items-center gap-2">
          <Archive class="w-4 h-4" /> Archives
        </h2>
        <button 
          @click="showArchives = false"
          class="text-stone-500 hover:text-stone-800"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-2 bg-stone-50">
        <button
          v-for="issue in allIssues"
          :key="issue.id"
          @click="handleSelectIssue(issue)"
          class="w-full text-left p-4 bg-white hover:bg-red-50 border border-stone-200 hover:border-red-200 rounded transition-all group shadow-sm"
          :class="{ 'border-red-500 ring-1 ring-red-500': data?.id === issue.id }"
        >
          <div class="flex justify-between items-start mb-2">
             <span class="text-xs font-bold text-stone-500 flex items-center gap-1">
               <Calendar class="w-3 h-3" /> {{ issue.textData.date }}
             </span>
             <ChevronRight class="w-3 h-3 text-stone-400 group-hover:text-red-500 transition-colors" />
          </div>
          <h3 class="font-bold text-stone-800 text-sm leading-tight group-hover:text-red-700 transition-colors">
            {{ issue.textData.frontPage.headline }}
          </h3>
        </button>
      </div>
    </div>
  </div>
</template>
