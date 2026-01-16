export default {
    editor: {
        // PanelGenerator
        startCreation: 'Start Creation',
        enterTopicHint: 'Enter a topic, and AI will generate the newspaper.',
        topic: 'Topic',
        topicPlaceholder: 'e.g. Life in 2050 Mars Colony...',
        date: 'Date',
        generate: 'AI Generate Preview',
        generating: 'Generating...',
        manual: 'Manual Blank Template',
        previousIssues: 'Previous Chronicles',
        noArchives: 'No archives found.',
        refresh: 'Refresh',

        // PanelDashboard  
        interactiveMode: 'Interactive Mode',
        clickToEdit: 'Click sections in the preview to edit.',
        globalActions: 'Global Actions',
        back: 'Back',
        saveDraft: 'Save Draft',
        saving: 'Saving...',
        publish: 'Publish Now',
        publishing: 'Publishing...',

        // PanelEdit
        save: 'Save',
        title: 'Title',
        content: 'Content',
        textContent: 'Text Content',
        mainImage: 'Main Image',
        uploadImage: 'Upload new image',
        uploadHint: 'AI image editing is not supported yet. Please upload a local image.',
        aiInstruction: 'AI instruction...',
        tipHint: 'Tips: Changes are reflected in real-time. Click outside to finish.',

        // Status
        draft: 'Draft',
        published: 'Published',

        // Editor page
        previewHint: 'Preview the generated newspaper here',
        previewHintDuskvol: 'The printing press awaits...',
        mdHint: 'MD: **bold** *italic* # Large',

        // Style Adjuster
        styleTitle: 'Styles',
        reset: 'Reset',
        fontSize: 'Font Size',
        lineHeight: 'Line Height',
        offsetX: 'Offset X',
        offsetY: 'Offset Y',
        selectSectionToAdjust: 'Select a section to adjust styles'
    },
    publication: {
        common: {
            loading: 'Connecting to News Server...',
            loadingVoid: 'Connecting to the Void...',
            noData: 'No Chronicle Published',
            noDataVoid: 'No Chronicle Published',
            enterEditor: 'Go to Editor',
            enterEditorVoid: 'Enter the Press Room',
            archives: 'Archives',
            backHome: 'Back to Home',
            page1: 'Page 1',
            page2: 'Page 2',
            fullIssue: 'Full Issue',
            exportFailed: 'Export Failed',
            pressRoom: 'Editor',
            pressRoomVoid: 'Press Room'
        },
        triangle: {
            editor: {
                title: 'Triangle Daily Editor',
                subtitle: 'Triangle CMS v4.0 • Nuxt Edition',
                emptyState: 'Preview the generated newspaper here'
            }
        },
        duskvol: {
            editor: {
                title: 'The Press Room',
                subtitle: 'Duskvol Chronicle • Printing Press',
                emptyState: 'The printing press awaits...'
            }
        },
        adventurer: {
            editor: {
                title: 'Adventurer Guild Daily',
                subtitle: 'Adventurer Guild • Daily Report',
                emptyState: 'The parchment awaits...'
            }
        }
    },
    home: {
        title: 'Gulugulu Press',
        subtitle: '"Printing the multiverse, one page at a time."',
        footer: 'Gulugulu Generator © 2026 • Crafted in the Multiverse',
        publications: {
            triangle: {
                title: 'Triangle Daily',
                tags: 'Corporate • Sci-Fi • Geometric',
                description: 'For the discerning modern citizen. Geometric precision, corporate euphemisms, and clean lines.',
                action: 'Enter System'
            },
            duskvol: {
                title: 'Duskvol Chronicle',
                tags: 'Noir • Industrial • Ghostly',
                description: 'Whispers from the void. Industrial decay, ghosts, and shadows in a city of eternal night.',
                action: 'Enter Shadows'
            },
            adventurer: {
                title: 'Adventurer\'s Guild',
                tags: 'Fantasy • Quests • Rumors',
                description: '"Hear ye, hear ye! Fresh bounties and tavern tales for heroes and vagabonds alike."',
                action: 'Open Scroll'
            }
        }
    }
}
