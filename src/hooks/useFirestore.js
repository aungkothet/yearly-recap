import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase';
import useStore from '../store/useStore';

// Hook for fetching and subscribing to a collection
export const useCollection = (collectionName, queryConstraints = []) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useStore((state) => state.user);

  useEffect(() => {
    if (!user) {
      setData([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    
    const collectionRef = collection(db, 'users', user.uid, collectionName);
    const q = query(collectionRef, ...queryConstraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const items = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setData(items);
        setLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching collection:', err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [user, collectionName, JSON.stringify(queryConstraints)]);

  return { data, loading, error };
};

// Hook for CRUD operations
export const useFirestore = (collectionName) => {
  const user = useStore((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const addDocument = async (data) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const collectionRef = collection(db, 'users', user.uid, collectionName);
      const docRef = await addDoc(collectionRef, {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
      return docRef.id;
    } catch (err) {
      console.error('Error adding document:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const updateDocument = async (id, data) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, 'users', user.uid, collectionName, id);
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      setLoading(false);
    } catch (err) {
      console.error('Error updating document:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const deleteDocument = async (id) => {
    if (!user) throw new Error('User not authenticated');
    
    setLoading(true);
    setError(null);
    
    try {
      const docRef = doc(db, 'users', user.uid, collectionName, id);
      await deleteDoc(docRef);
      setLoading(false);
    } catch (err) {
      console.error('Error deleting document:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return {
    addDocument,
    updateDocument,
    deleteDocument,
    loading,
    error,
  };
};
