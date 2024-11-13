export interface HistoryCard {
    title: string;
    description: string;
  }
  
  export interface TimelineItem {
    year: string;
    description: string;
  }
  
  export interface HistoryContent {
    title: {
      badge: string;
      mainHeading: string;
      subHeading: string;
    };
    historyCards: HistoryCard[];
    timelineItems: TimelineItem[];
  }