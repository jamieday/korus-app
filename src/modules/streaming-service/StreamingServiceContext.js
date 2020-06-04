import React, { useContext } from 'react';
import { findService } from './index';

export const StreamingServiceContext = React.createContext(undefined);

export const useStreamingService = () => {
  const context = useContext(StreamingServiceContext);
  const service = context ? findService(context.key) : undefined;
  return {
    context,
    service,
  };
};
