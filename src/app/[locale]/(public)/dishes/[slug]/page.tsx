import dishService from '@/infrastructure/services/dish.service';
import { getIdFromSlugURL } from '@/libs/utils/generate-slug-url';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';

import { DishDetailContent } from './dish-detail';

interface DishDetailPageProps {
  slug: string;
}

export default async function DishDetailPage({ params }: { params: DishDetailPageProps }) {
  const { slug } = params;
  const id = getIdFromSlugURL(slug);
  const data = await wrapServerApi(() => dishService.getOne(id));
  const dish = data?.payload?.data;

  return <DishDetailContent dish={dish} />;
}
