import '../env';
import mongoose from 'mongoose';
import dbConnect from '../lib/db';
import Restaurant from '../models/Restaurant';
import { colorFromLogo } from '../lib/logoColor';

async function main() {
    await dbConnect();
    const restaurants = await Restaurant.find({ logoUrl: /^data:image\// })
        .select('name logoUrl logoAccentColor');

    for (const restaurant of restaurants) {
        const color = await colorFromLogo(restaurant.logoUrl || '');
        if (color && color !== restaurant.logoAccentColor) {
            restaurant.logoAccentColor = color;
            await restaurant.save();
            console.log(`${restaurant.name}: ${color}`);
        }
    }

    await mongoose.disconnect();
}

main().catch(async error => {
    console.error('Could not update restaurant logo colours:', error.message);
    await mongoose.disconnect();
    process.exitCode = 1;
});
