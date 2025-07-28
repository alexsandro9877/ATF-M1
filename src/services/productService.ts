import { GetProductFromCosmosService } from "../integrations/cosmos";
import { admin } from "../lib/firebase";
import { Product } from "../types/product";

const getProductFromCosmosService = new GetProductFromCosmosService();

export class GetAllFromProductService {
  async execute(collection: string): Promise<Product>  {
    const snapshot = await admin.firestore().collection(collection).get();
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  }
}

export class GetByIdFromProductService {
  async execute(collection: string, ean: string) : Promise<Product> {
    const addFromProductService = new AddFromProductService();

    const querySnapshot = await admin.firestore()
      .collection(collection)
      .where("gtin", "==",  Number(ean))
      .get();

    // Se não encontrou
    if (querySnapshot.empty) {
      const resp = await getProductFromCosmosService.execute(ean);
      if (resp) {
         return resp;
      }
      await addFromProductService.execute(collection, resp)
    }  
    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() };
  }
}

export class SetFromFireStoreProductService {
  async execute(collection: string,  data: Product, merge = false) {
    const docRef = admin.firestore().collection(collection).doc(data.id);
    await docRef.set(data, { merge }); // merge: true → não sobrescreve campos não informados
    return { success: true, message: `Documento  salvo com sucesso.` };
  }
}

export class DeleteFromFireStoreProductService {
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
export class GetByIdFromProductServiceByGtin {
  async execute(collection: string, ean: string) : Promise<Product> {

    const querySnapshot = await admin.firestore()
      .collection(collection)
      .where("gtin", "==",  Number(ean))
      .get();

    // Se não encontrou
    if (querySnapshot.empty) {
      const resp = await getProductFromCosmosService.execute(ean);
      if (resp) {
         return resp;
      }
    }  
    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() };
  }
}
export class AddFromProductService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin.firestore().collection(collection).add({
      ...obj,
    });
    return { id: snapshot.id };
  }
}
