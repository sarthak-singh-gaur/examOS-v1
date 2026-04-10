import React, { createContext, useContext, useState, useEffect } from 'react';
import { loadState, saveState, getInitialState, loadLastUser, saveLastUser, resetUserState, clearLastUser } from '../utils/storage';

const ExamContext = createContext(null);

export const ExamProvider = ({ children }) => {
  const [userId, setUserId] = useState(() => loadLastUser());
  const [state, setState] = useState(() => {
    if (userId) return loadState(userId) || getInitialState();
    return getInitialState();
  });

  // Hot reload state if userId changes
  useEffect(() => {
    if (userId) {
      saveLastUser(userId);
      const userState = loadState(userId);
      setState(userState || getInitialState());
    } else {
      clearLastUser();
      setState(getInitialState());
    }
  }, [userId]);

  // Persist state changes exactly to active user
  useEffect(() => {
    if (userId) {
      saveState(userId, state);
    }
  }, [state, userId]);

  const loginOS = (name) => {
    setUserId(name.trim().toLowerCase());
  };

  const resetOS = () => {
    if (!userId) return;
    resetUserState(userId);
    clearLastUser();
    setUserId(null); // Boot them out
  };

  const updateProgress = (subjectId, unitId, progress) => {
    setState(prev => ({
      ...prev,
      progress: {
        ...prev.progress,
        [`${subjectId}`]: {
          ...(prev.progress[subjectId] || {}),
          [unitId]: progress
        }
      }
    }));
  };

  const addWeakTopic = (topicId) => {
    setState(prev => {
      if (prev.weakTopics.includes(topicId)) return prev;
      return {
        ...prev,
        weakTopics: [...prev.weakTopics, topicId]
      };
    });
  };

  const updateLastVisited = (urlPath) => {
    setState(prev => ({
      ...prev,
      lastVisited: urlPath
    }));
  };

  return (
    <ExamContext.Provider value={{
      userId,
      loginOS,
      resetOS,
      state,
      updateProgress,
      addWeakTopic,
      updateLastVisited
    }}>
      {children}
    </ExamContext.Provider>
  );
};

export const useExam = () => {
  const context = useContext(ExamContext);
  if (!context) throw new Error('useExam must be used within ExamProvider');
  return context;
};
