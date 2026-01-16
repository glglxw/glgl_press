<script setup lang="ts">
import { Scroll, Sword, Shield, Map, Skull } from 'lucide-vue-next'
import type { NewsData, ThemeType, ThemeColors } from '~/types'
import { useAutoFitText } from '~/composables/useAutoFitText'
import type { SectionStyles } from '~/composables/useSectionStyles'

const { autoFitAll } = useAutoFitText()
const containerRef = ref<HTMLElement | null>(null)

onMounted(() => {
  // Disabled auto-fit to allow manual style control
  // if (containerRef.value) {
  //   autoFitAll(containerRef.value)
  // }
})

onUpdated(() => {
  // Disabled auto-fit to allow manual style control
  // if (containerRef.value) {
  //   // Skip auto-fit for sections with manual styles
  //   const elementsWithAutofit = containerRef.value.querySelectorAll('[data-autofit]')
  //   elementsWithAutofit.forEach((el) => {
  //     const element = el as HTMLElement
  //     const container = element.closest('[data-autofit-container]') as HTMLElement
  //     
  //     // Get the section ID from the container
  //     const sectionId = container?.id
  //     const hasManualStyles = sectionId && props.sectionStyles?.[getSectionIdFromDomId(sectionId)]
  //     
  //     // Skip if manual font-size or line-height is set
  //     if (hasManualStyles && (hasManualStyles.fontSize || hasManualStyles.lineHeight)) {
  //       return
  //     }
  //     
  //     // Run auto-fit for this element
  //     if (container) {
  //       const minSize = parseInt(element.dataset.autofitMin || '8')
  //       const maxSize = parseInt(element.dataset.autofitMax || '14')
  //       const { fitTextToContainer } = useAutoFitText()
  //       fitTextToContainer(element, container, minSize, maxSize)
  //     }
  //   })
  // }
})

// Helper to map DOM ID to section path
function getSectionIdFromDomId(domId: string): string {
  const mapping: Record<string, string> = {
    'adv-main-story': 'frontPage.mainStory',
    'adv-rumors': 'frontPage.newsSnippets',
    // Add more mappings as needed
  }
  return mapping[domId] || domId
}

