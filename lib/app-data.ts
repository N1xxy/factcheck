import { cache } from "react";

import {
  commonPolicies as mockCommonPolicies,
  parties as mockParties,
  partyPositions as mockPartyPositions,
  policyAreas as mockPolicyAreas,
  policyEvidence as mockPolicyEvidence,
  type CommonPolicy,
  type EvidenceSource,
  type Party,
  type PartyPosition,
  type PolicyArea,
  type PolicyEvidence,
} from "@/lib/data";
import { supabase } from "@/lib/supabase";

export type AppData = {
  policyAreas: PolicyArea[];
  parties: Party[];
  commonPolicies: CommonPolicy[];
  partyPositions: PartyPosition[];
  policyEvidence: PolicyEvidence[];
};

type PartyRow = {
  party_slug: string;
  party_name: string;
  short_name: string;
  color_hex: string | null;
};

type SphereRow = {
  sphere_slug: string;
  sphere_name: string;
  description: string | null;
};

type CommonPolicyRow = {
  policy_slug: string;
  sphere_slug: string;
  title: string;
  opinion_statement: string;
};

type PartyPositionRow = {
  party_slug: string;
  policy_slug: string;
  support_level: number;
  reasoning: string | null;
  source_url: string | null;
  source_title: string | null;
};

type PolicyCheckRow = {
  check_slug: string;
  party_slug: string;
  sphere_slug: string;
  policy_slug: string | null;
  title: string;
  comparison_signal: PolicyEvidence["comparisonSignal"];
};

type ClaimRow = {
  check_slug: string;
  claim_text: string;
  source_url: string | null;
  source_title: string | null;
  source_date: string | null;
};

type ActionRow = {
  check_slug: string;
  action_text: string;
  source_url: string | null;
  source_title: string | null;
  source_date: string | null;
};

const mockData: AppData = {
  policyAreas: mockPolicyAreas,
  parties: mockParties,
  commonPolicies: mockCommonPolicies,
  partyPositions: mockPartyPositions,
  policyEvidence: mockPolicyEvidence,
};

type SupabaseFetchError = {
  message?: string;
  details?: string;
  hint?: string;
  code?: string;
  name?: string;
};

function describeSupabaseError(error: unknown): SupabaseFetchError {
  if (!error || typeof error !== "object") {
    return { message: String(error) };
  }

  const {
    code,
    details,
    hint,
    message,
    name,
  } = error as SupabaseFetchError;

  return {
    ...(name ? { name } : {}),
    ...(code ? { code } : {}),
    ...(message ? { message } : {}),
    ...(details ? { details } : {}),
    ...(hint ? { hint } : {}),
  };
}

function warnAboutSupabaseFallback(error: unknown) {
  if (process.env.NODE_ENV === "production") {
    return;
  }

  console.warn(
    "Supabase data fetch failed; using mock data instead.",
    describeSupabaseError(error),
  );
}

function isFulfilled<T>(
  result: PromiseSettledResult<T>,
): result is PromiseFulfilledResult<T> {
  return result.status === "fulfilled";
}

const partyVisuals: Record<
  string,
  Pick<
    Party,
    "description" | "gradientClass" | "accentClass" | "softClass" | "ringClass"
  >
> = {
  db: {
    description:
      "Профил с фокус върху институционална реформа, дигитализация, образование и евроатлантическа ориентация.",
    gradientClass: "from-[#00a86b] via-[#0b78be] to-[#ffd43b]",
    accentClass: "text-emerald-800",
    softClass: "bg-emerald-50",
    ringClass: "border-emerald-200",
  },
  pp: {
    description:
      "Профил с фокус върху антикорупция, бюджетна политика, образование и евроатлантическа ориентация.",
    gradientClass: "from-[#0b78be] via-cyan-500 to-[#00a86b]",
    accentClass: "text-sky-800",
    softClass: "bg-sky-50",
    ringClass: "border-sky-200",
  },
};

