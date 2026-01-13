'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Task, UseTaskStatusReturn } from '@/types';
import { getTask } from '@/lib/api';

// Polling interval in milliseconds
const POLL_INTERVAL = 1000;

export function useTaskStatus(taskId: string | null): UseTaskStatusReturn {
    const [task, setTask] = useState<Task | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isConnected, setIsConnected] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const pollingRef = useRef<NodeJS.Timeout | null>(null);

    // Fetch task data from API
    const fetchTask = useCallback(async (id: string) => {
        try {
            const data = await getTask(id);
            setTask(data as Task);
            setError(null);
            setIsConnected(true);

            // Stop polling if task is completed or failed
            if (data.status === 'completed' || data.status === 'failed') {
                if (pollingRef.current) {
                    clearInterval(pollingRef.current);
                    pollingRef.current = null;
                }
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch task');
            setIsConnected(false);
        }
    }, []);

    useEffect(() => {
        if (!taskId) {
            setTask(null);
            setIsConnected(false);
            setError(null);
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
            return;
        }

        // Initial fetch
        setIsLoading(true);
        fetchTask(taskId).finally(() => setIsLoading(false));

        // Start polling for updates
        pollingRef.current = setInterval(() => {
            fetchTask(taskId);
        }, POLL_INTERVAL);

        // Cleanup on unmount or taskId change
        return () => {
            if (pollingRef.current) {
                clearInterval(pollingRef.current);
                pollingRef.current = null;
            }
        };
    }, [taskId, fetchTask]);

    return {
        task,
        status: task?.status ?? null,
        progress: task?.progress ?? 0,
        result: task?.result ?? null,
        error: error || task?.error_message || null,
        isLoading,
        isConnected,
    };
}
