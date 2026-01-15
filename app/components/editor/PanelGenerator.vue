<script setup lang="ts">
import { 
  Layout, Loader2, Wand2, BookOpen, RefreshCw, Calendar 
} from 'lucide-vue-next'

const { t } = useI18n()

interface EditorControl {
  topic: any
  date: any
  theme: any
  loading: any
  loadingStep: any
  allIssues: any[]
  loadingIssues: any
  loadIssueList: () => Promise<void>
  handleGenerate: () => Promise<any>
  handleSelectIssue: (issue: any) => void
  createBlankTemplate: (...args: any[]) => void
}

const props = defineProps<{
  control: EditorControl
  publicationType?: 'TRIANGLE' | 'DUSKVOL'
}>()

const emit = defineEmits(['manual-create'])

function handleManualClick() {
    emit('manual-create')
}
</script>

<template>
  <div id="panel-generator" class="space-y-4 animate-in fade-in duration-300">
    <div id="welcome-message">
      <h3 class="welcome-title"><Layout class="w-4 h-4" /> {{ t('editor.startCreation') }}</h3>
      <p>{{ t('editor.enterTopicHint') }}</p>
    </div>
    
    <div id="form-group-topic">
      <label class="input-label">{{ t('editor.topic') }}</label>
      <textarea 
        v-model="control.topic"
        class="topic-input"
        :placeholder="t('editor.topicPlaceholder')"
      />
    </div>

    <div id="form-group-date">
      <label class="input-label">{{ t('editor.date') }}</label>
      <input 
        type="date" 
        v-model="control.date"
        class="date-input"
      />
    </div>

    <button
      @click="control.handleGenerate"
      :disabled="control.loading"
      id="btn-generate"
    >
      <span v-if="control.loading" class="btn-content">
        <Loader2 class="animate-spin w-4 h-4" /> {{ control.loadingStep || t('editor.generating') }}
      </span>
      <span v-else class="btn-content">
        <Wand2 class="w-4 h-4" /> {{ t('editor.generate') }}
      </span>
    </button>

    <button
      @click="handleManualClick"
      id="btn-manual"
    >
      <span class="btn-content">
        <Layout class="w-4 h-4" /> {{ t('editor.manual') }}
      </span>
    </button>

    <!-- History List -->
    <div id="history-section">
       <div class="history-header">
         <h3 class="history-title">{{ t('editor.previousIssues') }}</h3>
         <button @click="control.loadIssueList" class="btn-refresh" :title="t('editor.refresh')">
           <RefreshCw class="w-3 h-3" :class="{ 'animate-spin': control.loadingIssues }" />
         </button>
       </div>
       
       <div id="issue-list">
         <div v-if="control.allIssues.length === 0 && !control.loadingIssues" class="empty-msg">
           {{ t('editor.noArchives') }}
         </div>
         <button
           v-for="issue in control.allIssues"
           :key="issue.id"
           @click="control.handleSelectIssue(issue)"
           class="issue-item group"
         >
           <div class="issue-meta">
             <span class="issue-date">
               <Calendar class="w-3 h-3" /> {{ issue.textData.date }}
             </span>
             <span 
               class="issue-status"
               :class="issue.status === 'draft' ? 'status-draft' : 'status-published'"
             >
               {{ issue.status === 'draft' ? t('editor.draft') : t('editor.published') }}
             </span>
           </div>
           <h4 class="issue-headline">
             {{ issue.textData.frontPage.headline }}
           </h4>
         </button>
       </div>
    </div>
  </div>
</template>

<style scoped>
#welcome-message {
    @apply p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-800;
}

.welcome-title {
    @apply font-bold mb-1 flex items-center gap-2;
}

.input-label {
    @apply block text-xs font-bold uppercase mb-1 text-stone-500;
}

.topic-input {
    @apply w-full p-3 bg-stone-50 border-2 border-stone-200 focus:border-red-500 rounded-none outline-none font-serif text-sm h-20 resize-none transition-colors;
}

.date-input {
    @apply w-full p-2 bg-stone-50 border-2 border-stone-200 focus:border-red-500 rounded-none outline-none font-sans transition-colors;
}

.theme-grid {
    @apply grid grid-cols-2 gap-2;
}

.theme-btn {
    @apply p-2 text-xs font-bold border-2 transition-all;
}

.theme-btn-active {
    @apply border-black bg-stone-800 text-white;
}

.theme-btn-inactive {
    @apply border-stone-200 text-stone-500 hover:border-stone-400;
}

#btn-generate {
    @apply w-full py-4 text-white font-black uppercase tracking-widest transition-all mt-4 bg-stone-800 hover:bg-black shadow-[4px_4px_0px_0px_#ccc] active:translate-y-1 active:shadow-none disabled:bg-stone-400 disabled:cursor-not-allowed;
}

#btn-manual {
    @apply w-full py-2 text-stone-600 font-bold uppercase tracking-widest transition-all mt-2 border-2 border-stone-300 hover:bg-stone-50;
}

.btn-content {
    @apply flex items-center justify-center gap-2;
}

#history-section {
    @apply mt-8 border-t border-stone-100 pt-6;
}

.history-header {
    @apply flex items-center justify-between mb-4;
}

.history-title {
    @apply text-xs font-bold uppercase text-stone-400;
}

.btn-refresh {
    @apply text-stone-400 hover:text-stone-600 transition-colors;
}

#issue-list {
    @apply space-y-2;
}

.empty-msg {
    @apply text-xs text-stone-400 italic;
}

.issue-item {
    @apply w-full text-left p-3 border rounded hover:border-red-300 hover:bg-red-50 transition-all border-stone-200 bg-white;
}

.issue-meta {
    @apply flex justify-between items-start mb-1;
}

.issue-date {
    @apply text-[10px] font-bold text-stone-500 flex items-center gap-1;
}

.issue-time {
    @apply text-[10px] bg-stone-100 px-1 rounded text-stone-500;
}

.issue-status {
    @apply text-[10px] px-1.5 py-0.5 rounded font-bold;
}

.status-draft {
    @apply bg-amber-100 text-amber-700;
}

.status-published {
    @apply bg-green-100 text-green-700;
}

.issue-headline {
    @apply text-xs font-bold text-stone-700 leading-tight group-hover:text-red-700 font-sans;
}
</style>