interface Props {
  data: NewsData
  theme?: ThemeType
  imageSrc?: string
  page?: number
  onSectionSelect?: (path: string, label: string) => void
  selectedSectionId?: string | null
  sectionStyles?: Record<string, SectionStyles>
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



const volumeNumber = computed(() => {
  const match = props.data?.location?.match(/Vol\. (\d+)/)
  return match ? match[1] : '1'
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
  },
  PARCHMENT: {
    primary: '#4a3728', secondary: '#8b5a2b', background: '#f5f5dc', text: '#4a3728', accent: '#8b4513'
  }
}

// Adventurer colors
const adventurerColors = computed(() => ({
  accent: THEMES[props.theme || 'PARCHMENT'].accent,
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
    ref="containerRef"
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
        <header id="adv-header" class="flex items-end justify-between mb-8 relative">
            <div class="absolute bottom-0 left-0 right-0 h-1 bg-[#4a3728] opacity-80" style="clip-path: polygon(0 40%, 100% 0, 98% 100%, 2% 80%); filter: url(#ink-bleed);"></div>
            
            <div class="flex items-center gap-6">
                <div class="relative">
                    <div class="absolute inset-0 bg-[#8b4513] rounded-full blur-md opacity-30"></div>
                    <Scroll class="w-16 h-16 text-[#654321] drop-shadow-md relative z-10" :stroke-width="1.5" style="filter: drop-shadow(2px 4px 6px rgba(0,0,0,0.3));" />
                </div>
                <div>
                    <h1>
                        冒险者公会日报
                    </h1>
                    <div class="subtitle">Adventurer's Guild Daily</div>
                </div>
            </div>
            
            <div class="text-right mb-2">
                <div 
                    id="adv-date"
                    class="cursor-pointer"
                    :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('date') }"
                    @click="(e) => handleSelect('date', 'Date', e)"
                >
                    {{ data.date }}
                </div>
                <div class="meta">
                    {{ data.location }} • Vol. {{ volumeNumber }}
                </div>
            </div>
        </header>

        <!-- Page 1 -->
        <template v-if="page === 1">
            <div class="flex-1 grid grid-cols-12 gap-8">
                <!-- Left Parchment Column -->
                <div class="col-span-4 flex flex-col gap-8 relative">
                    <!-- Vertical Ink Divider -->
                    <div class="absolute -right-5 top-0 bottom-0 w-[2px] bg-[#4a3728] opacity-30" style="clip-path: polygon(0 0, 100% 2%, 80% 98%, 10% 100%); filter: url(#ink-bleed);"></div>

                    <!-- Bounties (Pinned Note style) -->
                    <StyledSection 
                        id="adv-bounties"
                        section-id="frontPage.column1"
                        :section-styles="sectionStyles"
                        tag="div"
                        class="cursor-pointer relative"
                        :class="{ 'ring-2 ring-orange-900/50': isSelected('frontPage.column1') }"
                        @click="(e: Event) => handleSelect('frontPage.column1', 'Bounties', e)"
                    >
                        <!-- Pin -->
                        <div class="pin"></div>
                        
                        <div class="header">
                             <Sword class="w-4 h-4" />
                             <h3>WANTED</h3>
                             <Sword class="w-4 h-4 transform scale-x-[-1]" />
                        </div>
                        <div class="content">{{ data.frontPage.column1.content }}</div>
                    </StyledSection>

                    <!-- Rumors -->
                    <div id="adv-rumors" class="flex-1 mt-2 overflow-hidden">
                         <h3 class="header">
                            <Map class="w-4 h-4" /> Tavern Rumors
                        </h3>
                        <div class="content">
                            <StyledSection 
                                v-for="(snippet, idx) in data.frontPage.newsSnippets"
                                :key="idx"
                                class="item group"
                                section-id="frontPage.rumors"
                                :section-styles="sectionStyles"
                                tag="div"
                                :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.rumors') }"
                                @click="(e: Event) => handleSelect('frontPage.rumors', 'Tavern Rumors', e)"
                                data-autofit-container
                            >
                                <div class="dot"></div>
                                <h5>{{ snippet.title }}</h5>
                                <p 
                                    data-autofit
                                    data-autofit-min="8"
                                    data-autofit-max="12"
                                >"{{ snippet.content }}"</p>
                            </StyledSection>
                        </div>
                    </div>
                </div>

                <!-- Right Main Column -->
                <div class="col-span-8 flex flex-col h-full relative">
                    <!-- Headline -->
                    <div 
                        id="adv-headline"
                        class="cursor-pointer mb-4"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.headline') }"
                        @click="(e) => handleSelect('frontPage.headline', 'Headline', e)"
                    >
                        <h2 style="filter: url(#ink-bleed);">{{ data.frontPage.headline }}</h2>
                    </div>

                    <!-- Main Image (Painting Style) -->
                    <StyledSection
                        section-id="image"
                        :section-styles="sectionStyles"
                        :enable-typography="false"
                        tag="div"
                        class="w-full mb-6 relative z-10"
                    >
                        <div 
                            id="adv-main-image"
                            class="w-full h-72 p-2 bg-white shadow-md cursor-pointer transform rotate-1 hover:rotate-0 transition-transform relative"
                            :class="{ 'ring-2 ring-orange-900/50': isSelected('image') }"
                            @click="(e: Event) => handleSelect('image', 'Main Image', e)"
                        >
                            <!-- Rough Sketch Borders -->
                            <div class="border-sketch" style="clip-path: polygon(0 0, 100% 1%, 99% 100%, 1% 99%); filter: url(#ink-bleed);"></div>
                            
                            <div class="image-container">
                                 <img v-if="imageSrc" :src="imageSrc" alt="News" />
                                 <div v-else class="placeholder">
                                    <span class="animate-pulse">Divining Image...</span>
                                 </div>
                            </div>
                        </div>
                    </StyledSection>

                    <!-- Main Story -->
                    <div 
                        id="adv-main-story"
                        data-autofit-container
                    >
                        <StyledSection
                            section-id="frontPage.mainStory"
                            :section-styles="sectionStyles"
                            tag="div"
                            content-class="content"
                            :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.mainStory') }"
                            @click="(e: Event) => handleSelect('frontPage.mainStory', 'Main Story', e)"
                            data-autofit
                            data-autofit-min="9"
                            data-autofit-max="18"
                        >
                            {{ data.frontPage.mainStory }}
                        </StyledSection>
                    </div>

                    <!-- Footer With Spacer & Announcements -->
                    <div id="adv-footer" class="mt-auto relative pt-3">
                         <!-- Small Footer Spacer -->
                        <div class="spacer"></div>
                        
                        <StyledSection 
                            section-id="frontPage.footerInfo"
                            :section-styles="sectionStyles"
                            :enable-typography="false"
                            tag="div"
                            class="group-container"
                            content-class="flex gap-4"
                            :class="{ 'ring-2 ring-orange-900/30 rounded p-1': isSelected('frontPage.footerInfo') }"
                            @click="(e: Event) => handleSelect('frontPage.footerInfo', 'Footer Sections', e)"
                        >
                            <StyledSection 
                                id="adv-decrees"
                                section-id="frontPage.footerInfo"
                                :section-styles="sectionStyles"
                                :enable-offset="false"
                                tag="div"
                                class="cursor-pointer flex-1"
                                :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('frontPage.footerInfo') }"
                            >
                                <h4>Guild Decrees</h4>
                                <p>{{ data.frontPage.column2.content }}</p>
                            </StyledSection>
                            
                            <StyledSection 
                                id="adv-monster-guide"
                                section-id="frontPage.footerInfo"
                                :section-styles="sectionStyles"
                                :enable-offset="false"
                                tag="div"
                                class="cursor-pointer flex-1"
                                :class="{ 'ring-2 ring-orange-500 rounded': isSelected('frontPage.footerInfo') }"
                            >
                                <h4>
                                    <Skull class="w-3 h-3" /> {{ data.frontPage.weirdNews.title }}
                                </h4>
                                <p>{{ data.frontPage.weirdNews.content }}</p>
                            </StyledSection>
                        </StyledSection>
                    </div>
                </div>
            </div>
        </template>

        <!-- Page 2 -->
        <template v-else-if="page === 2">
            <div class="flex-1 grid grid-cols-12 gap-6 overflow-hidden">
                <!-- Left Column -->
                <div class="col-span-4 flex flex-col gap-8 relative">
                     <!-- Vertical Ink Divider -->
                    <div class="absolute -right-5 top-0 bottom-0 w-[2px] bg-[#4a3728] opacity-30" style="clip-path: polygon(0 0, 100% 2%, 80% 98%, 10% 100%); filter: url(#ink-bleed);"></div>

                    <!-- Recruitment Board -->
                    <div id="adv-party-board">
                         <div class="header">
                             <div class="line"></div>
                             <h3>Party Board</h3>
                         </div>
                         
                         <div class="space-y-4">
                            <div 
                                v-for="(ad, idx) in data.secondPage.classifieds"
                                :key="idx"
                                class="ad-item"
                                :class="{ 'ring-2 ring-orange-900/50': isSelected(`secondPage.classifieds.${idx}`) }"
                                @click="(e) => handleSelect(`secondPage.classifieds.${idx}`, `Recruitment ${idx+1}`, e)"
                                style="transform: rotate(var(--rotation)); --rotation: -1deg;"
                            >
                                <div class="flex justify-between items-start mb-1">
                                    <h5>{{ ad.title }}</h5>
                                </div>
                                <p>{{ ad.content }}</p>
                            </div>
                         </div>
                    </div>

                    <!-- Oracle -->
                    <StyledSection 
                        id="adv-horoscope"
                        section-id="secondPage.horoscope"
                        :section-styles="sectionStyles"
                        tag="div"
                        class="cursor-pointer relative overflow-hidden aspect-square flex flex-col justify-center items-center"
                        content-class="w-full flex flex-col items-center"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('secondPage.horoscope') }"
                        @click="(e: Event) => handleSelect('secondPage.horoscope', 'Horoscope', e)"
                    >
                        <div class="border-ring" style="filter: url(#ink-bleed);"></div>
                        <h4>The Seer's Eye</h4>
                        <p>"{{ data.secondPage.horoscope }}"</p>
                    </StyledSection>
                </div>

