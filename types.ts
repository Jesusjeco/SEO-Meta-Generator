export interface MetaOption {
  type: string;
  meta_title: string;
  meta_title_length: number;
  meta_description: string;
  meta_description_length: number;
}

export interface SeoResponse {
  option_1: MetaOption;
  option_2: MetaOption;
}

export interface AnalysisInputs {
  url: string;
  targetPageContent: string;
  marketingFocus: string;
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}