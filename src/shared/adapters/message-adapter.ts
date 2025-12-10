import { NormalizedMessage } from './message.types';

export class MessageAdapter {

  static normalize(payload: any): NormalizedMessage | null {
    if (!payload.entry?.length) return null;

    const entry = payload.entry[0];
    const change = entry.changes?.[0];
    const value = change?.value;

    if (!value?.messages?.length) {
      return null; // No hay mensajes entrantes
    }

    const msg = value.messages[0];
    const contact = value.contacts?.[0];
    const phoneId = value.metadata?.phone_number_id;

    const base: NormalizedMessage = {
      wabaPhoneId: phoneId,
      senderPhone: contact?.wa_id,
      senderName: contact?.profile?.name,

      messageId: msg.id,
      timestamp: parseInt(msg.timestamp),

      type: msg.type || 'unknown',
      raw: payload
    };

    // Normalizar por tipo
    switch (msg.type) {
      case 'text':
        base.text = msg.text?.body;
        break;

      case 'image':
        base.imageUrl = msg.image?.link;
        break;

      case 'audio':
        base.audioUrl = msg.audio?.link;
        break;

      case 'location':
        base.location = {
          lat: msg.location.latitude,
          lng: msg.location.longitude,
        };
        break;

      default:
        base.type = 'unknown';
    }

    return base;
  }

}
