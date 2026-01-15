export enum ThemeType {
    CLASSIC_RED = 'CLASSIC_RED',
    DEEP_BLUE = 'DEEP_BLUE',
    EMERALD = 'EMERALD',
    NOIR = 'NOIR'
}

export enum PublicationType {
    TRIANGLE = 'TRIANGLE',
    DUSKVOL = 'DUSKVOL'
}

export interface FrontPageData {
    headline: string;
    mainStory: string;
    mainImagePrompt: string;
    newsSnippets: Array<{
        title: string;
        content: string;
        scale?: number;
    }>;
    column1: {
        title: string;
        content: string;
        scale?: number;
    };
    column2: {
        title: string;
        content: string;
        scale?: number;
    };
    weirdNews: {
        title: string;
        content: string;
        scale?: number;
    };
    scale?: number; // For mainStory
}

export interface SecondPageData {
    editorial: {
        title: string;
        content: string;
        scale?: number;
    };
    classifieds: Array<{
        title: string;
        content: string;
        scale?: number;
    }>;
    culture: {
        title: string;
        content: string;
        scale?: number;
    };
    horoscope: string;
    scale?: number;
}

export interface NewsData {
    date: string;
    location: string;
    frontPage: FrontPageData;
    secondPage: SecondPageData;
}

export enum IssueStatus {
    DRAFT = 'draft',
    PUBLISHED = 'published'
}

export interface GeneratedContent {
    id?: string;
    textData: NewsData;
    imageBase64?: string;
    publicationType: PublicationType;
    theme: ThemeType;
    status?: IssueStatus;
    publishedAt?: string;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
}
