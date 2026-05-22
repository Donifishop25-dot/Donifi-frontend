// src/context/RefreshContext.jsx
import { createContext, useContext, useState } from "react";

const RefreshContext = createContext();

export function useRefresh() {
  return useContext(RefreshContext);
}

export function RefreshProvider({ children }) {
  const [refreshReceivers, setRefreshReceivers] = useState(false);

  const triggerRefresh = () => setRefreshReceivers(true);
  const doneRefresh = () => setRefreshReceivers(false);

  return (
    <RefreshContext.Provider
      value={{ refreshReceivers, triggerRefresh, doneRefresh }}
    >
      {children}
    </RefreshContext.Provider>
  );
}
