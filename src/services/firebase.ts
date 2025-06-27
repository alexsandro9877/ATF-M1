
import { admin } from '../lib/firebase';

export async function getAllFromFirestore() {
  const snapshot = await admin.firestore().collection('webBase').get();

  const users = snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  return users;
}
