export class Result<T, E> {
  constructor(
    private readonly value: T | null = null,
    private readonly error: E | null = null,
  ) {}

  static ok<T, E>(value: T): Result<T, E> {
    return new Result<T, E>(value, null);
  }

  static error<T, E>(error: E): Result<T, E> {
    return new Result<T, E>(null, error);
  }

  isSuccess(): this is Result<T, null> {
    return this.value !== null;
  }

  isFailure(): this is Result<null, E> {
    return this.error !== null;
  }

  getValue(): T {
    return this.value as T;
  }

  getError(): E {
    return this.error as E;
  }
}
