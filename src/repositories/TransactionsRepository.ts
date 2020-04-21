import { EntityRepository, Repository } from 'typeorm';

import Transaction from '../models/Transaction';

interface Balance {
  income: number;
  outcome: number;
  total: number;
}

@EntityRepository(Transaction)
class TransactionsRepository extends Repository<Transaction> {
  public async getBalance(): Promise<Balance> {
    // TODO

    // get the array of transactions and make a filter by type, after this, a reduce
    const transactions = await this.find();

    const income = transactions
      .filter(item => item.type === 'income')
      .reduce((sum, item) => sum + item.value, 0);

    const outcome = transactions
      .filter(item => item.type === 'outcome')
      .reduce((sum, item) => sum + item.value, 0);

    // return the income, outcome and total income-outcome
    return {
      income,
      outcome,
      total: income - outcome,
    };
  }
}

export default TransactionsRepository;
