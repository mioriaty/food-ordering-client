import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/domain/schemas/indicator.schema';
import http from '@/infrastructure/http/fetcher';
import qs from 'query-string';

const prefix = '/indicators';

const indicatorService = {
  getDashboardIndicators: async (queryParams: DashboardIndicatorQueryParamsType) => {
    const response = await http.get<DashboardIndicatorResType>(
      `${prefix}/dashboard?${qs.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
      })}`
    );
    return response;
  }
};

export default indicatorService;
