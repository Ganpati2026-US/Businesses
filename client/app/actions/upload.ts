'use server';

import { apiFetch } from '@/client-lib/api';

const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;

export async function uploadFile(formData: FormData) {
    try {
        const file = formData.get('file') as File;

        if (!file) {
            return { success: false, error: 'No file provided' };
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return { success: false, error: 'Invalid file type. Please upload an image.' };
        }

        if (file.size > MAX_UPLOAD_SIZE_BYTES) {
            return { success: false, error: 'Image must be 5MB or smaller.' };
        }

        // Convert file to buffer and then to base64 data URI
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const base64 = buffer.toString('base64');
        const dataURI = `data:${file.type};base64,${base64}`;

        // Forward to the backend upload endpoint
        const res = await apiFetch('/api/v1/upload', {
            method: 'POST',
            body: JSON.stringify({ file: dataURI }),
        });

        const contentType = res.headers.get('content-type') || '';

        if (!res.ok) {
            if (contentType.includes('application/json')) {
                const errData = await res.json();
                return { success: false, error: errData.error || 'Failed to upload file' };
            }

            const errText = await res.text();
            const normalizedError = errText.includes('PayloadTooLargeError') || res.status === 413
                ? 'Image is too large after processing. Please upload an image under 5MB.'
                : `Upload failed (${res.status}).`;
            return { success: false, error: normalizedError };
        }

        if (!contentType.includes('application/json')) {
            return { success: false, error: 'Upload failed: unexpected server response.' };
        }

        return await res.json(); // Returns { success: true, url: dataURI }
    } catch (error) {
        console.error('Error uploading file:', error);
        return { success: false, error: 'Failed to upload file' };
    }
}

