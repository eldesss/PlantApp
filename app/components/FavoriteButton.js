import { useState, useEffect, useCallback } from "react";

export default function FavoriteButton({ userId, favoritedBy = [], currentUserId, onChange, className = "", loading: loadingProp, setLoading: setLoadingProp }) {
  const [internalLoading, setInternalLoading] = useState(false);
  const [localIsFavorite, setLocalIsFavorite] = useState(false);
  const [localCount, setLocalCount] = useState(0);
  const [error, setError] = useState(null);
  
  const loading = loadingProp !== undefined ? loadingProp : internalLoading;
  const setLoading = setLoadingProp || setInternalLoading;

  // Sincronizar estado local con props
  useEffect(() => {
    const isFav = favoritedBy.some(f => f.id === currentUserId);
    setLocalIsFavorite(isFav);
    setLocalCount(favoritedBy.length);
    setError(null);
  }, [favoritedBy, currentUserId]);

  const updateFavorite = useCallback(async (newIsFavorite) => {
    if (!currentUserId) return;
    
    // Estado optimista
    setLocalIsFavorite(newIsFavorite);
    setLocalCount(prev => newIsFavorite ? prev + 1 : prev - 1);
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/users/${userId}/favorite`, {
        method: newIsFavorite ? 'POST' : 'DELETE',
        headers: { 'x-user-id': currentUserId }
      });

      if (!res.ok) {
        throw new Error('Error al actualizar favorito');
      }

      // Notificar al padre para que actualice los datos
      if (onChange) {
        await onChange();
      }
    } catch (error) {
      console.error('Error:', error);
      setError(error.message);
      // Revertir estado optimista
      setLocalIsFavorite(!newIsFavorite);
      setLocalCount(prev => !newIsFavorite ? prev + 1 : prev - 1);
    } finally {
      setLoading(false);
    }
  }, [currentUserId, userId, onChange, setLoading]);

  const handleClick = (e) => {
    e.stopPropagation();
    if (!currentUserId || loading) return;
    updateFavorite(!localIsFavorite);
  };

  return (
    <div
      className={`flex items-center gap-1 bg-white/80 rounded-full px-2 py-1 shadow z-10 ${className} ${error ? 'border border-red-500' : ''}`}
      onClick={handleClick}
      style={{ position: 'relative' }}
      title={error || (localIsFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos')}
    >
      {localIsFavorite ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 20 20" className="w-5 h-5"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="gold" strokeWidth="1.5" viewBox="0 0 20 20" className="w-5 h-5"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
      )}
      <span className="text-yellow-700 font-bold text-sm">{localCount}</span>
    </div>
  );
} 