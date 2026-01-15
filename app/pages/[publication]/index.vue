<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Archive, X, ChevronRight, Calendar, Ghost, Lock, Home } from 'lucide-vue-next'
import { toPng } from 'html-to-image'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'
import { getEditorConfig } from '~/config/editorConfig'

const route = useRoute()
const publication = computed(() => (route.params.publication as string) || 'triangle')
const config = computed(() => getEditorConfig(publication.value))

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
      getLatestIssue(config.value.publicationType),
      getAllIssues()
    ])

    if (latest) {
      data.value = latest
    }

    if (issues) {
      allIssues.value = issues
        .filter(issue => issue.publicationType === config.value.publicationType)
        .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
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

  try {
    const container = document.createElement('div')
    container.style.position = 'fixed'
    container.style.left = '0'
    container.style.top = '0'
    container.style.zIndex = '-1'
    container.style.opacity = '0.01'
    container.style.pointerEvents = 'none'
    container.style.width = type === 'all' ? '1600px' : '800px'
    container.style.backgroundColor = config.value.isDark ? '#1c1917' : '#ffffff'
    document.body.appendChild(container)

    const appendClone = (ref: HTMLDivElement | null) => {
      if (!ref) return false
      const newspaperDiv = ref.querySelector('[class*="w-[794px]"]') as HTMLElement
      if (newspaperDiv) {
        const clone = newspaperDiv.cloneNode(true) as HTMLElement
        clone.style.margin = '0'
        clone.style.transform = 'none'
        clone.style.fontFeatureSettings = '"liga" 0'
        container.appendChild(clone)
        return true
      }
      const firstChild = ref.firstElementChild as HTMLElement
      if (firstChild) {
        const clone = firstChild.cloneNode(true) as HTMLElement
        clone.style.margin = '0'
        clone.style.transform = 'none'
        clone.style.fontFeatureSettings = '"liga" 0'
        container.appendChild(clone)
        return true
      }
      return false
    }

    if (type === 'page1' || type === 'all') {
      appendClone(page1Ref.value)
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
      appendClone(page2Ref.value)
    }

    await new Promise(resolve => setTimeout(resolve, 500))
    container.style.opacity = '1'

    const dataUrl = await toPng(container, {
      quality: 1.0,
      pixelRatio: 2,
      backgroundColor: config.value.isDark ? '#1c1917' : '#ffffff'
    })

    const link = document.createElement('a')
    const suffix = type === 'all' ? 'Full' : type === 'page1' ? 'Page1' : 'Page2'
    const pubName = publication.value === 'triangle' ? '三角日报' : 'Duskvol'
    link.download = `${pubName}-${data.value.textData.date}-${suffix}.png`
    link.href = dataUrl
    link.click()

    document.body.removeChild(container)
  } catch (e) {
    console.error(e)
    alert("导出失败")
  } finally {
    isDownloading.value = false
  }
}

const IconComponent = computed(() => config.value.isDark ? Ghost : Lock)
</script>

