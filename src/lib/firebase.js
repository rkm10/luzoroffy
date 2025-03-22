// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, deleteDoc, getDoc, collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "sonner";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
let app;
try {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
} catch (error) {
  console.error("Firebase initialization error:", error);
}

const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

// Authentication functions
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    await createUserDocument(result.user);
    toast.success("Successfully signed in!");
    return result.user;
  } catch (error) {
    console.error("Error signing in with Google: ", error);
    toast.error("Failed to sign in. Please try again.");
    return null;
  }
};

export const signUpWithEmail = async (email, password, displayName) => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName });
    await createUserDocument(result.user);
    toast.success("Successfully signed up!");
    return result.user;
  } catch (error) {
    console.error("Error signing up with email: ", error);
    toast.error(error.message);
    return null;
  }
};

export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    toast.success("Successfully signed in!");
    return result.user;
  } catch (error) {
    console.error("Error signing in with email: ", error);
    toast.error("Invalid email or password");
    return null;
  }
};

export const signOutUser = async () => {
  try {
    await signOut(auth);
    toast.success("Successfully signed out!");
  } catch (error) {
    console.error("Error signing out: ", error);
    toast.error("Failed to sign out. Please try again.");
  }
};

// User document functions
const createUserDocument = async (user) => {
  if (!user) return;
  
  const userDoc = doc(db, "users", user.uid);
  const userSnap = await getDoc(userDoc);
  
  if (!userSnap.exists()) {
    try {
      await setDoc(userDoc, {
        email: user.email,
        name: user.displayName,
        photoURL: user.photoURL,
        favorites: {
          anime: [],
          manga: []
        }
      });
    } catch (error) {
      console.error("Error creating user document:", error);
    }
  }
};

// Favorites functions
export const toggleFavorite = async (userId, itemId, type, itemData) => {
  try {
    if (!userId) {
      toast.error("Please sign in to add favorites");
      return false;
    }

    const userDoc = doc(db, "users", userId);
    const favoriteDoc = doc(db, `users/${userId}/${type}_favorites`, itemId.toString());
    const favoriteSnap = await getDoc(favoriteDoc);

    if (favoriteSnap.exists()) {
      // Remove from favorites
      await deleteDoc(favoriteDoc);
      toast.success("Removed from favorites!");
      return false;
    } else {
      // Add to favorites
      await setDoc(favoriteDoc, {
        ...itemData,
        addedAt: new Date().toISOString(),
        type
      });
      toast.success("Added to favorites!");
      return true;
    }
  } catch (error) {
    console.error("Error toggling favorite: ", error);
    toast.error("Failed to update favorites. Please try again.");
    return null;
  }
};

export const getFavorites = async (userId, type) => {
  try {
    if (!userId) return [];
    
    const favoritesRef = collection(db, 'users', userId, `${type}_favorites`);
    const snapshot = await getDocs(favoritesRef);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      mal_id: doc.id
    }));
  } catch (error) {
    console.error('Error getting favorites:', error);
    return [];
  }
};

export { auth, db }; 