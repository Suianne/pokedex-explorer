const API = '/api';
async function request(path) {
  const response = await fetch(`${API}${path}`);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || 'Não foi possível concluir a consulta.');
  return data;
}
export const api = {
  list: (limit, offset) => request(`/pokemon?limit=${limit}&offset=${offset}`),
  pokemon: id => request(`/pokemon/${encodeURIComponent(id)}`),
  types: () => request('/types'),
  type: name => request(`/types/${encodeURIComponent(name)}`),
  species: id => request(`/species/${id}`),
  evolution: url => request(`/evolution-chain?url=${encodeURIComponent(url)}`)
};
