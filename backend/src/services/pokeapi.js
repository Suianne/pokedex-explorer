const BASE_URL = 'https://pokeapi.co/api/v2';
const cache = new Map();
const TTL_MS = 30 * 60 * 1000;

export function clearCache() { cache.clear(); }
export function cacheSize() { return cache.size; }

export async function requestPokeApi(path, fetchImpl = fetch) {
  const url = path.startsWith('http') ? path : `${BASE_URL}${path}`;
  const cached = cache.get(url);
  if (cached && cached.expiresAt > Date.now()) return cached.data;
  if (cached) cache.delete(url);

  let lastError;
  for (let attempt = 0; attempt < 2; attempt += 1) {
    try {
      const response = await fetchImpl(url, { headers: { Accept: 'application/json' } });
      if (response.status === 404) {
        const error = new Error('Recurso não encontrado na PokéAPI.');
        error.status = 404;
        throw error;
      }
      if (!response.ok) {
        const error = new Error(`PokéAPI respondeu com status ${response.status}.`);
        error.status = 502;
        throw error;
      }
      const data = await response.json();
      cache.set(url, { data, expiresAt: Date.now() + TTL_MS });
      return data;
    } catch (error) {
      if (error.status === 404) throw error;
      lastError = error;
      if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 250));
    }
  }
  const error = new Error('Não foi possível conectar à PokéAPI. Tente novamente mais tarde.');
  error.status = 503;
  error.cause = lastError;
  throw error;
}

export const getPokemon = identifier => requestPokeApi(`/pokemon/${encodeURIComponent(String(identifier).toLowerCase())}`);
export const getType = type => requestPokeApi(`/type/${encodeURIComponent(type.toLowerCase())}`);
export const getSpecies = id => requestPokeApi(`/pokemon-species/${id}`);
export const getEvolutionChain = url => requestPokeApi(url);
export const listPokemon = (limit = 12, offset = 0) => requestPokeApi(`/pokemon?limit=${limit}&offset=${offset}`);
export const listTypes = () => requestPokeApi('/type');
