<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Archive, X, ChevronRight, Calendar, Ghost, Lock, Home, Scroll } from 'lucide-vue-next'
import { toPng } from 'html-to-image'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'
import { getEditorConfig } from '~/config/editorConfig'

const route = useRoute()
const publication = computed(() => (route.params.publication as string) || 'triangle')
const config = computed(() => getEditorConfig(publication.value))

const { getLatestIssue, getAllIssues } = useIssues()
const { t } = useI18n()


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
    container.style.backgroundColor = config.value.bgHex
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
      backgroundColor: config.value.bgHex
    })

    const link = document.createElement('a')
    const suffix = type === 'all' ? 'Full' : type === 'page1' ? 'Page1' : 'Page2'
    let pubName = 'Triangle'
    if (publication.value === 'duskvol') pubName = 'Duskvol'
    if (publication.value === 'adventurer') pubName = 'Adventurer'
    link.download = `${pubName}-${data.value.textData.date}-${suffix}.png`
    link.href = dataUrl
    link.click()

    document.body.removeChild(container)
  } catch (e) {
    console.error(e)
    alert(t('publication.common.exportFailed'))
  } finally {
    isDownloading.value = false
  }
}
</script>

<template>
  <div :data-publication="publication">
    <!-- Loading State -->
    <div v-if="loading" class="h-screen w-full flex items-center justify-center flex-col gap-4"
         :class="config.styles.loadingState">
      <Loader2 class="w-8 h-8 animate-spin" />
      <p class="font-serif tracking-widest uppercase text-xs">{{ t(config.styles.loadingTextKey) }}</p>
    </div>

    <!-- No Data State -->
    <div v-else-if="!data" class="h-screen w-full flex items-center justify-center flex-col gap-4"
         :class="config.styles.loadingState">
      <component :is="config.icon" class="w-16 h-16 opacity-20" />
      <h1 class="text-xl font-bold" :class="config.styles.headerText">
        {{ t(config.styles.noDataHeaderKey) }}
      </h1>
      <p class="font-serif text-sm">{{ config.emptyStateText }}</p>
      <NuxtLink :to="`/${publication}/editor`" 
                class="mt-4 px-6 py-2 text-white font-bold rounded"
                :class="config.styles.primaryButton">
        {{ t(config.styles.enterEditorKey) }}
      </NuxtLink>
    </div>

    <!-- Reader View -->
    <div v-else class="min-h-screen p-8 flex flex-col items-center gap-12 overflow-y-auto"
         :class="config.styles.pageBg">
      
      <!-- Header Bar -->
      <!-- Header Bar -->
      <div class="fixed top-0 left-0 right-0 h-16 shadow z-10 flex items-center justify-between px-8"
           :class="config.styles.header">
        <div class="flex items-center gap-4">
          <NuxtLink to="/"
                    class="p-2 rounded transition-colors"
                    :class="config.styles.headerButton"
                    :title="t('publication.common.backHome')">
            <Home class="w-5 h-5" />
          </NuxtLink>
          <button @click="showArchives = !showArchives"
                  class="p-2 rounded transition-colors"
                  :class="config.styles.headerButton">
            <Archive class="w-5 h-5" />
          </button>
          <span class="font-black text-xl tracking-tighter uppercase flex items-center gap-2"
                :class="config.styles.headerText">
            <component :is="config.icon" class="w-5 h-5" />
            {{ config.title }}
          </span>
          <div class="text-xs opacity-60 font-serif border-l pl-4 hidden sm:block border-current">
            {{ data.textData.date }} • {{ data.textData.location }}
          </div>
        </div>
        <div class="flex gap-2">
          <button @click="handleDownload('page1')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.styles.secondaryButton">
            <Download class="w-3 h-3" /> {{ t('publication.common.page1') }}
          </button>
          <button @click="handleDownload('page2')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.styles.secondaryButton">
            <Download class="w-3 h-3" /> {{ t('publication.common.page2') }}
          </button>
          <button @click="handleDownload('all')" :disabled="isDownloading"
                  class="px-4 py-2 text-white text-xs font-bold uppercase flex items-center gap-2 disabled:opacity-50"
                  :class="config.styles.primaryButton">
            <Download class="w-3 h-3" /> {{ t('publication.common.fullIssue') }}
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
              :section-styles="data.sectionStyles"
            />
          </div>

          <!-- Center fold effect -->
          <div class="w-2 shadow-inner"
               :class="config.styles.centerFold"></div>

          <!-- Page 2 (Right) -->
          <div ref="page2Ref" class="shadow-xl">
            <Newspaper
              :data="data.textData"
              :theme="config.defaultTheme"
              :publication-type="config.publicationType"
              :page="2"
              :section-styles="data.sectionStyles"
            />
          </div>
        </div>
      </div>

      <!-- Editor Link -->
      <NuxtLink :to="`/${publication}/editor`"
                class="fixed bottom-4 right-4 z-50 px-3 py-1 text-white text-[10px] uppercase font-bold tracking-widest opacity-20 hover:opacity-100 transition-opacity rounded shadow-lg"
                :class="config.styles.editorLink">
        {{ t(config.styles.pressRoomKey) }}
      </NuxtLink>

      <!-- Archives Drawer Backdrop -->
      <div v-if="showArchives"
           class="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
           @click="showArchives = false"></div>

      <!-- Archives Drawer -->
      <div class="fixed inset-y-0 left-0 w-80 border-r z-50 transform transition-transform duration-300 ease-in-out shadow-2xl flex flex-col font-sans"
           :class="[
             showArchives ? 'translate-x-0' : '-translate-x-full',
             config.styles.archiveDrawer
           ]">
        <div class="p-6 border-b flex items-center justify-between"
             :class="config.styles.archiveHeader">
          <h2 class="font-black uppercase tracking-tighter flex items-center gap-2">
            <Archive class="w-4 h-4" /> {{ t('publication.common.archives') }}
          </h2>
          <button @click="showArchives = false" class="hover:opacity-75">
            <X class="w-5 h-5" />
          </button>
        </div>

        <div class="flex-1 overflow-y-auto p-4 space-y-3"
             :class="config.styles.archiveList">
          <button v-for="issue in allIssues"
                  :key="issue.id"
                  @click="handleSelectIssue(issue)"
                  class="w-full text-left p-4 rounded-lg border transition-all group"
                  :class="[
                    config.styles.archiveItem,
                    config.styles.archiveItemHover,
                    data?.id === issue.id ? config.styles.archiveItemActive : ''
                  ]">
            <div class="flex justify-between items-start mb-2">
              <span class="text-xs font-bold flex items-center gap-1 opacity-60">
                <Calendar v-if="config.styles.themeKey !== 'dark'" class="w-3 h-3" />
                {{ issue.textData.date }}
              </span>
              <ChevronRight class="w-3 h-3 opacity-40 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 class="font-bold text-sm leading-tight">
              {{ issue.textData.frontPage.headline }}
            </h3>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
