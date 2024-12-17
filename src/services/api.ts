import axios, { AxiosError } from "axios";
import { Developer, Review } from "../types";

interface StrapiMeta {
  pagination: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}

interface StrapiResponse<T> {
  data: T[];
  meta: StrapiMeta;
}

interface StrapiSingleResponse<T> {
  data: T;
  meta: StrapiMeta;
}

const STRAPI_URL =
  import.meta.env.VITE_STRAPI_URL?.replace(/\/api$/, "") ||
  "http://localhost:1337";
const STRAPI_TOKEN = import.meta.env.VITE_STRAPI_TOKEN;

const strapiApi = axios.create({
  baseURL: STRAPI_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${STRAPI_TOKEN}`,
  },
});

strapiApi.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

strapiApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error: AxiosError) => {
    console.error("API Error:", error.response?.data);
    return Promise.reject(error);
  }
);

export const api = {
  developers: {
    getAll: async (): Promise<Developer[]> => {
      try {
        const response = await strapiApi.get<StrapiResponse<Developer>>(
          "/api/developers"
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to fetch developers: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },

    getById: async (id: number): Promise<Developer> => {
      try {
        const response = await strapiApi.get<StrapiResponse<Developer>>(
          `/api/developers?filters[id][$eq]=${id}`
        );
        if (!response.data.data.length) {
          throw new Error(`Developer with id ${id} not found`);
        }
        return response.data.data[0];
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to fetch developer: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },

    add: async (developer: Partial<Developer>): Promise<Developer> => {
      try {
        const response = await strapiApi.post<StrapiSingleResponse<Developer>>(
          "/api/developers",
          {
            data: developer,
          }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to add developer: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },

    update: async (developer: Developer): Promise<Developer> => {
      try {
        const response = await strapiApi.put<StrapiSingleResponse<Developer>>(
          `/api/developers/${developer.documentId}`,
          {
            data: {
              name: developer.name,
              role: developer.role,
              team: developer.team,
              employmentStatus: developer.employmentStatus,
              skills: developer.skills,
              joinDate: developer.joinDate,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to update developer: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },
  },

  reviews: {
    getByDeveloperId: async (developerId: number): Promise<Review[]> => {
      try {
        const response = await strapiApi.get<StrapiResponse<Review>>(
          `/api/reviews?filters[developer][id][$eq]=${developerId}&sort=date:desc`
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to fetch reviews: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },

    add: async (review: Partial<Review>): Promise<Review> => {
      try {
        const response = await strapiApi.post<StrapiSingleResponse<Review>>(
          "/api/reviews",
          {
            data: review,
          }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to add review: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },

    update: async (review: Review): Promise<Review> => {
      try {
        const response = await strapiApi.put<StrapiSingleResponse<Review>>(
          `/api/reviews/${review.documentId}`,
          {
            data: {
              date: review.date,
              codeQuality: review.codeQuality,
              communication: review.communication,
              teamwork: review.teamwork,
              delivery: review.delivery,
              strengths: review.strengths,
              improvements: review.improvements,
              notes: review.notes,
              developer: review.developer.id,
            },
          }
        );
        return response.data.data;
      } catch (error) {
        if (error instanceof AxiosError) {
          throw new Error(
            `Failed to update review: ${
              error.response?.data?.error?.message || error.message
            }`
          );
        }
        throw error;
      }
    },
  },
};
