<script setup lang="ts">
import { TriangleLogo, TrianglePattern } from '#components'
import type { NewsData, ThemeType, ThemeColors } from '~/types'
import MarkdownIt from 'markdown-it'

interface Props {
  data: NewsData
  theme: ThemeType
  themeName: string
  colors: ThemeColors
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

// Markdown Rendering
const md = new MarkdownIt({
  html: true,
  breaks: true,
  typographer: true
})

function renderMd(text: string) {
  if (!text) return ''
  return md.render(text)
}
</script>

<template>
  <div
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
</template>
