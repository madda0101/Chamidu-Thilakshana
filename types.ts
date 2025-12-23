
export interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export enum BeautyCategory {
  SKINCARE = 'Skincare',
  HAIRCARE = 'Haircare',
  MAKEUP = 'Makeup',
  CONFIDENCE = 'Confidence',
  FASHION = 'Fashion'
}
