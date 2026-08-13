const BASE64_ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

export function bytesToBase64(bytes) {
  let encoded = '';
  for (let index = 0; index < bytes.length; index += 3) {
    const first = bytes[index];
    const hasSecond = index + 1 < bytes.length;
    const hasThird = index + 2 < bytes.length;
    const second = hasSecond ? bytes[index + 1] : 0;
    const third = hasThird ? bytes[index + 2] : 0;
    const chunk = (first << 16) | (second << 8) | third;
    encoded += BASE64_ALPHABET[(chunk >> 18) & 63];
    encoded += BASE64_ALPHABET[(chunk >> 12) & 63];
    encoded += hasSecond ? BASE64_ALPHABET[(chunk >> 6) & 63] : '=';
    encoded += hasThird ? BASE64_ALPHABET[chunk & 63] : '=';
  }
  return encoded;
}

export function base64ToBytes(value) {
  let encoded = String(value || '').replace(/\s/g, '');
  if (!encoded) return new Uint8Array(0);
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(encoded) || encoded.slice(0, -2).includes('=')) {
    throw new Error('Invalid base64 image data.');
  }
  if (encoded.length % 4 === 1) throw new Error('Invalid base64 image data.');
  while (encoded.length % 4 !== 0) encoded += '=';

  const padding = encoded.endsWith('==') ? 2 : encoded.endsWith('=') ? 1 : 0;
  const bytes = new Uint8Array((encoded.length / 4) * 3 - padding);
  let offset = 0;
  for (let index = 0; index < encoded.length; index += 4) {
    const first = BASE64_ALPHABET.indexOf(encoded[index]);
    const second = BASE64_ALPHABET.indexOf(encoded[index + 1]);
    const third = encoded[index + 2] === '=' ? 0 : BASE64_ALPHABET.indexOf(encoded[index + 2]);
    const fourth = encoded[index + 3] === '=' ? 0 : BASE64_ALPHABET.indexOf(encoded[index + 3]);
    if (first < 0 || second < 0 || third < 0 || fourth < 0) throw new Error('Invalid base64 image data.');
    const chunk = (first << 18) | (second << 12) | (third << 6) | fourth;
    if (offset < bytes.length) bytes[offset++] = (chunk >> 16) & 255;
    if (offset < bytes.length) bytes[offset++] = (chunk >> 8) & 255;
    if (offset < bytes.length) bytes[offset++] = chunk & 255;
  }
  return bytes;
}
