import slugify from 'slugify';

export const generateSlugURL = ({ id, name }: { name: string; id: number }) => {
  return `${slugify(name)}-i.${id}`;
};

export const getIdFromSlugURL = (slug: string) => {
  return Number(slug.split('-i.')[1]);
};
