declare namespace Express {
  export interface Request {
    customer: { //atenção pra grafia, não é "costumer" mas como seu código tá com com "costumer" em todo lugar, vc pode colocar "costumer" aqui tb
      id: string;
      cpf: string;
      //e coloca todas as outras propriedades que seu customer vai ter
    };
  }
}