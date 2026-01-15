<script setup lang="ts">
import { Zap, Ghost, Anchor, Skull } from 'lucide-vue-next'
import type { NewsData, ThemeType, ThemeColors, PublicationType } from '~/types'

interface Props {
  data: NewsData
  theme: ThemeType
  publicationType?: PublicationType
  imageSrc?: string
  page: 1 | 2
  onSectionSelect?: (path: string, label: string) => void
  selectedSectionId?: string | null
}

const props = withDefaults(defineProps<Props>(), {
  publicationType: 'TRIANGLE' as PublicationType
})

const THEMES: Record<ThemeType, ThemeColors> = {
  CLASSIC_RED: {
    primary: '#dc2626', secondary: '#171717', background: '#fdfbf7', text: '#262626', accent: '#ef4444'
  },
  DEEP_BLUE: {
    primary: '#1e3a8a', secondary: '#0f172a', background: '#f8fafc', text: '#1e293b', accent: '#3b82f6'
  },
  EMERALD: {
    primary: '#047857', secondary: '#064e3b', background: '#f0fdf4', text: '#064e3b', accent: '#10b981'
  },
  NOIR: {
    primary: '#262626', secondary: '#000000', background: '#e5e5e5', text: '#171717', accent: '#525252'
  }
}

const colors = computed(() => THEMES[props.theme])
const isDuskvol = computed(() => props.publicationType === 'DUSKVOL')

const themeName = computed(() => {
  if (isDuskvol.value) return 'The Duskvol Chronicle'
  return {
    CLASSIC_RED: '三角日报',
    DEEP_BLUE: '深蓝观察',
    EMERALD: '翡翠之声',
    NOIR: '巨石公报'
  }[props.theme]
})

function handleSelect(path: string, label: string, e: Event) {
  e.stopPropagation()
  props.onSectionSelect?.(path, label)
}

function handleClear() {
  props.onSectionSelect?.('', '')
}

function isSelected(path: string) {
  return props.selectedSectionId === path
}

// Duskvol colors
const duskvolColors = computed(() => ({
  accent: THEMES[props.theme].accent,
  text: '#e7e5e4',
  bg: '#1c1917',
  border: '#44403c'
}))

// Deterministic Volume Number based on date
const volumeNumber = computed(() => {
    if (!props.data.date) return 700
    try {
        // Calculate days since a "start" epoch to simulate realistic volume numbers
        // Let's say Vol 1 was Jan 1, 2024
        const epoch = new Date('2024-01-01').getTime()
        const current = new Date(props.data.date).getTime()
        if (isNaN(current)) return 700

        const diffIds = Math.floor((current - epoch) / (1000 * 60 * 60 * 24))
        return Math.max(1, 100 + diffIds) // Base volume 100
    } catch {
        return 700
    }
})

// Markdown Rendering
import MarkdownIt from 'markdown-it'
const md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true
})

function renderMd(text: string) {
  if (!text) return ''
  return md.render(text)
}

function renderMdInline(text: string) {
  if (!text) return ''
  return md.renderInline(text)
}
</script>

