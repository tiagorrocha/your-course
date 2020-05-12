require('dotenv').config({ path:'.env.test' });
export const app = 'http://localhost:3000';
export const database = process.env.MONGO_URI;
