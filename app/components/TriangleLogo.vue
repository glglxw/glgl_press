<script setup lang="ts">
interface Props {
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#dc2626'
})
</script>

<template>
  <svg 
    viewBox="0 0 100 87" 
    xmlns="http://www.w3.org/2000/svg"
    :class="props.class"
  >
    <polygon 
      points="50,0 100,87 0,87" 
      :fill="props.color"
    />
  </svg>
</template>
