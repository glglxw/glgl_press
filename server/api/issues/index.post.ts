import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'

interface GeneratedContent {
    id?: string
    textData: any
    imageBase64?: string
    publicationType: string
    theme: string
    publishedAt?: string
}

const DATA_FILE = join(process.cwd(), 'server/data/issues.json')

async function ensureDataFile() {
    const dir = dirname(DATA_FILE)
    if (!existsSync(dir)) {
        await mkdir(dir, { recursive: true })
    }
    if (!existsSync(DATA_FILE)) {
        await writeFile(DATA_FILE, JSON.stringify({ issues: [] }))
    }
}

async function readIssues(): Promise<GeneratedContent[]> {
    await ensureDataFile()
    const data = await readFile(DATA_FILE, 'utf-8')
    return JSON.parse(data).issues
}

async function writeIssues(issues: GeneratedContent[]) {
    await ensureDataFile()
    await writeFile(DATA_FILE, JSON.stringify({ issues }, null, 2))
}

export default defineEventHandler(async (event) => {
    const body = await readBody<GeneratedContent>(event)

    console.log('[POST /api/issues] Received request to save issue')

    let issues = await readIssues()
    let newIssue: GeneratedContent

    if (body.id) {
        // Try to find existing issue
        const existingIndex = issues.findIndex(i => i.id === body.id)

        if (existingIndex !== -1) {
            console.log(`[POST /api/issues] Updating existing issue: ${body.id}`)
            // Update existing
            newIssue = {
                ...body,
                publishedAt: issues[existingIndex].publishedAt // Keep original published date
            }
            issues[existingIndex] = newIssue
        } else {
            console.log(`[POST /api/issues] ID provided but not found, treating as new: ${body.id}`)
            // Treat as new if ID not found (or should we respect the ID? Let's generate new to be safe/consistent)
            newIssue = {
                ...body,
                id: crypto.randomUUID(),
                publishedAt: new Date().toISOString()
            }
            issues.push(newIssue)
        }
    } else {
        // Create new
        const id = crypto.randomUUID()
        console.log(`[POST /api/issues] Creating new issue with ID: ${id}`)
        newIssue = {
            ...body,
            id,
            publishedAt: new Date().toISOString()
        }
        issues.push(newIssue)
    }

    console.log('[POST /api/issues] Current issues count:', issues.length)
    await writeIssues(issues)

    console.log('[POST /api/issues] Saved! Data file path:', DATA_FILE)

    return { success: true, issue: newIssue }
})
