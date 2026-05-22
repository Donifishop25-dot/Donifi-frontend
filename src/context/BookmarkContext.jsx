import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const BookmarkContext = createContext();

export function BookmarkProvider({ children }) {
  const { user } = useAuth();
  const [bookmarks, setBookmarks] = useState([]);

  const storageKey = user ? `donifi_bookmarks_${user.phone}` : null;

  // Load bookmarks when user changes
  useEffect(() => {
    if (!storageKey) {
      setBookmarks([]);
      return;
    }

    const stored = localStorage.getItem(storageKey);
    setBookmarks(stored ? JSON.parse(stored) : []);
  }, [storageKey]);

  // Save bookmarks
  useEffect(() => {
    if (storageKey) {
      localStorage.setItem(storageKey, JSON.stringify(bookmarks));
    }
  }, [bookmarks, storageKey]);

  const toggleBookmark = (item) => {
    setBookmarks(prev => {
      const exists = prev.find(b => b.receiverId === item.receiverId);
      if (exists) {
        return prev.filter(b => b.receiverId !== item.receiverId);
      }
      return [...prev, item];
    });
  };

  const isBookmarked = (receiverId) =>
    bookmarks.some(b => b.receiverId === receiverId);

  return (
    <BookmarkContext.Provider
      value={{ bookmarks, toggleBookmark, isBookmarked }}
    >
      {children}
    </BookmarkContext.Provider>
  );
}

export const useBookmarks = () => useContext(BookmarkContext);
