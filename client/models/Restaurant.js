import mongoose, { Schema } from 'mongoose';
const restaurantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Restaurant name is required'],
        trim: true,
    },
    slug: {
        type: String,
        required: [true, 'Slug is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default: '',
    },
    ownerId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    logoUrl: {
        type: String,
        default: '',
    },
    coverImageUrl: {
        type: String,
        default: '',
    },
    themeColor: {
        type: String,
        default: '#38bdf8',
    },
    fontFamily: {
        type: String,
        enum: ['inter', 'outfit', 'poppins', 'roboto', 'playfair'],
        default: 'inter',
    },
    colorScheme: {
        type: String,
        enum: ['light', 'dark', 'warm', 'cool'],
        default: 'light',
    },
    upiId: {
        type: String,
        trim: true,
        default: '',
    },
    upiPayeeName: {
        type: String,
        trim: true,
        default: '',
    },
    merchantCode: {
        type: String,
        trim: true,
        default: '0000',
    },
    appId: {
        type: String,
        trim: true,
        default: '',
    },
    gstNumber: {
        type: String,
        trim: true,
        default: '',
    },
    gstPercentage: {
        type: Number,
        default: 0,
        min: 0,
    },
    sgstPercentage: {
        type: Number,
        default: 0,
        min: 0,
    },
    phone: {
        type: String,
        trim: true,
        default: '',
    },
    status: {
        type: String,
        enum: ['active', 'suspended', 'onboarding'],
        default: 'onboarding',
    },
    customDomain: {
        type: String,
        trim: true,
        unique: true,
        sparse: true,
    },
}, {
    timestamps: true,
});
// Force recompilation of the model to ensure new fields (upiId) are picked up
// This is necessary because in development, the model might be cached with the old schema
if (process.env.NODE_ENV === 'development') {
    delete mongoose.models.Restaurant;
}
const Restaurant = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);
export default Restaurant;
