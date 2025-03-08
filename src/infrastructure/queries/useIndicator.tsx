import { DashboardIndicatorQueryParamsType } from '@/domain/schemas/indicator.schema';
import indicatorService from '@/infrastructure/services/indicator.service';
import { useQuery } from '@tanstack/react-query';

export const useGetDashboardIndicators = (queryParams: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryFn: () => indicatorService.getDashboardIndicators(queryParams),
    queryKey: ['dashboardIndicators', queryParams]
  });
};
