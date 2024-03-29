class CustomError extends Error {
  constructor(message) {
    super(message);
    this.name = this.constructor.name;
    if (typeof Error.captureStackTrace === 'function') {
      Error.captureStackTrace(this, this.constructor);
    } else {
      this.stack = new Error(message).stack;
    }
  }
}

export class TooManyPlayersException extends CustomError {}
export class TransactionError extends CustomError {
  constructor(message, transaction) {
    super(message);
    this.transaction = transaction;
  }
}

export default { TooManyPlayersException, TransactionError };
