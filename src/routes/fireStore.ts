import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import {
  GetAllFromFireStoreServiceWebBase,
  AddFromFireStoreServiceWebBase,
  DeleteFromFireStoreServiceWebBase,
  UpdateFromFireStoreServiceWebBase,
  SetFromFireStoreServiceWebBase,
  GetByIdFromFireStoreServiceWebBase,
  GetFromMultipleCollectionsByIdController,
  AddToMultipleCollectionsWithSameIdController,
} from "../controllers/fireStoreController";

import { authPlugin } from "../hooks/authPlugin";

export async function fireStore(app: FastifyInstance) {
app.addHook("onRequest", authPlugin);

  app.get("/api/store/webBase/All", async (request, reply) => {
    await new GetAllFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.post("/api/store/webBase/add", async (request, reply) => {
    await new AddFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.post("/api/store/webBase/del", async (request, reply) => {
    await new DeleteFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.post("/api/store/webBase/update", async (request, reply) => {
    await new UpdateFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.post("/api/store/webBase/set", async (request, reply) => {
    await new SetFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.get("/api/store/webBase/:id", async (request, reply) => {
    await new GetByIdFromFireStoreServiceWebBase().handle(request, reply);
  });

  app.post("/api/store/webBase/add-dual-linked", async (request, reply) => {
    await new AddToMultipleCollectionsWithSameIdController().handle(request, reply);
  });

  app.get("/api/store/webBase/join/:id", async (request, reply) => {
    await new GetFromMultipleCollectionsByIdController().handle(request, reply);
  });
}
