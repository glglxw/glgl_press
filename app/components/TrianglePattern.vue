<script setup lang="ts">
interface Props {
  color?: string
  class?: string
}

const props = withDefaults(defineProps<Props>(), {
  color: '#000'
})
</script>

<template>
  <div :class="['flex flex-col gap-2 opacity-10', props.class]">
    <div 
      v-for="i in 15" 
      :key="i" 
      class="flex gap-2 justify-center items-center"
    >
      <!-- Simple geometric pattern for Triangle -->
      <div 
        class="w-0 h-0 border-l-[6px] border-l-transparent border-b-[10px] border-r-[6px] border-r-transparent"
        :style="{ borderBottomColor: props.color }"
      />
      <div 
        class="w-0 h-0 border-l-[6px] border-l-transparent border-t-[10px] border-r-[6px] border-r-transparent"
        :style="{ borderTopColor: props.color }"
      />
      <div 
        class="w-0 h-0 border-l-[6px] border-l-transparent border-b-[10px] border-r-[6px] border-r-transparent"
        :style="{ borderBottomColor: props.color }"
      />
    </div>
  </div>
</template>
