import { useState, useEffect } from "react";

export default function FavoriteButton({ userId, favoritedBy = [], currentUserId, onChange, className = "" }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [count, setCount] = useState(favoritedBy.length);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setIsFavorite(favoritedBy.some(f => f.id === currentUserId));
    setCount(favoritedBy.length);
  }, [favoritedBy, currentUserId]);

  const handleClick = async (e) => {
    e.stopPropagation();
    if (!currentUserId || loading) return;
    setLoading(true);
    const method = isFavorite ? 'DELETE' : 'POST';
    try {
      const res = await fetch(`/api/users/${userId}/favorite`, {
        method,
        headers: { 'x-user-id': currentUserId }
      });
      if (res.ok) {
        setIsFavorite(!isFavorite);
        setCount(prev => prev + (isFavorite ? -1 : 1));
        if (onChange) onChange(!isFavorite);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-1 bg-white/80 rounded-full px-2 py-1 shadow z-10 ${className} ${loading ? 'opacity-60' : ''}`}
      onClick={handleClick}
      style={{ cursor: 'pointer' }}
      title={isFavorite ? 'Quitar de favoritos' : 'Añadir a favoritos'}
    >
      {isFavorite ? (
        <svg xmlns="http://www.w3.org/2000/svg" fill="gold" viewBox="0 0 20 20" className="w-5 h-5"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
      ) : (
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="gold" strokeWidth="1.5" viewBox="0 0 20 20" className="w-5 h-5"><path d="M10 15l-5.878 3.09 1.122-6.545L.488 6.91l6.561-.955L10 0l2.951 5.955 6.561.955-4.756 4.635 1.122 6.545z"/></svg>
      )}
      <span className="text-yellow-700 font-bold text-sm">{count}</span>
    </div>
  );
} 