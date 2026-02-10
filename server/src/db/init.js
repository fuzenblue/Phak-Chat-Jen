import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

const initDB = async () => {
    try {
        console.log('🔄 Initializing database...\n');

        // Create contacts table
        await pool.query(`
      CREATE TABLE IF NOT EXISTS contacts (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        message TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Table "contacts" created (or already exists)');

        // Create places table (for saving Google Maps places)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS places (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        address TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        place_id VARCHAR(255) UNIQUE,
        rating DECIMAL(2,1),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Table "places" created (or already exists)');

        // Create chat_history table (for saving Gemini chat history)
        await pool.query(`
      CREATE TABLE IF NOT EXISTS chat_history (
        id SERIAL PRIMARY KEY,
        user_message TEXT NOT NULL,
        ai_response TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
        console.log('✅ Table "chat_history" created (or already exists)');

        // Insert sample data
        const existingData = await pool.query('SELECT COUNT(*) FROM contacts');
        if (parseInt(existingData.rows[0].count) === 0) {
            await pool.query(`
        INSERT INTO contacts (name, email, message) VALUES
        ('สมชาย ใจดี', 'somchai@example.com', 'สวัสดีครับ ทดสอบระบบ'),
        ('สมหญิง รักสวย', 'somying@example.com', 'ลองใช้งานฐานข้อมูล'),
        ('วิชัย พัฒนา', 'wichai@example.com', 'ระบบทำงานได้ดีมาก!')
      `);
            console.log('✅ Sample data inserted into "contacts"');
        }

        console.log('\n🎉 Database initialization complete!\n');
        process.exit(0);
    } catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    }
};

initDB();
