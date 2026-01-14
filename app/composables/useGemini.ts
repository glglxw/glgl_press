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

        const startTime = Date.now()
        console.log('[Gemini] Starting content generation:', { topic, date, theme, publication })

        try {
            console.log('[Gemini] Sending request to /api/generate/content...')
            const response = await $fetch<{ success: boolean; data: NewsData }>('/api/generate/content', {
                method: 'POST',
                body: { topic, date, theme, publication }
            })

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.log(`[Gemini] Content generation completed in ${elapsed}s`, { success: response.success })

            if (response.success) {
                console.log('[Gemini] Generated content headline:', response.data?.frontPage?.headline)
                return response.data
            }
            throw new Error('Failed to generate content')
        } catch (e: any) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.error(`[Gemini] Content generation failed after ${elapsed}s:`, e)
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

        const startTime = Date.now()
        console.log('[Gemini] Starting image generation:', { imagePrompt: imagePrompt?.substring(0, 100) + '...', theme, publication })

        try {
            console.log('[Gemini] Sending request to /api/generate/image...')
            const response = await $fetch<{ success: boolean; imageBase64: string | null }>('/api/generate/image', {
                method: 'POST',
                body: { imagePrompt, theme, publication }
            })

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.log(`[Gemini] Image generation completed in ${elapsed}s`, {
                success: response.success,
                hasImage: !!response.imageBase64,
                imageSize: response.imageBase64?.length || 0
            })

            return response.imageBase64
        } catch (e: any) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.error(`[Gemini] Image generation failed after ${elapsed}s:`, e)
            return null
        } finally {
            loadingStep.value = ''
        }
    }

    async function rewriteText(currentText: string, instruction: string): Promise<string> {
        const startTime = Date.now()
        console.log('[Gemini] Starting text rewrite:', { textLength: currentText.length, instruction })

        try {
            const response = await $fetch<{ success: boolean; text: string }>('/api/generate/rewrite', {
                method: 'POST',
                body: { currentText, instruction }
            })

            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.log(`[Gemini] Text rewrite completed in ${elapsed}s`)

            return response.text
        } catch (e: any) {
            const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
            console.error(`[Gemini] Rewrite failed after ${elapsed}s:`, e)
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

