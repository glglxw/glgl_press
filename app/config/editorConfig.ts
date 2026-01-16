import { ThemeType, PublicationType, type NewsData } from '~/types'
import { Lock, Ghost, Scroll } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface PublicationStyles {
    // Reader page
    pageBg: string
    pageText: string
    loadingState: string
    header: string
    headerText: string
    headerButton: string
    archiveDrawer: string
    archiveHeader: string
    archiveList: string
    archiveItem: string
    archiveItemActive: string
    archiveItemHover: string
    centerFold: string
    editorLink: string
    primaryButton: string
    secondaryButton: string
    // Editor page
    editorBg: string
    sidebar: string
    sidebarBorder: string
    sidebarTitle: string
    sidebarSubtitle: string
    previewArea: string
    previewText: string
    themeKey: 'light' | 'dark' | 'parchment'
    // Text Keys
    loadingTextKey: string
    noDataHeaderKey: string
    enterEditorKey: string
    pressRoomKey: string
}

export interface EditorConfig {
    publicationType: PublicationType
    defaultTheme: ThemeType
    icon: Component
    title: string
    subtitle: string
    emptyStateText: string
    bgHex: string
    blankTemplate: NewsData
    styles: PublicationStyles
}

const TRIANGLE_BLANK_TEMPLATE: NewsData = {
    date: new Date().toISOString().split('T')[0] as string,
    location: '北京',
    frontPage: {
        headline: '点击编辑标题',
        mainStory: '点击编辑主要新闻内容...',
        mainImagePrompt: '',
        newsSnippets: [
            { title: '快讯标题 1', content: '点击编辑快讯内容...' },
            { title: '快讯标题 2', content: '点击编辑快讯内容...' },
            { title: '快讯标题 3', content: '点击编辑快讯内容...' }
        ],
        column1: { title: '专栏 1', content: '点击编辑专栏内容...' },
        column2: { title: '专栏 2', content: '点击编辑专栏内容...' },
        weirdNews: { title: '趣闻', content: '点击编辑趣闻内容...' }
    },
    secondPage: {
        editorial: { title: '社论标题', content: '点击编辑社论内容...' },
        culture: { title: '文化专栏', content: '点击编辑文化专栏内容...' },
        classifieds: [
            { title: '分类广告 1', content: '点击编辑广告内容...' },
            { title: '分类广告 2', content: '点击编辑广告内容...' },
            { title: '分类广告 3', content: '点击编辑广告内容...' }
        ],
        horoscope: '点击编辑今日箴言...'
    }
}

const DUSKVOL_BLANK_TEMPLATE: NewsData = {
    date: new Date().toISOString().split('T')[0] as string,
    location: 'Duskvol',
    frontPage: {
        headline: 'Click to Edit Headline',
        mainStory: 'Click to edit main story content...',
        mainImagePrompt: '',
        newsSnippets: [
            { title: 'Whisper 1', content: 'Click to edit whisper...' },
            { title: 'Whisper 2', content: 'Click to edit whisper...' },
            { title: 'Whisper 3', content: 'Click to edit whisper...' }
        ],
        column1: { title: 'Column 1', content: 'Click to edit column content...' },
        column2: { title: 'Column 2', content: 'Click to edit column content...' },
        weirdNews: { title: 'Dark News', content: 'Click to edit dark news...' }
    },
    secondPage: {
        editorial: { title: 'Editorial Title', content: 'Click to edit editorial...' },
        culture: { title: 'Culture', content: 'Click to edit culture section...' },
        classifieds: [
            { title: 'Classified 1', content: 'Click to edit...' },
            { title: 'Classified 2', content: 'Click to edit...' },
            { title: 'Classified 3', content: 'Click to edit...' }
        ],
        horoscope: 'Click to edit dark wisdom...'
    }
}

