import { admin } from "../lib/firebase";

// GET: Buscar todos os documentos
class GetAllFromFireStoreService {
  async execute(collection: string) {
    const snapshot = await admin.firestore().collection(collection).get();
    const getCollection = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return getCollection;
  }
}
// ADD: Adicionar novo documento com ID automático
class AddFromFireStoreService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin.firestore().collection(collection).add({
      ...obj,
    });
    return { id: snapshot.id };
  }
}

// DELETE: Deletar documento por ID
class DeleteFromFireStoreService {
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

// UPDATE: Atualizar campos específicos de um documento
class UpdateFromFireStoreService {
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

// SET: Criar ou sobrescrever documento
class SetFromFireStoreService {
  async execute(collection: string, id: string, data: any, merge = false) {
    const docRef = admin.firestore().collection(collection).doc(id);
    await docRef.set(data, { merge }); // merge: true → não sobrescreve campos não informados
    return { success: true, message: `Documento ${id} salvo com sucesso.` };
  }
}
class GetByIdFromFireStoreService {
  async execute(collection: string, id: string) {
    const docRef = admin.firestore().collection(collection).doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      throw new Error(`Documento com id ${id} não encontrado na coleção ${collection}`);
    }
    return { id: doc.id, ...doc.data() };
  }
}

class GetFromMultipleCollectionsByIdService {
  async execute(id: string, collections: string[]) {
    const firestore = admin.firestore();
    const results: Record<string, any> = {};

    for (const collection of collections) {
      const docRef = firestore.collection(collection).doc(id);
      const doc = await docRef.get();
      results[collection] = doc.exists ? { id: doc.id, ...doc.data() } : null;
    }

    return results;
  }
}


class AddToMultipleCollectionsWithSameIdService {
  async execute(data: any, collections: string[]) {
    const firestore = admin.firestore();

    // Gera um id único (sem criar documento ainda)
    const id = firestore.collection(collections[0]).doc().id;
    const batch = firestore.batch();

    for (const collection of collections) {
      const ref = firestore.collection(collection).doc(id);
      batch.set(ref, data);
    }

    await batch.commit();

    return { success: true, id };
  }
}





export {
  AddToMultipleCollectionsWithSameIdService,
  GetFromMultipleCollectionsByIdService,
  GetByIdFromFireStoreService,
  GetAllFromFireStoreService,
  AddFromFireStoreService,
  DeleteFromFireStoreService,
  UpdateFromFireStoreService,
  SetFromFireStoreService,
};
