import { axiosInstance } from '@/app/api/axios';

export interface LookupValue {
  id: string;
  category: string;
  code: string;
  label: string;
  description: string | null;
  value: string | null;
  sortOrder: number;
  metadata: Record<string, unknown> | null;
}

export const lookupService = {
  getAll: async () => {
    const response = await axiosInstance.get('/lookups/all');
    return response.data.data;
  },

  getByCategory: async (category: string) => {
    const response = await axiosInstance.get(`/lookups/${category}`);
    return response.data.data as LookupValue[];
  },
};
