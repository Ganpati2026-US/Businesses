import QRCode from 'qrcode';

/**
 * Generate QR code as data URL
 * @param url - The URL to encode in the QR code
 * @returns Data URL of the QR code image
 */
export async function generateQRCode(url: string): Promise<string> {
    try {
        const qrCodeDataUrl = await QRCode.toDataURL(url, {
            width: 400,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#FFFFFF',
            },
        });
        return qrCodeDataUrl;
    } catch (error) {
        console.error('Error generating QR code:', error);
        throw new Error('Failed to generate QR code');
    }
}

/**
 * Generate QR code as buffer
 * @param url - The URL to encode in the QR code
 * @returns Buffer of the QR code image
 */
export async function generateQRCodeBuffer(url: string): Promise<Buffer> {
    try {
        const buffer = await QRCode.toBuffer(url, {
            width: 400,
            margin: 2,
        });
        return buffer;
    } catch (error) {
        console.error('Error generating QR code buffer:', error);
        throw new Error('Failed to generate QR code buffer');
    }
}
