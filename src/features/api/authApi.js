import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_API = `${import.meta.env.VITE_REACT_APP_END_POINT}api/`;

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_API,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    registerUser: builder.mutation({
      query: (values) => ({
        url: "register",
        method: "POST",
        body: values,
      }),
    }),
    login: builder.mutation({
      query: (values) => ({
        url: "AdminLogin",
        method: "POST",
        body: values,
      }),
    }),
    logout: builder.mutation({
      query: (token) => ({
        url: "logout",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
  }),
});

export const { useRegisterUserMutation, useLoginMutation,useLogoutMutation } = authApi;
