import { Router } from 'express';

import { getCustomRepository, Transaction } from 'typeorm';
import multer from 'multer';

import uploadConfig from '../config/upload';
import TransactionsRepository from '../repositories/TransactionsRepository';
import CreateTransactionService from '../services/CreateTransactionService';
import DeleteTransactionService from '../services/DeleteTransactionService';
import ImportTransactionsService from '../services/ImportTransactionsService';
// import ImportTransactionsService from '../services/ImportTransactionsService';

const transactionsRouter = Router();

const upload = multer(uploadConfig);
transactionsRouter.get('/', async (request, response) => {
  // TODO
  try {
    const transactionsRepository = getCustomRepository(TransactionsRepository);

    const transactions = await transactionsRepository.find();
    const balance = await transactionsRepository.getBalance();
    return response.json({
      transactions,
      balance,
    });
  } catch (err) {
    return response.json(err);
  }
});

transactionsRouter.post('/', async (request, response) => {
  // TODO
  const { title, value, type, category } = request.body;
  const createTransaction = new CreateTransactionService();

  const transaction = await createTransaction.execute({
    title,
    value,
    type,
    category,
  });
  return response.json(transaction);
});

transactionsRouter.delete('/:id', async (request, response) => {
  // TODO

  try {
    const { id } = request.params;

    const deleteTransactionService = new DeleteTransactionService();
    deleteTransactionService.execute(id);

    return response.status(204).send();
  } catch (err) {
    return response.json(err);
  }
});

transactionsRouter.post(
  '/import',
  upload.single('file'),
  async (request, response) => {
    const importTransactions = new ImportTransactionsService();

    const transactions = await importTransactions.execute(request.file.path);

    const formatedTransactions = transactions.map(transaction => ({
      title: transaction.title,
      type: transaction.type,
    }));

    return response.json(formatedTransactions);
  },
);

export default transactionsRouter;
