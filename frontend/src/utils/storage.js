const getStorageKey = (userId) => `examOS_state_${userId}`;

export const loadState = (userId) => {
  if (!userId) return undefined;
  try {
    const serializedState = localStorage.getItem(getStorageKey(userId));
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('Could not load state', err);
    return undefined;
  }
};

export const saveState = (userId, state) => {
  if (!userId) return;
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(getStorageKey(userId), serializedState);
  } catch (err) {
    console.error('Could not save state', err);
  }
};

export const resetUserState = (userId) => {
  if (!userId) return;
  localStorage.removeItem(getStorageKey(userId));
};

// Internal metadata for tracking the last logged in user (optional convenience)
export const saveLastUser = (userId) => localStorage.setItem('examOS_last_user', userId);
export const loadLastUser = () => localStorage.getItem('examOS_last_user');
export const clearLastUser = () => localStorage.removeItem('examOS_last_user');

// Initial state shape
export const getInitialState = () => ({
  progress: {},
  weakTopics: [],
  scores: {},
  lastVisited: '/'
});
