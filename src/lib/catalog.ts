import data from '@/data/catalog.json';
import type { ActivityPackage, Category, Experience } from '@/lib/types';

export interface ExperienceWithPrice extends Experience {
  displayPrice: number;
}

const categories = data.categories as Category[];

export function getCategories(): Category[] {
  return categories;
}

export function getExperiences(): ExperienceWithPrice[] {
  return data.experiences.map((item) => ({
    id: item.id,
    title: item.title,
    slug: item.slug,
    description: item.description,
    location: item.location,
    images: item.images,
    category_id: item.category_id,
    categories: categories.find((cat) => cat.id === item.category_id),
    important_info: item.important_info,
    displayPrice: item.price,
  })) as ExperienceWithPrice[];
}

export function getExperienceById(id: number): Experience | null {
  const found = getExperiences().find((exp) => exp.id === id);
  return found ?? null;
}

export function getPackagesByExperienceId(id: number): ActivityPackage[] {
  const experience = data.experiences.find((item) => item.id === id);
  if (!experience) return [];
  return [
    {
      id: experience.id,
      activity_id: experience.id,
      package_name: 'Tarifa Única',
      price: experience.price,
      features: {},
      min_pax: 1,
      is_active: true,
    },
  ];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
  }).format(price);
}
