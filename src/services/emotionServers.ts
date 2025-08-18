
import { admin } from "../lib/firebase";

export interface Emotion {
  id: string;
  emotional: string;
  energy: string;
  focus: string;
  events: string;
  action: string;
  anchor: string;
  tookMedicine: boolean;
  dopamineCount: number;
  read: boolean;
  argued: boolean;
  wentOutside: boolean;
  weather: string;
}

export class GetAllFromEmotionService {
  async execute(collection: string) {
    const snapshot = await admin.firestore().collection(collection).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export class SetFromFireStoreEmotionService {
  async execute(collection: string,  data: Emotion, merge = false) {
    const docRef = admin.firestore().collection(collection).doc(data.id);
    await docRef.set(data, { merge }); // merge: true → não sobrescreve campos não informados
    return { success: true, message: `Documento  salvo com sucesso.` };
  }
}
export class DeleteFromFireStoreEmotionService {
  async execute(collection: string, id: string) {
    const docRef = admin.firestore().collection(collection).doc(id);
    const doc = await docRef.get();
    if (!doc.exists) {
      throw new Error(`Documento com id ${id} não encontrado na coleção ${collection}`);
    }
    await docRef.delete();
    return { success: true, message: `Documento ${id} deletado com sucesso.` };
  }
}

export class AddFromEmotionService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin.firestore().collection(collection).add({
      ...obj,
    });
    return { id: snapshot.id };
  }
}