                <!-- Right Column -->
                <div class="col-span-8 flex flex-col gap-4 overflow-hidden">
                    <!-- Editorial -->
                    <div 
                        id="adv-editorial"
                        class="cursor-pointer relative flex-1"
                        :class="{ 'ring-2 ring-orange-900/50 rounded': isSelected('secondPage.editorial') }"
                        @click="(e) => handleSelect('secondPage.editorial', 'Editorial', e)"
                    >
                        <!-- Decorative Header -->
                        <div class="header">
                            <div class="line"></div>
                            <h2 style="filter: url(#ink-bleed);">{{ data.secondPage.editorial.title }}</h2>
                            <div class="line"></div>
                        </div>
                        
                        <StyledSection 
                            section-id="secondPage.editorial"
                            :section-styles="sectionStyles"
                            tag="div"
                            content-class="content"
                        >
                            {{ data.secondPage.editorial.content }}
                        </StyledSection>

                         <!-- Horizontal Ink Divider -->
                        <div class="divider" style="clip-path: polygon(0 50%, 100% 0, 95% 100%, 5% 90%); filter: url(#ink-bleed);"></div>
                    </div>

                    <!-- Market Watch -->
                    <StyledSection 
                        id="adv-market"
                        section-id="secondPage.culture"
                        :section-styles="sectionStyles"
                        tag="div"
                        class="cursor-pointer relative overflow-hidden flex-1"
                        :class="{ 'ring-2 ring-orange-900/50': isSelected('secondPage.culture') }"
                        @click="(e: Event) => handleSelect('secondPage.culture', 'Market', e)"
                        style="clip-path: polygon(1% 1%, 99% 0, 100% 99%, 0 100%);"
                    >
                         <!-- Stain -->
                        <div class="stain"></div>

