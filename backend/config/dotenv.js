import dotenv from 'dotenv';

const loadEnv = () => {
  dotenv.config();
  if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
    console.error('Error: Missing required environment variables');
    process.exit(1);
  }
};

export default loadEnv;
