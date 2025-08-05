import { admin } from "../lib/firebase";


class GetAllFromFireStoreStoreService {
  async execute(collection: string) {
    const snapshot = await admin.firestore().collection(collection).get();
    const getCollection = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return getCollection;
  }
}

class AddFromFireStoreStoreService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin.firestore().collection(collection).add({
      ...obj,
    });
    return { id: snapshot.id };
  }
}



class DeleteFromFireStoreStoreService {
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

class UpdateFromFireStoreStoreService {
  async execute(collection: string, id: string, data: any) {
    const docRef = admin.firestore().collection(collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Documento com id ${id} não encontrado na coleção ${collection}`);
    }

    await docRef.update(data); // apenas atualiza campos informados
    return { success: true, message: `Documento ${id} atualizado com sucesso.` };
  }
}

export{
    GetAllFromFireStoreStoreService,AddFromFireStoreStoreService,UpdateFromFireStoreStoreService,DeleteFromFireStoreStoreService
}