                        <div class="header">
                            <h3>{{ data.secondPage.culture.title }}</h3>
                        </div>
                        <p>{{ data.secondPage.culture.content }}</p>
                    </StyledSection>
                </div>
                
            </div>
        </template>
    </div>
  </div>
</template>

<style scoped>
/* Header Styles */
#adv-header h1 {
  @apply text-4xl font-black uppercase tracking-widest leading-none text-[#2c1810] whitespace-nowrap;
  filter: url(#ink-bleed);
  text-shadow: 2px 2px 0px rgba(139,69,19,0.3);
}

#adv-header .subtitle {
  @apply text-xs font-bold tracking-[0.3em] uppercase text-[#8b5a2b] mt-1 pl-1;
}

#adv-date {
  @apply text-2xl font-bold text-[#4a3728];
  transform: rotate(-2deg);
}

#adv-header .meta {
  @apply text-xs font-bold tracking-widest text-[#8b5a2b] opacity-80 mt-1;
}

/* Bounties Styles */
#adv-bounties {
  @apply bg-[#dfd3bc] p-4 shadow-lg transform -rotate-1;
  box-shadow: 2px 4px 8px rgba(0,0,0,0.2);
}

#adv-bounties .pin {
  @apply absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-[#8b4513] shadow-inner border border-[#4a3728]/50 z-20;
}

#adv-bounties .header {
  @apply border-b-2 border-[#8b5a2b] pb-2 mb-2 flex items-center justify-center gap-2 opacity-80 border-dashed;
}

#adv-bounties .header h3 {
  @apply font-bold text-lg uppercase;
}

#adv-bounties .content {
  @apply leading-relaxed font-semibold text-[#4a3728] whitespace-pre-wrap font-serif;
}

/* Rumors Styles */
#adv-rumors .header {
  @apply font-bold text-base uppercase mb-2 text-[#654321] flex items-center gap-2 border-b border-[#654321] pb-1 w-max;
  transform: rotate(1deg);
}

#adv-rumors .content {
  @apply space-y-3 h-full flex flex-col;
}

#adv-rumors .item {
  @apply cursor-pointer relative pl-3 flex flex-col;
}

#adv-rumors .dot {
  @apply absolute left-0 top-1.5 w-1.5 h-1.5 bg-[#8b4513] rounded-full opacity-60;
}

#adv-rumors h5 {
  @apply font-bold text-[#4a3728] mb-0.5 group-hover:text-[#8b4513] transition-colors;
  font-size: 1.1em;
}

#adv-rumors p {
  @apply leading-tight text-[#5d4037] italic;
  font-size: 1em;
}

/* Headline Styles */
#adv-headline {
  @apply text-center;
}

#adv-headline h2 {
  @apply text-4xl font-black leading-tight text-[#2c1810];
}

/* Main Image Styles */
#adv-main-image {
  @apply w-full h-72 p-2 bg-white shadow-md transform rotate-1 hover:rotate-0 transition-transform mb-3;
}

#adv-main-image .border-sketch {
  @apply absolute inset-0 border-2 border-[#4a3728] opacity-80;
}

#adv-main-image .image-container {
  @apply w-full h-full overflow-hidden relative grayscale-[0.2] sepia-[0.4] contrast-[1.1];
}

#adv-main-image img {
  @apply w-full h-full object-cover;
}

