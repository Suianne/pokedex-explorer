// Favoritos persistidos no navegador; este módulo valida IDs para futura API autenticada.
export function normalizeFavoriteId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) throw new Error('Identificador de Pokémon inválido.');
  return id;
}
