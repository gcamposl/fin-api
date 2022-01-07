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
  const id = uuidv4(); // gera um id randomico 

  costumers.push({
    cpf,
    name,
    id,
    statement: []
  });

  return response.status(201).send();
})

app.listen(3333);