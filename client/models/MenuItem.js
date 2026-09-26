import mongoose, { Schema } from 'mongoose';
const menuItemSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Item name is required'],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be positive'],
    },
    imageUrl: {
        type: String,
        default: '',
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        trim: true,
    },
    isAvailable: {
        type: Boolean,
        default: true,
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
        required: true,
    },
}, {
    timestamps: true,
});
// Index for faster queries
menuItemSchema.index({ restaurantId: 1, category: 1 });
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 });
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
export default MenuItem;
