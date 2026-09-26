import mongoose, { Schema } from 'mongoose';
const tableSchema = new Schema({
    tableNumber: {
        type: String,
        required: [true, 'Table number is required'],
        trim: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
    qrCodeDataUrl: {
        type: String,
        default: '',
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Ensure unique table numbers within a restaurant
tableSchema.index({ restaurantId: 1, tableNumber: 1 }, { unique: true });
const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);
export default Table;
