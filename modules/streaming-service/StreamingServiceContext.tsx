import { createContext, useContext } from 'react';
import { StreamingServiceContext as StreamingServiceContextType } from './types';
import { findService } from './index';

export const StreamingServiceContext = createContext<
  StreamingServiceContextType | undefined
>(undefined);

type StreamingServiceState =
  | {
      type: 'connected',
      context: StreamingServiceContextType,
      service: NonNullable<ReturnType<typeof findService>>
    }
  | { type: 'disconnected', context: undefined, service: undefined };

export const useStreamingService = (): StreamingServiceState => {
  const context = useContext(StreamingServiceContext);

  if (context) {
    const service = findService(context.key);
    return { type: 'connected', context, service };
  }

  return { type: 'disconnected', context: undefined, service: undefined };
};
