<script setup lang="ts">
import { Zap, Ghost, Anchor, Skull } from 'lucide-vue-next'
import type { NewsData, ThemeType, ThemeColors } from '~/types'

interface Props {
  data: NewsData
  theme: ThemeType
  volumeNumber: number
  imageSrc?: string
  page: 1 | 2
  selectedSectionId?: string | null
  onSectionSelect?: (path: string, label: string) => void
}

const props = defineProps<Props>()

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
  },
  PARCHMENT: {
    primary: '#4a3728', secondary: '#8b5a2b', background: '#f5f5dc', text: '#4a3728', accent: '#8b4513'
  }
}

// Duskvol colors
const duskvolColors = computed(() => ({
  accent: THEMES[props.theme].accent,
  text: '#e7e5e4',
  bg: '#1c1917',
  border: '#44403c'
}))
</script>

<template>
  <div
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
