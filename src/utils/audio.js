const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Uplifting chime
  failure: 'https://assets.mixkit.co/active_storage/sfx/2005/2005-preview.mp3'  // Low/muted chime
};

export const playFeedback = (isCorrect) => {
  try {
    const audio = new Audio(isCorrect ? SOUNDS.success : SOUNDS.failure);
    audio.volume = 0.4;
    audio.play().catch(e => console.log('Audio playback prevented:', e));
  } catch (err) {
    console.error('Sound system error:', err);
  }
};
