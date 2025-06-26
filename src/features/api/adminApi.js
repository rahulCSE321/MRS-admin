import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = `${import.meta.env.VITE_REACT_APP_END_POINT}api/`;

export const adminApi = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    credentials: "include",
  }),
  endpoints: (builder) => ({
    getAllUsers: builder.query({
      query: (token) => ({
        url: "users/getAllUsers",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
      getPlanHistory: builder.query({
      query: (token) => ({
        url: "plans/getAllUsersPlanHistory",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
      getMasterPlan: builder.query({
      query: (token) => ({
        url: "getAllMasterplans",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    createMasterPlan:builder.mutation({
      query:({token,values})=>({
        url:'CreateMasterplans',
        method:"POST",
         headers: {
          Authorization: `Bearer ${token}`,
        },
        body:values
      })
    })
  }),
  
});

export const { useGetAllUsersQuery,useGetPlanHistoryQuery,useGetMasterPlanQuery ,useCreateMasterPlanMutation} = adminApi;
