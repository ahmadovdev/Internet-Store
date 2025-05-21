import dotenv from 'dotenv';
dotenv.config();

const config = {
  googleApiKey: process.env.GOOGLE_API_KEY, 

  mongodbURI: process.env.MONGO_URI,

  port: process.env.PORT || 5000,

  jwtSecret: process.env.ACCESS_TOKEN_SECRET,
};

export default config;