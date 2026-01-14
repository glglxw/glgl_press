<script setup lang="ts">
import { Download, Loader2, Newspaper as NewspaperIcon, Ghost } from 'lucide-vue-next'
import html2canvas from 'html2canvas'
import { ThemeType, PublicationType, type GeneratedContent } from '~/types'

const { getLatestIssue } = useIssues()

const loading = ref(true)
const data = ref<GeneratedContent | null>(null)

const page1Ref = ref<HTMLDivElement | null>(null)
const page2Ref = ref<HTMLDivElement | null>(null)

onMounted(async () => {
  try {
    const latest = await getLatestIssue(PublicationType.DUSKVOL)
    if (latest) {
      data.value = latest
    }
  } finally {
    loading.value = false
  }
})

async function handleDownload(pageRef: Ref<HTMLDivElement | null>, pageNum: number) {
  if (pageRef.value) {
    try {
      const canvas = await html2canvas(pageRef.value, {
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
  </div>
</template>
