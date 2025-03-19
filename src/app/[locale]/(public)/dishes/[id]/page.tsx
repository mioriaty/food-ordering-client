import dishService from '@/infrastructure/services/dish.service';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';

import { DishDetailContent } from './dish-detail';

interface DishDetailPageProps {
  id: string;
}

export default async function DishDetailPage({ params }: { params: DishDetailPageProps }) {
  const { id } = params;
  const data = await wrapServerApi(() => dishService.getOne(Number(id)));
  const dish = data?.payload?.data;

  return <DishDetailContent dish={dish} />;
}
