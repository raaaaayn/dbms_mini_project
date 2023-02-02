import { useEffect, useState } from 'react';

import { host, wshost } from '@/config/config';

const useWebsocket = () => {
  const [message, set_message] = useState<any>(null);
  const [enabled, set_enabled] = useState(false);

  const start_websocket = () => {
    set_enabled(true);
  };

  const close_websocket = () => {
    set_enabled(false);
  };

  useEffect(() => {
    let websocket: WebSocket | null = null;
    if (enabled) {
      websocket = new WebSocket(`${wshost}/ws`);
      websocket.onopen = () => {
        console.log('connected');
      };
      websocket.onmessage = (event) => {
        console.log({ data: event.data });
        const data = JSON.parse(event.data);
        console.log({ data });
        set_message(data);
      };
    } else {
      if (websocket)
        // @ts-ignore
        websocket.close();
    }
    return () => {
      if (websocket) websocket.close();
    };
  }, [enabled]);

  return { message, start_websocket, close_websocket };
};

export default useWebsocket;
