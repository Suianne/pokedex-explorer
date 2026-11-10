import test from 'node:test';
import assert from 'node:assert/strict';
import { clearCache, requestPokeApi } from '../src/services/pokeapi.js';
import { normalizeFavoriteId } from '../src/services/favorites.js';

test('consulta e armazena resposta em cache', async () => {
  clearCache(); let calls = 0;
  const fakeFetch = async () => { calls += 1; return { ok: true, json: async () => ({ name: 'pikachu', id: 25 }) }; };
  const first = await requestPokeApi('/pokemon/pikachu', fakeFetch);
  const second = await requestPokeApi('/pokemon/pikachu', fakeFetch);
  assert.equal(first.id, 25); assert.equal(second.name, 'pikachu'); assert.equal(calls, 1);
});

test('converte resposta 404 em erro de recurso não encontrado', async () => {
  clearCache();
  await assert.rejects(() => requestPokeApi('/pokemon/nao-existe', async () => ({ status: 404, ok: false })), { status: 404 });
});

test('valida identificadores de favoritos', () => {
  assert.equal(normalizeFavoriteId('25'), 25);
  assert.throws(() => normalizeFavoriteId('abc'));
  assert.throws(() => normalizeFavoriteId(0));
});
