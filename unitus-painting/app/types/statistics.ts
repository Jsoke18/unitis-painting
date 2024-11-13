export interface StatisticItem {
    value: string;
    description: string;
    iconType: 'CheckCircle' | 'Star' | 'Award';
    iconColor: string;
  }
  
  export interface StatisticsContent {
    statistics: StatisticItem[];
  }