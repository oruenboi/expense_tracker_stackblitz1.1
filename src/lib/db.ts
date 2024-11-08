import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  where, 
  getDocs,
  serverTimestamp,
  DocumentReference,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { Expense } from '../types';

const EXPENSES_COLLECTION = 'expenses';

export const addExpense = async (userId: string, expense: Omit<Expense, 'id'>): Promise<string> => {
  try {
    const docRef = await addDoc(collection(db, EXPENSES_COLLECTION), {
      ...expense,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding expense:', error);
    throw error;
  }
};

export const updateExpense = async (id: string, expense: Omit<Expense, 'id'>): Promise<void> => {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, id);
    await updateDoc(docRef, {
      ...expense,
      updatedAt: serverTimestamp()
    });
  } catch (error) {
    console.error('Error updating expense:', error);
    throw error;
  }
};

export const deleteExpense = async (id: string): Promise<void> => {
  try {
    const docRef = doc(db, EXPENSES_COLLECTION, id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting expense:', error);
    throw error;
  }
};

export const getUserExpenses = async (userId: string): Promise<Expense[]> => {
  try {
    const q = query(
      collection(db, EXPENSES_COLLECTION),
      where('userId', '==', userId)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        description: data.description,
        amount: data.amount,
        date: data.date,
        category: data.category,
        userId: data.userId,
        createdAt: data.createdAt instanceof Timestamp ? data.createdAt.toDate() : null,
        updatedAt: data.updatedAt instanceof Timestamp ? data.updatedAt.toDate() : null
      } as Expense;
    });
  } catch (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
};