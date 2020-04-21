import AppError from '../errors/AppError';
import { getCustomRepository } from 'typeorm';
import TransactionRepository from '../repositories/TransactionsRepository';
class DeleteTransactionService {
  public async execute(id: string): Promise<void> {
    const transactionsRepository = getCustomRepository(TransactionRepository);

    const transaction = await transactionsRepository.findOne({ where: { id } });

    if (!transaction) {
      throw new AppError('Wrong id, this transaction doesnt exists.');
    }
    await transactionsRepository.delete(transaction.id);
  }
}

export default DeleteTransactionService;
