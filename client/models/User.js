import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
    },
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
    },
    role: {
        type: String,
        enum: ['customer', 'restaurant_owner', 'system_admin'],
        default: 'restaurant_owner',
    },
    restaurantId: {
        type: Schema.Types.ObjectId,
        ref: 'Restaurant',
    },
}, {
    timestamps: true,
});
const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
