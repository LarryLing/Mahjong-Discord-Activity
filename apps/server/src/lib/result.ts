type Result<E extends { reason: string }, S> = [E, null] | [null, S];

const ok = <S>(data: S): Result<never, S> => {
  return [null, data];
};

const err = <const R extends string, E extends { reason: R }>(
  error: E,
): Result<E, never> => {
  return [error, null];
};

const tryCatch = async <R extends Result<{ reason: string }, unknown>>(
  promise: Promise<R>,
): Promise<R | Result<{ reason: "UnexpectedError" }, never>> => {
  try {
    return await promise;
  } catch {
    return err({ reason: "UnexpectedError" as const });
  }
};

export { err, ok, type Result, tryCatch };
