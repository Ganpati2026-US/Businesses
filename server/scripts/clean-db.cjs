
const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Setup environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error('Please define the MONGODB_URI environment variable');
    process.exit(1);
}

// Define Schemas locally
const restaurantSchema = new mongoose.Schema({}, { strict: false });
const menuItemSchema = new mongoose.Schema({}, { strict: false });
const orderSchema = new mongoose.Schema({}, { strict: false });
const tableSchema = new mongoose.Schema({}, { strict: false });

const Restaurant = mongoose.model('Restaurant', restaurantSchema);
const MenuItem = mongoose.models.MenuItem || mongoose.model('MenuItem', menuItemSchema);
const Order = mongoose.models.Order || mongoose.model('Order', orderSchema);
const Table = mongoose.models.Table || mongoose.model('Table', tableSchema);

async function clean() {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('Connected to MongoDB');

        // Find the restaurant (assuming single tenant/first one for this context)
        let restaurant = await Restaurant.findOne();

        if (!restaurant) {
            console.log('No restaurant found.');
            process.exit(0);
        }

        console.log(`Cleaning data for restaurant: ${restaurant.get('name')} (${restaurant._id})`);

        // Delete data
        const orders = await Order.deleteMany({ restaurantId: restaurant._id });
        console.log(`Deleted ${orders.deletedCount} orders`);

        const tables = await Table.deleteMany({ restaurantId: restaurant._id });
        console.log(`Deleted ${tables.deletedCount} tables`);

        const items = await MenuItem.deleteMany({ restaurantId: restaurant._id });
        console.log(`Deleted ${items.deletedCount} menu items`);

        console.log('Cleanup complete!');
        process.exit(0);

    } catch (error) {
        console.error('Error cleaning data:', error);
        process.exit(1);
    }
}

clean();
