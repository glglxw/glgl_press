<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Ghost, Archive, X, ChevronRight } from 'lucide-vue-next'
import { toPng } from 'html-to-image'
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

const isDownloading = ref(false)

async function handleDownload(type: 'page1' | 'page2' | 'all') {
  if (!data.value || isDownloading.value) return

  isDownloading.value = true
  console.log('[Download] Starting download, type:', type)

  try {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '0'
    container.style.top = '0'
    container.style.zIndex = '-1'
    container.style.opacity = '0.01' // Nearly invisible but still rendered
    container.style.pointerEvents = 'none'
    container.style.width = type === 'all' ? '1600px' : '800px'
    container.style.backgroundColor = '#1c1917'
    document.body.appendChild(container)
    console.log('[Download] Container created')

    const appendClone = (ref: HTMLDivElement | null, pageName: string) => {
      console.log(`[Download] appendClone called for ${pageName}, ref:`, ref)
      if (!ref) {
        console.log(`[Download] ${pageName} ref is null`)
        return false
      }
      
      console.log(`[Download] ${pageName} ref children:`, ref.children.length)
      console.log(`[Download] ${pageName} ref innerHTML length:`, ref.innerHTML.length)
      
      const newspaperDiv = ref.querySelector('[class*="w-[794px]"]') as HTMLElement
      console.log(`[Download] ${pageName} newspaperDiv:`, newspaperDiv)
      
      if (!newspaperDiv) {
        // Try alternative selectors
        const firstChild = ref.firstElementChild as HTMLElement
        console.log(`[Download] ${pageName} firstChild:`, firstChild)
        console.log(`[Download] ${pageName} firstChild class:`, firstChild?.className)
        
        // Use first child if it exists
        if (firstChild) {
          console.log(`[Download] Using firstChild as fallback`)
          const clone = firstChild.cloneNode(true) as HTMLElement
          clone.style.margin = '0'
          clone.style.transform = 'none'
          clone.style.fontFeatureSettings = '"liga" 0'
          container.appendChild(clone)
          return true
        }
        return false
      }
      
      console.log(`[Download] ${pageName} newspaperDiv className:`, newspaperDiv.className)
      const clone = newspaperDiv.cloneNode(true) as HTMLElement
      clone.style.margin = '0'
      clone.style.transform = 'none'
      clone.style.fontFeatureSettings = '"liga" 0'
      container.appendChild(clone)
      console.log(`[Download] ${pageName} clone appended`)
      return true
    }

    if (type === 'page1' || type === 'all') {
      appendClone(page1Ref.value, 'page1')
    }

    if (type === 'all') {
      const gap = document.createElement('div')
      gap.style.width = '20px'
      gap.style.height = '1px'
      gap.style.display = 'inline-block'
      container.appendChild(gap)
      container.style.display = 'flex'
      container.style.gap = '0'
    }

    if (type === 'page2' || type === 'all') {
      appendClone(page2Ref.value, 'page2')
    }

    console.log('[Download] Container children count:', container.children.length)
    console.log('[Download] Container innerHTML length:', container.innerHTML.length)

    await new Promise(resolve => setTimeout(resolve, 500))

    // Reset opacity to 1 for capture
    container.style.opacity = '1'

    const dataUrl = await toPng(container, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: '#1c1917'
    })
    console.log('[Download] dataUrl length:', dataUrl.length)

    const link = document.createElement('a')
    const suffix = type === 'all' ? 'Full' : type === 'page1' ? 'Page1' : 'Page2'
    link.download = `Duskvol-${data.value.textData.date}-${suffix}.png`
    link.href = dataUrl
    link.click()

    document.body.removeChild(container)
    console.log('[Download] Complete')
  } catch (e) {
    console.error('[Download] Error:', e)
    alert("Export Failed")
  } finally {
    isDownloading.value = false
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
        <button
          @click="handleDownload('page1')"
          :disabled="isDownloading"
          class="px-4 py-2 bg-stone-700 text-white text-xs font-bold uppercase hover:bg-stone-600 flex items-center gap-2 disabled:opacity-50"
        >
          <Download class="w-3 h-3" /> Page 1
        </button>
        <button
          @click="handleDownload('page2')"
          :disabled="isDownloading"
          class="px-4 py-2 bg-stone-700 text-white text-xs font-bold uppercase hover:bg-stone-600 flex items-center gap-2 disabled:opacity-50"
        >
          <Download class="w-3 h-3" /> Page 2
        </button>
        <button
          @click="handleDownload('all')"
          :disabled="isDownloading"
          class="px-4 py-2 bg-blue-900 text-white text-xs font-bold uppercase hover:bg-blue-800 flex items-center gap-2 disabled:opacity-50"
        >
          <Download class="w-3 h-3" /> Full Issue
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
