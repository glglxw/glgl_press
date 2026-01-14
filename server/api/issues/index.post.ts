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
    console.log('[POST /api/issues] Body:', JSON.stringify(body, null, 2))

    // Generate unique ID
    const id = `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newIssue: GeneratedContent = {
        ...body,
        id,
        publishedAt: new Date().toISOString()
    }

    const issues = await readIssues()
    console.log('[POST /api/issues] Current issues count:', issues.length)

    issues.push(newIssue)
    await writeIssues(issues)

    console.log('[POST /api/issues] Saved! New issues count:', issues.length)
    console.log('[POST /api/issues] Data file path:', DATA_FILE)

    return { success: true, issue: newIssue }
})
