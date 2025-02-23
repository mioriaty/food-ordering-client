import { DishListResType } from '@/domain/schemas/dish.schema';
import dishService from '@/infrastructure/services/dish.service';
import { formatCurrency } from '@/libs/utils/format-currency';
import Image from 'next/image';

export default async function Home() {
  let dishes: DishListResType['data'] = [];

  try {
    const data = await dishService.list();
    const {
      payload: { data: dishesResponse }
    } = data;

    dishes = dishesResponse;
  } catch (error) {
    return <div>Something went wrong!</div>;
  }

  return (
    <div className="w-full space-y-4">
      <section className="space-y-10">
        <h2 className="text-center text-2xl font-bold">Đa dạng các món ăn</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishes.map((dish) => (
            <div className="flex gap-4 w" key={dish.id}>
              <div className="flex-shrink-0">
                <Image
                  alt={dish.name}
                  src={dish.image}
                  width={150}
                  height={150}
                  quality={100}
                  className="object-cover w-[150px] h-[150px] rounded-md"
                />
              </div>
              <div className="space-y-1">
                <h3 className="text-xl font-semibold">{dish.name}</h3>
                <p className="">{dish.description}</p>
                <p className="font-semibold">{formatCurrency(dish.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
