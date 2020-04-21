import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import Transaction from '../models/Transaction';
import TransactionRepository from '../repositories/TransactionsRepository';

import CategoryRepository from '../repositories/CategoryRepository';

interface Request {
  title: string;
  value: number;
  type: 'income' | 'outcome';
  category: string;
}

class CreateTransactionService {
  public async execute({
    title,
    value,
    type,
    category,
  }: Request): Promise<Transaction> {
    const transactionRepository = getCustomRepository(TransactionRepository);
    const categoryRepository = getCustomRepository(CategoryRepository);

    const categoryExists = await categoryRepository.findByNameCategory(
      category,
    );

    let category_id;
    if (categoryExists) {
      category_id = categoryExists.id;
    } else {
      const category_created = await categoryRepository.create({
        title: category,
      });

      await categoryRepository.save(category_created);
      category_id = category_created.id;
    }

    const transactions_balance = await transactionRepository.getBalance();

    console.log(transactions_balance.outcome);

    if (type === 'outcome' && value > transactions_balance.income) {
      throw new AppError('Error, this value for outcome is not permitted', 400);
    }

    const transaction = await transactionRepository.create({
      title,
      value,
      type,
      category_id,
    });

    await transactionRepository.save(transaction);

    return transaction;
  }
}

export default CreateTransactionService;
