import { ViewToken } from "react-native";
import {
  CreateProductRequest,
  CreateProductResponse,
} from "../models/product.model";
import axios from "axios";
import { API_URL } from "@/api/ApiClient";
import { ProductItem } from "../models/product.model";

export const ProductService = {
  createProduct: async (
    productRequest: CreateProductRequest,
    token: string,
  ): Promise<CreateProductResponse> => {
    try {
      const authTokenHeader = token?.startsWith("Bearer")
        ? token
        : `Bearer ${token}`;
      const response = await axios.post<CreateProductResponse>(
        `${API_URL}/products/create`,
        productRequest,
        {
          headers: {
            Authorization: authTokenHeader,
            "Content-Type": "application/json",
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("error response:", error.response.data);
        throw new Error(
          error.response.data?.message || "error to create product",
        );
      }
      throw new Error("error al sevidor");
    }
  },

  getProductsByCategoryId: async (
    categoryId: number,
    token: string,
  ): Promise<ProductItem[]> => {
    try {
      const autorizedToken = token?.startsWith("Bearer")
        ? token
        : `Bearer ${token}`;
      const authTokenHeader = autorizedToken;
      const response = await axios.get<ProductItem[]>(
        `${API_URL}/products/category/${categoryId}`,
        {
          headers: {
            Authorization: authTokenHeader,
          },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        console.log("error response:", error.response.data);
        throw new Error(error.response.data?.message || "error to get product");
      }
      throw new Error("error al sevidor");
    }
  },
};
