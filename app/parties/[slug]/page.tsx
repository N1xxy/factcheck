import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  FileSearch,
} from "lucide-react";

import { HashOpenDetails } from "@/components/hash-open-details";
import { PartyMark } from "@/components/party-mark";
import { SiteHeader } from "@/components/site-header";
import { SupportMeter } from "@/components/support-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  getCommonPoliciesForArea,
  getEvidenceForCommonPolicy,
  getPartyPosition,
  getParty,
  parties,
  policyAreas,
  type PolicyEvidence,
} from "@/lib/data";

const comparisonSignals: Record<
  PolicyEvidence["comparisonSignal"],
  { label: string; className: string }
> = {
  mismatch: {
    label: "Има разминаване",
    className: "border-amber-200 bg-amber-50 text-amber-800",
  },
  insufficient_data: {
    label: "Няма достатъчно данни",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  },
  matches: {
    label: "Съвпада",
    className: "border-emerald-200 bg-emerald-50 text-emerald-800",
  },
};

export function generateStaticParams() {
  return parties.map((party) => ({ slug: party.slug }));
}

export default async function PartyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const party = getParty(slug);

  if (!party) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <HashOpenDetails />
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
          <Button asChild variant="ghost" className="-ml-3 mb-5">
            <Link href="/parties">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Всички партии
            </Link>
          </Button>
          <div
            className={`rounded-lg border ${party.ringClass} ${party.softClass} p-6`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <PartyMark party={party} size="lg" />
              <div>
                <Badge variant="neutral">Партиен профил</Badge>
                <h1 className={`mt-4 text-4xl font-bold ${party.accentClass}`}>
                  {party.name}
                </h1>
                <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-700">
                  Профилът показва позициите на партията по общи сфери. Когато
                  има конкретно обещание или твърдение, под позицията има и
                  проверка с намерено действие и източници.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <Card className="mb-5 border-cyan-100 bg-cyan-50/50">
          <CardContent className="p-5">
            <div className="flex gap-3">
              <FileSearch
                className="mt-1 h-5 w-5 shrink-0 text-cyan-700"
                aria-hidden="true"
              />
              <div>
                <h2 className="font-bold">Как да четеш профила?</h2>
                <p className="mt-1 text-sm leading-6 text-slate-700">
                  Скалата 1-5 показва подкрепата на партията за дадена позиция.
                  Проверките под нея са отделни: те сравняват конкретно
                  твърдение с намерено действие, без сайтът да поставя присъда
                  вместо теб.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4">
          {policyAreas.map((area, index) => {
            const positions = getCommonPoliciesForArea(area.slug);
            const checkedCount = positions.filter((position) =>
              getEvidenceForCommonPolicy(party.slug, position.id),
            ).length;

            return (
              <details
                key={area.slug}
                className="group rounded-lg border border-slate-200 bg-white shadow-sm"
                open={checkedCount > 0 || index < 2}
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <Badge>{area.name}</Badge>
                      <Badge variant="neutral">
                        {positions.length} позиции
                      </Badge>
                      <Badge variant="neutral">
                        {checkedCount} проверки
                      </Badge>
                    </div>
                    <h2 className="mt-3 text-xl font-bold">{area.name}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {area.description}
                    </p>
                  </div>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open:rotate-180"
                    aria-hidden="true"
                  />
                </summary>

                <div className="border-t border-slate-100 p-5 pt-0">
                  <div className="grid gap-4">
                    {positions.map((position) => {
                      const item = getEvidenceForCommonPolicy(
                        party.slug,
                        position.id,
                      );
                      const partyPosition = getPartyPosition(
                        party.slug,
                        position.id,
                      );
                      const detailsId =
                        item?.id ?? `${party.slug}-${position.id}`;

                      return (
                        <details
                          key={position.id}
                          id={detailsId}
                          className="group/policy scroll-mt-24 rounded-lg border border-slate-200 bg-white shadow-sm"
                        >
                          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                            <div>
                              <div className="flex flex-wrap gap-2">
                                <Badge variant="neutral">Позиция</Badge>
                                {item ? <Badge>Има проверка</Badge> : null}
                              </div>
                              <h3 className="mt-3 text-xl font-bold">
                                {position.title}
                              </h3>
                            </div>
                            <ChevronDown
                              className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open/policy:rotate-180"
                              aria-hidden="true"
                            />
                          </summary>
                          <div className="border-t border-slate-100 p-5 pt-0">
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <h4 className="font-bold">Обща позиция</h4>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  {position.question}
                                </p>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="mb-2 text-xs font-bold uppercase text-slate-500">
                                  Позиция на партията
                                </div>
                                {partyPosition ? (
                                  <SupportMeter
                                    value={partyPosition.supportLevel}
                                  />
                                ) : (
                                  <div className="h-2.5 w-36 rounded-full bg-white ring-1 ring-slate-200" />
                                )}
                              </div>
                            </div>

                            {partyPosition ? (
                              <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
                                <h4 className="font-bold">Защо е така?</h4>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  {partyPosition.reasoning}
                                </p>
                                {partyPosition.source ? (
                                  <a
                                    href={partyPosition.source.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                                  >
                                    {partyPosition.source.label}
                                    <ExternalLink
                                      className="h-3.5 w-3.5"
                                      aria-hidden="true"
                                    />
                                  </a>
                                ) : null}
                              </div>
                            ) : (
                              <div className="mt-4 rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                                <h4 className="font-bold">
                                  Няма намерена позиция
                                </h4>
                                <p className="mt-1 text-sm leading-6 text-slate-600">
                                  За тази партия още няма въведена ясна позиция
                                  по тази тема. В теста тя няма да участва в
                                  изчисляването на съвпадението.
                                </p>
                              </div>
                            )}

                            {item ? (
                              <div className="mt-4 rounded-lg border border-cyan-100 bg-cyan-50/40 p-4">
                                <div className="mb-4 flex flex-wrap gap-2">
                                  <Badge>Проверена политика</Badge>
                                  <span
                                    className={`inline-flex w-fit items-center rounded-md border px-2.5 py-1 text-xs font-semibold ${
                                      comparisonSignals[item.comparisonSignal]
                                        .className
                                    }`}
                                  >
                                    {
                                      comparisonSignals[item.comparisonSignal]
                                        .label
                                    }
                                  </span>
                                </div>
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                                      <ClipboardList
                                        className="h-4 w-4 text-cyan-700"
                                        aria-hidden="true"
                                      />
                                      Твърдение
                                    </div>
                                    <div className="grid gap-3">
                                      {item.claims.map((claim, claimIndex) => (
                                        <div
                                          key={`${item.id}-claim-${claimIndex}`}
                                        >
                                          <p className="text-sm leading-6 text-slate-600">
                                            {claim.text}
                                          </p>
                                          <a
                                            href={claim.source.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                                          >
                                            {claim.source.label}
                                            <ExternalLink
                                              className="h-3.5 w-3.5"
                                              aria-hidden="true"
                                            />
                                          </a>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                                      <CheckCircle2
                                        className="h-4 w-4 text-emerald-700"
                                        aria-hidden="true"
                                      />
                                      Намерено действие
                                    </div>
                                    <div className="grid gap-3">
                                      {item.actions.map((action, actionIndex) => (
                                        <div
                                          key={`${item.id}-action-${actionIndex}`}
                                        >
                                          <p className="text-sm leading-6 text-slate-600">
                                            {action.text}
                                          </p>
                                          {action.source ? (
                                            <a
                                              href={action.source.url}
                                              target="_blank"
                                              rel="noreferrer"
                                              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                                            >
                                              {action.source.label}
                                              <ExternalLink
                                                className="h-3.5 w-3.5"
                                                aria-hidden="true"
                                              />
                                            </a>
                                          ) : (
                                            <p className="mt-2 text-sm font-semibold text-amber-700">
                                              Все още няма добавен източник за
                                              действие.
                                            </p>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-4">
                                <h3 className="font-bold">
                                  Няма добавена проверка
                                </h3>
                                <p className="text-sm leading-6 text-slate-600">
                                  Имаме позиция за сравнение в теста, но още
                                  няма конкретно твърдение или обещание от тази
                                  партия, което да е въведено за проверка.
                                </p>
                              </div>
                            )}
                          </div>
                        </details>
                      );
                    })}
                  </div>
                </div>
              </details>
            );
          })}
        </div>
      </section>
    </main>
  );
}
