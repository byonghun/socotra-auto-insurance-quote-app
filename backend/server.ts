import express from "express";
import cors from "cors";
import { promises as fs } from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { z } from "zod";
import type {
  QuoteRequest,
  PricingResponse,
  ValidationErrors,
} from "./types.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;
const DATA_FILE = path.join(__dirname, "data", "quotes.json");

app.use(cors());
app.use(express.json());

const US_STATES = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
  "DC",
] as const;

const LIABILITY_LIMITS = [
  "100/300",
  "250/500",
  "500/1000",
  "1000/2000",
] as const;

const COLLISION_DEDUCTIBLES = ["25000", "50000", "100000", "250000"] as const;

const COVERAGE_TYPES = [
  "liability_only",
  "standard_coverage",
  "full_coverage",
] as const;

const quoteSchema = z.object({
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.email(),
  phoneNumber: z
    .string()
    .refine(
      (phone) =>
        /^[\d\s\-()]+$/.test(phone) && phone.replace(/\D/g, "").length >= 10
    ),
  dob: z.coerce
    .date()
    .min(new Date(new Date().setFullYear(new Date().getFullYear() - 100)), {
      message: "Must be less than 100 years old",
    })
    .max(new Date(new Date().setFullYear(new Date().getFullYear() - 16)), {
      message: "Must be at least 16 years old",
    }),
  address: z.string().min(1),
  city: z.string().min(1),
  state: z.enum(US_STATES),
  zipCode: z.string().regex(/^\d{5}$/),
  vehicleYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() + 1),
  vehicleMake: z.string().min(1),
  vehicleModel: z.string().min(1),
  vehicleVin: z.string().regex(/^[A-HJ-NPR-Z0-9]{17}$/i),
  coverageType: z.enum(COVERAGE_TYPES),
  liabilityLimits: z.enum(LIABILITY_LIMITS),
  collisionDeductibleInCents: z.enum(COLLISION_DEDUCTIBLES),
});

async function ensureDataDir() {
  const dataDir = path.dirname(DATA_FILE);
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

async function readQuote(): Promise<Partial<QuoteRequest> | null> {
  try {
    const data = await fs.readFile(DATA_FILE, "utf-8");
    const parsed = JSON.parse(data);
    return parsed.quote || null;
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "ENOENT"
    ) {
      return null;
    }
    throw error;
  }
}

async function writeQuote(quote: Partial<QuoteRequest>): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(DATA_FILE, JSON.stringify({ quote }, null, 2), "utf-8");
}

async function deleteQuote(): Promise<void> {
  try {
    await fs.unlink(DATA_FILE);
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code !== "ENOENT"
    ) {
      throw error;
    }
  }
}
function validateQuote(
  quote: Partial<QuoteRequest>,
  isComplete = false
): ValidationErrors | null {
  const schema = isComplete ? quoteSchema : quoteSchema.partial();
  const result = schema.safeParse(quote);

  if (result.success) {
    return null;
  }

  const errors: Record<string, string[]> = {};
  for (const issue of result.error.issues) {
    const path = issue.path.join(".");
    if (!errors[path]) {
      errors[path] = [];
    }
    const receivedValue =
      issue.path.length > 0
        ? quote[issue.path[0] as keyof typeof quote]
        : undefined;
    const errorMessage =
      receivedValue !== undefined
        ? `${issue.message} (received: ${JSON.stringify(receivedValue)})`
        : issue.message;
    errors[path].push(errorMessage);
  }

  return { errors };
}

function calculatePricing(quote: QuoteRequest): PricingResponse {
  const baseLiabilityRate = 5000;
  const baseCollisionRate = 8000;
  const baseComprehensiveRate = 3000;

  const currentYear = new Date().getFullYear();
  const vehicleAge = currentYear - quote.vehicleYear;
  const vehicleMultiplier = Math.max(0.5, 1 + vehicleAge * -0.02);

  let liabilityCoverageCents = baseLiabilityRate;
  const liabilityLimits = quote.liabilityLimits;
  if (liabilityLimits === "100/300") {
    liabilityCoverageCents = baseLiabilityRate * 1.0;
  } else if (liabilityLimits === "250/500") {
    liabilityCoverageCents = baseLiabilityRate * 1.5;
  } else if (liabilityLimits === "500/1000") {
    liabilityCoverageCents = baseLiabilityRate * 2.0;
  } else if (liabilityLimits === "1000/2000") {
    liabilityCoverageCents = baseLiabilityRate * 2.5;
  }

  let collisionCoverageCents = 0;
  if (
    quote.coverageType === "standard_coverage" ||
    quote.coverageType === "full_coverage"
  ) {
    collisionCoverageCents = baseCollisionRate * vehicleMultiplier;
    const deductibleMultiplier =
      1000 / Math.max(Number(quote.collisionDeductibleInCents) / 100, 250);
    collisionCoverageCents = Math.round(
      collisionCoverageCents * deductibleMultiplier
    );
  }

  let comprehensiveCoverageCents = 0;
  if (quote.coverageType === "full_coverage") {
    comprehensiveCoverageCents = Math.round(
      baseComprehensiveRate * vehicleMultiplier
    );
  }

  return {
    liabilityCoverageCents: Math.round(liabilityCoverageCents),
    collisionCoverageCents: Math.round(collisionCoverageCents),
    comprehensiveCoverageCents: Math.round(comprehensiveCoverageCents),
  };
}
app.patch("/quote", async (req, res) => {
  try {
    const partialSchema = quoteSchema.partial();
    const result = partialSchema.safeParse(req.body);

    if (!result.success) {
      const errors: Record<string, string[]> = {};
      for (const issue of result.error.issues) {
        const path = issue.path.join(".");
        if (!errors[path]) {
          errors[path] = [];
        }
        const receivedValue =
          issue.path.length > 0 ? req.body[issue.path[0]] : undefined;
        const errorMessage =
          receivedValue !== undefined
            ? `${issue.message} (received: ${JSON.stringify(receivedValue)})`
            : issue.message;
        errors[path].push(errorMessage);
      }
      return res.status(422).json({ errors });
    }

    const existingQuote = await readQuote();
    const updatedQuote = { ...existingQuote, ...req.body };

    const validationErrors = validateQuote(updatedQuote);
    if (validationErrors) {
      return res.status(422).json(validationErrors);
    }

    await writeQuote(updatedQuote);
    res.status(200).json({ quote: updatedQuote });
  } catch (error) {
    console.error("Error updating quote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/quote", async (req, res) => {
  try {
    const quote = await readQuote();
    if (!quote) {
      return res.status(404).json({ error: "No quote found" });
    }
    res.status(200).json({ quote });
  } catch (error) {
    console.error("Error reading quote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/quote", async (req, res) => {
  try {
    const quote = req.body as QuoteRequest;

    const validationErrors = validateQuote(quote, true);
    if (validationErrors) {
      return res.status(422).json(validationErrors);
    }

    const pricing = calculatePricing(quote);
    const totalPremiumCents =
      pricing.liabilityCoverageCents +
      pricing.collisionCoverageCents +
      pricing.comprehensiveCoverageCents;

    const quoteId = `quote-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    res.status(200).json({
      quoteId,
      totalPremiumCents,
      term: "monthly",
    });
  } catch (error) {
    console.error("Error submitting quote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.delete("/quote", async (req, res) => {
  try {
    await deleteQuote();
    res.status(200).json({ message: "Quote reset successfully" });
  } catch (error) {
    console.error("Error deleting quote:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
