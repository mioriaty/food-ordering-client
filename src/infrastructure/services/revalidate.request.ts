import http from '@/infrastructure/http/fetcher';

const revalidateApiRequest = (tag: string) =>
  http.get(`/api/revalidate?tag=${tag}`, {
    baseUrl: ''
  });

export default revalidateApiRequest;
