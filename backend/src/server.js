import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { apiRouter } from './gateway/routes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../');
app.disable('x-powered-by');
app.use(express.json());
app.use('/api', apiRouter);
app.use(express.static(path.join(root, 'frontend')));
app.get('*', (_req, res) => res.sendFile(path.join(root, 'frontend/index.html')));
app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
if (process.env.NODE_ENV !== 'test') app.listen(PORT, () => console.log(`Pokédex Explorer disponível em http://localhost:${PORT}`));
export default app;