<template>
  <!-- Triangle Layout -->
  <div
    v-if="!isDuskvol"
    class="w-[794px] h-[1123px] flex-shrink-0 relative overflow-hidden shadow-2xl origin-top"
    :style="{ backgroundColor: colors.background, color: colors.text }"
    @click="handleClear"
  >
    <!-- Left Border Pattern -->
    <div
      class="absolute left-0 top-0 bottom-0 w-12 border-r-2 border-dashed z-0 flex flex-col overflow-hidden"
      :style="{ borderColor: colors.secondary }"
    >
      <TrianglePattern class="h-full w-40 -ml-4" :color="colors.secondary" />
    </div>

    <div class="ml-12 h-full flex flex-col relative z-10">
      <!-- Header -->
      <header
        class="border-b-4 flex items-center justify-between py-4 px-8 relative"
        :style="{ borderColor: colors.primary }"
      >
        <div
          class="absolute top-1 left-2 text-[10px] opacity-60 font-sans tracking-widest"
          :style="{ color: colors.secondary }"
        >
          第 {{ volumeNumber }} 期 • {{ page === 1 ? '头版' : '副刊' }}
        </div>
        <div class="flex-1 text-center">
          <h1
            :class="[page === 1 ? 'text-7xl' : 'text-5xl', 'font-sans font-black tracking-widest uppercase flex items-center justify-center gap-4']"
            :style="{ color: colors.primary }"
          >
            <TriangleLogo :class="page === 1 ? 'w-12 h-12' : 'w-8 h-8'" :color="colors.primary" />
            {{ themeName }}
          </h1>
        </div>
        <div
          class="flex flex-col items-end font-sans font-bold leading-tight cursor-pointer"
          :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('date') }"
          :style="{ color: colors.primary }"
          @click="(e) => handleSelect('date', 'Date', e)"
        >
          <span class="text-xl">{{ data.date.split('-')[0] }}</span>
          <span class="text-lg">{{ data.date.split('-')[1] }}月{{ data.date.split('-')[2] }}日</span>
        </div>
      </header>

      <!-- Page 1 Content -->
      <div v-if="page === 1" class="flex-1 p-8 flex flex-col gap-6 overflow-hidden">
        <div class="grid grid-cols-12 gap-6 pb-6 border-b-2" :style="{ borderColor: colors.secondary }">
          <div class="col-span-7 flex flex-col gap-4">
            <div class="flex items-center gap-2 mb-2">
              <TriangleLogo class="w-6 h-6 rotate-90" :color="colors.primary" />
              <h2 class="text-2xl font-sans font-bold uppercase leading-none" :style="{ color: colors.secondary }">
                今日头条
              </h2>
            </div>
            <div
              class="cursor-pointer"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('frontPage.headline') }"
              @click="(e) => handleSelect('frontPage.headline', 'Headline', e)"
            >
              <h3 class="text-2xl font-bold font-sans leading-tight" :style="{ color: colors.primary }">
                ▲ {{ data.frontPage.headline }}
              </h3>
            </div>
            <div
              class="cursor-pointer"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('frontPage.mainStory') }"
              @click="(e) => handleSelect('frontPage.mainStory', 'Main Story', e)"
            >
              <div class="text-sm font-serif text-justify leading-snug opacity-90 whitespace-pre-wrap line-clamp-[12]">
                <span class="font-bold text-base float-left mr-2 leading-none" :style="{ color: colors.primary }">{{ data.location }} —</span>
                {{ data.frontPage.mainStory }}
              </div>
            </div>
          </div>
          <div class="col-span-5 relative">
            <div
              class="w-full h-full cursor-pointer"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('image') }"
              @click="(e) => handleSelect('image', 'Main Image', e)"
            >
              <div
                class="w-full h-full min-h-[240px] border-4 p-1 bg-white relative shadow-lg"
                :style="{ borderColor: colors.primary }"
              >
                <img v-if="imageSrc" :src="imageSrc" class="w-full h-full object-cover" alt="News" />
                <div v-else class="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 font-sans font-bold animate-pulse text-sm">
                  照片冲印中...
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 gap-8 flex-1">
          <div class="flex flex-col gap-4 border-r pr-6 overflow-hidden" :style="{ borderColor: colors.secondary }">
            <div>
              <h4 class="text-lg font-sans font-black uppercase mb-3 flex items-center gap-2" :style="{ color: colors.primary }">
                <span class="w-2 h-2 rotate-45" :style="{ backgroundColor: colors.primary }"></span>
                本地快讯
              </h4>
              <div class="space-y-3 max-h-[180px] overflow-hidden">
                <div
                  v-for="(snippet, idx) in data.frontPage.newsSnippets"
                  :key="idx"
                  class="relative pl-4 border-l-2 cursor-pointer"
                  :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected(`frontPage.newsSnippets.${idx}`) }"
                  :style="{ borderColor: colors.accent }"
                  @click="(e) => handleSelect(`frontPage.newsSnippets.${idx}`, `Snippet ${idx+1}`, e)"
                >
                  <h5 class="font-bold font-sans text-sm leading-tight mb-1" :style="{ color: colors.secondary }">{{ snippet.title }}</h5>
                  <p class="text-xs font-serif leading-tight opacity-80 text-justify line-clamp-2">{{ snippet.content }}</p>
                </div>
              </div>
            </div>
            <div
              class="cursor-pointer"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('frontPage.column1') }"
              @click="(e) => handleSelect('frontPage.column1', 'Column 1', e)"
            >
              <h4 class="text-xl font-sans font-bold mb-2 text-center" :style="{ color: colors.primary }">{{ data.frontPage.column1.title }}</h4>
              <p class="text-xs font-serif text-justify leading-relaxed columns-2 gap-4 line-clamp-4">{{ data.frontPage.column1.content }}</p>
            </div>
          </div>
          <div class="flex flex-col gap-6 overflow-hidden">
            <div
              class="flex-1 relative cursor-pointer"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('frontPage.column2') }"
              @click="(e) => handleSelect('frontPage.column2', 'Column 2', e)"
            >
              <div class="absolute -left-2 top-2 w-0 h-0 border-l-[10px] border-l-transparent border-t-[10px] border-r-[10px] border-r-transparent" :style="{ borderTopColor: colors.primary }"></div>
              <h4 class="text-xl font-sans font-bold uppercase mb-2 pl-4" :style="{ color: colors.secondary }">{{ data.frontPage.column2.title }}</h4>
              <p class="font-serif text-justify leading-relaxed" style="font-size: clamp(9px, 1.2vw, 11px);">{{ data.frontPage.column2.content }}</p>
            </div>
            <div
              class="flex-1 cursor-pointer bg-opacity-10 px-4 pt-4 pb-2 rounded-tl-[40px] relative"
              :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('frontPage.weirdNews') }"
              :style="{ backgroundColor: colors.accent }"
              @click="(e) => handleSelect('frontPage.weirdNews', 'Weird News', e)"
            >
              <div class="absolute -top-6 right-4">
                <TriangleLogo class="w-16 h-16 animate-bounce" :color="colors.primary" />
              </div>
              <h4 class="text-xl font-sans font-black uppercase mb-2 text-right mt-4" :style="{ color: colors.primary }">{{ data.frontPage.weirdNews.title }}</h4>
              <p class="text-xs font-serif leading-relaxed italic text-justify">{{ data.frontPage.weirdNews.content }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Page 2 Content -->
      <div v-if="page === 2" class="flex-1 p-8 grid grid-cols-12 gap-8 overflow-hidden">
        <div class="col-span-8 flex flex-col gap-8">
          <div
            class="border-b-2 pb-6 cursor-pointer"
            :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('secondPage.editorial') }"
            :style="{ borderColor: colors.secondary }"
            @click="(e) => handleSelect('secondPage.editorial', 'Editorial', e)"
          >
            <h2 class="text-4xl font-sans font-black uppercase mb-4 tracking-tight" :style="{ color: colors.secondary }">
              社论：<span :style="{ color: colors.primary }">{{ data.secondPage.editorial.title }}</span>
            </h2>
            <div class="text-sm font-serif text-justify leading-relaxed columns-2 gap-8 opacity-90 first-letter:text-4xl first-letter:font-bold first-letter:float-left first-letter:mr-2 max-h-[280px] overflow-hidden" v-html="renderMd(data.secondPage.editorial.content)"></div>
          </div>
          <div
            class="flex-1 bg-opacity-5 p-6 rounded-lg border cursor-pointer"
            :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('secondPage.culture') }"
            :style="{ backgroundColor: colors.accent, borderColor: colors.primary }"
            @click="(e) => handleSelect('secondPage.culture', 'Culture', e)"
          >
            <div class="flex items-center gap-2 mb-4 border-b pb-2" :style="{ borderColor: colors.primary }">
              <div class="w-4 h-4 rounded-full" :style="{ backgroundColor: colors.primary }"></div>
              <h3 class="text-xl font-sans font-bold uppercase" :style="{ color: colors.secondary }">{{ data.secondPage.culture.title }}</h3>
            </div>
            <p class="text-sm font-serif leading-relaxed text-justify whitespace-pre-wrap line-clamp-[10]">{{ data.secondPage.culture.content }}</p>
          </div>
        </div>
        <div class="col-span-4 flex flex-col gap-6 border-l pl-6" :style="{ borderColor: colors.secondary }">
          <div class="flex-1">
            <div class="bg-stone-900 text-white p-2 mb-4 text-center font-sans font-bold uppercase tracking-widest" :style="{ backgroundColor: colors.secondary }">分类广告</div>
            <div class="space-y-4">
              <div
                v-for="(ad, idx) in data.secondPage.classifieds"
                :key="idx"
                class="border-b pb-2 last:border-0 border-dashed cursor-pointer"
                :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected(`secondPage.classifieds.${idx}`) }"
                :style="{ borderColor: colors.accent }"
                @click="(e) => handleSelect(`secondPage.classifieds.${idx}`, `Classified ${idx+1}`, e)"
              >
                <h5 class="font-bold text-sm mb-1" :style="{ color: colors.primary }">▲ {{ ad.title }}</h5>
                <p class="text-xs font-serif opacity-80 leading-tight">{{ ad.content }}</p>
              </div>
            </div>
          </div>
          <div
            class="mt-auto border-4 p-4 text-center cursor-pointer"
            :class="{ 'ring-4 ring-red-500 ring-opacity-50 z-20': isSelected('secondPage.horoscope') }"
            :style="{ borderColor: colors.primary }"
            @click="(e) => handleSelect('secondPage.horoscope', 'Horoscope', e)"
          >
            <TriangleLogo class="w-8 h-8 mx-auto mb-2" :color="colors.accent" />
            <h4 class="font-sans font-bold uppercase text-xs tracking-widest mb-2 opacity-60">每日箴言</h4>
            <p class="font-serif italic font-bold text-lg leading-snug" :style="{ color: colors.secondary }">"{{ data.secondPage.horoscope }}"</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div class="mt-auto h-24 overflow-hidden relative w-full flex items-end justify-center bg-transparent border-t-2" :style="{ borderColor: colors.secondary }">
        <div class="text-[100px] leading-[0.7] font-sans font-black tracking-tighter whitespace-nowrap opacity-10 select-none absolute -bottom-6" :style="{ color: colors.secondary }">TRIANGLE AGENCY</div>
        <div class="w-full flex justify-between items-end pb-2 px-2 text-xs font-sans font-bold uppercase tracking-widest opacity-50" :style="{ color: colors.secondary }">
          <span>Page {{ page }} of 2</span>
          <span>Triangle Daily Press © 2024</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Duskvol Layout -->
  <div
    v-else
    class="w-[794px] h-[1123px] flex-shrink-0 relative overflow-hidden shadow-2xl origin-top font-serif flex flex-col"
    :style="{ backgroundColor: duskvolColors.bg, color: duskvolColors.text }"
    @click="handleClear"
  >
    <!-- Background Texture -->
    <div class="absolute inset-0 opacity-10 pointer-events-none" style="background-image: radial-gradient(circle, #44403c 1px, transparent 1px); background-size: 20px 20px;"></div>

    <!-- Border Frame -->
    <div class="absolute inset-4 border-2 border-double pointer-events-none" :style="{ borderColor: duskvolColors.accent }"></div>
    <div class="absolute inset-6 border pointer-events-none" :style="{ borderColor: duskvolColors.border }"></div>


      <!-- Shared Header (Date & VOL) -->
    <header class="pt-12 mx-12 relative z-10">
      <div class="flex justify-between items-end pb-2" :style="{ borderColor: duskvolColors.accent }">
        <div class="font-serif text-xs tracking-[0.2em] opacity-60">
          <span
            class="cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': isSelected('date') }"
            @click="(e) => handleSelect('date', 'Date', e)"
          >{{ data.date }}</span>
        </div>
        <div class="font-serif text-xs tracking-[0.2em] opacity-60">
          VOL. {{ volumeNumber }}
        </div>
      </div>
    </header>

    <!-- Main Content Wrapper -->
    <div class="flex-1 min-h-0 relative z-10 flex flex-col">
      <template v-if="page === 1">
        <!-- Page 1 Title (Only for Page 1) -->
        <div class="mx-12 py-4 flex flex-col items-center border-b-4 border-double" :style="{ borderColor: duskvolColors.accent }">
          <h1 class="text-6xl font-serif font-bold tracking-tighter uppercase mb-2 flex items-center gap-4 text-center leading-none" :style="{ textShadow: `0 0 10px ${duskvolColors.accent}` }">
            <Ghost class="w-10 h-10 opacity-80" />
            The Duskvol Chronicle
          </h1>
          <div class="text-sm font-serif italic mt-1 opacity-80">"Whispers from the Void, Truths from the Shadows"</div>
        </div>

        <div class="flex-1 px-12 py-6 grid grid-cols-3 gap-6">
          <!-- Left Column -->
          <div class="col-span-1 flex flex-col gap-6 border-r border-dashed pr-6" :style="{ borderColor: duskvolColors.border }">
            <div
              class="mb-6 cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': isSelected('frontPage.column1') }"
              @click="(e) => handleSelect('frontPage.column1', 'Column 1', e)"
            >
              <h3 class="font-bold border-b pb-1 mb-2 uppercase text-sm tracking-widest" :style="{ borderColor: duskvolColors.accent }">{{ data.frontPage.column1.title }}</h3>
              <p class="text-xs text-justify leading-relaxed opacity-80">{{ data.frontPage.column1.content }}</p>
            </div>

            <div class="flex-1">
              <h3 class="font-bold border-b pb-1 mb-4 uppercase text-sm tracking-widest flex items-center gap-2" :style="{ borderColor: duskvolColors.accent }">
                <Zap :size="12" /> Whispers
              </h3>
              <div class="space-y-4">
                <div
                  v-for="(snippet, idx) in data.frontPage.newsSnippets"
                  :key="idx"
                  class="relative pl-3 border-l cursor-pointer"
                  :class="{ 'ring-2 ring-blue-500': isSelected(`frontPage.newsSnippets.${idx}`) }"
                  :style="{ borderColor: duskvolColors.accent }"
                  @click="(e) => handleSelect(`frontPage.newsSnippets.${idx}`, `Snippet ${idx+1}`, e)"
                >
                  <h5 class="font-bold text-xs mb-1 text-stone-300">{{ snippet.title }}</h5>
                  <p class="text-[10px] leading-tight opacity-60">{{ snippet.content }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Middle (Main Story) -->
          <div class="col-span-2 flex flex-col gap-2">
            <div
              class="cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': isSelected('frontPage.headline') }"
              @click="(e) => handleSelect('frontPage.headline', 'Headline', e)"
            >
              <h2 class="text-4xl font-bold leading-tight mb-2 font-serif text-white">{{ data.frontPage.headline }}</h2>
            </div>

            <div
              class="w-full h-48 border-4 border-double cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': isSelected('image') }"
              :style="{ borderColor: duskvolColors.border }"
              @click="(e) => handleSelect('image', 'Main Image', e)"
            >
              <div class="w-full h-full bg-black relative overflow-hidden">
                <img v-if="imageSrc" :src="imageSrc" class="w-full h-full object-cover opacity-80 grayscale contrast-125" alt="News" />
                <div v-else class="w-full h-full flex items-center justify-center text-stone-600 text-xs">Developing Plate...</div>
              </div>
            </div>

            <div class="columns-2 gap-6 text-xs text-justify leading-relaxed opacity-90 font-serif">
              <div
                class="cursor-pointer"
                :class="{ 'ring-2 ring-blue-500': isSelected('frontPage.mainStory') }"
                @click="(e) => handleSelect('frontPage.mainStory', 'Main Story', e)"
              >
                <span class="font-bold uppercase tracking-widest mr-1" :style="{ color: duskvolColors.accent }">{{ data.location }} —</span>
                {{ data.frontPage.mainStory }}
              </div>
            </div>

            <div class="mt-auto border-t pt-2 flex gap-2" :style="{ borderColor: duskvolColors.border }">
              <div class="flex-1">
                <div
                  class="cursor-pointer"
                  :class="{ 'ring-2 ring-blue-500': isSelected('frontPage.column2') }"
                  @click="(e) => handleSelect('frontPage.column2', 'Column 2', e)"
                >
                  <h4 class="font-bold text-xs uppercase mb-1 opacity-70">{{ data.frontPage.column2.title }}</h4>
                  <p class="text-[10px] leading-relaxed opacity-60">{{ data.frontPage.column2.content }}</p>
                </div>
              </div>
              <div class="flex-1 bg-stone-800 p-2 border border-stone-700">
                <div
                  class="cursor-pointer"
                  :class="{ 'ring-2 ring-blue-500': isSelected('frontPage.weirdNews') }"
                  @click="(e) => handleSelect('frontPage.weirdNews', 'Weird News', e)"
                >
                  <h4 class="font-bold text-xs uppercase mb-1 text-red-900 flex items-center gap-1"><Skull :size="10" /> {{ data.frontPage.weirdNews.title }}</h4>
                  <p class="text-[10px] leading-tight italic opacity-70">{{ data.frontPage.weirdNews.content }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- Page 2 Content -->
      <div v-else-if="page === 2" class="flex-1 px-12 py-6 grid grid-cols-12 gap-6">
        <div class="col-span-4 border-r border-double pr-6" :style="{ borderColor: duskvolColors.border }">
          <h3 class="text-2xl font-bold mb-6 text-center border-b pb-2 uppercase tracking-widest">Classifieds</h3>
          <div class="space-y-6">
            <div
              v-for="(ad, idx) in data.secondPage.classifieds"
              :key="idx"
              class="text-center cursor-pointer"
              :class="{ 'ring-2 ring-blue-500': isSelected(`secondPage.classifieds.${idx}`) }"
              @click="(e) => handleSelect(`secondPage.classifieds.${idx}`, `Ad ${idx+1}`, e)"
            >
              <h5 class="font-bold text-sm mb-1 uppercase text-stone-400">{{ ad.title }}</h5>
              <p class="text-[10px] opacity-60 italic">{{ ad.content }}</p>
              <div class="mx-auto w-4 h-4 mt-2 text-stone-700"><Anchor :size="12" /></div>
            </div>
          </div>
        </div>
        <div class="col-span-8 flex flex-col gap-8">
          <div
            class="bg-stone-800 p-6 border border-stone-700 cursor-pointer"
            :class="{ 'ring-2 ring-blue-500': isSelected('secondPage.editorial') }"
            @click="(e) => handleSelect('secondPage.editorial', 'Editorial', e)"
          >
            <h2 class="text-3xl font-bold mb-4 italic">"{{ data.secondPage.editorial.title }}"</h2>
            <div class="text-sm leading-7 opacity-80 columns-2 gap-6 text-justify">
              {{ data.secondPage.editorial.content }}
            </div>
          </div>

          <div class="flex gap-6">
            <div class="flex-1">
              <div
                class="cursor-pointer"
                :class="{ 'ring-2 ring-blue-500': isSelected('secondPage.culture') }"
                @click="(e) => handleSelect('secondPage.culture', 'Culture', e)"
              >
                <h3 class="font-bold border-b mb-2 uppercase text-xs" :style="{ borderColor: duskvolColors.accent }">{{ data.secondPage.culture.title }}</h3>
                <p class="text-xs leading-relaxed opacity-70 text-justify">{{ data.secondPage.culture.content }}</p>
              </div>
            </div>
            <div class="w-40 flex flex-col justify-center items-center text-center border p-4" :style="{ borderColor: duskvolColors.border }">
              <div
                class="cursor-pointer"
                :class="{ 'ring-2 ring-blue-500': isSelected('secondPage.horoscope') }"
                @click="(e) => handleSelect('secondPage.horoscope', 'Horoscope', e)"
              >
                <Ghost :size="24" class="mb-2 opacity-50 mx-auto" />
                <p class="text-xs font-bold uppercase mb-2">Dark Wisdom</p>
                <p class="text-[10px] italic leading-tight">"{{ data.secondPage.horoscope }}"</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Shared Footer -->
    <div class="h-12 flex-shrink-0 flex items-center justify-center border-t-4 border-double mx-12 mb-6 relative z-10" :style="{ borderColor: duskvolColors.border }">
      <p class="text-[10px] uppercase tracking-[0.3em] opacity-40">Printed in the district of Crow's Foot • Est. 847 IE</p>
    </div>

    <!-- Side Pattern -->
    <div class="absolute right-0 bottom-0 top-0 w-24 flex flex-col gap-2 opacity-10 overflow-hidden">
      <div v-for="i in 15" :key="i" class="flex gap-4 justify-center items-center">
        <Zap :size="12" :stroke-width="3" :style="{ color: duskvolColors.border }" />
        <Ghost :size="12" :stroke-width="3" :style="{ color: duskvolColors.border }" />
        <Skull :size="12" :stroke-width="3" :style="{ color: duskvolColors.border }" />
      </div>
    </div>
  </div>
</template>
