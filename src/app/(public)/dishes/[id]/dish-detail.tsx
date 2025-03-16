import { DishResType } from '@/domain/schemas/dish.schema';
import { formatCurrency } from '@/libs/utils/format-currency';
import Image from 'next/image';

interface DishDetailPageProps {
  dish: DishResType['data'] | undefined;
}

export const DishDetailContent = ({ dish }: DishDetailPageProps) => {
  if (!dish) {
    return <h1 className="text-2xl lg:text-3xl font-semibold">Not found</h1>;
  }

  return (
    <div className="space-y-4">
      <Image
        alt={dish.name}
        src={dish.image}
        width={500}
        height={500}
        quality={100}
        className="object-cover w-full max-w-[500px] max-h-[500px] rounded-md"
        loading="lazy"
      />
      <h2 className="text-2xl font-bold lg:text-3xl">{dish.name}</h2>
      <p className="text-2xl font-bold">Giá: {formatCurrency(dish.price)}</p>
      <p className="text-gray-600">{dish.description}</p>
    </div>
  );
};
