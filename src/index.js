const express = require("express");
const { v4: uuidv4 } = require("uuid"); // renomeada
const app = express();
app.use(express.json());

const costumers = []; //bd fake
/*
* CPF - string
* name - string
* id - uuid
* statement - []
*/
app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customersAlredyExists = costumers.some(
    (customers) => customers.cpf === cpf
  );

  if (customersAlredyExists) {
    return response.status(400).json({ error: "Customer already exists!" })
  }

  costumers.push({
    cpf,
    name,
    id: uuidv4(), // gera um id randomico
    statement: []
  });

  return response.status(201).send();
})

app.listen(3333);