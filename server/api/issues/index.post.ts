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

    // Generate unique ID
    const id = `issue-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    const newIssue: GeneratedContent = {
        ...body,
        id,
        publishedAt: new Date().toISOString()
    }

    const issues = await readIssues()
    issues.push(newIssue)
    await writeIssues(issues)

    return { success: true, issue: newIssue }
})
