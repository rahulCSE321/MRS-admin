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
      query: ({token,page=1,forWallet="false"}) => ({
        url: `users/getAllUsers?page=${page}&forWallet=${forWallet}`,
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
    getAllRanks: builder.query({
      query: ({token}) => ({
        url: "ranks/getAllRank",
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getPreviousTransactions: builder.mutation({
      query: ({token,fromDate='',toDate='',userId}) => ({
        url: `wallets/wallet-history?fromDate=${fromDate}&toDate=${toDate}&userId=${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getUserWalletRecharge: builder.query({
      query: ({token,wallet_recharge="wallet_recharge",page=1}) => ({
        url: `users/walletHistory?transactionType=${wallet_recharge}&page=${page}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getBankDetailsById: builder.mutation({
      query: ({token,userId}) => ({
        url: `banks/getBanksByUserId/${userId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getUserUpline: builder.mutation({
      query: ({token,userId,uplinePage=1}) => ({
        url: `users/getUplineList/${userId}?page=${uplinePage}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    getUsersIncome: builder.mutation({
      query: ({token,fromDate='',toDate='',page=1,search=''}) => ({
        url: `wallets/admin-reward-history?fromDate=${fromDate}&toDate=${toDate}&page=${page}&search=${search}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
    }),
    changeStatus: builder.mutation({
      query: ({token,userId,status}) => ({
        url: `users/change-status`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body:{status,userId}
      }),
    }),
    createMasterPlan: builder.mutation({
      query: ({ token, values }) => ({
        url: "CreateMasterplans",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: values,
      }),
    }),
    registerNewUser: builder.mutation({
      query: ({ token, formData }) => ({
        url: "users/register",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      }),
    }),
    rechargeWallet: builder.mutation({
      query: ({ token, userId,amount,transactionType }) => ({
        url: "wallets/userWalletRecharge",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: {userId,amount,transactionType},
      }),
    }),
  }),
});

export const {
  useGetAllUsersQuery,
  useGetPlanHistoryQuery,
  useGetMasterPlanQuery,
  useCreateMasterPlanMutation,
useGetUsersIncomeMutation,
useChangeStatusMutation,
useGetUserUplineMutation,
useGetBankDetailsByIdMutation,
useRegisterNewUserMutation,
useGetUserWalletRechargeQuery,
useRechargeWalletMutation,
useGetPreviousTransactionsMutation,
useGetAllRanksQuery
} = adminApi;
