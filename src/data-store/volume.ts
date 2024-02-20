const VolumeMuted = 'volume-muted'
const True = 'true';
const False = 'false';

/**
 * Mute the BGM.
 */
export function muteBGM() {
    localStorage.setItem(VolumeMuted, True);
}

/**
 * Unmute the BGM.
 */
export function unmuteBGM() {
    localStorage.setItem(VolumeMuted, False);
}

/**
 * @returns {boolean} true if the BGM is muted, false otherwise.
 */
export function isMuted(): boolean {
    const isMuted = localStorage.getItem(VolumeMuted);
    if (!isMuted) {
        localStorage.setItem(VolumeMuted, False);
        return false;
    }
    
    return isMuted.toLowerCase() === True;
}