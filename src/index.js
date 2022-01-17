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

function getBalance(statement) {
  const balance = statement.reduce((acc, operation) => {
    if (operation.type === "credit")
      return acc + operation.amount;
    else
      return acc - operation.amount;
  }, 0)

  return balance;
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

app.get("/statement", veriftIfExistsAccountCPF, (request, response) => {
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

app.post("/withdraw", veriftIfExistsAccountCPF, (request, response) => {
  const { amount } = request.body;
  const { customer } = request;

  const balance = getBalance(customer.statement);

  if (balance < amount) {
    return response.status(400).json({ error: "insufficient funds!" })
  }

  const statementOperation = {
    amount,
    created_at: new Date(),
    type: "debit"
  }

  customer.statement.push(statementOperation);

  return response.status(201).send();
})

app.get("/statement/date", veriftIfExistsAccountCPF, (request, response) => {
  const { customer } = request;
  const { date } = request.query;

  const dateFormat = new Date(date + " 00:00");

  const statement = customer.statement.filter((statement) =>
    statement.created_at.toDateString() === new Date(dateFormat).toDateString());

  return response.json(statement);
});

app.put("/account", veriftIfExistsAccountCPF, (request, response) => {
  const { name } = request.body;
  const { customer } = request;

  customer.name = name;

  return response.status(201).send();
})

app.get("/account", veriftIfExistsAccountCPF, (request, response) => {
  const { customer } = request;

  return response.json(customer);
})

app.listen(3333);