import type { NewsData, ThemeType, PublicationType, GeneratedContent } from '~/types'

export function useGemini() {
    const loading = ref(false)
    const loadingStep = ref('')
    const error = ref<string | null>(null)

    async function generateNewsContent(
        topic: string,
        date: string,
        theme: ThemeType,
        publication: PublicationType
    ): Promise<NewsData | null> {
        loading.value = true
        loadingStep.value = '正在撰写双版新闻稿...'
        error.value = null

        try {
            const response = await $fetch<{ success: boolean; data: NewsData }>('/api/generate/content', {
                method: 'POST',
                body: { topic, date, theme, publication }
            })

            if (response.success) {
                return response.data
            }
            throw new Error('Failed to generate content')
        } catch (e: any) {
            error.value = e.message || 'Generation failed'
            return null
        } finally {
            loading.value = false
            loadingStep.value = ''
        }
    }

    async function generateNewsImage(
        imagePrompt: string,
        theme: ThemeType,
        publication: PublicationType
    ): Promise<string | null> {
        loadingStep.value = '正在冲印头版照片...'

        try {
            const response = await $fetch<{ success: boolean; imageBase64: string | null }>('/api/generate/image', {
                method: 'POST',
                body: { imagePrompt, theme, publication }
            })

            return response.imageBase64
        } catch (e: any) {
            console.error('Image generation failed:', e)
            return null
        } finally {
            loadingStep.value = ''
        }
    }

    async function rewriteText(currentText: string, instruction: string): Promise<string> {
        try {
            const response = await $fetch<{ success: boolean; text: string }>('/api/generate/rewrite', {
                method: 'POST',
                body: { currentText, instruction }
            })

            return response.text
        } catch (e: any) {
            console.error('Rewrite failed:', e)
            return currentText
        }
    }

    return {
        loading,
        loadingStep,
        error,
        generateNewsContent,
        generateNewsImage,
        rewriteText
    }
}