const ADVENTURER_BLANK_TEMPLATE: NewsData = {
    date: new Date().toISOString().split('T')[0] as string,
    location: '无冬城',
    frontPage: {
        headline: '点击编辑今日头条',
        mainStory: '在此输入主要新闻内容，例如巨龙袭击或新的地下城发现...',
        mainImagePrompt: 'Fantasy adventurer guild hall, bustling with activity, detailed painting',
        newsSnippets: [
            { title: '酒馆传闻 1', content: '点击编辑传闻...' },
            { title: '酒馆传闻 2', content: '点击编辑传闻...' },
            { title: '酒馆传闻 3', content: '点击编辑传闻...' }
        ],
        column1: { title: '悬赏任务', content: '点击编辑任务详情...' },
        column2: { title: '公会公告', content: '点击编辑公告内容...' },
        weirdNews: { title: '怪物图鉴', content: '点击编辑怪物信息...' }
    },
    secondPage: {
        editorial: { title: '每周之星', content: '点击编辑优秀冒险者事迹...' },
        culture: { title: '装备行情', content: '点击编辑市场价格...' },
        classifieds: [
            { title: '组队招募 1', content: '点击编辑招募信息...' },
            { title: '组队招募 2', content: '点击编辑招募信息...' },
            { title: '组队招募 3', content: '点击编辑招募信息...' }
        ],
        horoscope: '点击编辑今日运势...'
    }
}

