import bootstrap from './src/main.js';

export default async function handler(req, res) {
    const app = await bootstrap();
    app(req, res);
  }