function fallbackPartyVisuals(slug: string) {
  return (
    partyVisuals[slug] ?? {
      description: "Партиен профил с позиции, проверки и източници.",
      gradientClass: "from-slate-700 to-slate-500",
      accentClass: "text-slate-700",
      softClass: "bg-slate-100",
      ringClass: "border-slate-300",
    }
  );
}

function sourceFrom(
  url: string | null,
  title: string | null,
  date?: string | null,
): EvidenceSource | undefined {
  if (!url) {
    return undefined;
  }

  try {
    const parsedUrl = new URL(url);
    const hasSpecificPath = parsedUrl.pathname.replaceAll("/", "").length > 0;

    if (parsedUrl.hostname === "example.com") {
      return undefined;
    }

    if (!title && !hasSpecificPath) {
      return undefined;
    }
  } catch {
    return undefined;
  }

  const labelParts = [title || "Източник", date].filter(Boolean);

  return {
    label: labelParts.join(" · "),
    url,
  };
}

function hasUsableSource(source: EvidenceSource | undefined) {
  return Boolean(source && source.url !== "#");
}

const signalCorrections: Partial<
  Record<string, PolicyEvidence["comparisonSignal"]>
> = {
  "db-budget-transparency": "matches",
};

function getComparisonSignal({
  actionSources,
  check,
  claimSources,
}: {
  actionSources: Array<EvidenceSource | undefined>;
  check: PolicyCheckRow;
  claimSources: Array<EvidenceSource | undefined>;
}) {
  const hasMissingClaimSource =
    claimSources.length === 0 || claimSources.some((source) => !hasUsableSource(source));
  const hasMissingActionSource =
    actionSources.length === 0 ||
    actionSources.some((source) => !hasUsableSource(source));

  if (hasMissingClaimSource || hasMissingActionSource) {
    return "insufficient_data";
  }

  return signalCorrections[check.check_slug] ?? check.comparison_signal;
}

function mapSupabaseRows({
  partyRows,
  sphereRows,
  commonPolicyRows,
  partyPositionRows,
  policyCheckRows,
  claimRows,
  actionRows,
}: {
  partyRows: PartyRow[];
  sphereRows: SphereRow[];
  commonPolicyRows: CommonPolicyRow[];
  partyPositionRows: PartyPositionRow[];
  policyCheckRows: PolicyCheckRow[];
  claimRows: ClaimRow[];
  actionRows: ActionRow[];
}): AppData {
  const policyAreas = sphereRows.map((area) => ({
    slug: area.sphere_slug,
    name: area.sphere_name,
    description: area.description || "Сфера за сравнение на партийни позиции.",
  }));

  const parties = partyRows.map((party) => {
    const visuals = fallbackPartyVisuals(party.party_slug);

    return {
      slug: party.party_slug,
      name: party.party_name,
      shortName: party.short_name,
      logoMark: party.short_name,
      primaryColor: party.color_hex || "#64748b",
      ...visuals,
    };
  });

  const commonPolicies = commonPolicyRows.map((policy) => ({
    id: policy.policy_slug,
    areaSlug: policy.sphere_slug,
    title: policy.title,
    question: policy.opinion_statement,
    description: policy.opinion_statement,
  }));

  const partyPositions = partyPositionRows.map((position) => ({
    partySlug: position.party_slug,
    commonPolicyId: position.policy_slug,
    supportLevel: Number(position.support_level),
    reasoning: position.reasoning || "Няма добавено обяснение.",
    source: sourceFrom(position.source_url, position.source_title),
  }));

  const claimsByCheck = new Map<string, ClaimRow[]>();
  for (const claim of claimRows) {
    claimsByCheck.set(claim.check_slug, [
      ...(claimsByCheck.get(claim.check_slug) || []),
      claim,
    ]);
  }

  const actionsByCheck = new Map<string, ActionRow[]>();
  for (const action of actionRows) {
    actionsByCheck.set(action.check_slug, [
      ...(actionsByCheck.get(action.check_slug) || []),
      action,
    ]);
  }

  const policyEvidence = policyCheckRows.map((check) => {
    const claims = (claimsByCheck.get(check.check_slug) || []).map((claim) => ({
      text: claim.claim_text,
      source: sourceFrom(claim.source_url, claim.source_title, claim.source_date),
    }));
    const actions = (actionsByCheck.get(check.check_slug) || []).map((action) => ({
      text: action.action_text,
      source: sourceFrom(
        action.source_url,
        action.source_title,
        action.source_date,
      ),
    }));

    return {
      id: check.check_slug,
      partySlug: check.party_slug,
      areaSlug: check.sphere_slug,
      commonPolicyId: check.policy_slug || undefined,
      policyName: check.title,
      comparisonSignal: getComparisonSignal({
        actionSources: actions.map((action) => action.source),
        check,
        claimSources: claims.map((claim) => claim.source),
      }),
      claims,
      actions,
    };
  });

  return {
    policyAreas,
    parties,
    commonPolicies,
    partyPositions,
    policyEvidence,
  };
}

