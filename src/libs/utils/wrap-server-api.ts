import { isRedirectError } from 'next/dist/client/components/redirect-error';

export const wrapServerApi = async <T>(fnc: () => Promise<T>) => {
  let result = null;
  try {
    result = await fnc();
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
  }
  return result;
};
