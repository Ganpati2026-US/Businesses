'use client';

import { useRef } from 'react';
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/react';
import { PrinterIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useReactToPrint } from 'react-to-print';

type KotOrder = {
    _id: string;
    orderType?: 'dine-in' | 'takeaway';
    tableId?: { tableNumber?: string };
    customerName?: string;
    notes?: string;
    createdAt: string;
    items: { name: string; quantity: number }[];
};

export default function KotModal({ order, restaurant, onClose }: {
    order: KotOrder | null;
    restaurant: { name: string; phone?: string; address?: string };
    onClose: () => void;
}) {
    const printRef = useRef<HTMLDivElement>(null);
    const print = useReactToPrint({
        contentRef: printRef,
        documentTitle: `KOT-${order?._id.slice(-6) || 'order'}`,
        pageStyle: '@page { margin: 4mm; } @media print { body { margin: 0; color: #000; } }',
    });

    return (
        <Dialog open={Boolean(order)} onClose={onClose} className="relative z-50">
            <div className="fixed inset-0 bg-slate-950/50" aria-hidden="true" />
            <div className="fixed inset-0 overflow-y-auto p-4">
                <div className="flex min-h-full items-center justify-center">
                    <DialogPanel className="w-full max-w-sm rounded-2xl bg-white p-5 text-slate-900 shadow-2xl">
                        <div className="mb-4 flex items-center justify-between">
                            <DialogTitle className="text-lg font-bold">Kitchen order ticket</DialogTitle>
                            <button type="button" onClick={onClose} aria-label="Close KOT" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><XMarkIcon className="h-5 w-5" /></button>
                        </div>
                        {order && (
                            <div ref={printRef} className="mx-auto max-w-[72mm] bg-white p-3 font-mono text-sm text-black">
                                <div className="border-b-2 border-dashed border-black pb-3 text-center">
                                    <p className="text-lg font-black uppercase">{restaurant.name}</p>
                                    <p className="mt-1 font-bold">KITCHEN ORDER TICKET</p>
                                    {restaurant.address && <p className="mt-1 text-xs">{restaurant.address}</p>}
                                    {restaurant.phone && <p className="mt-1">Contact: {restaurant.phone}</p>}
                                </div>
                                <div className="space-y-1 border-b-2 border-dashed border-black py-3 text-xs">
                                    <p><strong>KOT:</strong> #{order._id.slice(-6).toUpperCase()}</p>
                                    <p><strong>Time:</strong> {new Date(order.createdAt).toLocaleString()}</p>
                                    <p><strong>Order:</strong> {order.orderType === 'takeaway' ? 'Takeaway' : `Table ${order.tableId?.tableNumber || 'N/A'}`}</p>
                                    {order.customerName && <p><strong>Customer:</strong> {order.customerName}</p>}
                                </div>
                                <div className="space-y-3 py-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex gap-3 font-bold">
                                            <span className="w-8 shrink-0">{item.quantity}×</span>
                                            <span>{item.name}</span>
                                        </div>
                                    ))}
                                </div>
                                {order.notes && <div className="border-t-2 border-dashed border-black py-3"><p className="text-xs font-bold uppercase">Instructions</p><p className="mt-1 whitespace-pre-wrap">{order.notes}</p></div>}
                                <p className="border-t-2 border-dashed border-black pt-3 text-center text-xs">End of KOT</p>
                            </div>
                        )}
                        <button type="button" onClick={() => print()} className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white hover:bg-slate-800"><PrinterIcon className="h-4 w-4" /> Print KOT</button>
                    </DialogPanel>
                </div>
            </div>
        </Dialog>
    );
}
