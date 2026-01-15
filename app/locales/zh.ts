export default {
    editor: {
        // PanelGenerator
        startCreation: '开始创作',
        enterTopicHint: '输入主题，AI 将生成报纸内容。',
        topic: '主题',
        topicPlaceholder: '例如：2050年火星殖民地生活...',
        date: '日期',
        generate: 'AI 生成预览',
        generating: '生成中...',
        manual: '手动创建模板',
        previousIssues: '历史记录',
        noArchives: '暂无记录',
        refresh: '刷新',

        // PanelDashboard
        interactiveMode: '交互模式',
        clickToEdit: '点击预览中的区块进行编辑',
        globalActions: '全局操作',
        back: '返回',
        saveDraft: '保存草稿',
        saving: '保存中...',
        publish: '立即发布',
        publishing: '发布中...',

        // PanelEdit
        save: '保存',
        title: '标题',
        content: '内容',
        textContent: '文本内容',
        mainImage: '主图',
        uploadImage: '上传图片',
        uploadHint: '目前暂不支持 AI 局部重绘图片，请上传本地图片替代。',
        aiInstruction: 'AI 指令...',
        tipHint: '提示：修改实时生效，点击空白处完成编辑。',

        // Status
        draft: '草稿',
        published: '已发布',

        // Editor page
        previewHint: '在此处预览生成的报纸',
        previewHintDuskvol: '印刷机就绪...',
        mdHint: 'MD: **粗体** *斜体* # 标题'
    },
    publication: {
        common: {
            loading: '正在连接新闻服务器...',
            loadingVoid: '正在连接虚空...',
            noData: '暂无日报发布',
            noDataVoid: '暂无编年史发布',
            enterEditor: '前往编辑器',
            enterEditorVoid: '进入印刷室',
            archives: '历史记录',
            backHome: '返回主页',
            page1: '头版',
            page2: '副刊',
            fullIssue: '完整版',
            exportFailed: '导出失败',
            pressRoom: '编辑器',
            pressRoomVoid: '印刷室'
        },
        triangle: {
            editor: {
                title: '三角日报编辑器',
                subtitle: 'Triangle CMS v4.0 • Nuxt Edition',
                emptyState: '在此处预览生成的新闻日报'
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
                title: '冒险者工会日报',
                subtitle: 'Adventurer Guild • Daily Report',
                emptyState: '羊皮纸准备就绪...'
            }
        }
    },
    home: {
        title: '咕噜咕噜日报',
        subtitle: '“打印多元宇宙，一次一页。”',
        footer: '咕噜咕噜日报 © 2026 • 打造于多元宇宙',
        publications: {
            triangle: {
                title: '三角日报',
                tags: '企业 • 科幻 • 几何',
                description: '为独具慧眼的现代公民打造。几何精度，企业委婉语，以及简洁的线条。',
                action: '进入系统'
            },
            duskvol: {
                title: '多斯科沃公报',
                tags: '黑色 • 工业 • 幽灵',
                description: '来自虚空的低语。工业衰退，幽灵，以及在永夜之城中的阴影。',
                action: '潜入暗影'
            },
            adventurer: {
                title: '冒险者公会报',
                tags: '奇幻 • 任务 • 传闻',
                description: '“听着，听着！英雄和流浪者们的新鲜赏金和酒馆传说。”',
                action: '打开卷轴'
            }
        }
    }
}
