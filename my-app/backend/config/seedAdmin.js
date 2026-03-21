import User from '../models/User.js';
import dotenv from 'dotenv';
dotenv.config();

const seedAdmin = async () => {
    try {
        // Check if any admin user exists
        const adminExists = await User.findOne({ role: 'admin' });

        if (!adminExists) {
            // Create default admin user
            const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
            const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
            const adminName = process.env.ADMIN_NAME || 'Super Admin';

            const newAdmin = await User.create({
                name: adminName,
                email: adminEmail,
                password: adminPassword,
                role: 'admin'
            });

            console.log('✅ Default admin user created:');
            console.log(`Email: ${adminEmail}`);
            console.log(`Password: ${adminPassword}`);
            console.log('(Please change these credentials in production!)');
        } else {
            console.log('ℹ️ Admin user already exists. Skipping seed.');
        }
    } catch (error) {
        console.error('❌ Error seeding admin user:', error.message);
    }
};

export default seedAdmin;
