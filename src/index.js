const express = require("express");
const { v4: uuidv4 } = require("uuid"); // renomeada
const app = express();
app.use(express.json());

const customers = []; //bd fake

//Middleware
function veriftIfExistsAccountCPF(request, response, next) {
  const { cpf } = request.headers;

  const customer = customers.find((customer) => customer.cpf === cpf);

  if (!customer) {
    return response.status(400).json({ error: "Customer NOT FOUND" })
  }

  request.customer = customer;

  return next();
}

app.post("/account", (request, response) => {
  const { cpf, name } = request.body;

  const customersAlredyExists = customers.some(
    (customers) => customers.cpf === cpf
  );

  if (customersAlredyExists) {
    return response.status(400).json({ error: "Customer already exists!" })
  }

  customers.push({
    cpf,
    name,
    id: uuidv4(), // gera um id randomico
    statement: []
  });

  return response.status(201).send();
})

//app.use(veriftIfExistsAccountCPF); // todas as rotas que tiverem abaixo utilizaram este middleware

app.get("/statement/", veriftIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  return response.json(customer.statement);
});

app.post("/deposit", veriftIfExistsAccountCPF, (request, response) => {
  const { description, amount } = request.body;

  const { customer } = request;

  const statementOperation = {
    description,
    amount,
    created_at: new Date(),
    type: "credit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();
});

app.listen(3333);