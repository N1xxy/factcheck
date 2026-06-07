import type { EvidenceSource, PartyPosition, PolicyEvidence } from "@/lib/data";

export function hasUsableSource(source: EvidenceSource | undefined) {
  return Boolean(source?.url && source.url !== "#");
}

export function isFullyCheckedPolicy(
  evidence: PolicyEvidence | undefined,
  position: PartyPosition | undefined,
) {
  if (!evidence || !position) {
    return false;
  }

  const hasPositionExplanation = Boolean(position.reasoning.trim());
  const hasPositionSource = hasUsableSource(position.source);
  const hasSourcedClaims =
    evidence.claims.length > 0 &&
    evidence.claims.every(
      (claim) => claim.text.trim() && hasUsableSource(claim.source),
    );
  const hasSourcedActions =
    evidence.actions.length > 0 &&
    evidence.actions.every(
      (action) => action.text.trim() && hasUsableSource(action.source),
    );

  return (
    hasPositionExplanation &&
    hasPositionSource &&
    hasSourcedClaims &&
    hasSourcedActions
  );
}
