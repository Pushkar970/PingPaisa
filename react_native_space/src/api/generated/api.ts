// @ts-nocheck
import {
  useMutation,
  useQuery
} from '@tanstack/react-query';
import type {
  DataTag,
  DefinedInitialDataOptions,
  DefinedUseQueryResult,
  MutationFunction,
  QueryClient,
  QueryFunction,
  QueryKey,
  UndefinedInitialDataOptions,
  UseMutationOptions,
  UseMutationResult,
  UseQueryOptions,
  UseQueryResult
} from '@tanstack/react-query';

import type {
  AiControllerGetMessagesParams,
  AuthControllerGoogleAuthParams,
  AuthControllerGoogleCallbackParams,
  AuthResponseDto,
  BatchCreateExpenseDto,
  BatchCreateIncomeDto,
  BatchCreateIncomeResponseDto,
  BatchCreateResponseDto,
  CategoryBreakdownResponseDto,
  ChatRequestDto,
  ChatResponseDto,
  ConversationListResponseDto,
  CreateExpenseDto,
  CreateIncomeDto,
  CreatePushTokenDto,
  CreateSubscriptionDto,
  DashboardControllerGetCategoryBreakdownParams,
  DashboardStatsResponseDto,
  DeleteResponseDto,
  ExpenseListResponseDto,
  ExpenseResponseDto,
  ExpensesControllerFindAllParams,
  ExportControllerExportCsvParams,
  InactivityReminderResponseDto,
  IncomeControllerFindAllParams,
  IncomeListResponseDto,
  IncomeResponseDto,
  LoginDto,
  MeResponseDto,
  MessageListResponseDto,
  MonthlyLimitResponseDto,
  ParseCreditSmsDto,
  ParseCreditSmsResponseDto,
  ParseSmsDto,
  ParseSmsResponseDto,
  PlanResponseDto,
  PushTokenResponseDto,
  SetMonthlyLimitDto,
  SignupDto,
  SplitResponseDto,
  SubscriptionListResponseDto,
  SubscriptionResponseDto,
  SubscriptionUpcomingResponseDto,
  SubscriptionsControllerFindAllParams,
  SubscriptionsControllerFindUpcomingParams,
  SuggestionsResponseDto,
  TrendsResponseDto,
  UpdateExpenseDto,
  UpdateIncomeDto,
  UpdateSubscriptionDto,
  UpgradeResponseDto
} from './schemas';

import { customFetch } from '../customFetch';
import type { ErrorType , BodyType } from '../customFetch';


type SecondParameter<T extends (...args: never) => unknown> = Parameters<T>[1];



export const getAuthControllerSignupUrl = () => {




  return `/api/signup`
}

export const authControllerSignup = async (signupDto: SignupDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerSignupUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(signupDto)
  }
);}




