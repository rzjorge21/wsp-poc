export interface NormalizedMessage {
  wabaPhoneId: string;
  senderPhone: string;
  senderName?: string;

  messageId: string;
  timestamp: number;

  type: 'text' | 'image' | 'audio' | 'button' | 'location' | 'unknown';

  text?: string;
  imageUrl?: string;
  audioUrl?: string;
  location?: {
    lat: number;
    lng: number;
  };

  raw: any;
}
