<script setup lang="ts">
import { Scroll, Sword, Shield, Map, Skull } from 'lucide-vue-next'
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

// Adventurer colors
const adventurerColors = computed(() => ({
  accent: THEMES[props.theme].accent,
  text: '#4a3728',
  bg: '#f5f5dc',
  border: '#d2b48c',
  secondary: '#8b5a2b'
}))
</script>

<template>
  <div
    class="w-[794px] h-[1123px] flex-shrink-0 relative overflow-hidden shadow-xl origin-top font-serif flex flex-col text-[#2c1810]"
    :style="{ backgroundColor: '#e6dcc3' }"
    @click="handleClear"
  >
    <!-- SVG Filters for Ink Bleed & Rough Edges -->
    <svg width="0" height="0" class="absolute">
      <filter id="ink-bleed">
        <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise" />
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
      </filter>
      <filter id="rough-paper">
         <!-- Increased frequency for finer grain, reduced surfaceScale for flatter texture -->
         <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="3" result="noise" />
         <feDiffuseLighting in="noise" lighting-color="#e6dcc3" surfaceScale="0.8">
            <feDistantLight azimuth="45" elevation="60" />
         </feDiffuseLighting>
      </filter>
    </svg>

    <!-- Background Texture Layers -->
    <!-- 1. Base Roughness (Reduced visibility) -->
    <div class="absolute inset-0 opacity-50 pointer-events-none mix-blend-multiply" 
         style="filter: url(#rough-paper) contrast(1.1) brightness(0.95);"></div>
    
    <!-- 2. Aged Stains (Softer stains) -->
    <div class="absolute inset-0 opacity-20 pointer-events-none mix-blend-multiply"
         style="background-image: radial-gradient(circle at 30% 20%, #8b5a2b 0%, transparent 40%), radial-gradient(circle at 80% 80%, #654321 0%, transparent 40%), radial-gradient(circle at 50% 50%, #d2b48c 0%, transparent 70%); filter: blur(80px);"></div>
    
    <!-- 3. Paper Texture Image Overlay (More subtle) -->
    <div class="absolute inset-0 opacity-30 pointer-events-none mix-blend-multiply" 
         style="background-image: url('https://www.transparenttextures.com/patterns/aged-paper.png'); background-size: 300px;"></div>

    <!-- 4. Burnt/Dark Edges (Softer edges) -->
    <div class="absolute inset-0 pointer-events-none" 
         style="box-shadow: inset 0 0 100px rgba(45, 25, 10, 0.3), inset 0 0 20px rgba(45, 25, 10, 0.4);"></div>

    <!-- Content Container -->
    <div class="relative z-10 w-full h-full flex flex-col p-16 pb-12">
        
        <!-- Header: Guild Seal & Title -->
        <header class="flex items-end justify-between mb-8 relative">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-[#4a3728] opacity-80" style="clip-path: polygon(0 40%, 100% 0, 98% 100%, 2% 80%); filter: url(#ink-bleed);"></div>
            
            <div class="flex items-center gap-6">
                <div class="relative">
                    <div class="absolute inset-0 bg-[#8b4513] rounded-full blur-md opacity-30"></div>
                    <Scroll class="w-16 h-16 text-[#654321] drop-shadow-md relative z-10" :stroke-width="1.5" style="filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));" />
                </div>
                <div>
                    <h1 class="text-5xl font-black uppercase tracking-widest leading-none text-[#2c1810]" style="filter: url(#ink-bleed); text-shadow: 2px 2px 0px rgba(139,69,19,0.3);">
                        冒险者公会日报
                    </h1>
                    <div class="text-sm font-bold tracking-[0.5em] uppercase text-[#8b5a2b] mt-1 pl-1">Adventurer's Guild Daily</div>
                </div>
            </div>
            
            <div class="text-right mb-2">
                <div 
                    class="text-2xl font-bold cursor-pointer text-[#4a3728]"
                    :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('date') }"
                    @click="(e) => handleSelect('date', 'Date', e)"
                    style="transform: rotate(-2deg);"
                >
                    {{ data.date }}
                </div>
                <div class="text-xs font-bold tracking-widest text-[#8b5a2b] opacity-80 mt-1">
                    {{ data.location }} • Vol. {{ volumeNumber }}
                </div>
            </div>
        </header>

        <!-- Page 1 -->
        <template v-if="page === 1">
            <div class="flex-1 grid grid-cols-12 gap-10">
                <!-- Left Parchment Column -->
                <div class="col-span-4 flex flex-col gap-8 relative">
                    <!-- Vertical Ink Divider -->
                    <div class="absolute -right-5 top-0 bottom-0 w-[2px] bg-[#4a3728] opacity-30" style="clip-path: polygon(0 0, 100% 2%, 80% 98%, 10% 100%); filter: url(#ink-bleed);"></div>

                    <!-- Bounties (Pinned Note style) -->
                    <div 
                        class="bg-[#dfd3bc] p-4 shadow-lg transform -rotate-1 cursor-pointer relative"
                        :class="{ 'ring-2 ring-orange-900/50': isSelected('frontPage.column1') }"
                        @click="(e) => handleSelect('frontPage.column1', 'Bounties', e)"
                        style="box-shadow: 2px 4px 8px rgba(0,0,0,0.2);"
                    >
                        <!-- Pin -->
                        <div class="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8b4513] shadow-inner border border-[#4a3728/50] z-20"></div>
                        
                        <div class="border-b-2 border-[#8b5a2b] pb-2 mb-2 flex items-center justify-center gap-2 opacity-80 border-dashed">
                             <Sword class="w-4 h-4" />
                             <h3 class="font-bold text-lg uppercase">WANTED</h3>
                             <Sword class="w-4 h-4 transform scale-x-[-1]" />
                        </div>
                        <div class="text-sm leading-relaxed font-semibold text-[#4a3728] whitespace-pre-wrap font-serif">{{ data.frontPage.column1.content }}</div>
                    </div>

                    <!-- Rumors -->
                    <div class="flex-1 mt-4">
                         <h3 class="font-bold text-xl uppercase mb-4 text-[#654321] flex items-center gap-2 border-b border-[#654321] pb-1 w-max" style="transform: rotate(1deg);">
                            <Map class="w-5 h-5" /> Tavern Rumors
                        </h3>
                        <div class="space-y-6">
                            <div 
                                v-for="(snippet, idx) in data.frontPage.newsSnippets"
                                :key="idx"
                                class="cursor-pointer group relative pl-4"
                                :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected(`frontPage.newsSnippets.${idx}`) }"
                                @click="(e) => handleSelect(`frontPage.newsSnippets.${idx}`, `Rumor ${idx+1}`, e)"
                            >
                                <div class="absolute left-0 top-2 w-2 h-2 bg-[#8b4513] rounded-full opacity-60"></div>
                                <h5 class="font-bold text-base text-[#4a3728] mb-1 group-hover:text-[#8b4513] transition-colors">{{ snippet.title }}</h5>
                                <p class="text-sm leading-tight text-[#5d4037] italic">"{{ snippet.content }}"</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Right Main Column -->
                <div class="col-span-8 flex flex-col h-full relative">
                    <!-- Headline -->
                    <div 
                        class="text-center cursor-pointer mb-6"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.headline') }"
                        @click="(e) => handleSelect('frontPage.headline', 'Headline', e)"
                    >
                        <h2 class="text-5xl font-black leading-tight text-[#2c1810]" style="filter: url(#ink-bleed);">{{ data.frontPage.headline }}</h2>
                    </div>

                    <!-- Main Image (Painting Style) -->
                    <div 
                        class="w-full h-72 p-2 bg-white shadow-md cursor-pointer transform rotate-1 hover:rotate-0 transition-transform mb-6 relative"
                        :class="{ 'ring-2 ring-orange-900/50': isSelected('image') }"
                        @click="(e) => handleSelect('image', 'Main Image', e)"
                    >
                        <!-- Rough Sketch Borders -->
                        <div class="absolute inset-0 border-2 border-[#4a3728] opacity-80" style="clip-path: polygon(0 0, 100% 1%, 99% 100%, 1% 99%); filter: url(#ink-bleed);"></div>
                        
                        <div class="w-full h-full overflow-hidden relative grayscale-[0.2] sepia-[0.4] contrast-[1.1]">
                             <img v-if="imageSrc" :src="imageSrc" class="w-full h-full object-cover" alt="News" />
                             <div v-else class="w-full h-full flex items-center justify-center bg-[#f0e6d2] text-[#8b5a2b] font-serif italic text-lg opacity-60">
                                <span class="animate-pulse">Divining Image...</span>
                             </div>
                        </div>
                    </div>

                    <!-- Main Story -->
                    <div class="columns-2 gap-8 text-base leading-7 text-justify text-[#2c1810] mb-4">
                        <div 
                            class="cursor-pointer first-letter:text-5xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:text-[#654321]"
                            :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.mainStory') }"
                            @click="(e) => handleSelect('frontPage.mainStory', 'Main Story', e)"
                        >
                            {{ data.frontPage.mainStory }}
                        </div>
                    </div>

                    <!-- Footer With Spacer & Announcements -->
                    <div class="mt-auto relative pt-8">
                         <!-- Small Footer Spacer -->
                        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#8b4513] opacity-30 rounded-full"></div>
                        
                        <div class="flex gap-6">
                            <div 
                                class="flex-1 cursor-pointer"
                                :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.column2') }"
                                @click="(e) => handleSelect('frontPage.column2', 'Announcements', e)"
                            >
                                <h4 class="font-bold text-sm uppercase mb-2 text-[#8b5a2b] tracking-wider">Guild Decrees</h4>
                                <p class="text-xs leading-relaxed opacity-90 font-medium">{{ data.frontPage.column2.content }}</p>
                            </div>
                            
                            <div 
                                class="flex-1 cursor-pointer bg-[#2c1810] text-[#e6dcc3] p-3 shadow-inner transform -rotate-1"
                                :class="{ 'ring-2 ring-orange-500 rounded': isSelected('frontPage.weirdNews') }"
                                @click="(e) => handleSelect('frontPage.weirdNews', 'Monster Guide', e)"
                                style="clip-path: polygon(2% 2%, 98% 0, 100% 98%, 0 100%);"
                            >
                                <h4 class="font-bold text-sm uppercase mb-1 flex items-center gap-2 text-[#d2b48c] border-b border-[#d2b48c]/30 pb-1">
                                    <Skull class="w-4 h-4" /> {{ data.frontPage.weirdNews.title }}
                                </h4>
                                <p class="text-xs leading-tight italic opacity-90">{{ data.frontPage.weirdNews.content }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </template>

        <!-- Page 2 -->
        <template v-else-if="page === 2">
            <div class="flex-1 grid grid-cols-12 gap-10">
                <!-- Left Column -->
                <div class="col-span-4 flex flex-col gap-8 relative">
                     <!-- Vertical Ink Divider -->
                    <div class="absolute -right-5 top-0 bottom-0 w-[2px] bg-[#4a3728] opacity-30" style="clip-path: polygon(0 0, 100% 2%, 80% 98%, 10% 100%); filter: url(#ink-bleed);"></div>

                    <!-- Recruitment Board -->
                    <div>
                         <div class="text-center mb-6 relative">
                             <div class="absolute inset-x-0 bottom-1 h-[1px] bg-[#4a3728] opacity-40"></div>
                            <h3 class="text-2xl font-black uppercase tracking-widest text-[#654321]" style="filter: url(#ink-bleed);">Party Board</h3>
                         </div>
                         
                         <div class="space-y-4">
                            <div 
                                v-for="(ad, idx) in data.secondPage.classifieds"
                                :key="idx"
                                class="p-3 bg-white/40 border border-[#8b5a2b]/30 shadow-sm cursor-pointer hover:bg-white/60 transition-colors"
                                :class="{ 'ring-2 ring-orange-900/50': isSelected(`secondPage.classifieds.${idx}`) }"
                                @click="(e) => handleSelect(`secondPage.classifieds.${idx}`, `Recruitment ${idx+1}`, e)"
                                style="transform: rotate(var(--rotation)); --rotation: -1deg;"
                            >
                                <div class="flex justify-between items-start mb-1">
                                    <h5 class="font-bold text-sm text-[#4a3728]">{{ ad.title }}</h5>
                                </div>
                                <p class="text-xs leading-normal opacity-90 text-[#2c1810] font-medium">{{ ad.content }}</p>
                            </div>
                         </div>
                    </div>

                    <!-- Oracle -->
                    <div 
                        class="mt-auto p-6 text-center cursor-pointer relative"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('secondPage.horoscope') }"
                        @click="(e) => handleSelect('secondPage.horoscope', 'Horoscope', e)"
                    >
                        <div class="absolute inset-0 border-2 border-[#8b5a2b] opacity-40 rounded-full" style="filter: url(#ink-bleed);"></div>
                        <h4 class="text-xs uppercase font-bold mb-3 text-[#8b5a2b] tracking-[0.2em]">The Seer's Eye</h4>
                        <p class="font-serif italic text-lg font-bold text-[#4a3728] leading-tight">"{{ data.secondPage.horoscope }}"</p>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="col-span-8 flex flex-col gap-8">
                    <!-- Editorial -->
                    <div 
                        class="cursor-pointer relative pb-8"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('secondPage.editorial') }"
                        @click="(e) => handleSelect('secondPage.editorial', 'Editorial', e)"
                    >
                        <!-- Decorative Header -->
                        <div class="flex items-center gap-4 mb-6">
                            <div class="h-[2px] flex-1 bg-[#4a3728] opacity-40"></div>
                            <h2 class="text-3xl font-black uppercase whitespace-nowrap text-[#2c1810]" style="filter: url(#ink-bleed);">{{ data.secondPage.editorial.title }}</h2>
                            <div class="h-[2px] flex-1 bg-[#4a3728] opacity-40"></div>
                        </div>
                        
                        <div class="columns-2 gap-8 text-base leading-7 text-justify whitespace-pre-wrap font-medium text-[#2c1810]">
                            {{ data.secondPage.editorial.content }}
                        </div>

                         <!-- Horizontal Ink Divider -->
                        <div class="absolute bottom-0 left-10 right-10 h-[2px] bg-[#4a3728] opacity-20" style="clip-path: polygon(0 50%, 100% 0, 95% 100%, 5% 90%); filter: url(#ink-bleed);"></div>
                    </div>

                    <!-- Market Watch -->
                    <div 
                        class="flex-1 bg-[#dcd0b9] p-6 shadow-inner cursor-pointer relative overflow-hidden"
                        :class="{ 'ring-2 ring-orange-900/50': isSelected('secondPage.culture') }"
                        @click="(e) => handleSelect('secondPage.culture', 'Market', e)"
                        style="clip-path: polygon(1% 1%, 99% 0, 100% 99%, 0 100%);"
                    >
                         <!-- Stain -->
                        <div class="absolute -right-10 -bottom-10 w-40 h-40 bg-[#8b5a2b] opacity-10 rounded-full blur-xl"></div>

                        <div class="flex items-center justify-between mb-4 border-b border-[#4a3728]/20 pb-2">
                            <h3 class="text-xl font-bold uppercase text-[#654321]">{{ data.secondPage.culture.title }}</h3>
                        </div>
                        <p class="text-sm leading-relaxed text-justify whitespace-pre-wrap font-medium opacity-90">{{ data.secondPage.culture.content }}</p>
                    </div>
                </div>
                
            </div>
        </template>
    </div>
  </div>
</template>
