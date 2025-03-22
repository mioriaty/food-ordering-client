import dishService from '@/infrastructure/services/dish.service';
import { getIdFromSlugURL } from '@/libs/utils/generate-slug-url';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';

import { DishDetailContent } from './dish-detail';

// export async function generateStaticParams() {
//   const data = await wrapServerApi(() => dishService.list());
//   const dishes = data?.payload?.data ?? [];
//   return dishes.map((dish) => ({
//     slug: generateSlugURL({
//       id: dish.id,
//       name: dish.name
//     })
//   }));
// }

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
