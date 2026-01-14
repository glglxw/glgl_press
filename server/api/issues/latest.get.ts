import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import { join, dirname } from 'path'

type PublicationType = 'TRIANGLE' | 'DUSKVOL'

interface GeneratedContent {
    id?: string
    textData: any
    imageBase64?: string
    publicationType: PublicationType
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

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const publicationType = query.type as PublicationType | undefined

    const issues = await readIssues()

    // Filter by publication type if specified
    const filtered = publicationType
        ? issues.filter(i => i.publicationType === publicationType)
        : issues

    // Sort by publishedAt descending, get latest
    const sorted = filtered.sort((a, b) => {
        const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
        const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
        return dateB - dateA
    })

    return { issue: sorted[0] || null }
})
