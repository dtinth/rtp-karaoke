const params = new URLSearchParams(location.search)

export const roomId = params.get('room_id') || 'rtp-karaoke-default'
export const mode = params.get('mode') || 'view'