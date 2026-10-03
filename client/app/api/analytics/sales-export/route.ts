import { auth } from '@/lib/auth';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { getAnalyticsDateRange, getAnalyticsPeriodLabel, normalizeAnalyticsPeriod } from '@/lib/analyticsPeriod';
import ExcelJS from 'exceljs';

export const runtime = 'nodejs';

const dateInIndia = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});

function safeCell(value: string) {
    return /^[\s]*[=+\-@]/.test(value) ? `'${value}` : value;
}

function amountForOrder(order: { total: number; checkout?: { payableAmount?: number } }) {
    const payable = order.checkout?.payableAmount;
    return Math.round((typeof payable === 'number' ? payable : order.total) * 100) / 100;
}

export async function GET(request: Request) {
    const session = await auth();
    if (!session?.user?.restaurantId || session.user.role !== 'restaurant_owner') {
        return new Response('Unauthorized', { status: 401 });
    }

    const period = normalizeAnalyticsPeriod(new URL(request.url).searchParams.get('period') || undefined);
    const { startDate, endDate } = getAnalyticsDateRange(period);

    try {
        await dbConnect();
        const orders = await Order.find({
            restaurantId: session.user.restaurantId,
            status: 'completed',
            createdAt: { $gte: startDate, $lte: endDate },
        })
            .select('_id createdAt customerName paymentStatus paymentMethod total checkout.payableAmount')
            .sort({ createdAt: -1 })
            .lean();

        const workbook = new ExcelJS.Workbook();
        workbook.creator = 'BitByte';
        workbook.created = new Date();
        const sheet = workbook.addWorksheet('Sales orders', { views: [{ state: 'frozen', ySplit: 1 }] });
        sheet.columns = [
            { header: 'Order Date (IST)', key: 'date', width: 23 },
            { header: 'Order ID', key: 'id', width: 28 },
            { header: 'Customer Name', key: 'customer', width: 28 },
            { header: 'Payment Status', key: 'status', width: 18 },
            { header: 'Payment Method', key: 'method', width: 20 },
            { header: 'Total Amount (INR)', key: 'amount', width: 22 },
        ];

        let paidTotal = 0;
        let pendingTotal = 0;
        let upiTotal = 0;
        let cashTotal = 0;
        let unrecordedMethodTotal = 0;
        let paidCount = 0;
        for (const order of orders) {
            const amount = amountForOrder(order);
            const paid = order.paymentStatus === 'paid';
            if (paid) {
                paidTotal += amount;
                paidCount++;
                if (order.paymentMethod === 'upi') upiTotal += amount;
                else if (order.paymentMethod === 'cash') cashTotal += amount;
                else unrecordedMethodTotal += amount;
            } else pendingTotal += amount;
            sheet.addRow({
                date: dateInIndia.format(new Date(order.createdAt)),
                id: String(order._id),
                customer: safeCell(order.customerName?.trim() || 'Guest'),
                status: paid ? 'Paid' : 'Pending',
                method: paid ? (order.paymentMethod === 'upi' ? 'UPI' : order.paymentMethod === 'cash' ? 'Cash' : 'Not recorded') : '—',
                amount,
            });
        }

        sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' } };
        sheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF1E293B' } };
        sheet.getRow(1).height = 26;
        sheet.getColumn('amount').numFmt = '"₹"#,##0.00';
        sheet.autoFilter = `A1:F${Math.max(1, orders.length + 1)}`;

        const summary = workbook.addWorksheet('Summary');
        summary.columns = [{ width: 29 }, { width: 24 }];
        summary.addRows([
            ['BitByte sales report', getAnalyticsPeriodLabel(period)],
            ['Period basis', 'Order date (IST)'],
            ['Period start (IST)', dateInIndia.format(startDate)],
            ['Period end (IST)', dateInIndia.format(endDate)],
            ['Completed orders', orders.length],
            ['Paid orders', paidCount],
            ['Pending payments', orders.length - paidCount],
            ['Collected amount (INR)', Math.round(paidTotal * 100) / 100],
            ['Outstanding amount (INR)', Math.round(pendingTotal * 100) / 100],
            ['UPI collected (INR)', Math.round(upiTotal * 100) / 100],
            ['Cash collected (INR)', Math.round(cashTotal * 100) / 100],
            ['Paid method not recorded (INR)', Math.round(unrecordedMethodTotal * 100) / 100],
        ]);
        summary.getRow(1).font = { bold: true, size: 14 };
        for (let row = 8; row <= 12; row++) summary.getCell(`B${row}`).numFmt = '"₹"#,##0.00';

        const buffer = await workbook.xlsx.writeBuffer();
        const filenameDate = dateInIndia.formatToParts(new Date());
        const datePart = (type: string) => filenameDate.find(part => part.type === type)?.value || '';
        const filename = `BitByte-sales-${period}-${datePart('year')}-${datePart('month')}-${datePart('day')}.xlsx`;
        return new Response(new Uint8Array(buffer), {
            headers: {
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': `attachment; filename="${filename}"`,
                'Cache-Control': 'private, no-store',
            },
        });
    } catch (error) {
        console.error('Sales export failed:', error);
        return new Response('Could not generate the sales report', { status: 500 });
    }
}
