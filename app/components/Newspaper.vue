<script setup lang="ts">
import type { NewsData, ThemeType, ThemeColors, PublicationType } from '~/types'
import NewspaperTriangle from './NewspaperTriangle.vue'
import NewspaperDuskvol from './NewspaperDuskvol.vue'
import NewspaperAdventurer from './NewspaperAdventurer.vue'

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
  },
  PARCHMENT: {
    primary: '#4a3728', secondary: '#8b5a2b', background: '#f5f5dc', text: '#4a3728', accent: '#8b4513'
  }
}

const colors = computed(() => THEMES[props.theme])

const themeName = computed(() => {
  if (props.publicationType === 'DUSKVOL') return 'The Duskvol Chronicle'
  if (props.publicationType === 'ADVENTURER') return '冒险者公会日报'
  return {
    CLASSIC_RED: '三角日报',
    DEEP_BLUE: '深蓝观察',
    EMERALD: '翡翠之声',
    NOIR: '巨石公报',
    PARCHMENT: '冒险者公会日报'
  }[props.theme]
})

// Deterministic Volume Number based on date
const volumeNumber = computed(() => {
    if (!props.data.date) return 700
    try {
        const epoch = new Date('2024-01-01').getTime()
        const current = new Date(props.data.date).getTime()
        if (isNaN(current)) return 700

        const diffIds = Math.floor((current - epoch) / (1000 * 60 * 60 * 24))
        return Math.max(1, 100 + diffIds) // Base volume 100
    } catch {
        return 700
    }
})
</script>

<template>
  <NewspaperDuskvol
    v-if="publicationType === 'DUSKVOL'"
    :data="data"
    :theme="theme"
    :volume-number="volumeNumber"
    :image-src="imageSrc"
    :page="page"
    :selected-section-id="selectedSectionId"
    :on-section-select="onSectionSelect"
  />
  
  <NewspaperAdventurer
    v-else-if="publicationType === 'ADVENTURER'"
    :data="data"
    :theme="theme"
    :volume-number="volumeNumber"
    :image-src="imageSrc"
    :page="page"
    :selected-section-id="selectedSectionId"
    :on-section-select="onSectionSelect"
  />

  <NewspaperTriangle
    v-else
    :data="data"
    :theme="theme"
    :theme-name="themeName"
    :colors="colors"
    :volume-number="volumeNumber"
    :image-src="imageSrc"
    :page="page"
    :selected-section-id="selectedSectionId"
    :on-section-select="onSectionSelect"
  />
</template>
