import envConfig from '@/configs/env.config';
import dishService from '@/infrastructure/services/dish.service';
import { Locale } from '@/libs/constants/locale';
import { generateSlugURL, getIdFromSlugURL } from '@/libs/utils/generate-slug-url';
import { htmlToTextForDescription } from '@/libs/utils/html-to-text';
import { wrapServerApi } from '@/libs/utils/wrap-server-api';
import { baseOpenGraph } from '@/shared-metadata';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { cache } from 'react';

import { DishDetailContent } from './dish-detail';

const getDetail = cache((id: number) => wrapServerApi(() => dishService.getOne(id)));

type Props = {
  params: Promise<{ slug: string; locale: Locale }>;
};

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params;
  const t = await getTranslations({
    locale: params.locale,
    namespace: 'DishDetail'
  });
  const id = getIdFromSlugURL(params.slug);
  const data = await getDetail(id);
  const dish = data?.payload.data;

  if (!dish) {
    return {
      title: t('notFound'),
      description: t('notFound')
    };
  }

  const url =
    envConfig.NEXT_PUBLIC_URL +
    `/${params.locale}/dishes/${generateSlugURL({
      name: dish.name,
      id: dish.id
    })}`;

  return {
    title: dish.name,
    description: htmlToTextForDescription(dish.description),
    openGraph: {
      ...baseOpenGraph,
      title: dish.name,
      description: dish.description,
      url,
      images: [
        {
          url: dish.image
        }
      ]
    },
    alternates: {
      canonical: url
    }
  };
}

interface DishDetailPageProps {
  slug: string;
}

export default async function DishDetailPage(props: { params: Promise<DishDetailPageProps> }) {
  const params = await props.params;
  const { slug } = params;
  const id = getIdFromSlugURL(slug);
  const data = await wrapServerApi(() => dishService.getOne(id));
  const dish = data?.payload?.data;

  return <DishDetailContent dish={dish} />;
}
