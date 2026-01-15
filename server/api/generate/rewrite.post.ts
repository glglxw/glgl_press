import { GoogleGenAI } from "@google/genai"

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    if (!config.geminiApiKey) {
        throw createError({ statusCode: 500, message: 'API Key not configured' })
    }

    const body = await readBody<{
        currentText: string
        instruction: string
    }>(event)

    const httpOptions = config.geminiBaseUrl ? { baseUrl: config.geminiBaseUrl } : undefined
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey, httpOptions })

    const prompt = `
    You are a professional newspaper editor.
    
    Original Text: "${body.currentText}"
    
    Instruction: "${body.instruction}"
    
    Rewrite the text in Simplified Chinese (简体中文). Keep the same context/meaning unless the instruction says otherwise. Return ONLY the new text.
  `

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        })

        return {
            success: true,
            text: response.text?.trim() || body.currentText
        }
    } catch (error: any) {
        console.error("Error rewriting text:", error)
        return { success: false, text: body.currentText, error: error.message }
    }
})
