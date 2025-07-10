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
      if (!resp) {
        throw new Error(`Produto com GTIN ${ean} não encontrado na API externa.`);
      }
      await addFromProductService.execute(collection, resp);
      console.log("Produto adicionado à coleção:", collection);
      return resp;
    }

    // Se encontrou
    const foundDoc = querySnapshot.docs[0];
    return { id: foundDoc.id, ...foundDoc.data() };
  }
}

class AddFromProductService {
  async execute(collection: string, obj: any) {
    const snapshot = await admin.firestore().collection(collection).add({
      ...obj,
    });
    return { id: snapshot.id };
  }
}
