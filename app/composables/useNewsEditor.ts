import { ref } from 'vue'
import { type ThemeType, PublicationType, IssueStatus, type GeneratedContent, type NewsData } from '~/types'

export function useNewsEditor(publicationType: PublicationType) {
    const { generateNewsContent, generateNewsImage, rewriteText, loading, loadingStep } = useGemini()
    const { saveIssue, getAllIssues } = useIssues()
    const router = useRouter()

    // State
    const topic = ref('')
    const date = ref(new Date().toLocaleDateString('en-CA')) // YYYY-MM-DD in user's local timezone
    const theme = ref<ThemeType | null>(null)

    const previewContent = ref<GeneratedContent | null>(null)
    const isPublishing = ref(false)
    const isSaving = ref(false)

    const selectedPath = ref<string | null>(null)
    const selectedLabel = ref('')
    const isRewriting = ref(false)
    const rewritePrompt = ref('')

    // Issues List
    const allIssues = ref<GeneratedContent[]>([])
    const loadingIssues = ref(false)

    // Initialize
    async function init() {
        await loadIssueList()
    }

    async function loadIssueList() {
        loadingIssues.value = true
        try {
            const issues = await getAllIssues()
            if (issues) {
                allIssues.value = issues
                    .filter(issue => issue.publicationType === publicationType)
                    .sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime())
            }
        } finally {
            loadingIssues.value = false
        }
    }

    // Actions
    function createBlankTemplate(defaultData: NewsData, defaultTheme: ThemeType) {
        const textData = defaultData
        theme.value = defaultTheme
        previewContent.value = { textData, theme: defaultTheme, publicationType }
        selectedPath.value = null
    }

    async function handleGenerate() {
        if (!theme.value) return
        const textData = await generateNewsContent(topic.value, date.value, theme.value, publicationType)
        if (!textData) return null

        previewContent.value = { textData, theme: theme.value, publicationType }

        // Background image generation
        if (theme.value) {
            generateNewsImage(textData.frontPage.mainImagePrompt, theme.value, publicationType).then(imageBase64 => {
                if (imageBase64 && previewContent.value) {
                    previewContent.value = { ...previewContent.value, imageBase64 }
                }
            })
        }

        selectedPath.value = null
        return textData
    }

    async function handlePublish() {
        if (!previewContent.value) return
        isPublishing.value = true
        try {
            // Set status to published
            const contentToSave = { ...previewContent.value, status: IssueStatus.PUBLISHED }
            const result = await saveIssue(contentToSave)
            if (result) {
                previewContent.value = result
                await loadIssueList()
                return true
            }
            return false
        } finally {
            isPublishing.value = false
        }
    }

    async function handleSaveDraft() {
        if (!previewContent.value) return
        isSaving.value = true
        try {
            // Set status to draft
            const contentToSave = { ...previewContent.value, status: IssueStatus.DRAFT }
            const result = await saveIssue(contentToSave)
            if (result) {
                previewContent.value = result // Update with ID if new
                await loadIssueList() // Refresh list
                return true
            }
            return false
        } finally {
            isSaving.value = false
        }
    }


    function handleSelectIssue(issue: GeneratedContent) {
        previewContent.value = issue
        if (issue.theme) theme.value = issue.theme
        if (issue.textData?.date) {
            date.value = issue.textData.date
        }
        selectedPath.value = null
    }

    // Data Manipulation
    function getValue(path: string): any {
        if (!previewContent.value) return ''
        const keys = path.split('.')
        let current: any = previewContent.value.textData
        for (const k of keys) {
            if (current === undefined) return ''
            current = current[k]
        }
        return current
    }

    // Efficient deep update
    function updateTextData(path: string, field: string | null, value: any) {
        if (!previewContent.value) return

        // Direct mutation for performance / simplicity
        const keys = path.split('.')
        if (field) keys.push(field)

        if (keys.length === 0) return

        let current: any = previewContent.value.textData
        for (let i = 0; i < keys.length - 1; i++) {
            if (!current) return
            current = current[keys[i]]
        }

        const lastKey = keys[keys.length - 1]
        if (current && lastKey) {
            current[lastKey] = value
        }
    }

    function updateScale(scale: number) {
        if (!previewContent.value || !selectedPath.value) return

        let target = getValue(selectedPath.value)

        // If target is primitive (e.g. string content), try to apply scale to parent
        if (typeof target !== 'object' || target === null) {
            const keys = selectedPath.value.split('.')
            keys.pop() // remove property name
            if (keys.length > 0) {
                // Traverse to parent
                let current: any = previewContent.value.textData
                for (const k of keys) {
                    if (current === undefined) return
                    current = current[k]
                }
                // Set scale on parent (e.g. FrontPageData)
                if (current) current.scale = scale
            }
        } else {
            // Target is object (e.g. column1), set scale on it
            target.scale = scale
        }
    }

    function getScale(): number {
        if (!previewContent.value || !selectedPath.value) return 1

        let target = getValue(selectedPath.value)
        if (typeof target === 'object' && target !== null && typeof target.scale === 'number') {
            return target.scale
        }

        // Check parent
        const keys = selectedPath.value.split('.')
        keys.pop()
        if (keys.length > 0) {
            let current: any = previewContent.value.textData
            for (const k of keys) {
                if (current === undefined) return 1
                current = current[k]
            }
            if (current && typeof current.scale === 'number') return current.scale
        }

        return 1
    }


    function handleSectionSelect(path: string, label: string) {
        if (!path) {
            selectedPath.value = null
            return
        }
        selectedPath.value = path
        selectedLabel.value = label
        rewritePrompt.value = ''
    }

    async function handleSmartRewrite(currentText: string) {
        console.log('[NewsEditor] handleSmartRewrite called:', {
            currentText: currentText?.substring(0, 50),
            rewritePrompt: rewritePrompt.value
        })

        if (!currentText || !rewritePrompt.value) {
            console.log('[NewsEditor] handleSmartRewrite early return - missing text or prompt')
            return currentText
        }

        isRewriting.value = true
        console.log('[NewsEditor] Starting rewrite...')

        try {
            const result = await rewriteText(currentText, rewritePrompt.value)
            console.log('[NewsEditor] Rewrite complete, result length:', result?.length)
            return result
        } finally {
            isRewriting.value = false
        }
    }

    function handleImageUpload(e: Event) {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                if (previewContent.value) {
                    previewContent.value = { ...previewContent.value, imageBase64: reader.result as string }
                }
            }
            reader.readAsDataURL(file)
        }
    }

    return {
        // State
        topic,
        date,
        theme,
        previewContent,
        isPublishing,
        isSaving,
        selectedPath,
        selectedLabel,
        isRewriting,
        rewritePrompt,
        loading,
        loadingStep,
        allIssues,
        loadingIssues,

        // Actions
        init,
        loadIssueList,
        createBlankTemplate,
        handleGenerate,
        handlePublish,
        handleSaveDraft,
        handleSelectIssue,
        getValue,
        updateTextData,
        updateScale,
        getScale,
        handleSectionSelect,
        handleSmartRewrite,
        handleImageUpload
    }
}
