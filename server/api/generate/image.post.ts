import { GoogleGenAI } from "@google/genai"

type PublicationType = 'TRIANGLE' | 'DUSKVOL'
type ThemeType = 'CLASSIC_RED' | 'DEEP_BLUE' | 'EMERALD' | 'NOIR'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    if (!config.geminiApiKey) {
        throw createError({ statusCode: 500, message: 'API Key not configured' })
    }

    const body = await readBody<{
        imagePrompt: string
        theme: ThemeType
        publication: PublicationType
    }>(event)

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })

    let styleSuffix = " Photorealistic, high quality newspaper photography style, slightly grainy print texture."

    if (body.publication === 'DUSKVOL') {
        styleSuffix += " Victorian era, industrial steampunk, moody, gaslamp fantasy, heavy shadows, high contrast black and white photography."
    } else {
        switch (body.theme) {
            case 'CLASSIC_RED':
                styleSuffix += " High contrast, desaturated world with strong red accents."
                break
            case 'DEEP_BLUE':
                styleSuffix += " Cool blue tones, cinematic lighting, cyanotype aesthetic, deep shadows."
                break
            case 'EMERALD':
                styleSuffix += " Muted green tones, nature-inspired palette, vintage botanical feel."
                break
            case 'NOIR':
                styleSuffix += " Black and white film noir style, high contrast, harsh shadows, chiaroscuro."
                break
            default:
                styleSuffix += " High contrast."
        }
    }

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash-preview-image-generation',
            contents: {
                parts: [
                    { text: body.imagePrompt + styleSuffix }
                ]
            },
            config: {
                responseModalities: ['Text', 'Image']
            }
        })

        // Extract image
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
                return {
                    success: true,
                    imageBase64: `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`
                }
            }
        }

        return { success: true, imageBase64: null }
    } catch (error: any) {
        console.error("Error generating image:", error)
        // Fail silently for image
        return { success: false, imageBase64: null, error: error.message }
    }
})
