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

import { PartyMark } from "@/components/party-mark";
import { SiteHeader } from "@/components/site-header";
import { SupportMeter } from "@/components/support-meter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCommonPoliciesForArea,
  getEvidenceForCommonPolicy,
  getParty,
  parties,
  policyAreas,
} from "@/lib/data";

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
                      const stance = position.partyStances[party.slug] ?? 3;
                      const item = getEvidenceForCommonPolicy(
                        party.slug,
                        position.id,
                      );

                      return (
                        <Card
                          key={position.id}
                          id={item?.id}
                          className="scroll-mt-24"
                        >
                          <CardHeader>
                            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <CardTitle className="text-xl">
                                  {position.title}
                                </CardTitle>
                                <CardDescription>
                                  {position.question}
                                </CardDescription>
                              </div>
                              <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                                <div className="mb-2 text-xs font-bold uppercase text-slate-500">
                                  Позиция на партията
                                </div>
                                <SupportMeter value={stance} />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            {item ? (
                              <div className="rounded-lg border border-cyan-100 bg-cyan-50/40 p-4">
                                <Badge className="mb-4">Проверена политика</Badge>
                                <div className="grid gap-4 lg:grid-cols-2">
                                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                                      <ClipboardList
                                        className="h-4 w-4 text-cyan-700"
                                        aria-hidden="true"
                                      />
                                      Твърдение
                                    </div>
                                    <p className="text-sm leading-6 text-slate-600">
                                      {item.claim}
                                    </p>
                                    <a
                                      href={item.claimSource.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                                    >
                                      {item.claimSource.label}
                                      <ExternalLink
                                        className="h-3.5 w-3.5"
                                        aria-hidden="true"
                                      />
                                    </a>
                                  </div>
                                  <div className="rounded-lg border border-slate-200 bg-white p-4">
                                    <div className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-900">
                                      <CheckCircle2
                                        className="h-4 w-4 text-emerald-700"
                                        aria-hidden="true"
                                      />
                                      Намерено действие
                                    </div>
                                    <p className="text-sm leading-6 text-slate-600">
                                      {item.action}
                                    </p>
                                    {item.actionSource ? (
                                      <a
                                        href={item.actionSource.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                                      >
                                        {item.actionSource.label}
                                        <ExternalLink
                                          className="h-3.5 w-3.5"
                                          aria-hidden="true"
                                        />
                                      </a>
                                    ) : (
                                      <p className="mt-3 text-sm font-semibold text-amber-700">
                                        Все още няма добавен източник за действие.
                                      </p>
                                    )}
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
                          </CardContent>
                        </Card>
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
