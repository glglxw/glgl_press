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

export default defineEventHandler(async () => {
    const issues = await readIssues()
    return { issues }
})