#adv-main-image .placeholder {
  @apply w-full h-full flex items-center justify-center bg-[#f0e6d2] text-[#8b5a2b] font-serif italic text-lg opacity-60;
}

/* Main Story Styles */
#adv-main-story {
  flex: 1;
  columns: 2;
  column-gap: var(--section-gap, 1.25rem);
  text-align: justify;
  color: #2c1810;
  margin-bottom: 0.5rem;
  overflow: hidden;
  width: var(--section-width, auto);
  height: var(--section-height, auto);
  transform: translate(var(--section-offset-x, 0), var(--section-offset-y, 0));
  padding: var(--section-padding, 0);
  font-size: var(--section-font-size, inherit);
  line-height: var(--section-line-height, 1.8);
}

#adv-main-story .content {
  @apply cursor-pointer first-letter:text-3xl first-letter:font-black first-letter:float-left first-letter:mr-2 first-letter:leading-none first-letter:text-[#654321];
}

/* Footer Styles */
#adv-footer .spacer {
  @apply absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-[#8b4513] opacity-30 rounded-full;
}

#adv-decrees h4 {
  @apply font-bold uppercase mb-1 text-[#8b5a2b] tracking-wider;
}

#adv-decrees p {
  @apply leading-snug opacity-90 font-medium;
}

#adv-monster-guide {
  @apply bg-[#2c1810] text-[#e6dcc3] p-2 shadow-inner transform -rotate-1;
  clip-path: polygon(2% 2%, 98% 0, 100% 98%, 0 100%);
}

#adv-monster-guide h4 {
  @apply font-bold uppercase mb-1 flex items-center gap-1 text-[#d2b48c] border-b border-[#d2b48c]/30 pb-1;
}

#adv-monster-guide p {
  @apply leading-snug italic opacity-90;
}

/* Page 2 Styles */
/* Party Board */
#adv-party-board .header {
  @apply text-center mb-6 relative;
}

#adv-party-board .header .line {
  @apply absolute inset-x-0 bottom-1 h-[1px] bg-[#4a3728] opacity-40;
}

#adv-party-board h3 {
  @apply text-2xl font-black uppercase tracking-widest text-[#654321];
}

#adv-party-board .ad-item {
  @apply p-3 bg-white/40 border border-[#8b5a2b]/30 shadow-sm cursor-pointer hover:bg-white/60 transition-colors;
}

#adv-party-board h5 {
  @apply font-bold text-sm text-[#4a3728];
}

#adv-party-board p {
  @apply text-xs leading-normal opacity-90 text-[#2c1810] font-medium;
}

/* Horoscope */
#adv-horoscope {
  @apply mt-auto p-4 text-center;
}

#adv-horoscope .border-ring {
  @apply absolute inset-0 border-2 border-[#8b5a2b] opacity-40 rounded-full;
}

#adv-horoscope h4 {
  @apply uppercase font-bold mb-2 text-[#8b5a2b] tracking-[0.15em];
}

#adv-horoscope p {
  @apply font-serif italic font-bold text-[#4a3728] line-clamp-4;
}

/* Editorial */
#adv-editorial {
  @apply pb-4;
}

#adv-editorial .header {
  @apply flex items-center gap-3 mb-4;
}

#adv-editorial .line {
  @apply h-[2px] flex-1 bg-[#4a3728] opacity-40;
}

#adv-editorial h2 {
  @apply text-2xl font-black uppercase whitespace-nowrap text-[#2c1810];
}

#adv-editorial .content {
  @apply columns-2 gap-6 leading-6 text-justify whitespace-pre-wrap font-medium text-[#2c1810];
}

#adv-editorial .divider {
  @apply absolute bottom-0 left-10 right-10 h-[2px] bg-[#4a3728] opacity-20;
}

/* Market Watch */
#adv-market {
  @apply bg-[#dcd0b9] p-4 shadow-inner;
}

#adv-market .stain {
  @apply absolute -right-10 -bottom-10 w-40 h-40 bg-[#8b5a2b] opacity-10 rounded-full blur-xl;
}

#adv-market .header {
  @apply flex items-center justify-between mb-2 border-b border-[#4a3728]/20 pb-1;
}

#adv-market h3 {
  @apply text-[1.2em] font-bold uppercase text-[#654321];
}

#adv-market p {
  @apply text-justify whitespace-pre-wrap font-medium opacity-90;
}
</style>