export const EDITOR_CONFIGS: Record<string, EditorConfig> = {
    TRIANGLE: {
        publicationType: PublicationType.TRIANGLE,
        defaultTheme: ThemeType.CLASSIC_RED,
        icon: Lock,
        title: '三角日报编辑器',
        subtitle: 'Triangle CMS v4.0 • Nuxt Edition',
        emptyStateText: '在此处预览生成的新闻日报',
        bgHex: '#ffffff',
        blankTemplate: TRIANGLE_BLANK_TEMPLATE,
        styles: {
            pageBg: 'bg-stone-200',
            pageText: 'text-stone-500',
            loadingState: 'bg-stone-100 text-stone-500',
            header: 'bg-white',
            headerText: 'text-red-600',
            headerButton: 'hover:bg-stone-100 text-stone-400 hover:text-stone-800',
            archiveDrawer: 'bg-stone-100 border-stone-200',
            archiveHeader: 'border-stone-200 bg-white text-red-600',
            archiveList: 'bg-stone-50',
            archiveItem: 'bg-white border-stone-200 text-stone-800',
            archiveItemActive: 'border-red-500 ring-1 ring-red-500',
            archiveItemHover: 'hover:bg-red-50 hover:border-red-200 hover:text-red-700',
            centerFold: 'bg-gradient-to-r from-stone-400 via-stone-300 to-stone-400',
            editorLink: 'bg-black',
            primaryButton: 'bg-red-600 hover:bg-red-700',
            secondaryButton: 'bg-stone-800 hover:bg-black',
            // Editor
            editorBg: 'bg-stone-100',
            sidebar: 'bg-white border-stone-200 text-stone-800',
            sidebarBorder: 'border-stone-100',
            sidebarTitle: 'text-stone-800',
            sidebarSubtitle: 'text-stone-500',
            previewArea: 'bg-stone-200',
            previewText: 'text-stone-400',
            themeKey: 'light',
            loadingTextKey: 'publication.common.loading',
            noDataHeaderKey: 'publication.common.noData',
            enterEditorKey: 'publication.common.enterEditor',
            pressRoomKey: 'publication.common.pressRoom'
        }
    },
    DUSKVOL: {
        publicationType: PublicationType.DUSKVOL,
        defaultTheme: ThemeType.NOIR,
        icon: Ghost,
        title: 'The Press Room',
        subtitle: 'Duskvol Chronicle • Printing Press',
        emptyStateText: 'The printing press awaits...',
        bgHex: '#1c1917',
        blankTemplate: DUSKVOL_BLANK_TEMPLATE,
        styles: {
            pageBg: 'bg-stone-900',
            pageText: 'text-stone-400',
            loadingState: 'bg-stone-900 text-stone-400',
            header: 'bg-stone-800 text-stone-200',
            headerText: 'text-stone-100',
            headerButton: 'hover:bg-stone-700 text-stone-400 hover:text-stone-200',
            archiveDrawer: 'bg-stone-900 border-stone-800',
            archiveHeader: 'border-stone-800 text-stone-400',
            archiveList: '',
            archiveItem: 'bg-stone-800/50 border-stone-800 text-stone-300',
            archiveItemActive: 'border-blue-500/50 bg-blue-900/10',
            archiveItemHover: 'hover:bg-stone-800 hover:border-stone-700 hover:text-white',
            centerFold: 'bg-gradient-to-r from-stone-700 via-stone-800 to-stone-700',
            editorLink: 'bg-stone-700',
            primaryButton: 'bg-blue-900 hover:bg-blue-800',
            secondaryButton: 'bg-stone-700 hover:bg-stone-600',
            // Editor
            editorBg: 'bg-stone-900',
            sidebar: 'bg-stone-800 border-stone-700 text-stone-200',
            sidebarBorder: 'border-stone-700',
            sidebarTitle: 'text-stone-100',
            sidebarSubtitle: 'text-stone-400 italic',
            previewArea: 'bg-stone-950',
            previewText: 'text-stone-600 italic',
            themeKey: 'dark',
            loadingTextKey: 'publication.common.loadingVoid',
            noDataHeaderKey: 'publication.common.noDataVoid',
            enterEditorKey: 'publication.common.enterEditorVoid',
            pressRoomKey: 'publication.common.pressRoomVoid'
        }
    },
    ADVENTURER: {
        publicationType: PublicationType.ADVENTURER,
        defaultTheme: ThemeType.PARCHMENT,
        icon: Scroll,
        title: '冒险者工会日报',
        subtitle: 'Adventurer Guild • Daily Report',
        emptyStateText: '羊皮纸准备就绪...',
        bgHex: '#f0e6d2',
        blankTemplate: ADVENTURER_BLANK_TEMPLATE,
        styles: {
            pageBg: 'bg-[#f0e6d2]',
            pageText: 'text-[#5c4033]',
            loadingState: 'bg-[#f0e6d2] text-[#8b5a2b]',
            header: 'bg-[#e6dcc3] border-b border-[#d2b48c]',
            headerText: 'text-[#4a3728]',
            headerButton: 'text-[#8b5a2b] hover:bg-[#d2b48c]/30 hover:text-[#5c4033]',
            archiveDrawer: 'bg-[#f0e6d2] border-[#d2b48c]',
            archiveHeader: 'border-[#d2b48c] bg-[#e6dcc3] text-[#4a3728]',
            archiveList: 'bg-[#f0e6d2]',
            archiveItem: 'bg-[#fdfbf7] border-[#d2b48c] text-[#5c4033]',
            archiveItemActive: 'border-[#8b5a2b] ring-1 ring-[#8b5a2b] bg-[#e6dcc3]',
            archiveItemHover: 'hover:bg-[#e6dcc3] hover:border-[#8b5a2b] hover:text-[#4a3728]',
            centerFold: 'bg-gradient-to-r from-[#d2b48c] via-[#e6dcc3] to-[#d2b48c]',
            editorLink: 'bg-[#4a3728]',
            primaryButton: 'bg-[#8b4513] hover:bg-[#654321]',
            secondaryButton: 'bg-[#8b5a2b] hover:bg-[#654321]',
            // Editor
            editorBg: 'bg-[#f0e6d2]',
            sidebar: 'bg-[#e6dcc3] border-[#d2b48c] text-[#5c4033]',
            sidebarBorder: 'border-[#d2b48c]',
            sidebarTitle: 'text-[#4a3728]',
            sidebarSubtitle: 'text-[#8b5a2b] italic',
            previewArea: 'bg-[#d9cdb8]',
            previewText: 'text-[#8b5a2b] italic',
            themeKey: 'parchment',
            loadingTextKey: 'publication.common.loading',
            noDataHeaderKey: 'publication.common.noData',
            enterEditorKey: 'publication.common.enterEditor',
            pressRoomKey: 'publication.common.pressRoom'
        }
    }
}

export function getEditorConfig(publication: string): EditorConfig {
    const key = publication.toUpperCase()
    if (!(key in EDITOR_CONFIGS)) {
        throw new Error(`Unknown publication: ${publication}`)
    }
    return EDITOR_CONFIGS[key] as EditorConfig
}
