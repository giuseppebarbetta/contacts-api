const checkIdUserMiddleware = (request, response, next) => {
  const { id } = request.params;
  const index = contacts.findIndex((contact) => contact.id === id);

  if (index < 0) {
    return response.status(404).json({ error: "Contact not found" });
  }

  request.contactId = id;
  request.contactIndex = index;

  next();
};

export default checkIdUserMiddleware;
