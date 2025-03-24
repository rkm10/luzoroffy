import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { doc, getDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';

export function useFavorites(type, itemId) {
  const { user } = useAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        const docRef = doc(db, 'users', user.uid, `${type}_favorites`, itemId.toString());
        const docSnap = await getDoc(docRef);
        setIsFavorited(docSnap.exists());
      } catch (error) {
        console.error('Error checking favorite status:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkFavoriteStatus();
  }, [user, type, itemId]);

  const toggleFavorite = async (item) => {
    if (!user) {
      toast.error('Please log in to add favorites');
      return;
    }

    setIsLoading(true);
    const docRef = doc(db, 'users', user.uid, `${type}_favorites`, itemId.toString());

    try {
      if (isFavorited) {
        await deleteDoc(docRef);
        setIsFavorited(false);
        toast.success(`Removed from favorites`);
      } else {
        await setDoc(docRef, {
          ...item,
          addedAt: new Date().toISOString(),
          type: type,
        });
        setIsFavorited(true);
        toast.success(`Added to favorites`);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast.error('Failed to update favorites');
    } finally {
      setIsLoading(false);
    }
  };

  return { isFavorited, isLoading, toggleFavorite };
} 