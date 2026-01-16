import { describe, it, expect } from 'vitest'
import { EDITOR_CONFIGS, getEditorConfig, type PublicationStyles } from './editorConfig'
import { PublicationType, ThemeType } from '~/types'

const REQUIRED_STYLE_KEYS: (keyof PublicationStyles)[] = [
    'pageBg', 'pageText', 'loadingState', 'header', 'headerText', 'headerButton',
    'archiveDrawer', 'archiveHeader', 'archiveList', 'archiveItem', 'archiveItemActive',
    'archiveItemHover', 'centerFold', 'editorLink', 'primaryButton', 'secondaryButton',
    'editorBg', 'sidebar', 'sidebarBorder', 'sidebarTitle', 'sidebarSubtitle',
    'previewArea', 'previewText', 'themeKey'
]

describe('EDITOR_CONFIGS', () => {
    it('should have TRIANGLE config with correct defaults', () => {
        const config = EDITOR_CONFIGS.TRIANGLE
        expect(config.publicationType).toBe(PublicationType.TRIANGLE)
        expect(config.defaultTheme).toBe(ThemeType.CLASSIC_RED)
        expect(config.title).toBe('三角日报编辑器')
        expect(config.styles.themeKey).toBe('light')
    })

    it('should have DUSKVOL config with correct defaults', () => {
        const config = EDITOR_CONFIGS.DUSKVOL
        expect(config.publicationType).toBe(PublicationType.DUSKVOL)
        expect(config.defaultTheme).toBe(ThemeType.NOIR)
        expect(config.title).toBe('The Press Room')
        expect(config.styles.themeKey).toBe('dark')
    })

    it('should have ADVENTURER config with correct defaults', () => {
        const config = EDITOR_CONFIGS.ADVENTURER
        expect(config.publicationType).toBe(PublicationType.ADVENTURER)
        expect(config.defaultTheme).toBe(ThemeType.PARCHMENT)
        expect(config.title).toBe('冒险者工会日报')
        expect(config.styles.themeKey).toBe('parchment')
    })

    it('should have all required style keys for each publication', () => {
        for (const key of Object.keys(EDITOR_CONFIGS)) {
            const config = EDITOR_CONFIGS[key]!
            for (const styleKey of REQUIRED_STYLE_KEYS) {
                expect(config.styles).toHaveProperty(styleKey)
                expect(typeof config.styles[styleKey]).toBe('string')
            }
        }
    })
})

describe('getEditorConfig', () => {
    it('should return TRIANGLE config for "triangle"', () => {
        const config = getEditorConfig('triangle')
        expect(config.publicationType).toBe(PublicationType.TRIANGLE)
    })

    it('should return DUSKVOL config for "duskvol"', () => {
        const config = getEditorConfig('duskvol')
        expect(config.publicationType).toBe(PublicationType.DUSKVOL)
    })

    it('should return ADVENTURER config for "adventurer"', () => {
        const config = getEditorConfig('adventurer')
        expect(config.publicationType).toBe(PublicationType.ADVENTURER)
    })

    it('should be case-insensitive', () => {
        expect(getEditorConfig('TRIANGLE').publicationType).toBe(PublicationType.TRIANGLE)
        expect(getEditorConfig('Duskvol').publicationType).toBe(PublicationType.DUSKVOL)
        expect(getEditorConfig('ADVENTURER').publicationType).toBe(PublicationType.ADVENTURER)
    })

    it('should throw for unknown publication', () => {
        expect(() => getEditorConfig('unknown')).toThrow('Unknown publication: unknown')
    })
})
