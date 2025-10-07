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

class TooManyPlayersException extends CustomError {}
class TransactionError extends CustomError {
  constructor(message, transaction) {
    super(message);
    this.transaction = transaction;
  }
}

export { TooManyPlayersException, TransactionError };
