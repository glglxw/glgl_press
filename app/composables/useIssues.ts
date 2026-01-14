import type { GeneratedContent, PublicationType } from '~/types'

export function useIssues() {
    async function getLatestIssue(publicationType?: PublicationType): Promise<GeneratedContent | null> {
        try {
            const query = publicationType ? `?type=${publicationType}` : ''
            const response = await $fetch<{ issue: GeneratedContent | null }>(`/api/issues/latest${query}`)
            return response.issue
        } catch (e) {
            console.error('Failed to fetch latest issue:', e)
            return null
        }
    }

    async function saveIssue(content: GeneratedContent): Promise<GeneratedContent | null> {
        try {
            console.log('[useIssues] Attempting to save issue:', content)
            const response = await $fetch<{ success: boolean; issue: GeneratedContent }>('/api/issues', {
                method: 'POST',
                body: content
            })

            console.log('[useIssues] Save response:', response)
            if (response.success) {
                return response.issue
            }
            return null
        } catch (e) {
            console.error('[useIssues] Failed to save issue:', e)
            return null
        }
    }

    async function getAllIssues(): Promise<GeneratedContent[]> {
        try {
            const response = await $fetch<{ issues: GeneratedContent[] }>('/api/issues')
            return response.issues
        } catch (e) {
            console.error('Failed to fetch issues:', e)
            return []
        }
    }

    return {
        getLatestIssue,
        saveIssue,
        getAllIssues
    }
}
