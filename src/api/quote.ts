import { type Quote } from "../types/quote";

type GetQuoteResponse = { quote: Quote } | { error: string };
type PatchQuoteResponse =
  | { quote: Quote }
  | { errors: Record<string, string[]> }
  | { error: string };
type PostQuoteResponse =
  | { quoteId: string; totalPremiumCents: number; term: string }
  | { errors: Record<string, string[]> }
  | { error: string };

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

export async function getQuote(): Promise<Quote | null> {
  const res = await fetch(`${BASE_URL}/quote`, { method: "GET" });
  const data = (await res.json()) as GetQuoteResponse;

  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Failed to fetch quote");

  if ("quote" in data) return data.quote;
  throw new Error("Unexpected response");
}

export async function patchQuote(payload: Partial<Quote>): Promise<Quote> {
  const res = await fetch(`${BASE_URL}/quote`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = (await res.json()) as PatchQuoteResponse;

  if (res.status === 422 && "errors" in data) {
    const err = new Error("Validation failed");
    (err as any).validationErrors = data.errors;
    throw err;
  }

  if (!res.ok) throw new Error("Failed to update quote");
  if ("quote" in data) return data.quote;

  throw new Error("Unexpected response");
}

export async function submitQuote(quote: Quote): Promise<{
  quoteId: string;
  totalPremiumCents: number;
  term: string;
}> {
  const res = await fetch(`${BASE_URL}/quote`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(quote),
  });

  const data = (await res.json()) as PostQuoteResponse;

  if (res.status === 422 && "errors" in data) {
    const err = new Error("Validation failed");
    (err as any).validationErrors = data.errors;
    throw err;
  }

  if (!res.ok) throw new Error("Failed to submit quote");

  if ("quoteId" in data) {
    return {
      quoteId: data.quoteId,
      totalPremiumCents: data.totalPremiumCents,
      term: data.term,
    };
  }

  throw new Error("Unexpected response");
}

export async function deleteQuote(): Promise<void> {
  const res = await fetch(`${BASE_URL}/quote`, {
    method: "DELETE",
  });

  if (!res.ok) throw new Error("Failed to delete quote");
}
