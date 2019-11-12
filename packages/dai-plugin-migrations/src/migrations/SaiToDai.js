import { SAI } from '..';

export default class SaiToDai {
  constructor(manager) {
    this._manager = manager;
    this._sai = manager.get('token').getToken(SAI);
    return this;
  }

  async check() {
    return this._sai.balance();
  }

  async execute(amount) {
    const formattedAmount = SAI(amount).toFixed('wei');
    const address = this._manager.get('web3').currentAddress();
    const migrationContract = this._manager
      .get('smartContract')
      .getContract('MIGRATION');
    const allowance = await this._sai.allowance(
      address,
      migrationContract.address
    );
    console.log(allowance.toNumber());
    console.log(formattedAmount * 1.5);
    console.log(migrationContract.address);
    if (allowance.toNumber() < amount) {
      await this._sai.approve(migrationContract.address, (formattedAmount * 1.5));
      console.log(await this._sai.allowance(
        address,
        migrationContract.address
      ));
    }

    return migrationContract.swapSaiToDai(formattedAmount);
  }
}
