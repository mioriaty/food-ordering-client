type StatusPolling = 'requesting' | 'success' | 'failure';
type AnyFunction = (...args: any[]) => any;

interface WaitFor<Fn extends AnyFunction> {
  cb: Fn;
  args: Parameters<Fn>;
  condition: (res: Awaited<ReturnType<Fn>>) => StatusPolling;
  options?: {
    interval?: number;
    expire?: number;
  };
}

export const waitFor = <Fn extends AnyFunction>({ cb, args, condition, options = {} }: WaitFor<Fn>) => {
  const { interval = 500, expire = 3000 } = options;
  return new Promise<Awaited<ReturnType<Fn>>>((resolve, reject) => {
    let _timeoutId: number | undefined = undefined;
    const recursiveFunc = async () => {
      try {
        const res = await cb(...args);
        const status = condition(res);
        if (status === 'success') {
          return resolve(res);
        }
        if (status === 'failure') {
          return reject(res);
        }
        if (status === 'requesting') {
          clearTimeout(_timeoutId);
          _timeoutId = window.setTimeout(recursiveFunc, interval);
        }
      } catch (error) {
        reject(error);
      }
    };
    recursiveFunc();
    const _timeOutId2 = setTimeout(() => {
      clearTimeout(_timeoutId);
      clearTimeout(_timeOutId2);
      reject(new Error('Timeout'));
    }, expire);
  });
};