export const getAuthControllerSignupMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext> => {

const mutationKey = ['authControllerSignup'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerSignup>>, {data: BodyType<SignupDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerSignup(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerSignupMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerSignup>>>
    export type AuthControllerSignupMutationBody = BodyType<SignupDto>
    export type AuthControllerSignupMutationError = ErrorType<unknown>

    export const useAuthControllerSignup = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerSignup>>, TError,{data: BodyType<SignupDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerSignup>>,
        TError,
        {data: BodyType<SignupDto>},
        TContext
      > => {
      return useMutation(getAuthControllerSignupMutationOptions(options), queryClient);
    }

export const getAuthControllerLoginUrl = () => {




  return `/api/auth/login`
}

export const authControllerLogin = async (loginDto: LoginDto, options?: RequestInit): Promise<AuthResponseDto> => {

  return customFetch<AuthResponseDto>(getAuthControllerLoginUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(loginDto)
  }
);}




export const getAuthControllerLoginMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext> => {

const mutationKey = ['authControllerLogin'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof authControllerLogin>>, {data: BodyType<LoginDto>}> = (props) => {
          const {data} = props ?? {};

          return  authControllerLogin(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AuthControllerLoginMutationResult = NonNullable<Awaited<ReturnType<typeof authControllerLogin>>>
    export type AuthControllerLoginMutationBody = BodyType<LoginDto>
    export type AuthControllerLoginMutationError = ErrorType<unknown>

    export const useAuthControllerLogin = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof authControllerLogin>>, TError,{data: BodyType<LoginDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof authControllerLogin>>,
        TError,
        {data: BodyType<LoginDto>},
        TContext
      > => {
      return useMutation(getAuthControllerLoginMutationOptions(options), queryClient);
    }

export const getAuthControllerMeUrl = () => {




  return `/api/auth/me`
}

export const authControllerMe = async ( options?: RequestInit): Promise<MeResponseDto> => {

  return customFetch<MeResponseDto>(getAuthControllerMeUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerMeQueryKey = () => {
    return [
    `/api/auth/me`
    ] as const;
    }


export const getAuthControllerMeQueryOptions = <TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerMeQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerMe>>> = ({ signal }) => authControllerMe({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerMeQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerMe>>>
export type AuthControllerMeQueryError = ErrorType<unknown>


export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerMe>>,
          TError,
          Awaited<ReturnType<typeof authControllerMe>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerMe<TData = Awaited<ReturnType<typeof authControllerMe>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerMe>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerMeQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerGoogleAuthUrl = (params: AuthControllerGoogleAuthParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/auth/google?${stringifiedParams}` : `/api/auth/google`
}

export const authControllerGoogleAuth = async (params: AuthControllerGoogleAuthParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAuthControllerGoogleAuthUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerGoogleAuthQueryKey = (params?: AuthControllerGoogleAuthParams,) => {
    return [
    `/api/auth/google`, ...(params ? [params] : [])
    ] as const;
    }


export const getAuthControllerGoogleAuthQueryOptions = <TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerGoogleAuthQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerGoogleAuth>>> = ({ signal }) => authControllerGoogleAuth(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerGoogleAuthQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerGoogleAuth>>>
export type AuthControllerGoogleAuthQueryError = ErrorType<unknown>


export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleAuth>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleAuth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleAuth>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleAuth>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerGoogleAuth<TData = Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleAuthParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleAuth>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerGoogleAuthQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAuthControllerGoogleCallbackUrl = (params: AuthControllerGoogleCallbackParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/auth/google/callback?${stringifiedParams}` : `/api/auth/google/callback`
}

export const authControllerGoogleCallback = async (params: AuthControllerGoogleCallbackParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getAuthControllerGoogleCallbackUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAuthControllerGoogleCallbackQueryKey = (params?: AuthControllerGoogleCallbackParams,) => {
    return [
    `/api/auth/google/callback`, ...(params ? [params] : [])
    ] as const;
    }


export const getAuthControllerGoogleCallbackQueryOptions = <TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAuthControllerGoogleCallbackQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof authControllerGoogleCallback>>> = ({ signal }) => authControllerGoogleCallback(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AuthControllerGoogleCallbackQueryResult = NonNullable<Awaited<ReturnType<typeof authControllerGoogleCallback>>>
export type AuthControllerGoogleCallbackQueryError = ErrorType<unknown>


export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleCallback>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleCallback>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof authControllerGoogleCallback>>,
          TError,
          Awaited<ReturnType<typeof authControllerGoogleCallback>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAuthControllerGoogleCallback<TData = Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError = ErrorType<unknown>>(
 params: AuthControllerGoogleCallbackParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof authControllerGoogleCallback>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAuthControllerGoogleCallbackQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSubscriptionsControllerFindAllUrl = (params?: SubscriptionsControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/subscriptions?${stringifiedParams}` : `/api/subscriptions`
}

export const subscriptionsControllerFindAll = async (params?: SubscriptionsControllerFindAllParams, options?: RequestInit): Promise<SubscriptionListResponseDto> => {

  return customFetch<SubscriptionListResponseDto>(getSubscriptionsControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSubscriptionsControllerFindAllQueryKey = (params?: SubscriptionsControllerFindAllParams,) => {
    return [
    `/api/subscriptions`, ...(params ? [params] : [])
    ] as const;
    }


export const getSubscriptionsControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError = ErrorType<unknown>>(params?: SubscriptionsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSubscriptionsControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>> = ({ signal }) => subscriptionsControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SubscriptionsControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>>
export type SubscriptionsControllerFindAllQueryError = ErrorType<unknown>


export function useSubscriptionsControllerFindAll<TData = Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  SubscriptionsControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindAll<TData = Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindAll<TData = Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSubscriptionsControllerFindAll<TData = Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSubscriptionsControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSubscriptionsControllerCreateUrl = () => {




  return `/api/subscriptions`
}

export const subscriptionsControllerCreate = async (createSubscriptionDto: CreateSubscriptionDto, options?: RequestInit): Promise<SubscriptionResponseDto> => {

  return customFetch<SubscriptionResponseDto>(getSubscriptionsControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createSubscriptionDto)
  }
);}




export const getSubscriptionsControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerCreate>>, TError,{data: BodyType<CreateSubscriptionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerCreate>>, TError,{data: BodyType<CreateSubscriptionDto>}, TContext> => {

const mutationKey = ['subscriptionsControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subscriptionsControllerCreate>>, {data: BodyType<CreateSubscriptionDto>}> = (props) => {
          const {data} = props ?? {};

          return  subscriptionsControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SubscriptionsControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerCreate>>>
    export type SubscriptionsControllerCreateMutationBody = BodyType<CreateSubscriptionDto>
    export type SubscriptionsControllerCreateMutationError = ErrorType<unknown>

    export const useSubscriptionsControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerCreate>>, TError,{data: BodyType<CreateSubscriptionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof subscriptionsControllerCreate>>,
        TError,
        {data: BodyType<CreateSubscriptionDto>},
        TContext
      > => {
      return useMutation(getSubscriptionsControllerCreateMutationOptions(options), queryClient);
    }

export const getSubscriptionsControllerFindUpcomingUrl = (params?: SubscriptionsControllerFindUpcomingParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/subscriptions/upcoming?${stringifiedParams}` : `/api/subscriptions/upcoming`
}

export const subscriptionsControllerFindUpcoming = async (params?: SubscriptionsControllerFindUpcomingParams, options?: RequestInit): Promise<SubscriptionUpcomingResponseDto> => {

  return customFetch<SubscriptionUpcomingResponseDto>(getSubscriptionsControllerFindUpcomingUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSubscriptionsControllerFindUpcomingQueryKey = (params?: SubscriptionsControllerFindUpcomingParams,) => {
    return [
    `/api/subscriptions/upcoming`, ...(params ? [params] : [])
    ] as const;
    }


export const getSubscriptionsControllerFindUpcomingQueryOptions = <TData = Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError = ErrorType<unknown>>(params?: SubscriptionsControllerFindUpcomingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSubscriptionsControllerFindUpcomingQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>> = ({ signal }) => subscriptionsControllerFindUpcoming(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SubscriptionsControllerFindUpcomingQueryResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>>
export type SubscriptionsControllerFindUpcomingQueryError = ErrorType<unknown>


export function useSubscriptionsControllerFindUpcoming<TData = Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError = ErrorType<unknown>>(
 params: undefined |  SubscriptionsControllerFindUpcomingParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindUpcoming<TData = Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindUpcomingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindUpcoming<TData = Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindUpcomingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSubscriptionsControllerFindUpcoming<TData = Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError = ErrorType<unknown>>(
 params?: SubscriptionsControllerFindUpcomingParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindUpcoming>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSubscriptionsControllerFindUpcomingQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSubscriptionsControllerFindOneUrl = (id: string,) => {




  return `/api/subscriptions/${id}`
}

export const subscriptionsControllerFindOne = async (id: string, options?: RequestInit): Promise<SubscriptionResponseDto> => {

  return customFetch<SubscriptionResponseDto>(getSubscriptionsControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getSubscriptionsControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/subscriptions/${id}`
    ] as const;
    }


export const getSubscriptionsControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getSubscriptionsControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>> = ({ signal }) => subscriptionsControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type SubscriptionsControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>>
export type SubscriptionsControllerFindOneQueryError = ErrorType<unknown>


export function useSubscriptionsControllerFindOne<TData = Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindOne<TData = Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof subscriptionsControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof subscriptionsControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useSubscriptionsControllerFindOne<TData = Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useSubscriptionsControllerFindOne<TData = Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof subscriptionsControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getSubscriptionsControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getSubscriptionsControllerUpdateUrl = (id: string,) => {




  return `/api/subscriptions/${id}`
}

export const subscriptionsControllerUpdate = async (id: string,
    updateSubscriptionDto: UpdateSubscriptionDto, options?: RequestInit): Promise<SubscriptionResponseDto> => {

  return customFetch<SubscriptionResponseDto>(getSubscriptionsControllerUpdateUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateSubscriptionDto)
  }
);}




export const getSubscriptionsControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSubscriptionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSubscriptionDto>}, TContext> => {

const mutationKey = ['subscriptionsControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subscriptionsControllerUpdate>>, {id: string;data: BodyType<UpdateSubscriptionDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  subscriptionsControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SubscriptionsControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerUpdate>>>
    export type SubscriptionsControllerUpdateMutationBody = BodyType<UpdateSubscriptionDto>
    export type SubscriptionsControllerUpdateMutationError = ErrorType<unknown>

    export const useSubscriptionsControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerUpdate>>, TError,{id: string;data: BodyType<UpdateSubscriptionDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof subscriptionsControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateSubscriptionDto>},
        TContext
      > => {
      return useMutation(getSubscriptionsControllerUpdateMutationOptions(options), queryClient);
    }

export const getSubscriptionsControllerRemoveUrl = (id: string,) => {




  return `/api/subscriptions/${id}`
}

export const subscriptionsControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteResponseDto> => {

  return customFetch<DeleteResponseDto>(getSubscriptionsControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getSubscriptionsControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['subscriptionsControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof subscriptionsControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  subscriptionsControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type SubscriptionsControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof subscriptionsControllerRemove>>>

    export type SubscriptionsControllerRemoveMutationError = ErrorType<unknown>

    export const useSubscriptionsControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof subscriptionsControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof subscriptionsControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getSubscriptionsControllerRemoveMutationOptions(options), queryClient);
    }

export const getExpensesControllerFindAllUrl = (params?: ExpensesControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/expenses?${stringifiedParams}` : `/api/expenses`
}

export const expensesControllerFindAll = async (params?: ExpensesControllerFindAllParams, options?: RequestInit): Promise<ExpenseListResponseDto> => {

  return customFetch<ExpenseListResponseDto>(getExpensesControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getExpensesControllerFindAllQueryKey = (params?: ExpensesControllerFindAllParams,) => {
    return [
    `/api/expenses`, ...(params ? [params] : [])
    ] as const;
    }


export const getExpensesControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getExpensesControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof expensesControllerFindAll>>> = ({ signal }) => expensesControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ExpensesControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof expensesControllerFindAll>>>
export type ExpensesControllerFindAllQueryError = ErrorType<unknown>


export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  ExpensesControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useExpensesControllerFindAll<TData = Awaited<ReturnType<typeof expensesControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: ExpensesControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getExpensesControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getExpensesControllerCreateUrl = () => {




  return `/api/expenses`
}

export const expensesControllerCreate = async (createExpenseDto: CreateExpenseDto, options?: RequestInit): Promise<ExpenseResponseDto> => {

  return customFetch<ExpenseResponseDto>(getExpensesControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createExpenseDto)
  }
);}




export const getExpensesControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext> => {

const mutationKey = ['expensesControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerCreate>>, {data: BodyType<CreateExpenseDto>}> = (props) => {
          const {data} = props ?? {};

          return  expensesControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerCreate>>>
    export type ExpensesControllerCreateMutationBody = BodyType<CreateExpenseDto>
    export type ExpensesControllerCreateMutationError = ErrorType<unknown>

    export const useExpensesControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreate>>, TError,{data: BodyType<CreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerCreate>>,
        TError,
        {data: BodyType<CreateExpenseDto>},
        TContext
      > => {
      return useMutation(getExpensesControllerCreateMutationOptions(options), queryClient);
    }

export const getExpensesControllerFindOneUrl = (id: string,) => {




  return `/api/expenses/${id}`
}

export const expensesControllerFindOne = async (id: string, options?: RequestInit): Promise<ExpenseResponseDto> => {

  return customFetch<ExpenseResponseDto>(getExpensesControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getExpensesControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/expenses/${id}`
    ] as const;
    }


export const getExpensesControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof expensesControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getExpensesControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof expensesControllerFindOne>>> = ({ signal }) => expensesControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ExpensesControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof expensesControllerFindOne>>>
export type ExpensesControllerFindOneQueryError = ErrorType<unknown>


export function useExpensesControllerFindOne<TData = Awaited<ReturnType<typeof expensesControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindOne<TData = Awaited<ReturnType<typeof expensesControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof expensesControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof expensesControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExpensesControllerFindOne<TData = Awaited<ReturnType<typeof expensesControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useExpensesControllerFindOne<TData = Awaited<ReturnType<typeof expensesControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof expensesControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getExpensesControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getExpensesControllerUpdateUrl = (id: string,) => {




  return `/api/expenses/${id}`
}

export const expensesControllerUpdate = async (id: string,
    updateExpenseDto: UpdateExpenseDto, options?: RequestInit): Promise<ExpenseResponseDto> => {

  return customFetch<ExpenseResponseDto>(getExpensesControllerUpdateUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateExpenseDto)
  }
);}




export const getExpensesControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateExpenseDto>}, TContext> => {

const mutationKey = ['expensesControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerUpdate>>, {id: string;data: BodyType<UpdateExpenseDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  expensesControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerUpdate>>>
    export type ExpensesControllerUpdateMutationBody = BodyType<UpdateExpenseDto>
    export type ExpensesControllerUpdateMutationError = ErrorType<unknown>

    export const useExpensesControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerUpdate>>, TError,{id: string;data: BodyType<UpdateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateExpenseDto>},
        TContext
      > => {
      return useMutation(getExpensesControllerUpdateMutationOptions(options), queryClient);
    }

export const getExpensesControllerRemoveUrl = (id: string,) => {




  return `/api/expenses/${id}`
}

export const expensesControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteResponseDto> => {

  return customFetch<DeleteResponseDto>(getExpensesControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getExpensesControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['expensesControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  expensesControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerRemove>>>

    export type ExpensesControllerRemoveMutationError = ErrorType<unknown>

    export const useExpensesControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getExpensesControllerRemoveMutationOptions(options), queryClient);
    }

export const getExpensesControllerParseSmsUrl = () => {




  return `/api/expenses/parse-sms`
}

export const expensesControllerParseSms = async (parseSmsDto: ParseSmsDto, options?: RequestInit): Promise<ParseSmsResponseDto> => {

  return customFetch<ParseSmsResponseDto>(getExpensesControllerParseSmsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(parseSmsDto)
  }
);}




export const getExpensesControllerParseSmsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerParseSms>>, TError,{data: BodyType<ParseSmsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerParseSms>>, TError,{data: BodyType<ParseSmsDto>}, TContext> => {

const mutationKey = ['expensesControllerParseSms'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerParseSms>>, {data: BodyType<ParseSmsDto>}> = (props) => {
          const {data} = props ?? {};

          return  expensesControllerParseSms(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerParseSmsMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerParseSms>>>
    export type ExpensesControllerParseSmsMutationBody = BodyType<ParseSmsDto>
    export type ExpensesControllerParseSmsMutationError = ErrorType<unknown>

    export const useExpensesControllerParseSms = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerParseSms>>, TError,{data: BodyType<ParseSmsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerParseSms>>,
        TError,
        {data: BodyType<ParseSmsDto>},
        TContext
      > => {
      return useMutation(getExpensesControllerParseSmsMutationOptions(options), queryClient);
    }

export const getExpensesControllerCreateBatchUrl = () => {




  return `/api/expenses/batch`
}

export const expensesControllerCreateBatch = async (batchCreateExpenseDto: BatchCreateExpenseDto, options?: RequestInit): Promise<BatchCreateResponseDto> => {

  return customFetch<BatchCreateResponseDto>(getExpensesControllerCreateBatchUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(batchCreateExpenseDto)
  }
);}




export const getExpensesControllerCreateBatchMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreateBatch>>, TError,{data: BodyType<BatchCreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreateBatch>>, TError,{data: BodyType<BatchCreateExpenseDto>}, TContext> => {

const mutationKey = ['expensesControllerCreateBatch'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof expensesControllerCreateBatch>>, {data: BodyType<BatchCreateExpenseDto>}> = (props) => {
          const {data} = props ?? {};

          return  expensesControllerCreateBatch(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type ExpensesControllerCreateBatchMutationResult = NonNullable<Awaited<ReturnType<typeof expensesControllerCreateBatch>>>
    export type ExpensesControllerCreateBatchMutationBody = BodyType<BatchCreateExpenseDto>
    export type ExpensesControllerCreateBatchMutationError = ErrorType<unknown>

    export const useExpensesControllerCreateBatch = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof expensesControllerCreateBatch>>, TError,{data: BodyType<BatchCreateExpenseDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof expensesControllerCreateBatch>>,
        TError,
        {data: BodyType<BatchCreateExpenseDto>},
        TContext
      > => {
      return useMutation(getExpensesControllerCreateBatchMutationOptions(options), queryClient);
    }

export const getIncomeControllerFindAllUrl = (params?: IncomeControllerFindAllParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/income?${stringifiedParams}` : `/api/income`
}

export const incomeControllerFindAll = async (params?: IncomeControllerFindAllParams, options?: RequestInit): Promise<IncomeListResponseDto> => {

  return customFetch<IncomeListResponseDto>(getIncomeControllerFindAllUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getIncomeControllerFindAllQueryKey = (params?: IncomeControllerFindAllParams,) => {
    return [
    `/api/income`, ...(params ? [params] : [])
    ] as const;
    }


export const getIncomeControllerFindAllQueryOptions = <TData = Awaited<ReturnType<typeof incomeControllerFindAll>>, TError = ErrorType<unknown>>(params?: IncomeControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getIncomeControllerFindAllQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof incomeControllerFindAll>>> = ({ signal }) => incomeControllerFindAll(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type IncomeControllerFindAllQueryResult = NonNullable<Awaited<ReturnType<typeof incomeControllerFindAll>>>
export type IncomeControllerFindAllQueryError = ErrorType<unknown>


export function useIncomeControllerFindAll<TData = Awaited<ReturnType<typeof incomeControllerFindAll>>, TError = ErrorType<unknown>>(
 params: undefined |  IncomeControllerFindAllParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof incomeControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof incomeControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useIncomeControllerFindAll<TData = Awaited<ReturnType<typeof incomeControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: IncomeControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof incomeControllerFindAll>>,
          TError,
          Awaited<ReturnType<typeof incomeControllerFindAll>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useIncomeControllerFindAll<TData = Awaited<ReturnType<typeof incomeControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: IncomeControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useIncomeControllerFindAll<TData = Awaited<ReturnType<typeof incomeControllerFindAll>>, TError = ErrorType<unknown>>(
 params?: IncomeControllerFindAllParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindAll>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getIncomeControllerFindAllQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getIncomeControllerCreateUrl = () => {




  return `/api/income`
}

export const incomeControllerCreate = async (createIncomeDto: CreateIncomeDto, options?: RequestInit): Promise<IncomeResponseDto> => {

  return customFetch<IncomeResponseDto>(getIncomeControllerCreateUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createIncomeDto)
  }
);}




export const getIncomeControllerCreateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreate>>, TError,{data: BodyType<CreateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreate>>, TError,{data: BodyType<CreateIncomeDto>}, TContext> => {

const mutationKey = ['incomeControllerCreate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof incomeControllerCreate>>, {data: BodyType<CreateIncomeDto>}> = (props) => {
          const {data} = props ?? {};

          return  incomeControllerCreate(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type IncomeControllerCreateMutationResult = NonNullable<Awaited<ReturnType<typeof incomeControllerCreate>>>
    export type IncomeControllerCreateMutationBody = BodyType<CreateIncomeDto>
    export type IncomeControllerCreateMutationError = ErrorType<unknown>

    export const useIncomeControllerCreate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreate>>, TError,{data: BodyType<CreateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof incomeControllerCreate>>,
        TError,
        {data: BodyType<CreateIncomeDto>},
        TContext
      > => {
      return useMutation(getIncomeControllerCreateMutationOptions(options), queryClient);
    }

export const getIncomeControllerFindOneUrl = (id: string,) => {




  return `/api/income/${id}`
}

export const incomeControllerFindOne = async (id: string, options?: RequestInit): Promise<IncomeResponseDto> => {

  return customFetch<IncomeResponseDto>(getIncomeControllerFindOneUrl(id),
  {
    ...options,
    method: 'GET'


  }
);}





export const getIncomeControllerFindOneQueryKey = (id: string,) => {
    return [
    `/api/income/${id}`
    ] as const;
    }


export const getIncomeControllerFindOneQueryOptions = <TData = Awaited<ReturnType<typeof incomeControllerFindOne>>, TError = ErrorType<unknown>>(id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getIncomeControllerFindOneQueryKey(id);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof incomeControllerFindOne>>> = ({ signal }) => incomeControllerFindOne(id, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type IncomeControllerFindOneQueryResult = NonNullable<Awaited<ReturnType<typeof incomeControllerFindOne>>>
export type IncomeControllerFindOneQueryError = ErrorType<unknown>


export function useIncomeControllerFindOne<TData = Awaited<ReturnType<typeof incomeControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof incomeControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof incomeControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useIncomeControllerFindOne<TData = Awaited<ReturnType<typeof incomeControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof incomeControllerFindOne>>,
          TError,
          Awaited<ReturnType<typeof incomeControllerFindOne>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useIncomeControllerFindOne<TData = Awaited<ReturnType<typeof incomeControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useIncomeControllerFindOne<TData = Awaited<ReturnType<typeof incomeControllerFindOne>>, TError = ErrorType<unknown>>(
 id: string, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof incomeControllerFindOne>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getIncomeControllerFindOneQueryOptions(id,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getIncomeControllerUpdateUrl = (id: string,) => {




  return `/api/income/${id}`
}

export const incomeControllerUpdate = async (id: string,
    updateIncomeDto: UpdateIncomeDto, options?: RequestInit): Promise<IncomeResponseDto> => {

  return customFetch<IncomeResponseDto>(getIncomeControllerUpdateUrl(id),
  {
    ...options,
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(updateIncomeDto)
  }
);}




export const getIncomeControllerUpdateMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerUpdate>>, TError,{id: string;data: BodyType<UpdateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof incomeControllerUpdate>>, TError,{id: string;data: BodyType<UpdateIncomeDto>}, TContext> => {

const mutationKey = ['incomeControllerUpdate'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof incomeControllerUpdate>>, {id: string;data: BodyType<UpdateIncomeDto>}> = (props) => {
          const {id,data} = props ?? {};

          return  incomeControllerUpdate(id,data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type IncomeControllerUpdateMutationResult = NonNullable<Awaited<ReturnType<typeof incomeControllerUpdate>>>
    export type IncomeControllerUpdateMutationBody = BodyType<UpdateIncomeDto>
    export type IncomeControllerUpdateMutationError = ErrorType<unknown>

    export const useIncomeControllerUpdate = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerUpdate>>, TError,{id: string;data: BodyType<UpdateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof incomeControllerUpdate>>,
        TError,
        {id: string;data: BodyType<UpdateIncomeDto>},
        TContext
      > => {
      return useMutation(getIncomeControllerUpdateMutationOptions(options), queryClient);
    }

export const getIncomeControllerRemoveUrl = (id: string,) => {




  return `/api/income/${id}`
}

export const incomeControllerRemove = async (id: string, options?: RequestInit): Promise<DeleteResponseDto> => {

  return customFetch<DeleteResponseDto>(getIncomeControllerRemoveUrl(id),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getIncomeControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof incomeControllerRemove>>, TError,{id: string}, TContext> => {

const mutationKey = ['incomeControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof incomeControllerRemove>>, {id: string}> = (props) => {
          const {id} = props ?? {};

          return  incomeControllerRemove(id,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type IncomeControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof incomeControllerRemove>>>

    export type IncomeControllerRemoveMutationError = ErrorType<unknown>

    export const useIncomeControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerRemove>>, TError,{id: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof incomeControllerRemove>>,
        TError,
        {id: string},
        TContext
      > => {
      return useMutation(getIncomeControllerRemoveMutationOptions(options), queryClient);
    }

export const getIncomeControllerParseCreditSmsUrl = () => {




  return `/api/income/parse-credit-sms`
}

export const incomeControllerParseCreditSms = async (parseCreditSmsDto: ParseCreditSmsDto, options?: RequestInit): Promise<ParseCreditSmsResponseDto> => {

  return customFetch<ParseCreditSmsResponseDto>(getIncomeControllerParseCreditSmsUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(parseCreditSmsDto)
  }
);}




export const getIncomeControllerParseCreditSmsMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerParseCreditSms>>, TError,{data: BodyType<ParseCreditSmsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof incomeControllerParseCreditSms>>, TError,{data: BodyType<ParseCreditSmsDto>}, TContext> => {

const mutationKey = ['incomeControllerParseCreditSms'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof incomeControllerParseCreditSms>>, {data: BodyType<ParseCreditSmsDto>}> = (props) => {
          const {data} = props ?? {};

          return  incomeControllerParseCreditSms(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type IncomeControllerParseCreditSmsMutationResult = NonNullable<Awaited<ReturnType<typeof incomeControllerParseCreditSms>>>
    export type IncomeControllerParseCreditSmsMutationBody = BodyType<ParseCreditSmsDto>
    export type IncomeControllerParseCreditSmsMutationError = ErrorType<unknown>

    export const useIncomeControllerParseCreditSms = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerParseCreditSms>>, TError,{data: BodyType<ParseCreditSmsDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof incomeControllerParseCreditSms>>,
        TError,
        {data: BodyType<ParseCreditSmsDto>},
        TContext
      > => {
      return useMutation(getIncomeControllerParseCreditSmsMutationOptions(options), queryClient);
    }

export const getIncomeControllerCreateBatchUrl = () => {




  return `/api/income/batch`
}

export const incomeControllerCreateBatch = async (batchCreateIncomeDto: BatchCreateIncomeDto, options?: RequestInit): Promise<BatchCreateIncomeResponseDto> => {

  return customFetch<BatchCreateIncomeResponseDto>(getIncomeControllerCreateBatchUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(batchCreateIncomeDto)
  }
);}




export const getIncomeControllerCreateBatchMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreateBatch>>, TError,{data: BodyType<BatchCreateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreateBatch>>, TError,{data: BodyType<BatchCreateIncomeDto>}, TContext> => {

const mutationKey = ['incomeControllerCreateBatch'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof incomeControllerCreateBatch>>, {data: BodyType<BatchCreateIncomeDto>}> = (props) => {
          const {data} = props ?? {};

          return  incomeControllerCreateBatch(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type IncomeControllerCreateBatchMutationResult = NonNullable<Awaited<ReturnType<typeof incomeControllerCreateBatch>>>
    export type IncomeControllerCreateBatchMutationBody = BodyType<BatchCreateIncomeDto>
    export type IncomeControllerCreateBatchMutationError = ErrorType<unknown>

    export const useIncomeControllerCreateBatch = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof incomeControllerCreateBatch>>, TError,{data: BodyType<BatchCreateIncomeDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof incomeControllerCreateBatch>>,
        TError,
        {data: BodyType<BatchCreateIncomeDto>},
        TContext
      > => {
      return useMutation(getIncomeControllerCreateBatchMutationOptions(options), queryClient);
    }

export const getDashboardControllerGetStatsUrl = () => {




  return `/api/dashboard/stats`
}

export const dashboardControllerGetStats = async ( options?: RequestInit): Promise<DashboardStatsResponseDto> => {

  return customFetch<DashboardStatsResponseDto>(getDashboardControllerGetStatsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetStatsQueryKey = () => {
    return [
    `/api/dashboard/stats`
    ] as const;
    }


export const getDashboardControllerGetStatsQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetStatsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetStats>>> = ({ signal }) => dashboardControllerGetStats({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetStatsQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetStats>>>
export type DashboardControllerGetStatsQueryError = ErrorType<unknown>


export function useDashboardControllerGetStats<TData = Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetStats>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetStats<TData = Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetStats>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetStats>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetStats<TData = Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetStats<TData = Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetStats>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetStatsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getDashboardControllerGetCategoryBreakdownUrl = (params?: DashboardControllerGetCategoryBreakdownParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/dashboard/category-breakdown?${stringifiedParams}` : `/api/dashboard/category-breakdown`
}

export const dashboardControllerGetCategoryBreakdown = async (params?: DashboardControllerGetCategoryBreakdownParams, options?: RequestInit): Promise<CategoryBreakdownResponseDto> => {

  return customFetch<CategoryBreakdownResponseDto>(getDashboardControllerGetCategoryBreakdownUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetCategoryBreakdownQueryKey = (params?: DashboardControllerGetCategoryBreakdownParams,) => {
    return [
    `/api/dashboard/category-breakdown`, ...(params ? [params] : [])
    ] as const;
    }


export const getDashboardControllerGetCategoryBreakdownQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError = ErrorType<unknown>>(params?: DashboardControllerGetCategoryBreakdownParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetCategoryBreakdownQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>> = ({ signal }) => dashboardControllerGetCategoryBreakdown(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetCategoryBreakdownQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>>
export type DashboardControllerGetCategoryBreakdownQueryError = ErrorType<unknown>


export function useDashboardControllerGetCategoryBreakdown<TData = Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError = ErrorType<unknown>>(
 params: undefined |  DashboardControllerGetCategoryBreakdownParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetCategoryBreakdown<TData = Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError = ErrorType<unknown>>(
 params?: DashboardControllerGetCategoryBreakdownParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetCategoryBreakdown<TData = Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError = ErrorType<unknown>>(
 params?: DashboardControllerGetCategoryBreakdownParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetCategoryBreakdown<TData = Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError = ErrorType<unknown>>(
 params?: DashboardControllerGetCategoryBreakdownParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetCategoryBreakdown>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetCategoryBreakdownQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getDashboardControllerGetTrendsUrl = () => {




  return `/api/dashboard/trends`
}

export const dashboardControllerGetTrends = async ( options?: RequestInit): Promise<TrendsResponseDto> => {

  return customFetch<TrendsResponseDto>(getDashboardControllerGetTrendsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetTrendsQueryKey = () => {
    return [
    `/api/dashboard/trends`
    ] as const;
    }


export const getDashboardControllerGetTrendsQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetTrendsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetTrends>>> = ({ signal }) => dashboardControllerGetTrends({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetTrendsQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetTrends>>>
export type DashboardControllerGetTrendsQueryError = ErrorType<unknown>


export function useDashboardControllerGetTrends<TData = Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetTrends>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetTrends>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetTrends<TData = Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetTrends>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetTrends>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetTrends<TData = Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetTrends<TData = Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetTrends>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetTrendsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getDashboardControllerGetSplitUrl = () => {




  return `/api/dashboard/split`
}

export const dashboardControllerGetSplit = async ( options?: RequestInit): Promise<SplitResponseDto> => {

  return customFetch<SplitResponseDto>(getDashboardControllerGetSplitUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getDashboardControllerGetSplitQueryKey = () => {
    return [
    `/api/dashboard/split`
    ] as const;
    }


export const getDashboardControllerGetSplitQueryOptions = <TData = Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getDashboardControllerGetSplitQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof dashboardControllerGetSplit>>> = ({ signal }) => dashboardControllerGetSplit({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type DashboardControllerGetSplitQueryResult = NonNullable<Awaited<ReturnType<typeof dashboardControllerGetSplit>>>
export type DashboardControllerGetSplitQueryError = ErrorType<unknown>


export function useDashboardControllerGetSplit<TData = Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetSplit>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetSplit>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetSplit<TData = Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof dashboardControllerGetSplit>>,
          TError,
          Awaited<ReturnType<typeof dashboardControllerGetSplit>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useDashboardControllerGetSplit<TData = Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useDashboardControllerGetSplit<TData = Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof dashboardControllerGetSplit>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getDashboardControllerGetSplitQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAiControllerChatUrl = () => {




  return `/api/ai/chat`
}

export const aiControllerChat = async (chatRequestDto: ChatRequestDto, options?: RequestInit): Promise<ChatResponseDto> => {

  return customFetch<ChatResponseDto>(getAiControllerChatUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(chatRequestDto)
  }
);}




export const getAiControllerChatMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof aiControllerChat>>, TError,{data: BodyType<ChatRequestDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof aiControllerChat>>, TError,{data: BodyType<ChatRequestDto>}, TContext> => {

const mutationKey = ['aiControllerChat'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof aiControllerChat>>, {data: BodyType<ChatRequestDto>}> = (props) => {
          const {data} = props ?? {};

          return  aiControllerChat(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type AiControllerChatMutationResult = NonNullable<Awaited<ReturnType<typeof aiControllerChat>>>
    export type AiControllerChatMutationBody = BodyType<ChatRequestDto>
    export type AiControllerChatMutationError = ErrorType<unknown>

    export const useAiControllerChat = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof aiControllerChat>>, TError,{data: BodyType<ChatRequestDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof aiControllerChat>>,
        TError,
        {data: BodyType<ChatRequestDto>},
        TContext
      > => {
      return useMutation(getAiControllerChatMutationOptions(options), queryClient);
    }

export const getAiControllerGetConversationsUrl = () => {




  return `/api/ai/conversations`
}

export const aiControllerGetConversations = async ( options?: RequestInit): Promise<ConversationListResponseDto> => {

  return customFetch<ConversationListResponseDto>(getAiControllerGetConversationsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAiControllerGetConversationsQueryKey = () => {
    return [
    `/api/ai/conversations`
    ] as const;
    }


export const getAiControllerGetConversationsQueryOptions = <TData = Awaited<ReturnType<typeof aiControllerGetConversations>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAiControllerGetConversationsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof aiControllerGetConversations>>> = ({ signal }) => aiControllerGetConversations({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AiControllerGetConversationsQueryResult = NonNullable<Awaited<ReturnType<typeof aiControllerGetConversations>>>
export type AiControllerGetConversationsQueryError = ErrorType<unknown>


export function useAiControllerGetConversations<TData = Awaited<ReturnType<typeof aiControllerGetConversations>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetConversations>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetConversations>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetConversations<TData = Awaited<ReturnType<typeof aiControllerGetConversations>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetConversations>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetConversations>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetConversations<TData = Awaited<ReturnType<typeof aiControllerGetConversations>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAiControllerGetConversations<TData = Awaited<ReturnType<typeof aiControllerGetConversations>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetConversations>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAiControllerGetConversationsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAiControllerGetMessagesUrl = (id: string,
    params?: AiControllerGetMessagesParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/ai/conversations/${id}/messages?${stringifiedParams}` : `/api/ai/conversations/${id}/messages`
}

export const aiControllerGetMessages = async (id: string,
    params?: AiControllerGetMessagesParams, options?: RequestInit): Promise<MessageListResponseDto> => {

  return customFetch<MessageListResponseDto>(getAiControllerGetMessagesUrl(id,params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAiControllerGetMessagesQueryKey = (id: string,
    params?: AiControllerGetMessagesParams,) => {
    return [
    `/api/ai/conversations/${id}/messages`, ...(params ? [params] : [])
    ] as const;
    }


export const getAiControllerGetMessagesQueryOptions = <TData = Awaited<ReturnType<typeof aiControllerGetMessages>>, TError = ErrorType<unknown>>(id: string,
    params?: AiControllerGetMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAiControllerGetMessagesQueryKey(id,params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof aiControllerGetMessages>>> = ({ signal }) => aiControllerGetMessages(id,params, { signal, ...requestOptions });





   return  { queryKey, queryFn, enabled: id !== null && id !== undefined, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AiControllerGetMessagesQueryResult = NonNullable<Awaited<ReturnType<typeof aiControllerGetMessages>>>
export type AiControllerGetMessagesQueryError = ErrorType<unknown>


export function useAiControllerGetMessages<TData = Awaited<ReturnType<typeof aiControllerGetMessages>>, TError = ErrorType<unknown>>(
 id: string,
    params: undefined |  AiControllerGetMessagesParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetMessages>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetMessages>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetMessages<TData = Awaited<ReturnType<typeof aiControllerGetMessages>>, TError = ErrorType<unknown>>(
 id: string,
    params?: AiControllerGetMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetMessages>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetMessages>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetMessages<TData = Awaited<ReturnType<typeof aiControllerGetMessages>>, TError = ErrorType<unknown>>(
 id: string,
    params?: AiControllerGetMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAiControllerGetMessages<TData = Awaited<ReturnType<typeof aiControllerGetMessages>>, TError = ErrorType<unknown>>(
 id: string,
    params?: AiControllerGetMessagesParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetMessages>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAiControllerGetMessagesQueryOptions(id,params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getAiControllerGetSuggestionsUrl = () => {




  return `/api/ai/suggestions`
}

export const aiControllerGetSuggestions = async ( options?: RequestInit): Promise<SuggestionsResponseDto> => {

  return customFetch<SuggestionsResponseDto>(getAiControllerGetSuggestionsUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getAiControllerGetSuggestionsQueryKey = () => {
    return [
    `/api/ai/suggestions`
    ] as const;
    }


export const getAiControllerGetSuggestionsQueryOptions = <TData = Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getAiControllerGetSuggestionsQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof aiControllerGetSuggestions>>> = ({ signal }) => aiControllerGetSuggestions({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type AiControllerGetSuggestionsQueryResult = NonNullable<Awaited<ReturnType<typeof aiControllerGetSuggestions>>>
export type AiControllerGetSuggestionsQueryError = ErrorType<unknown>


export function useAiControllerGetSuggestions<TData = Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetSuggestions>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetSuggestions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetSuggestions<TData = Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof aiControllerGetSuggestions>>,
          TError,
          Awaited<ReturnType<typeof aiControllerGetSuggestions>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useAiControllerGetSuggestions<TData = Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useAiControllerGetSuggestions<TData = Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof aiControllerGetSuggestions>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getAiControllerGetSuggestionsQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUserControllerGetPlanUrl = () => {




  return `/api/user/plan`
}

export const userControllerGetPlan = async ( options?: RequestInit): Promise<PlanResponseDto> => {

  return customFetch<PlanResponseDto>(getUserControllerGetPlanUrl(),
  {
    ...options,
    method: 'GET'


  }
);}





export const getUserControllerGetPlanQueryKey = () => {
    return [
    `/api/user/plan`
    ] as const;
    }


export const getUserControllerGetPlanQueryOptions = <TData = Awaited<ReturnType<typeof userControllerGetPlan>>, TError = ErrorType<unknown>>( options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getUserControllerGetPlanQueryKey();



    const queryFn: QueryFunction<Awaited<ReturnType<typeof userControllerGetPlan>>> = ({ signal }) => userControllerGetPlan({ signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type UserControllerGetPlanQueryResult = NonNullable<Awaited<ReturnType<typeof userControllerGetPlan>>>
export type UserControllerGetPlanQueryError = ErrorType<unknown>


export function useUserControllerGetPlan<TData = Awaited<ReturnType<typeof userControllerGetPlan>>, TError = ErrorType<unknown>>(
  options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerGetPlan>>,
          TError,
          Awaited<ReturnType<typeof userControllerGetPlan>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserControllerGetPlan<TData = Awaited<ReturnType<typeof userControllerGetPlan>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof userControllerGetPlan>>,
          TError,
          Awaited<ReturnType<typeof userControllerGetPlan>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useUserControllerGetPlan<TData = Awaited<ReturnType<typeof userControllerGetPlan>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useUserControllerGetPlan<TData = Awaited<ReturnType<typeof userControllerGetPlan>>, TError = ErrorType<unknown>>(
  options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof userControllerGetPlan>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getUserControllerGetPlanQueryOptions(options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getUserControllerSetMonthlyLimitUrl = () => {




  return `/api/user/monthly-limit`
}

export const userControllerSetMonthlyLimit = async (setMonthlyLimitDto: SetMonthlyLimitDto, options?: RequestInit): Promise<MonthlyLimitResponseDto> => {

  return customFetch<MonthlyLimitResponseDto>(getUserControllerSetMonthlyLimitUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(setMonthlyLimitDto)
  }
);}




export const getUserControllerSetMonthlyLimitMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>, TError,{data: BodyType<SetMonthlyLimitDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>, TError,{data: BodyType<SetMonthlyLimitDto>}, TContext> => {

const mutationKey = ['userControllerSetMonthlyLimit'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>, {data: BodyType<SetMonthlyLimitDto>}> = (props) => {
          const {data} = props ?? {};

          return  userControllerSetMonthlyLimit(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserControllerSetMonthlyLimitMutationResult = NonNullable<Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>>
    export type UserControllerSetMonthlyLimitMutationBody = BodyType<SetMonthlyLimitDto>
    export type UserControllerSetMonthlyLimitMutationError = ErrorType<unknown>

    export const useUserControllerSetMonthlyLimit = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>, TError,{data: BodyType<SetMonthlyLimitDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userControllerSetMonthlyLimit>>,
        TError,
        {data: BodyType<SetMonthlyLimitDto>},
        TContext
      > => {
      return useMutation(getUserControllerSetMonthlyLimitMutationOptions(options), queryClient);
    }

export const getUserControllerUpgradeUrl = () => {




  return `/api/user/upgrade`
}

export const userControllerUpgrade = async ( options?: RequestInit): Promise<UpgradeResponseDto> => {

  return customFetch<UpgradeResponseDto>(getUserControllerUpgradeUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getUserControllerUpgradeMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userControllerUpgrade>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof userControllerUpgrade>>, TError,void, TContext> => {

const mutationKey = ['userControllerUpgrade'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof userControllerUpgrade>>, void> = () => {


          return  userControllerUpgrade(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type UserControllerUpgradeMutationResult = NonNullable<Awaited<ReturnType<typeof userControllerUpgrade>>>

    export type UserControllerUpgradeMutationError = ErrorType<unknown>

    export const useUserControllerUpgrade = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof userControllerUpgrade>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof userControllerUpgrade>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getUserControllerUpgradeMutationOptions(options), queryClient);
    }

export const getExportControllerExportCsvUrl = (params?: ExportControllerExportCsvParams,) => {
  const normalizedParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {

    if (value !== undefined) {
      normalizedParams.append(key, value === null ? 'null' : String(value))
    }
  });

  const stringifiedParams = normalizedParams.toString();

  return stringifiedParams.length > 0 ? `/api/export/csv?${stringifiedParams}` : `/api/export/csv`
}

export const exportControllerExportCsv = async (params?: ExportControllerExportCsvParams, options?: RequestInit): Promise<void> => {

  return customFetch<void>(getExportControllerExportCsvUrl(params),
  {
    ...options,
    method: 'GET'


  }
);}





export const getExportControllerExportCsvQueryKey = (params?: ExportControllerExportCsvParams,) => {
    return [
    `/api/export/csv`, ...(params ? [params] : [])
    ] as const;
    }


export const getExportControllerExportCsvQueryOptions = <TData = Awaited<ReturnType<typeof exportControllerExportCsv>>, TError = ErrorType<unknown>>(params?: ExportControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
) => {

const {query: queryOptions, request: requestOptions} = options ?? {};

  const queryKey =  queryOptions?.queryKey ?? getExportControllerExportCsvQueryKey(params);



    const queryFn: QueryFunction<Awaited<ReturnType<typeof exportControllerExportCsv>>> = ({ signal }) => exportControllerExportCsv(params, { signal, ...requestOptions });





   return  { queryKey, queryFn, ...queryOptions} as UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData> & { queryKey: DataTag<QueryKey, TData, TError> }
}

export type ExportControllerExportCsvQueryResult = NonNullable<Awaited<ReturnType<typeof exportControllerExportCsv>>>
export type ExportControllerExportCsvQueryError = ErrorType<unknown>


export function useExportControllerExportCsv<TData = Awaited<ReturnType<typeof exportControllerExportCsv>>, TError = ErrorType<unknown>>(
 params: undefined |  ExportControllerExportCsvParams, options: { query:Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData>> & Pick<
        DefinedInitialDataOptions<
          Awaited<ReturnType<typeof exportControllerExportCsv>>,
          TError,
          Awaited<ReturnType<typeof exportControllerExportCsv>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  DefinedUseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExportControllerExportCsv<TData = Awaited<ReturnType<typeof exportControllerExportCsv>>, TError = ErrorType<unknown>>(
 params?: ExportControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData>> & Pick<
        UndefinedInitialDataOptions<
          Awaited<ReturnType<typeof exportControllerExportCsv>>,
          TError,
          Awaited<ReturnType<typeof exportControllerExportCsv>>
        > , 'initialData'
      >, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }
export function useExportControllerExportCsv<TData = Awaited<ReturnType<typeof exportControllerExportCsv>>, TError = ErrorType<unknown>>(
 params?: ExportControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
  ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> }

export function useExportControllerExportCsv<TData = Awaited<ReturnType<typeof exportControllerExportCsv>>, TError = ErrorType<unknown>>(
 params?: ExportControllerExportCsvParams, options?: { query?:Partial<UseQueryOptions<Awaited<ReturnType<typeof exportControllerExportCsv>>, TError, TData>>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient
 ):  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> } {

  const queryOptions = getExportControllerExportCsvQueryOptions(params,options)

  const query = useQuery(queryOptions, queryClient) as  UseQueryResult<TData, TError> & { queryKey: DataTag<QueryKey, TData, TError> };

  return { ...query, queryKey: queryOptions.queryKey };
}







export const getPushTokensControllerRegisterUrl = () => {




  return `/api/push-tokens`
}

export const pushTokensControllerRegister = async (createPushTokenDto: CreatePushTokenDto, options?: RequestInit): Promise<PushTokenResponseDto> => {

  return customFetch<PushTokenResponseDto>(getPushTokensControllerRegisterUrl(),
  {
    ...options,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...options?.headers },
    body: JSON.stringify(createPushTokenDto)
  }
);}




export const getPushTokensControllerRegisterMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRegister>>, TError,{data: BodyType<CreatePushTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRegister>>, TError,{data: BodyType<CreatePushTokenDto>}, TContext> => {

const mutationKey = ['pushTokensControllerRegister'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pushTokensControllerRegister>>, {data: BodyType<CreatePushTokenDto>}> = (props) => {
          const {data} = props ?? {};

          return  pushTokensControllerRegister(data,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PushTokensControllerRegisterMutationResult = NonNullable<Awaited<ReturnType<typeof pushTokensControllerRegister>>>
    export type PushTokensControllerRegisterMutationBody = BodyType<CreatePushTokenDto>
    export type PushTokensControllerRegisterMutationError = ErrorType<unknown>

    export const usePushTokensControllerRegister = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRegister>>, TError,{data: BodyType<CreatePushTokenDto>}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pushTokensControllerRegister>>,
        TError,
        {data: BodyType<CreatePushTokenDto>},
        TContext
      > => {
      return useMutation(getPushTokensControllerRegisterMutationOptions(options), queryClient);
    }

export const getPushTokensControllerRemoveUrl = (token: string,) => {




  return `/api/push-tokens/${token}`
}

export const pushTokensControllerRemove = async (token: string, options?: RequestInit): Promise<PushTokenResponseDto> => {

  return customFetch<PushTokenResponseDto>(getPushTokensControllerRemoveUrl(token),
  {
    ...options,
    method: 'DELETE'


  }
);}




export const getPushTokensControllerRemoveMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRemove>>, TError,{token: string}, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRemove>>, TError,{token: string}, TContext> => {

const mutationKey = ['pushTokensControllerRemove'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof pushTokensControllerRemove>>, {token: string}> = (props) => {
          const {token} = props ?? {};

          return  pushTokensControllerRemove(token,requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type PushTokensControllerRemoveMutationResult = NonNullable<Awaited<ReturnType<typeof pushTokensControllerRemove>>>

    export type PushTokensControllerRemoveMutationError = ErrorType<unknown>

    export const usePushTokensControllerRemove = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof pushTokensControllerRemove>>, TError,{token: string}, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof pushTokensControllerRemove>>,
        TError,
        {token: string},
        TContext
      > => {
      return useMutation(getPushTokensControllerRemoveMutationOptions(options), queryClient);
    }

export const getNotificationsControllerSendInactivityRemindersUrl = () => {




  return `/api/notifications/send-inactivity-reminders`
}

export const notificationsControllerSendInactivityReminders = async ( options?: RequestInit): Promise<InactivityReminderResponseDto> => {

  return customFetch<InactivityReminderResponseDto>(getNotificationsControllerSendInactivityRemindersUrl(),
  {
    ...options,
    method: 'POST'


  }
);}




export const getNotificationsControllerSendInactivityRemindersMutationOptions = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
): UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>, TError,void, TContext> => {

const mutationKey = ['notificationsControllerSendInactivityReminders'];
const {mutation: mutationOptions, request: requestOptions} = options ?
      options.mutation && 'mutationKey' in options.mutation && options.mutation.mutationKey ?
      options
      : {...options, mutation: {...options.mutation, mutationKey}}
      : {mutation: { mutationKey, }, request: undefined};




      const mutationFn: MutationFunction<Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>, void> = () => {


          return  notificationsControllerSendInactivityReminders(requestOptions)
        }






  return  { mutationFn, ...mutationOptions }}

    export type NotificationsControllerSendInactivityRemindersMutationResult = NonNullable<Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>>

    export type NotificationsControllerSendInactivityRemindersMutationError = ErrorType<unknown>

    export const useNotificationsControllerSendInactivityReminders = <TError = ErrorType<unknown>,
    TContext = unknown>(options?: { mutation?:UseMutationOptions<Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>, TError,void, TContext>, request?: SecondParameter<typeof customFetch>}
 , queryClient?: QueryClient): UseMutationResult<
        Awaited<ReturnType<typeof notificationsControllerSendInactivityReminders>>,
        TError,
        void,
        TContext
      > => {
      return useMutation(getNotificationsControllerSendInactivityRemindersMutationOptions(options), queryClient);
    }

