import { useEffect, useCallback, useRef } from 'react';
import { MessageBroker } from './MessageBroker';

const broker = new MessageBroker();

type Listener = (message: object) => void;

function useBroker() {
  const brokerRef = useRef(broker);
  return brokerRef.current;
}

export function useSubscribe(topic: string, listener: Listener) {
  const broker = useBroker();
  useEffect(() => {
    const unsubscribe = broker.subscribe(topic, listener);
    return () => {
      unsubscribe();
    };
  }, [broker, topic, listener]);
}

export function usePublish(topic: string) {
  const broker = useBroker();
  const publish = useCallback(
    (message: object) => {
      broker.publish(topic, message);
    },
    [broker, topic]
  );
  return publish;
}
