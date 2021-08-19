const params = new URLSearchParams(location.search)

export const roomId = params.get('room_id') || ''
export const mode = params.get('mode') || 'edit'