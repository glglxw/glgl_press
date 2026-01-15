import { ThemeType, PublicationType, type NewsData } from '~/types'
import { Lock, Ghost, Scroll } from 'lucide-vue-next'
import type { Component } from 'vue'

export interface EditorConfig {
    publicationType: PublicationType
    defaultTheme: ThemeType
    icon: Component
    title: string
    subtitle: string
    emptyStateText: string
    isDark: boolean
    blankTemplate: NewsData
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
        isDark: false,
        blankTemplate: TRIANGLE_BLANK_TEMPLATE
    },
    DUSKVOL: {
        publicationType: PublicationType.DUSKVOL,
        defaultTheme: ThemeType.NOIR,
        icon: Ghost,
        title: 'The Press Room',
        subtitle: 'Duskvol Chronicle • Printing Press',
        emptyStateText: 'The printing press awaits...',
        isDark: true,
        blankTemplate: DUSKVOL_BLANK_TEMPLATE
    },
    ADVENTURER: {
        publicationType: PublicationType.ADVENTURER,
        defaultTheme: ThemeType.PARCHMENT,
        icon: Scroll,
        title: '冒险者工会日报',
        subtitle: 'Adventurer Guild • Daily Report',
        emptyStateText: '羊皮纸准备就绪...',
        isDark: false,
        blankTemplate: ADVENTURER_BLANK_TEMPLATE
    }
}

export function getEditorConfig(publication: string): EditorConfig {
    const key = publication.toUpperCase()
    if (!(key in EDITOR_CONFIGS)) {
        throw new Error(`Unknown publication: ${publication}`)
    }
    return EDITOR_CONFIGS[key] as EditorConfig
}
