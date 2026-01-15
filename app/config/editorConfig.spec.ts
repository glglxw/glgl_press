import { describe, it, expect } from 'vitest'
import { EDITOR_CONFIGS, getEditorConfig } from './editorConfig'
import { PublicationType, ThemeType } from '~/types'

describe('EDITOR_CONFIGS', () => {
    it('should have TRIANGLE config with correct defaults', () => {
        const config = EDITOR_CONFIGS.TRIANGLE
        expect(config.publicationType).toBe(PublicationType.TRIANGLE)
        expect(config.defaultTheme).toBe(ThemeType.CLASSIC_RED)
        expect(config.isDark).toBe(false)
        expect(config.title).toBe('三角日报编辑器')
    })

    it('should have DUSKVOL config with correct defaults', () => {
        const config = EDITOR_CONFIGS.DUSKVOL
        expect(config.publicationType).toBe(PublicationType.DUSKVOL)
        expect(config.defaultTheme).toBe(ThemeType.NOIR)
        expect(config.isDark).toBe(true)
        expect(config.title).toBe('The Press Room')
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

    it('should be case-insensitive', () => {
        expect(getEditorConfig('TRIANGLE').publicationType).toBe(PublicationType.TRIANGLE)
        expect(getEditorConfig('Duskvol').publicationType).toBe(PublicationType.DUSKVOL)
    })

    it('should throw for unknown publication', () => {
        expect(() => getEditorConfig('unknown')).toThrow('Unknown publication: unknown')
    })
})
