import { CreateTaskResponse, TaskType } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export interface ProcessOptions {
    format?: 'video' | 'audio';
    quality?: string;
    ytdlpFormat?: string;
    audioBitrate?: string;
    separation?: 'vocals' | 'instrumental' | 'drum' | 'bass' | 'other';
}

export async function createTask(
    type: TaskType,
    inputUrl: string,
    options?: ProcessOptions
): Promise<CreateTaskResponse> {
    const response = await fetch(`${API_URL}/api/process`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            type,
            url: inputUrl,
            format: options?.format,
            quality: options?.quality,
            ytdlp_format: options?.ytdlpFormat,
            audio_bitrate: options?.audioBitrate,
        }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to create task');
    }

    return response.json();
}

export async function getTask(taskId: string) {
    const response = await fetch(`${API_URL}/api/tasks/${taskId}`);

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Failed to fetch task');
    }

    return response.json();
}
