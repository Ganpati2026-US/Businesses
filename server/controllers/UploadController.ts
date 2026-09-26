import { Request, Response } from 'express';

export class UploadController {
    /**
     * Handle raw base64 upload requests
     */
    static async upload(req: Request, res: Response) {
        try {
            const { file } = req.body;

            if (!file) {
                return res.status(400).json({ error: 'No file provided' });
            }

            if (!file.startsWith('data:image/')) {
                return res.status(400).json({ error: 'Invalid file type. Please upload an image.' });
            }

            // Return the base64 URL directly for database saving
            res.json({ success: true, url: file });
        } catch (error: any) {
            console.error('Upload API error:', error);
            res.status(500).json({ error: 'Failed to upload image' });
        }
    }
}
