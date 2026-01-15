<script setup lang="ts">
import { BookOpen, Printer } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-stone-900 via-stone-800 to-stone-900 flex flex-col items-center justify-center p-8">
    <div class="text-center mb-16">
      <h1 class="text-6xl font-black text-white mb-4 tracking-tight">
        咕噜咕噜日报生成系统
      </h1>
      <p class="text-stone-400 text-lg font-serif">
        选择您要访问的刊物
      </p>
    </div>

    <div class="grid md:grid-cols-2 gap-8 max-w-4xl w-full">
      <!-- Triangle Daily -->
      <NuxtLink 
        to="/triangle"
        class="group bg-gradient-to-br from-red-900/30 to-red-950/50 border-2 border-red-800/50 hover:border-red-500 rounded-lg p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
      >
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-red-600 flex items-center justify-center">
            <TriangleLogo color="white" class="w-10 h-10" />
          </div>
          <div>
            <h2 class="text-3xl font-black text-white group-hover:text-red-400 transition-colors">三角日报</h2>
            <p class="text-red-400 text-sm font-sans uppercase tracking-widest">Triangle Daily</p>
          </div>
        </div>
        <p class="text-stone-300 font-serif leading-relaxed mb-6">
          先锋派现代风格日报。几何图形、锐利线条、专业视角。四种配色风格可选。
        </p>
        <div class="flex gap-4">
          <span class="inline-flex items-center gap-2 text-xs font-bold text-red-400 bg-red-950 px-3 py-1 rounded">
            <BookOpen :size="12" /> 阅读器
          </span>
          <NuxtLink 
            to="/triangle/editor" 
            class="inline-flex items-center gap-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 px-3 py-1 rounded transition-colors"
            @click.stop
          >
            <Printer :size="12" /> 编辑器
          </NuxtLink>
        </div>
      </NuxtLink>

      <!-- Duskvol Chronicle -->
      <NuxtLink 
        to="/duskvol"
        class="group bg-gradient-to-br from-stone-800/50 to-stone-900/50 border-2 border-stone-600/50 hover:border-stone-400 rounded-lg p-8 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-stone-500/20"
      >
        <div class="flex items-center gap-4 mb-6">
          <div class="w-16 h-16 bg-stone-700 flex items-center justify-center rounded">
            <span class="text-3xl">👻</span>
          </div>
          <div>
            <h2 class="text-3xl font-black text-white group-hover:text-stone-300 transition-colors">多斯科沃公报</h2>
            <p class="text-stone-400 text-sm font-serif italic tracking-widest">The Duskvol Chronicle</p>
          </div>
        </div>
        <p class="text-stone-300 font-serif leading-relaxed mb-6">
          暗夜刀锋 (Blades in the Dark) 风格日报。维多利亚工业幻想、阴暗氛围、蒸汽朋克美学。
        </p>
        <div class="flex gap-4">
          <span class="inline-flex items-center gap-2 text-xs font-bold text-stone-300 bg-stone-800 px-3 py-1 rounded">
            <BookOpen :size="12" /> 阅读器
          </span>
          <NuxtLink 
            to="/duskvol/editor" 
            class="inline-flex items-center gap-2 text-xs font-bold text-white bg-stone-600 hover:bg-stone-500 px-3 py-1 rounded transition-colors"
            @click.stop
          >
            <Printer :size="12" /> 编辑器
          </NuxtLink>
        </div>
      </NuxtLink>
    </div>

    <div class="mt-16 text-center text-stone-500 text-sm">
      <p>咕噜咕噜小屋 © 2026</p>
    </div>
  </div>
</template>
