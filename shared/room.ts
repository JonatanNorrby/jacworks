// Missing room is reserved for legacy clients; new browser visits create private links.
export function roomFromUrl(url: string): string | null {
  const room = new URL(url).searchParams.get('room');
  return room === null ? 'prototype-01' : /^[a-zA-Z0-9_-]{6,64}$/.test(room) ? room : null;
}
