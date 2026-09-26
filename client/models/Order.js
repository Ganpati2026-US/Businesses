import mongoose, { Schema } from 'mongoose';
const orderItemSchema = new Schema({
    menuItemId: {
        type: Schema.Types.ObjectId,
        ref: 'MenuItem',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
}, { _id: false });
const orderSchema = new Schema({
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    tableId: {
        type: Schema.Types.ObjectId,
        ref: 'Table',
        required: true,
    },
    items: {
        type: [orderItemSchema],
        required: true,
        validate: {
            validator: (items) => items.length > 0,
            message: 'Order must have at least one item',
        },
    },
    total: {
        type: Number,
        required: true,
        min: 0,
    },
    status: {
        type: String,
        enum: ['pending', 'preparing', 'served', 'completed', 'cancelled'],
        default: 'pending',
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid'],
        default: 'pending',
    },
    sessionId: {
        type: String,
        required: true,
    },
    customerName: {
        type: String,
        trim: true,
        default: '',
    },
    customerPhone: {
        type: String,
    },
    notes: {
        type: String,
        trim: true,
        default: '',
    },
}, {
    timestamps: true,
});
// Indexes for efficient queries
orderSchema.index({ restaurantId: 1, createdAt: -1 });
orderSchema.index({ tableId: 1, createdAt: -1 });
orderSchema.index({ sessionId: 1 });
orderSchema.index({ status: 1, restaurantId: 1 });
orderSchema.index({ restaurantId: 1, status: 1, createdAt: -1 }); // Optimized for analytics
// Force recompilation of the model to ensure new fields (paymentStatus) are picked up
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Order;
}
// Singleton pattern to prevent recompilation errors in development and maintain cache in production
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
export default Order;
