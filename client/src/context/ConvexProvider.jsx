import { ConvexProvider as BaseConvexProvider } from 'convex/react';
import { ConvexReactClient } from 'convex/react';
import { useState, createContext, useContext } from 'react';

const convexUrl = import.meta.env.VITE_CONVEX_URL || 'https://giddy-lyrebird-252.convex.cloud';
const convex = new ConvexReactClient(convexUrl);

const ConvexContext = createContext();

export const useConvexMutation = (functionName) => {
  return async (args) => {
    try {
      return await convex.mutation(functionName, args);
    } catch (error) {
      console.error(`Error calling mutation ${functionName}:`, error);
      throw error;
    }
  };
};

export const useConvexQuery = (functionName, args) => {
  try {
    return convex.query(functionName, args);
  } catch (error) {
    console.error(`Error calling query ${functionName}:`, error);
    return null;
  }
};

export const ConvexProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  return (
    <ConvexContext.Provider value={{ isConnected, convex }}>
      <BaseConvexProvider client={convex}>
        {children}
      </BaseConvexProvider>
    </ConvexContext.Provider>
  );
};

export const useConvexContext = () => {
  const context = useContext(ConvexContext);
  if (!context) {
    throw new Error('useConvexContext must be used within ConvexProvider');
  }
  return context;
};
