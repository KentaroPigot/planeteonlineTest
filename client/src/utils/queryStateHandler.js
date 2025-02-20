// Gère l'état de la requête
export default async (store, fn, dependencies = {}) => {
  // Execute les getters du store pour récupérer leurs valeurs et les ajouter dans un objet
  const deps = Object.entries(dependencies).reduce((acc, [key, value]) => {
    acc[key] = typeof value === 'function' ? value() : value
    return acc
  }, {})

  store.loading = true
  store.error = null
  try {
    // execute la fonction passé en paramètre avec ses dépendances
    await fn(deps)
  } catch (err) {
    store.error = err
    throw err
  } finally {
    store.loading = false
  }
}
