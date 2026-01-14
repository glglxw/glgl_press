<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Ghost, Archive, X, ChevronRight } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'

const { getLatestIssue, getAllIssues } = useIssues()

const loading = ref(true)
const data = ref<GeneratedContent | null>(null)
const allIssues = ref<GeneratedContent[]>([])
const showArchives = ref(false)

const page1Ref = ref<HTMLDivElement | null>(null)
const page2Ref = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  try {
    const [latest, issues] = await Promise.all([
      getLatestIssue(PublicationType.DUSKVOL),
      getAllIssues()
    ])
    
    if (latest) {
      data.value = latest
    }
    if (issues) {
      // Sort issues by date descending if not already
      allIssues.value = issues.filter(issue => issue.publicationType === PublicationType.DUSKVOL).sort((a, b) => 
        new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime()
      )
    }
  } finally {
    loading.value = false
  }
})

function handleSelectIssue(issue: GeneratedContent) {
  data.value = issue
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
      link.download = `多斯科沃公报-${data.value?.textData.date || 'issue'}-第${pageNum}版.png`
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
  <div v-if="loading" class="h-screen w-full flex items-center justify-center bg-stone-900 flex-col gap-4 text-stone-400">
    <Loader2 class="w-8 h-8 animate-spin" />
    <p class="font-serif tracking-widest uppercase text-xs">Connecting to the Void...</p>
  </div>

  <!-- No Data State -->
  <div v-else-if="!data" class="h-screen w-full flex items-center justify-center bg-stone-900 flex-col gap-4 text-stone-400">
    <Ghost class="w-16 h-16 opacity-20" />
    <h1 class="text-xl font-bold font-serif text-stone-200">No Chronicle Published</h1>
    <p class="font-serif text-sm">The printing press awaits fresh ink...</p>
    <NuxtLink to="/duskvol/editor" class="mt-4 px-6 py-2 bg-stone-700 text-white font-bold rounded hover:bg-stone-600">
      Enter the Press Room
    </NuxtLink>
  </div>

  <!-- Reader View -->
  <div v-else class="min-h-screen p-8 flex flex-col items-center gap-12 overflow-y-auto bg-stone-900">
    <!-- Header Bar -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-stone-800 shadow z-10 flex items-center justify-between px-8 text-stone-200">
      <div class="flex items-center gap-4">
        <button 
          @click="showArchives = !showArchives"
          class="p-2 hover:bg-stone-700 rounded text-stone-400 hover:text-stone-200 transition-colors"
          title="Open Archives"
        >
          <Archive class="w-5 h-5" />
        </button>
        <NuxtLink to="/" class="font-black text-xl tracking-tighter uppercase text-stone-100 hover:text-white flex items-center gap-2">
          <Ghost class="w-5 h-5" /> The Duskvol Chronicle
        </NuxtLink>
        <div class="text-xs opacity-60 font-serif border-l pl-4 hidden sm:block border-stone-600">
          {{ data.textData.date }} • {{ data.textData.location }}
        </div>
      </div>
      <div class="flex gap-2">
        <button @click="handleDownload(page1Ref, 1)" class="px-4 py-2 bg-stone-700 text-white text-xs font-bold uppercase hover:bg-stone-600 flex items-center gap-2">
          <Download class="w-3 h-3" /> Page 1
        </button>
        <button @click="handleDownload(page2Ref, 2)" class="px-4 py-2 bg-stone-700 text-white text-xs font-bold uppercase hover:bg-stone-600 flex items-center gap-2">
          <Download class="w-3 h-3" /> Page 2
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
            :theme="data.theme || ThemeType.NOIR" 
            :publication-type="PublicationType.DUSKVOL"
            :image-src="data.imageBase64" 
            :page="1" 
          />
        </div>
        
        <!-- Center fold effect -->
        <div class="w-2 bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700 shadow-inner"></div>
        
        <!-- Page 2 (Right) -->
        <div ref="page2Ref" class="shadow-xl">
          <Newspaper 
            :data="data.textData" 
            :theme="data.theme || ThemeType.NOIR" 
            :publication-type="PublicationType.DUSKVOL"
            :page="2" 
          />
        </div>
      </div>
    </div>

    <!-- Editor Link -->
    <NuxtLink 
      to="/duskvol/editor"
      class="fixed bottom-4 right-4 z-50 px-3 py-1 bg-stone-700 text-white text-[10px] uppercase font-bold tracking-widest opacity-20 hover:opacity-100 transition-opacity rounded shadow-lg"
    >
      Press Room
    </NuxtLink>

    <!-- Archives Drawer -->
    <div 
      v-if="showArchives" 
      class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
      @click="showArchives = false"
    ></div>
    
    <div 
      class="fixed inset-y-0 left-0 w-80 bg-stone-900 border-r border-stone-800 z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col"
      :class="showArchives ? 'translate-x-0' : '-translate-x-full'"
    >
      <div class="p-6 border-b border-stone-800 flex items-center justify-between">
        <h2 class="font-black uppercase tracking-widest text-stone-400 flex items-center gap-2">
          <Archive class="w-4 h-4" /> Archives
        </h2>
        <button 
          @click="showArchives = false"
          class="text-stone-500 hover:text-stone-300"
        >
          <X class="w-5 h-5" />
        </button>
      </div>
      
      <div class="flex-1 overflow-y-auto p-4 space-y-2">
        <button
          v-for="issue in allIssues"
          :key="issue.id"
          @click="handleSelectIssue(issue)"
          class="w-full text-left p-4 bg-stone-800/50 hover:bg-stone-800 border border-stone-800 hover:border-stone-700 rounded transition-all group"
          :class="{ 'border-blue-500/50 bg-blue-900/10': data?.id === issue.id }"
        >
          <div class="flex justify-between items-start mb-2">
             <span class="text-xs font-serif text-stone-500">{{ issue.textData.date }}</span>
             <ChevronRight class="w-3 h-3 text-stone-600 group-hover:text-stone-400 transition-colors" />
          </div>
          <h3 class="font-bold text-stone-300 text-sm leading-tight group-hover:text-white transition-colors">
            {{ issue.textData.frontPage.headline }}
          </h3>
        </button>
      </div>
    </div>
  </div>
</template>
