import '../env';
import dbConnect from '../lib/db';
import Restaurant from '../models/Restaurant';
import Table from '../models/Table';
import mongoose from 'mongoose';

const RESTAURANT_ID = '698a2e5b48af4f3cc15947b9';
const TABLE_ID = '698a30d748af4f3cc159480c';

async function main() {
    console.log('Connecting to DB...');
    try {
        await dbConnect();
        console.log('Connected to DB');

        console.log(`Searching for Restaurant: ${RESTAURANT_ID}`);
        if (!mongoose.Types.ObjectId.isValid(RESTAURANT_ID)) {
            console.error('Invalid Restaurant ID format');
        }
        const restaurant = await Restaurant.findById(RESTAURANT_ID);
        console.log('Restaurant found:', !!restaurant);
        if (restaurant) console.log('Restaurant Name:', restaurant.name);

        console.log(`Searching for Table: ${TABLE_ID}`);
        if (!mongoose.Types.ObjectId.isValid(TABLE_ID)) {
            console.error('Invalid Table ID format');
        }
        const table = await Table.findById(TABLE_ID);
        console.log('Table found:', !!table);
        if (table) console.log('Table Number:', table.tableNumber);

        process.exit(0);
    } catch (error) {
        console.error('DB Connection FAIL:', error);
        process.exit(1);
    }
}

main();
