import { ref, computed } from 'vue'
import zh from '~/locales/zh'
import en from '~/locales/en'

type LocaleType = 'zh' | 'en'
type Messages = typeof zh

const locales: Record<LocaleType, Messages> = { zh, en }

// Global locale state
const currentLocale = ref<LocaleType>('zh')

export function useI18n() {
    const locale = computed({
        get: () => currentLocale.value,
        set: (val: LocaleType) => { currentLocale.value = val }
    })

    function t(key: string): string {
        const keys = key.split('.')
        let result: any = locales[currentLocale.value]

        for (const k of keys) {
            if (result === undefined) return key
            result = result[k]
        }

        return typeof result === 'string' ? result : key
    }

    function setLocale(loc: LocaleType) {
        currentLocale.value = loc
    }

    return {
        locale,
        t,
        setLocale
    }
}