export const getAppData = cache(async (): Promise<AppData> => {
  if (!supabase) {
    return mockData;
  }

  const results = await Promise.allSettled([
    supabase.from("parties").select("*").order("party_slug"),
    supabase.from("spheres").select("*").order("sphere_slug"),
    supabase.from("common_policies").select("*").order("policy_slug"),
    supabase
      .from("party_positions")
      .select("*")
      .order("party_slug")
      .order("policy_slug"),
    supabase
      .from("policy_checks")
      .select("*")
      .order("party_slug")
      .order("check_slug"),
    supabase.from("claims").select("*").order("check_slug"),
    supabase.from("actions").select("*").order("check_slug"),
  ]);

  const rejectedResult = results.find((result) => !isFulfilled(result));

  if (rejectedResult) {
    warnAboutSupabaseFallback(rejectedResult.reason);
    return mockData;
  }

  const fulfilledResults = results.filter(isFulfilled);
  const [
    partiesResult,
    spheresResult,
    commonPoliciesResult,
    partyPositionsResult,
    policyChecksResult,
    claimsResult,
    actionsResult,
  ] = fulfilledResults.map((result) => result.value);

  const error =
    partiesResult.error ||
    spheresResult.error ||
    commonPoliciesResult.error ||
    partyPositionsResult.error ||
    policyChecksResult.error ||
    claimsResult.error ||
    actionsResult.error;

  if (error) {
    warnAboutSupabaseFallback(error);
    return mockData;
  }

  return mapSupabaseRows({
    partyRows: partiesResult.data || [],
    sphereRows: spheresResult.data || [],
    commonPolicyRows: commonPoliciesResult.data || [],
    partyPositionRows: partyPositionsResult.data || [],
    policyCheckRows: policyChecksResult.data || [],
    claimRows: claimsResult.data || [],
    actionRows: actionsResult.data || [],
  });
});

export function getParty(data: AppData, slug: string) {
  return data.parties.find((party) => party.slug === slug);
}

export function getEvidenceForParty(data: AppData, slug: string) {
  return data.policyEvidence.filter((item) => item.partySlug === slug);
}

export function getCommonPoliciesForArea(data: AppData, areaSlug: string) {
  return data.commonPolicies.filter((policy) => policy.areaSlug === areaSlug);
}

export function getEvidenceForCommonPolicy(
  data: AppData,
  partySlug: string,
  commonPolicyId: string,
) {
  return data.policyEvidence.find(
    (item) =>
      item.partySlug === partySlug && item.commonPolicyId === commonPolicyId,
  );
}

export function getPartyPosition(
  data: AppData,
  partySlug: string,
  commonPolicyId: string,
) {
  return data.partyPositions.find(
    (position) =>
      position.partySlug === partySlug &&
      position.commonPolicyId === commonPolicyId,
  );
}
