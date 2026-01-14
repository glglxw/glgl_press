/**
 * Auto-fit text composable
 * Automatically scales the font size of an element to fit its container
 */
export function useAutoFitText() {
    function fitTextToContainer(
        element: HTMLElement,
        container: HTMLElement,
        minFontSize = 8,
        maxFontSize = 14
    ) {
        if (!element || !container) return

        // Remove line-clamp temporarily for measurement
        const originalLineClamp = element.style.webkitLineClamp
        const originalOverflow = element.style.overflow
        element.style.webkitLineClamp = 'unset'
        element.style.overflow = 'visible'

        // Start with max font size
        let fontSize = maxFontSize
        element.style.fontSize = `${fontSize}px`

        // Get container's available height
        const containerHeight = container.clientHeight

        // Reduce font size until content fits
        while (element.scrollHeight > containerHeight && fontSize > minFontSize) {
            fontSize -= 0.5
            element.style.fontSize = `${fontSize}px`
        }

        // Restore line-clamp
        element.style.webkitLineClamp = originalLineClamp
        element.style.overflow = originalOverflow
    }

    function autoFitAll(containerRef: HTMLElement | null, selector = '[data-autofit]') {
        if (!containerRef) return

        const textElements = containerRef.querySelectorAll(selector)
        textElements.forEach((el) => {
            const element = el as HTMLElement
            const container = element.closest('[data-autofit-container]') as HTMLElement || element.parentElement
            if (container) {
                const minSize = parseInt(element.dataset.autofitMin || '8')
                const maxSize = parseInt(element.dataset.autofitMax || '14')
                fitTextToContainer(element, container, minSize, maxSize)
            }
        })
    }

    return {
        fitTextToContainer,
        autoFitAll
    }
}
