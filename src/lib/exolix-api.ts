import axios from "axios";

export interface ExchangeDataInterface {
  amount_from: string;
  amount_to: string;
  coin_from: string;
  coin_to: string;
  created_at: number;
  deposit_address: string;
  deposit_extra: string | null;
  destination_address: string;
  destination_extra: string | null;
  hash_in: string | null;
  hash_in_link: string | null;
  hash_out: string | null;
  hash_out_link: string | null;
  id: string;
  message: string | null;
  rate: string;
  status: string;
}

interface CurrenciesInterface {
  status: number;
  label: string;
  code: string;
}

const api = axios.create({ baseURL: "https://exolix.com/api" });

export const getCurrencies = async () => {
  return api.get<CurrenciesInterface[]>("/currency").then((r) => r.data);
};

export const getRate = async (data: {
  coin_from: string;
  coin_to: string;
  deposit_amount: number;
}) => {
  return api.post("/rate", data).then((r) => r.data);
};

export const submitExchange = async (data: {
  coin_from: string;
  coin_to: string;
  deposit_amount: number;
  destination_address: string;
  destination_extra: string;
}) => {
  return api.post("/exchange", data).then((r) => r.data);
};

export const getExchangeData = async (exchangeId: string) => {
  return api
    .get<ExchangeDataInterface>(`/exchange/${exchangeId}`)
    .then((r) => r.data);
};