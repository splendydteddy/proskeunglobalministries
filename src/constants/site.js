/** Display address for Sunday service / main center (written directions). */
export const MAIN_CAMPUS = {
  display:
    'The Proskeun Center, 15 Nova Road, Opp Uwasota Busstop, Ugbowo, Benin City.',
};

/** Official Google Maps link for Sunday service — do not replace with search URL. */
export const SUNDAY_SERVICE_DIRECTIONS_URL =
  'https://www.google.com/maps/dir//Proskeun+global+ministry,+12a+Ogbeide+St,+Uselu,+Benin+City+300103,+Edo/@6.394096,5.6094877,7360m/data=!3m1!1e3!4m8!4m7!1m0!1m5!1m1!1s0x10472d004e8f03cb:0x2a72fc5135325510!2m2!1d5.6119774!2d6.384577?entry=ttu&g_ep=EgoyMDI2MDgyNi4wIKXMDSoASAFQAw%3D%3D';

export function mapsSearchUrl(query) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export const IMAGE_FALLBACK = '/logo.png';

/** Max sermon audio upload size (100 MB). */
export const MAX_SERMON_AUDIO_BYTES = 100 * 1024 * 1024;

export const ALLOWED_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/x-wav',
  'audio/mp4',
  'audio/x-m4a',
  'audio/aac',
  'audio/ogg',
];
