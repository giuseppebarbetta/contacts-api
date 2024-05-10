import express from "express";
import { v4 as uuid } from "uuid";
import cors from "cors";

import checkIdUserMiddleware from "./middlewares/checkId.js";

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const contacts = [];

const showMethods = (request, response, next) => {
  console.log(request.url);
  console.log(request.method);

  next();
};

app.post("/contacts", showMethods, (request, response) => {
  const { contactName, phone } = request.body;
  const newContact = {
    id: uuid.v4,
    contactName,
    phone,
    status: "Novo Contato adicionado",
  };

  contacts.push(newContact);
  return response.status(201).json(newContact);
});

app.get("/contacts", showMethods, (request, response) => {
  return response.json(contacts);
});

app.put(
  "/contacts/:id",
  showMethods,
  checkIdUserMiddleware,
  (request, response) => {
    const id = request.contactId;
    const index = request.contactIndex;
    const { contactName, phone } = request.body;

    const updatedContact = { id, contactName, phone };

    contacts[index] = updatedContact;

    return response.json(updatedContact);
  }
);

app.delete("/contacts/:id", showMethods, (request, response) => {
  const index = request.contactIndex;

  contacts.splice(index, 1);

  return response.status(204).json();
});

app.get(
  "/contacts/:id",
  showMethods,
  checkIdUserMiddleware,
  (request, response) => {
    const index = request.contactIndex;
    return response.json(contacts[index]);
  }
);

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
