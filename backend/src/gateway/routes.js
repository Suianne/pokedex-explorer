import { Router } from 'express';
import { getPokemon, getSpecies, getEvolutionChain, getType, listPokemon, listTypes } from '../services/pokeapi.js';

export const apiRouter = Router();
apiRouter.get('/health', (_req, res) => res.json({ status: 'ok', service: 'pokedex-api-gateway' }));
apiRouter.get('/pokemon', async (req, res, next) => {
  try {
    const limit = Math.min(60, Math.max(1, Number(req.query.limit) || 12));
    const offset = Math.max(0, Number(req.query.offset) || 0);
    res.json(await listPokemon(limit, offset));
  } catch (error) { next(error); }
});
apiRouter.get('/pokemon/:identifier', async (req, res, next) => {
  try { res.json(await getPokemon(req.params.identifier)); } catch (error) { next(error); }
});
apiRouter.get('/types', async (_req, res, next) => {
  try { res.json(await listTypes()); } catch (error) { next(error); }
});
apiRouter.get('/types/:type', async (req, res, next) => {
  try {
    const data = await getType(req.params.type);
    res.json({ type: data.name, pokemon: data.pokemon.map(item => ({ name: item.pokemon.name, url: item.pokemon.url })) });
  } catch (error) { next(error); }
});
apiRouter.get('/species/:id', async (req, res, next) => {
  try { res.json(await getSpecies(req.params.id)); } catch (error) { next(error); }
});
apiRouter.get('/evolution-chain', async (req, res, next) => {
  try {
    const url = String(req.query.url || '');
    if (!url.startsWith('https://pokeapi.co/api/v2/evolution-chain/')) {
      return res.status(400).json({ error: 'Informe uma URL válida da cadeia evolutiva da PokéAPI.' });
    }
    res.json(await getEvolutionChain(url));
  } catch (error) { next(error); }
});
