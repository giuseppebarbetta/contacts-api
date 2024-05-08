const express = require("express");
const uuid = require("uuid");
const cors = require("cors");

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

const orders = [];

const checkIdUser = (request, response, next) => {
  const { id } = request.params;
  const index = orders.findIndex((order) => order.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Contact not found" });
  }

  request.contactId = id;
  request.contactIndex = index;

  next();
};

const showMethods = (request, response, next) => {
  console.log(request.url);
  console.log(request.method);

  next();
};

app.post("/contacts", showMethods, (request, response) => {
  const { contactName, phone } = request.body;
  const newContact = {
    id: uuid.v4(),
    contactName,
    phone,
    status: "Novo Contato adicionado",
  };

  orders.push(newContact);
  return response.status(201).json(newContact);
});

app.get("/contacts", showMethods, (request, response) => {
  return response.json(orders);
});

app.patch("/contacts/:id", showMethods, checkIdUser, (request, response) => {
  const index = request.contactIndex;
  const { status } = request.body;

  const updateContact = orders[index];

  updateContact.status = status;

  return response.json(updateContact);
});

app.put("/contacts/:id", showMethods, checkIdUser, (request, response) => {
  const id = request.contactId;
  const index = request.contactIndex;
  const { contactName, phone, status } = request.body;

  const updatedContact = { id, contactName, phone, status };

  orders[index] = updatedContact;

  return response.json(updatedContact);
});

app.delete("/contacts/:id", showMethods, (request, response) => {
  const index = request.orderIndex;

  orders.splice(index, 1);

  return response.status(204).json();
});

app.get("/contacts/:id", showMethods, checkIdUser, (request, response) => {
  const index = request.orderIndex;
  return response.json(orders[index]);
});

app.listen(port, () => {
  console.log(`🚀 Server started on port ${port}`);
});
