import { Link } from '@/i18n/navigation';
import dishService from '@/infrastructure/services/dish.service';
import { Locale } from '@/libs/constants/locale';
import { formatCurrency } from '@/libs/utils/format-currency';
import { generateSlugURL } from '@/libs/utils/generate-slug-url';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';
import { getTranslations, setRequestLocale } from 'next-intl/server';
import Image from 'next/image';

export default async function Home({ params: { locale } }: { params: { locale: Locale } }) {
  setRequestLocale(locale);

  const data = await wrapServerApi(() => dishService.list());
  const dishes = data?.payload?.data;
  const t = await getTranslations('DishPage');

  if (!dishes) {
    return <div>Not found any dishes</div>;
  }

  return (
    <div className="w-full space-y-4">
      <section className="space-y-10">
        <h2 className="text-center text-2xl font-bold">{t('title')}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {dishes.map((dish) => (
            <Link
              href={`/dishes/${generateSlugURL({ id: dish.id, name: dish.name })}`}
              className="flex gap-4 w"
              key={dish.id}
            >
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
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
