import dishService from '@/infrastructure/services/dish.service';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';

import DishModal from '@/app/(public)/@modal/(.)dishes/[id]/modal';
import { DishDetailContent } from '@/app/(public)/dishes/[id]/dish-detail';

interface DishDetailPageProps {
  id: string;
}

export default async function DishDetailPage({ params }: { params: DishDetailPageProps }) {
  const { id } = params;
  const data = await wrapServerApi(() => dishService.getOne(Number(id)));
  const dish = data?.payload?.data;

  return (
    <DishModal>
      <DishDetailContent dish={dish} />
    </DishModal>
  );
}
