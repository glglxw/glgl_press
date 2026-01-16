<script setup lang="ts">
import type { SectionStyles } from '~/composables/useSectionStyles'

interface Props {
  sectionId: string
  sectionStyles?: Record<string, SectionStyles>
  tag?: string
  contentClass?: string
  enableOffset?: boolean
  enableTypography?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  tag: 'div',
  contentClass: '',
  enableOffset: true,
  enableTypography: true
})

// Get container styles (transform, position)
const containerStyles = computed(() => {
  const styles = props.sectionStyles?.[props.sectionId] || {}
  const vars: Record<string, string> = {}
  
  if (props.enableOffset) {
    if (styles.offsetX || styles.offsetY) {
      vars['transform'] = `translate(${styles.offsetX || '0'}, ${styles.offsetY || '0'})`
    }
  }
  
  return vars
})

// Get content styles (fontSize, lineHeight)
const contentStyles = computed(() => {
  const styles = props.sectionStyles?.[props.sectionId] || {}
  const vars: Record<string, string> = {}
  
  if (props.enableTypography) {
    if (styles.fontSize) vars['fontSize'] = styles.fontSize
    if (styles.lineHeight) vars['lineHeight'] = styles.lineHeight
  }
  
  return vars
})
</script>

<template>
  <component 
    :is="tag" 
    :style="containerStyles"
  >
    <div :class="contentClass" :style="contentStyles">
      <slot />
    </div>
  </component>
</template>
