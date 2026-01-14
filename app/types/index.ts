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
    }>;
    column1: {
        title: string;
        content: string;
    };
    column2: {
        title: string;
        content: string;
    };
    weirdNews: {
        title: string;
        content: string;
    };
}

export interface SecondPageData {
    editorial: {
        title: string;
        content: string;
    };
    classifieds: Array<{
        title: string;
        content: string;
    }>;
    culture: {
        title: string;
        content: string;
    };
    horoscope: string;
}

export interface NewsData {
    date: string;
    location: string;
    frontPage: FrontPageData;
    secondPage: SecondPageData;
}

export interface GeneratedContent {
    id?: string;
    textData: NewsData;
    imageBase64?: string;
    publicationType: PublicationType;
    theme: ThemeType;
    publishedAt?: string;
}

export interface ThemeColors {
    primary: string;
    secondary: string;
    background: string;
    text: string;
    accent: string;
}
