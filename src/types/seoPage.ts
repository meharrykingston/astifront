export type SeoPageStatus = "published" | "draft";
export type SeoPageKind = "symptom" | "disease" | "test" | "medicine" | "cause" | "treatment";

export type HeadingStructure = {
  h1: string;
  h2: string[];
  h3: string[];
};

export type SeoContentSection = {
  id: string;
  heading: string;
  body: string;
};

export type SeoPageRecord = {
  id: string;
  pageKind: SeoPageKind;
  targetKeyword: string;
  overview?: string;
  sections?: SeoContentSection[];
  content: string;
  quickAnswer?: string;
  titleTag: string;
  metaTag: string;
  metaDescription: string;
  url: string;
  status: SeoPageStatus;
  author: string;
  headingStructure: HeadingStructure;
  keywordPlacement: string[];
  imageAltText: string[];
  internalLinks: string[];
  views: number;
  createdAt: string;
  updatedAt: string;
};

export type UpsertSeoPagePayload = {
  pageKind: SeoPageKind;
  targetKeyword: string;
  overview?: string;
  sections?: SeoContentSection[];
  content?: string;
  quickAnswer?: string;
  titleTag: string;
  metaTag: string;
  metaDescription: string;
  url: string;
  status: SeoPageStatus;
  author: string;
  headingStructure: {
    h1: string;
    h2: string;
    h3: string;
  };
  keywordPlacement: string;
  imageAltText: string;
  internalLinks: string;
};
