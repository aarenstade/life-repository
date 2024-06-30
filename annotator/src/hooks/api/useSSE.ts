import { useState, useEffect, useRef } from "react";

type EventData = any; // TODO: Define the type according to the data structure you expect.

export interface UseSSEConfig {
  url?: string;
  id?: string;
}

function useSSE(config?: UseSSEConfig): EventData[] {
  const endpoint = config?.url ? config.url : "http://localhost:8001/events";

  const [events, setEvents] = useState<EventData[]>([]);
  const eventSourceRef = useRef<EventSource | null>(null);
  const retryIntervalRef = useRef<number | null>(null);

  const initializeEventSource = () => {
    const url = config?.id ? `${endpoint}?id=${config.id}` : endpoint;
    const eventSource = new EventSource(url);

    eventSource.onmessage = (event) => {
      const parsedData = JSON.parse(event.data);
      setEvents((prevEvents) => [...prevEvents, parsedData]);
    };

    eventSource.onopen = () => {
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
        retryIntervalRef.current = null;
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      if (eventSource.readyState !== EventSource.CLOSED) {
        eventSource.close();
      }
      if (!retryIntervalRef.current) {
        retryIntervalRef.current = window.setInterval(initializeEventSource, 5000);
      }
    };

    eventSourceRef.current = eventSource;
  };

  useEffect(() => {
    initializeEventSource();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (retryIntervalRef.current) {
        clearInterval(retryIntervalRef.current);
      }
    };
  }, [endpoint, config?.id]);

  return events;
}

export default useSSE;
