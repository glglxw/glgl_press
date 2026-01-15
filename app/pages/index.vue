<script setup lang="ts">
import { BookOpen, Printer, Scroll } from 'lucide-vue-next'
</script>

<template>
  <div class="min-h-screen bg-stone-950 text-stone-200 font-serif selection:bg-orange-900/40 relative overflow-hidden">
    <!-- Ambient Background Effects -->
    <div class="absolute inset-0 bg-[#0c0a09] z-0"></div>
    <div class="absolute inset-0 opacity-20 z-0 bg-stone-900" style="background-image: radial-gradient(circle at 50% 50%, #292524 1px, transparent 1px); background-size: 40px 40px;"></div>
    
    <!-- Hero Section -->
    <div class="pt-24 pb-16 px-4 text-center relative z-10">
      <h1 class="text-5xl md:text-7xl font-black tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-b from-stone-100 to-stone-400 drop-shadow-[0_2px_10px_rgba(255,255,255,0.1)] uppercase">
        Glgl Press
      </h1>
      <p class="text-stone-500 text-xl max-w-2xl mx-auto italic border-y border-stone-800 py-4">
        "Printing the multiverse, one page at a time."
      </p>
    </div>

    <!-- Publications Grid -->
    <div class="max-w-7xl mx-auto px-4 pb-24 relative z-10">
      <div class="grid lg:grid-cols-3 gap-8 items-stretch">
        
        <!-- Triangle Daily (Holographic/Cyber) -->
        <NuxtLink 
          to="/triangle"
          class="group relative overflow-hidden rounded-xl border border-stone-800 bg-stone-900/50 hover:bg-stone-900 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)]"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-red-600/10 to-transparent pointer-events-none"></div>
          <div class="h-56 flex items-center justify-center relative border-b border-stone-800 group-hover:border-red-900/50 transition-colors bg-stone-900">
            <!-- Grid Pattern -->
             <div class="absolute inset-0 opacity-20" style="background-image: linear-gradient(#dc2626 1px, transparent 1px), linear-gradient(90deg, #dc2626 1px, transparent 1px); background-size: 20px 20px;"></div>
            <TriangleLogo class="w-24 h-24 text-stone-700 group-hover:text-red-500 transition-all duration-500 drop-shadow-[0_0_10px_rgba(220,38,38,0.5)]" />
          </div>
          <div class="p-8 flex flex-col h-[calc(100%-14rem)]">
            <h2 class="text-3xl font-black uppercase mb-1 text-stone-300 group-hover:text-red-500 transition-colors font-sans tracking-wide">Triangle Daily</h2>
            <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-red-900/50 group-hover:text-red-500/50 mb-6 transition-colors font-sans">Corporate • Sci-Fi • Geometric</div>
            <p class="text-sm text-stone-500 leading-relaxed mb-6 font-sans">
              For the discerning modern citizen. Geometric precision, corporate euphemisms, and clean lines.
            </p>
            <div class="mt-auto pt-6 border-t border-stone-800 flex justify-between items-center group-hover:border-red-900/30 transition-colors">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-red-500 transition-colors font-sans">Enter System</span>
              <BookOpen class="w-4 h-4 text-stone-700 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </NuxtLink>

        <!-- Duskvol Chronicle (Noir/Gothic) -->
        <NuxtLink 
          to="/duskvol"
          class="group relative overflow-hidden rounded-xl border border-stone-800 bg-[#0c0a09] hover:bg-black transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]"
        >
          <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none"></div>
          <div class="h-56 flex items-center justify-center relative border-b border-stone-800 group-hover:border-blue-900/30 transition-colors bg-black">
             <!-- Rain/Noise Effect -->
             <div class="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48ZmlsdGVyIGlkPSJnoiPjZmVPZmZzZXQgcmVzdWx0PSJyIiBqaT0ibnVsbCIgZHk9Im51bGwiLz48ZmVEaXNwbGFjZW1lbnRNYXAgaW4yPSJyIiBpbj0iU291cmNlR3JhcGhpYyIgc2NhbGU9IjUiLz48L2ZpbHRlcj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iIzAwMDAwMCIgb3BhY2l0eT0iMC4xIiBmaWx0ZXI9InVybCgjbikiLz48L3N2Zz4=')]"></div>
            <span class="text-7xl grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]">👻</span>
          </div>
          <div class="p-8 flex flex-col h-[calc(100%-14rem)]">
            <h2 class="text-3xl font-black uppercase mb-1 text-stone-400 group-hover:text-blue-400 transition-colors font-serif tracking-tight">Duskvol Chronicle</h2>
            <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-blue-900/40 group-hover:text-blue-500/40 mb-6 transition-colors">Noir • Industrial • Ghostly</div>
            <p class="text-sm text-stone-500 leading-relaxed mb-6">
              Whispers from the void. Industrial decay, ghosts, and shadows in a city of eternal night.
            </p>
            <div class="mt-auto pt-6 border-t border-stone-800 flex justify-between items-center group-hover:border-blue-900/30 transition-colors">
              <span class="text-xs font-bold uppercase tracking-wider text-stone-600 group-hover:text-blue-400 transition-colors">Enter Shadows</span>
              <BookOpen class="w-4 h-4 text-stone-700 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>
        </NuxtLink>

        <!-- Adventurer Guild (Parchment/Fantasy) -->
        <NuxtLink 
          to="/adventurer"
          class="group relative overflow-hidden rounded-xl border border-[#5c4033] bg-[#e6dcc3] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(139,69,19,0.4)]"
        >
          <!-- Parchment Texture Overlay -->
          <div class="absolute inset-0 opacity-40 mix-blend-multiply pointer-events-none" 
               style="background-image: url('https://www.transparenttextures.com/patterns/aged-paper.png'); background-size: 200px;"></div>
          
          <!-- Inner Border -->
          <div class="absolute inset-2 border border-[#8b5a2b] opacity-20 rounded-lg pointer-events-none"></div>
          <div class="absolute inset-[10px] border border-dashed border-[#8b5a2b] opacity-20 rounded-md pointer-events-none"></div>

          <div class="h-56 flex items-center justify-center relative border-b border-[#d2b48c] border-double border-4 bg-[#f0e6d2]">
            <div class="absolute inset-0 opacity-10" style="background-image: repeating-linear-gradient(45deg, #8b4513 0, #8b4513 1px, transparent 0, transparent 50%); background-size: 10px 10px;"></div>
            <Scroll class="w-24 h-24 text-[#8b5a2b] group-hover:text-[#654321] group-hover:scale-110 transition-all duration-500 drop-shadow-[2px_4px_6px_rgba(0,0,0,0.2)]" :stroke-width="1.5" />
          </div>
          <div class="p-8 flex flex-col h-[calc(100%-14rem)] relative">
            <h2 class="text-3xl font-black uppercase mb-1 text-[#4a3728] group-hover:text-[#2c1810] transition-colors font-serif tracking-wide drop-shadow-sm">Adventurer's Guild</h2>
            <div class="text-[10px] font-bold tracking-[0.2em] uppercase text-[#8b5a2b]/70 mb-6 border-b border-[#d2b48c] pb-2">Fantasy • Quests • Rumors</div>
            <p class="text-sm text-[#5d4037] leading-relaxed mb-6 font-serif italic">
              "Hear ye, hear ye! Fresh bounties and tavern tales for heroes and vagabonds alike."
            </p>
            <div class="mt-auto pt-6 border-t border-[#d2b48c] flex justify-between items-center">
              <span class="text-xs font-bold uppercase tracking-wider text-[#8b5a2b] group-hover:text-[#654321] transition-colors">Open Scroll</span>
              <BookOpen class="w-4 h-4 text-[#8b5a2b] group-hover:text-[#654321] transition-colors" />
            </div>
          </div>
        </NuxtLink>

      </div>
    </div>

    <!-- Footer -->
    <div class="py-8 text-center text-stone-600 text-[10px] uppercase tracking-[0.2em] relative z-10">
      Triangle Times Generator © 2026 • Crafted in the Multiverse
    </div>
  </div>
</template>
