export interface SectionStyles {
    fontSize?: string
    lineHeight?: string
    offsetX?: string
    offsetY?: string
}

const sectionStyles = ref<Record<string, SectionStyles>>({})

export function useSectionStyles() {
    function updateSectionStyle(sectionId: string, styles: SectionStyles) {
        sectionStyles.value[sectionId] = { ...styles }
    }

    function getSectionStyle(sectionId: string): SectionStyles {
        return sectionStyles.value[sectionId] || {}
    }

    function resetSectionStyle(sectionId: string) {
        delete sectionStyles.value[sectionId]
    }

    function resetAllStyles() {
        sectionStyles.value = {}
    }

    function getCSSVariables(sectionId: string): Record<string, string> {
        const styles = getSectionStyle(sectionId)
        const vars: Record<string, string> = {}

        if (styles.fontSize) vars['--section-font-size'] = styles.fontSize
        if (styles.lineHeight) vars['--section-line-height'] = styles.lineHeight
        if (styles.offsetX) vars['--section-offset-x'] = styles.offsetX
        if (styles.offsetY) vars['--section-offset-y'] = styles.offsetY

        return vars
    }

    function setSectionStyles(styles: Record<string, SectionStyles>) {
        sectionStyles.value = { ...styles }
    }

    return {
        sectionStyles,
        updateSectionStyle,
        getSectionStyle,
        resetSectionStyle,
        resetAllStyles,
        setSectionStyles,
        getCSSVariables
    }
}
