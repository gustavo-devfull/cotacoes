// config/aws.config.js
const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'nyc3', // A região do seu Space (você mencionou nyc3)
  endpoint: process.env.AWS_ENDPOINT, // Adicione o endpoint do DigitalOcean Spaces
  s3ForcePathStyle: true, // Necessário para DigitalOcean Spaces
};

export default awsConfig;