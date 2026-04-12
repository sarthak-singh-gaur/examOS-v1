const SOUNDS = {
  success: 'https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3', // Uplifting chime
  failure: 'https://assets.mixkit.co/active_storage/sfx/2056/2056-preview.mp3'  // Distinct error/failure tone
};

export const playFeedback = (isCorrect) => {
  try {
    const audio = new Audio(isCorrect ? SOUNDS.success : SOUNDS.failure);
    audio.volume = 0.15;
    audio.play().catch(e => console.log('Audio playback prevented:', e));
  } catch (err) {
    console.error('Sound system error:', err);
  }
};