<template>
  <div :data-publication="publication">
    <!-- Loading State -->
    <div v-if="loading" class="h-screen w-full flex items-center justify-center flex-col gap-4"
         :class="config.isDark ? 'bg-stone-900 text-stone-400' : 'bg-stone-100 text-stone-500'">
      <Loader2 class="w-8 h-8 animate-spin" />
      <p class="font-serif tracking-widest uppercase text-xs">{{ config.isDark ? 'Connecting to the Void...' : '正在连接新闻服务器...' }}</p>
    </div>

    <!-- No Data State -->
    <div v-else-if="!data" class="h-screen w-full flex items-center justify-center flex-col gap-4"
         :class="config.isDark ? 'bg-stone-900 text-stone-400' : 'bg-stone-100 text-stone-500'">
      <component :is="IconComponent" class="w-16 h-16 opacity-20" />
      <h1 class="text-xl font-bold" :class="config.isDark ? 'text-stone-200' : ''">
        {{ config.isDark ? 'No Chronicle Published' : '暂无日报发布' }}
      </h1>
      <p class="font-serif text-sm">{{ config.emptyStateText }}</p>
      <NuxtLink :to="`/${publication}/editor`" 
                class="mt-4 px-6 py-2 text-white font-bold rounded"
                :class="config.isDark ? 'bg-stone-700 hover:bg-stone-600' : 'bg-red-600 hover:bg-red-700'">
        {{ config.isDark ? 'Enter the Press Room' : '前往编辑器' }}
      </NuxtLink>
    </div>

    <!-- Reader View -->
    <div v-else class="min-h-screen p-8 flex flex-col items-center gap-12 overflow-y-auto"
         :class="config.isDark ? 'bg-stone-900' : 'bg-stone-200'">
      
      <!-- Header Bar -->
      <div class="fixed top-0 left-0 right-0 h-16 shadow z-10 flex items-center justify-between px-8"
           :class="config.isDark ? 'bg-stone-800 text-stone-200' : 'bg-white'">
        <div class="flex items-center gap-4">
          <NuxtLink to="/"
                    class="p-2 rounded transition-colors"
                    :class="config.isDark ? 'hover:bg-stone-700 text-stone-400 hover:text-stone-200' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-800'"
                    title="返回主页">
            <Home class="w-5 h-5" />
          </NuxtLink>
          <button @click="showArchives = !showArchives"
                  class="p-2 rounded transition-colors"
                  :class="config.isDark ? 'hover:bg-stone-700 text-stone-400 hover:text-stone-200' : 'hover:bg-stone-100 text-stone-400 hover:text-stone-800'">
            <Archive class="w-5 h-5" />
          </button>
          <span class="font-black text-xl tracking-tighter uppercase flex items-center gap-2"
                    :class="config.isDark ? 'text-stone-100' : 'text-red-600'">
            <component :is="IconComponent" v-if="config.isDark" class="w-5 h-5" />
            {{ config.isDark ? 'The Duskvol Chronicle' : 'Triangle Daily' }}
          </span>
          <div class="text-xs opacity-60 font-serif border-l pl-4 hidden sm:block"
               :class="config.isDark ? 'border-stone-600' : 'border-current'">
            {{ data.textData.date }} • {{ data.textData.location }}
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="handleDownload('page1')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.isDark ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-800 hover:bg-black'">
            <Download class="w-3 h-3" /> {{ config.isDark ? 'Page 1' : '头版' }}
          </button>
          <button @click="handleDownload('page2')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.isDark ? 'bg-stone-700 hover:bg-stone-600' : 'bg-stone-800 hover:bg-black'">
            <Download class="w-3 h-3" /> {{ config.isDark ? 'Page 2' : '副刊' }}
          </button>
          <button @click="handleDownload('all')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.isDark ? 'bg-blue-900 hover:bg-blue-800' : 'bg-red-600 hover:bg-red-700'">
            <Download class="w-3 h-3" /> {{ config.isDark ? 'Full Issue' : '完整版' }}
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
              :theme="config.defaultTheme"
              :publication-type="config.publicationType"
              :image-src="data.imageBase64"
              :page="1"
            />
          </div>

          <!-- Center fold effect -->
          <div class="w-2 shadow-inner"
               :class="config.isDark ? 'bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700' : 'bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400'"></div>

          <!-- Page 2 (Right) -->
          <div ref="page2Ref" class="shadow-xl">
            <Newspaper
              :data="data.textData"
              :theme="config.defaultTheme"
              :publication-type="config.publicationType"
              :page="2"
            />
          </div>
        </div>
      </div>

      <!-- Editor Link -->
      <NuxtLink :to="`/${publication}/editor`"
                class="fixed bottom-4 right-4 z-50 px-3 py-1 text-white text-[10px] uppercase font-bold tracking-widest opacity-20 hover:opacity-100 transition-opacity rounded shadow-lg"
                :class="config.isDark ? 'bg-stone-700' : 'bg-black'">
        {{ config.isDark ? 'Press Room' : 'Editor' }}
      </NuxtLink>

      <!-- Archives Drawer Backdrop -->
      <div v-if="showArchives"
           class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
           @click="showArchives = false"></div>

      <!-- Archives Drawer -->
      <div class="fixed inset-y-0 left-0 w-80 border-r z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col font-sans"
           :class="[
             showArchives ? 'translate-x-0' : '-translate-x-full',
             config.isDark ? 'bg-stone-900 border-stone-800' : 'bg-stone-100 border-stone-200'
           ]">
        <div class="p-6 border-b flex items-center justify-between"
             :class="config.isDark ? 'border-stone-800' : 'border-stone-200 bg-white'">
          <h2 class="font-black uppercase tracking-tighter flex items-center gap-2"
              :class="config.isDark ? 'text-stone-400 tracking-widest' : 'text-red-600'">
            <Archive class="w-4 h-4" /> Archives
          </h2>
          <button @click="showArchives = false"
                  :class="config.isDark ? 'text-stone-500 hover:text-stone-300' : 'text-stone-500 hover:text-stone-800'">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-2"
             :class="config.isDark ? '' : 'bg-stone-50'">
          <button v-for="issue in allIssues" :key="issue.id"
                  @click="handleSelectIssue(issue)"
                  class="w-full text-left p-4 border rounded transition-all group shadow-sm"
                  :class="[
                    config.isDark 
                      ? 'bg-stone-800/50 hover:bg-stone-800 border-stone-800 hover:border-stone-700' 
                      : 'bg-white hover:bg-red-50 border-stone-200 hover:border-red-200',
                    data?.id === issue.id 
                      ? (config.isDark ? 'border-blue-500/50 bg-blue-900/10' : 'border-red-500 ring-1 ring-red-500')
                      : ''
                  ]">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-bold flex items-center gap-1"
                    :class="config.isDark ? 'text-stone-500 font-serif' : 'text-stone-500'">
                <Calendar v-if="!config.isDark" class="w-3 h-3" />
                {{ issue.textData.date }}
              </span>
              <ChevronRight class="w-3 h-3 transition-colors"
                            :class="config.isDark ? 'text-stone-600 group-hover:text-stone-400' : 'text-stone-400 group-hover:text-red-500'" />
            </div>
            <h3 class="font-bold text-sm leading-tight transition-colors"
                :class="config.isDark ? 'text-stone-300 group-hover:text-white' : 'text-stone-800 group-hover:text-red-700'">
              {{ issue.textData.frontPage.headline }}
            </h3>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
