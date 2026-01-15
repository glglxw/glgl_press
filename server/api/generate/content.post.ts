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

    const httpOptions = config.geminiBaseUrl ? { baseUrl: config.geminiBaseUrl } : undefined
    const ai = new GoogleGenAI({ apiKey: config.geminiApiKey, httpOptions })

    const isDuskvol = body.publication === 'DUSKVOL'

    // Completely separate prompts for each publication
    let prompt: string

    if (isDuskvol) {
        // ===== DUSKVOL CHRONICLE PROMPT =====
        prompt = `
You are the cynical, world-weary editor of "The Duskvol Chronicle (多斯科沃公报)", a grim newspaper in a city of eternal night, industrial decay, and restless ghosts.

Generate a **TWO-PAGE** newspaper based on Topic: "${body.topic}"
Date: "${body.date}"
Visual Theme: "${body.theme}"

IMPORTANT: All text MUST BE IN SIMPLIFIED CHINESE (简体中文), except mainImagePrompt.

**TONE & STYLE:**
- Cynical, atmospheric, shadowy
- Victorian-industrial era language
- References to ghosts, electroplasm, leviathan blood, and crime
- Dark humor and fatalism

**PAGE 1 - FRONT PAGE:**
1. **Headline & Main Story (~300 words):** Report on "${body.topic}" with grim atmosphere. Include references to the Spirit Wardens, Bluecoats, or criminal gangs if relevant.
2. **News Snippets (3 items):** Brief reports on ghost sightings, industrial accidents, or gang violence.
3. **Column 1 - "The Gaslight Review":** Commentary on Duskvol society or philosophy.
4. **Column 2 - "Market Watch":** Prices of electroplasm, leviathan oil, or black market goods.
5. **Weird News:** Strange occurrences - possessed objects, temporal anomalies, cultist activities.
6. **mainImagePrompt (ENGLISH):** Describe a scene with fog, gaslamps, industrial decay, Victorian aesthetic, shadows.

**PAGE 2 - INNER PAGE:**
1. **Editorial (~300 words):** Opinion piece with dark philosophical bent.
2. **Classifieds (4-5 ads):** Sell spirits, haunted items, mercenary services, forbidden artifacts.
3. **Culture Section (~200 words):** Review of underground theater, spirit seances, or criminal entertainment.
4. **Horoscope:** Dark prophecy or ominous wisdom for the day.
`
    } else {
        // ===== TRIANGLE DAILY PROMPT =====
        prompt = `
You are the Lead Reality Architect and Editor-in-Chief of "Triangle Daily (三角日报)", the premier corporate publication of the Triangle Agency. Your mission is to curate reality, normalize anomalies through corporate euphemisms, and present a sharp, geometric worldview.

Generate a **TWO-PAGE** avant-garde corporate newspaper based on Topic: "${body.topic}"
Date: "${body.date}"
Visual Theme: "${body.theme}" (Interpret through Brutalist design and geometric precision)

IMPORTANT: All text MUST BE IN SIMPLIFIED CHINESE (简体中文), except mainImagePrompt.

**TONE & STYLE:**
- Clinical, precise, yet elegantly bureaucratic
- Normalize the abnormal: Call chaos "Unscheduled Restructuring", monsters "Geometric Fluctuations", disasters "Reality Adjustments"
- Geometric fetishism: Reference triangles, angles, lines, intersections as metaphors for order
- Slightly threatening but polite corporate speak
- Never panic, always maintain composure

**PAGE 1 - THE REALITY ANCHOR:**
1. **Headline & Cover Story (~300 words):** Report on "${body.topic}" spun into a positive corporate narrative or "necessary Reality Adjustment." Emphasize efficiency, structure, and Agency benevolence.
2. **"Minor Fluctuations" (News Snippets, 3 items):** Strange phenomena (time loops, floating objects, memory leaks) framed as mundane infrastructure updates.
3. **"Angle of View" (Column 1):** Philosophically geometric column about maintaining focus and ignoring "unauthorized thoughts."
4. **"Structural Integrity Report" (Column 2):** Status updates on reality stability in various sectors.
5. **"Unclassified Observations" (Weird News):** Bizarre events described with clinical detachment and corporate euphemisms.
6. **mainImagePrompt (ENGLISH):** Create prompt for high-contrast, minimalist illustration. Keywords: "Corporate Memphis meets Lovecraftian geometry", "Flat vector art", "Sharp angles", "Limited color palette", "Abstract representation of ${body.topic}".

**PAGE 2 - THE ECHO CHAMBER:**
1. **"From The Management" (Editorial, ~300 words):** Reinforce importance of "${body.topic}" for global stability. Use slightly threatening corporate speak.
2. **"The Void Market" (Classifieds, 4-5 ads):** Surreal services like "Selling unused Tuesday afternoons", "Memory erasure - 50% off", "Hiring: Non-Euclidean Architect", "Lost: My concept of linear time".
3. **"Form & Function" (Culture, ~200 words):** Review of non-existent art exhibit or "state of mind" based on "structural integrity" and "clean lines."
4. **"Productivity Forecast" (Horoscope):** Use Geometric Shapes instead of zodiac (e.g., "Those aligned with The Isosceles..."). Give advice on work efficiency and avoiding "unauthorized thoughts."
`
    }

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

