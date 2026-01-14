import { GoogleGenAI, Type } from "@google/genai"

type PublicationType = 'TRIANGLE' | 'DUSKVOL'

interface NewsData {
    date: string
    location: string
    frontPage: any
    secondPage: any
}

// Schema for structured JSON output
const newsSchema = {
    type: Type.OBJECT,
    properties: {
        location: { type: Type.STRING, description: "Location in Simplified Chinese." },
        frontPage: {
            type: Type.OBJECT,
            properties: {
                headline: { type: Type.STRING, description: "Main story headline in Simplified Chinese. Catchy, 2-8 words." },
                mainStory: { type: Type.STRING, description: "Main article text in Simplified Chinese, detailed and descriptive, about 250-300 words. Professional tone." },
                mainImagePrompt: { type: Type.STRING, description: "A descriptive prompt (in English) to generate a photo for the main story. Ensure it describes the lighting and mood." },
                newsSnippets: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Snippet title in Simplified Chinese" },
                            content: { type: Type.STRING, description: "News snippet in Simplified Chinese, approx 60-80 words." }
                        }
                    }
                },
                column1: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Column title in Simplified Chinese (e.g. 'Reading Corner')" },
                        content: { type: Type.STRING, description: "Column content in Simplified Chinese, approx 120 words." }
                    }
                },
                column2: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Column title in Simplified Chinese (e.g. 'Market Watch')" },
                        content: { type: Type.STRING, description: "Column content in Simplified Chinese, approx 100 words." }
                    }
                },
                weirdNews: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Weird news title in Simplified Chinese" },
                        content: { type: Type.STRING, description: "A strange/funny short story in Simplified Chinese, approx 100 words." }
                    }
                }
            },
            required: ["headline", "mainStory", "newsSnippets", "column1", "column2", "weirdNews", "mainImagePrompt"]
        },
        secondPage: {
            type: Type.OBJECT,
            properties: {
                editorial: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Editorial title (e.g. 'Editor's Note') in Chinese" },
                        content: { type: Type.STRING, description: "Opinion piece, ~300 words in Chinese. Deep analysis." }
                    }
                },
                classifieds: {
                    type: Type.ARRAY,
                    description: "List of 4-6 funny or surreal classified ads.",
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            title: { type: Type.STRING, description: "Item name or service in Chinese" },
                            content: { type: Type.STRING, description: "Short description/price in Chinese" }
                        }
                    }
                },
                culture: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: "Culture section title in Chinese" },
                        content: { type: Type.STRING, description: "Art/Music review or essay in Chinese, approx 200 words." }
                    }
                },
                horoscope: { type: Type.STRING, description: "A one-sentence daily horoscope or wisdom in Chinese." }
            },
            required: ["editorial", "classifieds", "culture", "horoscope"]
        }
    },
    required: ["location", "frontPage", "secondPage"]
}

export default defineEventHandler(async (event) => {
    const startTime = Date.now()
    console.log('[API /generate/content] Request received')

    const config = useRuntimeConfig()
    if (!config.geminiApiKey) {
        console.error('[API /generate/content] API Key not configured')
        throw createError({ statusCode: 500, message: 'API Key not configured' })
    }

    const body = await readBody<{
        topic: string
        date: string
        theme: string
        publication: PublicationType
    }>(event)

    console.log('[API /generate/content] Params:', {
        topic: body.topic?.substring(0, 50) + '...',
        date: body.date,
        theme: body.theme,
        publication: body.publication
    })

    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey })

    const isDuskvol = body.publication === 'DUSKVOL'
    const paperName = isDuskvol ? "The Duskvol Chronicle (多斯科沃公报)" : "Triangle Daily (三角日报)"
    const context = isDuskvol
        ? "You are the editor of a grim, industrial-fantasy newspaper in a city of eternal night and ghosts."
        : "You are the editor-in-chief of a stylish, modern avant-garde newspaper."

    const prompt = `
    ${context}
    Newspaper Name: "${paperName}"
    
    Generate a **TWO-PAGE** newspaper issue content based on the Topic: "${body.topic}".
    The Date is: "${body.date}".
    The Visual Theme is: "${body.theme}".
    
    IMPORTANT: All generated text (headlines, stories, locations, titles) MUST BE IN SIMPLIFIED CHINESE (简体中文).
    
    Page 1 content:
    - Main headline and story (Make it substantive, ~250-300 words).
    - Short snippets and columns (Make them detailed).
    - Weird news ${isDuskvol ? "(Focus on ghosts, electroplasm, or crime)" : "(General weirdness)"}.
    - Image prompt (in ENGLISH).
    
    Page 2 content:
    - Editorial (Opinion, ~300 words).
    - Classifieds (Funny/Surreal ads ${isDuskvol ? "selling spirits, lightning oil, etc." : ""}).
    - Culture section (Arts review, ~200 words).
    - Horoscope/Wisdom.
    
    The tone should be ${isDuskvol ? "cynical, atmospheric, shadowy" : "professional, geometric, sharp"}.
    
    Crucially, for 'mainImagePrompt', write it in ENGLISH. Describe a scene fitting the publication's vibe.
    ${isDuskvol ? "Focus on fog, gaslamps, industrial decay, shadows, Victorian era aesthetic." : "Focus on geometric shapes, clean lines, high contrast."}
  `

    try {
        console.log('[API /generate/content] Calling Gemini API...')
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: newsSchema,
            },
        })

        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`[API /generate/content] Gemini API responded in ${elapsed}s`)

        const text = response.text
        if (!text) {
            console.error('[API /generate/content] No text returned from Gemini')
            throw createError({ statusCode: 500, message: 'No text returned from Gemini' })
        }

        console.log('[API /generate/content] Parsing JSON response, length:', text.length)
        const data = JSON.parse(text) as NewsData
        data.date = body.date

        const totalTime = ((Date.now() - startTime) / 1000).toFixed(2)
        console.log(`[API /generate/content] Success! Total time: ${totalTime}s, Headline: ${data.frontPage?.headline}`)

        return { success: true, data }
    } catch (error: any) {
        const elapsed = ((Date.now() - startTime) / 1000).toFixed(2)
        console.error(`[API /generate/content] Error after ${elapsed}s:`, error.message || error)
        throw createError({ statusCode: 500, message: error.message || 'Failed to generate content' })
    }
})

