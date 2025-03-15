import dishService from '@/infrastructure/services/dish.service';
import { formatCurrency } from '@/libs/utils/format-currency';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';
import Image from 'next/image';

interface DishDetailPageProps {
  id: string;
}

export default async function DishDetailPage({ params }: { params: DishDetailPageProps }) {
  const { id } = params;
  const data = await wrapServerApi(() => dishService.getOne(Number(id)));
  const dish = data?.payload?.data;

  if (!dish) {
    return <div>Not found</div>;
  }

  return (
    <div className="space-y-4">
      <Image
        alt={dish.name}
        src={dish.image}
        width={700}
        height={700}
        quality={100}
        className="object-cover w-full h-full max-w-[700px] max-h-[700px] rounded-md"
      />
      <h2 className="text-2xl font-bold lg:text-3xl">{dish.name}</h2>
      <p className="text-2xl font-bold">Giá: {formatCurrency(dish.price)}</p>
      <p className="text-gray-600">{dish.description}</p>
    </div>
  );
}
