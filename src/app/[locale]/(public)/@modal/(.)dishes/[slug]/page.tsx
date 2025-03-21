import dishService from '@/infrastructure/services/dish.service';
import { getIdFromSlugURL } from '@/libs/utils/generate-slug-url';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';

import { DishDetailContent } from '@/app/[locale]/(public)/dishes/[slug]/dish-detail';

import DishModal from './modal';

interface DishDetailPageProps {
  slug: string;
}

export default async function DishDetailPage({ params }: { params: DishDetailPageProps }) {
  const { slug } = params;
  const id = getIdFromSlugURL(slug);
  const data = await wrapServerApi(() => dishService.getOne(Number(id)));
  const dish = data?.payload?.data;

  return (
    <DishModal>
      <DishDetailContent dish={dish} />
    </DishModal>
  );
}
