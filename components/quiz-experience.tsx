"use client";

import Link from "next/link";
import { ChevronDown, RotateCcw, Trophy, XCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PartyMark } from "@/components/party-mark";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { AppData } from "@/lib/app-data";
import type { CommonPolicy, Party } from "@/lib/data";

const answerLabels: Record<number, string> = {
  1: "Не подкрепям",
  2: "По-скоро не",
  3: "Смесено",
  4: "По-скоро да",
  5: "Подкрепям",
};

const scoreColors: Record<number, string> = {
  1: "bg-red-800",
  2: "bg-red-300",
  3: "bg-slate-300",
  4: "bg-sky-300",
  5: "bg-blue-700",
};

type Answers = Record<string, number | undefined>;

const STORAGE_KEY = "template-quiz-answers";

function getAnsweredPolicies(answers: Answers) {
  return Object.entries(answers)
    .filter(([, value]) => typeof value === "number")
    .map(([policyId, value]) => ({ policyId, value: value as number }));
}

function getCommonPoliciesForArea(data: AppData, areaSlug: string) {
  return data.commonPolicies.filter((policy) => policy.areaSlug === areaSlug);
}

function getEvidenceForCommonPolicy(
  data: AppData,
  partySlug: string,
  commonPolicyId: string,
) {
  return data.policyEvidence.find(
    (item) =>
      item.partySlug === partySlug && item.commonPolicyId === commonPolicyId,
  );
}

function getPartyPosition(
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

function scoreParty(
  data: AppData,
  policyAnswers: { policyId: string; value: number }[],
  policies: CommonPolicy[],
  partySlug: string,
) {
  let comparableCount = 0;
  const totalDistance = policyAnswers.reduce((sum, answer) => {
    const policy = policies.find((item) => item.id === answer.policyId);
    const position = policy
      ? getPartyPosition(data, partySlug, policy.id)
      : undefined;

    if (!position) {
      return sum;
    }

    comparableCount += 1;

    return sum + Math.abs(answer.value - position.supportLevel);
  }, 0);
  const maxDistance = Math.max(comparableCount * 4, 1);

  return {
    comparableCount,
    match: comparableCount
      ? Math.round((1 - totalDistance / maxDistance) * 100)
      : 0,
  };
}

function ScoreBars({ label, value }: { label: string; value?: number }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
      <div className="mb-1 flex items-center justify-between gap-3 text-xs font-bold text-slate-500">
        <span>{label}</span>
        <span>{value ? `${value} - ${answerLabels[value]}` : "Няма позиция"}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {[1, 2, 3, 4, 5].map((level) => (
          <span
            key={level}
            className={`h-3 rounded-full ${
              value && level <= value ? scoreColors[value] : "bg-white"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function ResultPartyCard({
  data,
  party,
  match,
  comparableCount,
  answeredPolicies,
}: {
  data: AppData;
  party: Party;
  match: number;
  comparableCount: number;
  answeredPolicies: { policyId: string; value: number }[];
}) {
  return (
    <details
      className={`group rounded-lg border bg-white shadow-sm ${party.ringClass}`}
    >
      <summary
        className={`${party.softClass} flex cursor-pointer list-none flex-col gap-4 rounded-lg p-5 transition-colors group-open:rounded-b-none sm:flex-row sm:items-center sm:justify-between`}
      >
        <div className="flex min-w-0 items-center gap-3">
          <PartyMark party={party} />
          <div className="min-w-0">
            <h3 className={`truncate text-xl font-bold ${party.accentClass}`}>
              {party.name}
            </h3>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              {match}% съвпадение по {comparableCount} позиции
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:w-56 sm:items-end">
          <div className="h-3 w-full rounded-full bg-white ring-1 ring-slate-200">
            <div
              className="h-3 rounded-full bg-cyan-600"
              style={{ width: `${match}%` }}
            />
          </div>
          <span className="inline-flex h-9 w-fit items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 text-sm font-semibold text-slate-900 transition-colors group-open:bg-slate-50">
            Виж отговорите
            <ChevronDown
              className="h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </div>
      </summary>
      <div className="grid gap-3 border-t border-slate-100 p-5">
        <Button asChild variant="secondary" size="sm" className="w-fit">
          <Link href={`/parties/${party.slug}`}>Пълен профил</Link>
        </Button>
        {answeredPolicies.map((answer) => {
          const policy = data.commonPolicies.find(
            (item) => item.id === answer.policyId,
          );

          if (!policy) {
            return null;
          }

          const position = getPartyPosition(data, party.slug, policy.id);
          const evidence = getEvidenceForCommonPolicy(
            data,
            party.slug,
            policy.id,
          );

          return (
            <div
              key={policy.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-col gap-4">
                <div>
                  <h3 className="font-bold">{policy.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Ти: {answer.value} ({answerLabels[answer.value]}) /{" "}
                    {party.shortName}:{" "}
                    {position
                      ? `${position.supportLevel} (${
                          answerLabels[position.supportLevel]
                        })`
                      : "няма намерена позиция"}
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <ScoreBars label="Твоят отговор" value={answer.value} />
                  <ScoreBars
                    label={party.shortName}
                    value={position?.supportLevel}
                  />
                </div>
                {position ? (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
                    <h4 className="text-sm font-bold">Защо е така?</h4>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {position.reasoning}
                    </p>
                    {position.source ? (
                      <a
                        href={position.source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-sm font-semibold text-cyan-800 hover:text-cyan-950"
                      >
                        {position.source.label}
                      </a>
                    ) : null}
                  </div>
                ) : null}
              </div>
              {evidence ? (
                <Button asChild variant="secondary" size="sm" className="mt-4">
                  <Link href={`/parties/${party.slug}#${evidence.id}`}>
                    Виж детайли
                  </Link>
                </Button>
              ) : (
                <p className="mt-4 text-sm font-semibold text-slate-500">
                  Няма конкретно обещание за проверка по тази позиция.
                </p>
              )}
            </div>
          );
        })}
      </div>
    </details>
  );
}

export function QuizExperience({ data }: { data: AppData }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const hasLoadedSavedAnswers = useRef(false);

  const answeredPolicies = getAnsweredPolicies(answers);
  const answeredCount = answeredPolicies.length;

  useEffect(() => {
    const storedAnswers = window.localStorage.getItem(STORAGE_KEY);

    if (!storedAnswers) {
      hasLoadedSavedAnswers.current = true;
      return;
    }

    try {
      const parsedAnswers = JSON.parse(storedAnswers) as Answers;
      window.requestAnimationFrame(() => {
        hasLoadedSavedAnswers.current = true;
        setAnswers(parsedAnswers);
      });
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      hasLoadedSavedAnswers.current = true;
    }
  }, []);

  useEffect(() => {
    if (!hasLoadedSavedAnswers.current) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(answers));
  }, [answers]);

  const ranking = useMemo(() => {
    return data.parties
      .map((party) => ({
        party,
        ...scoreParty(data, answeredPolicies, data.commonPolicies, party.slug),
      }))
      .sort((first, second) => second.match - first.match);
  }, [answeredPolicies, data]);

  function setAnswer(policyId: string, value: number) {
    setAnswers((current) => ({ ...current, [policyId]: value }));
    setShowResults(false);
  }

  function clearAnswer(policyId: string) {
    setAnswers((current) => {
      const nextAnswers = { ...current };
      delete nextAnswers[policyId];
      return nextAnswers;
    });
    setShowResults(false);
  }

  function resetQuiz() {
    setAnswers({});
    setShowResults(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  function submitQuiz() {
    if (answeredCount === 0) {
      return;
    }

    setShowResults(true);
    window.requestAnimationFrame(() => {
      resultsRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
      <Card className="h-fit border-cyan-100">
        <CardHeader>
          <Badge>Интерактивен тест</Badge>
          <CardTitle>Избери само позициите, които те интересуват</CardTitle>
          <CardDescription>
            Всяка позиция започва като неотговорена. Партийните позиции са скрити
            до края, за да не влияят на отговорите.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 rounded-lg bg-slate-50 p-4">
            <div className="text-2xl font-bold">{answeredCount}</div>
            <div className="text-sm font-medium text-slate-500">
              отговорени позиции
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button disabled={answeredCount === 0} onClick={submitQuiz}>
              Покажи класиране
              <Trophy className="h-4 w-4" aria-hidden="true" />
            </Button>
            <Button variant="secondary" onClick={resetQuiz}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Започни отначало
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4">
        {data.policyAreas.map((area) => {
          const policies = getCommonPoliciesForArea(data, area.slug);

          return (
            <details
              key={area.slug}
              className="group rounded-lg border border-slate-200 bg-white shadow-sm"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                <div>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{area.name}</Badge>
                    <Badge variant="neutral">{policies.length} позиции</Badge>
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

              <div className="grid gap-3 border-t border-slate-100 p-5 pt-0">
                {policies.map((policy) => {
                  const answer = answers[policy.id];
                  const hasAnswer = typeof answer === "number";

                  return (
                    <details
                      key={policy.id}
                      className="group/policy rounded-lg border border-slate-200 bg-white shadow-sm"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5">
                        <div className="min-w-0">
                          <div className="flex flex-wrap gap-2">
                            <Badge variant="neutral">Обща позиция</Badge>
                            <Badge variant={hasAnswer ? "green" : "amber"}>
                              {hasAnswer ? "Отговорено" : "Неотговорено"}
                            </Badge>
                          </div>
                          <h3 className="mt-3 text-lg font-bold">
                            {policy.title}
                          </h3>
                          <p className="mt-1 text-sm leading-6 text-slate-600">
                            {policy.question}
                          </p>
                        </div>
                        <ChevronDown
                          className="h-5 w-5 shrink-0 text-slate-500 transition-transform group-open/policy:rotate-180"
                          aria-hidden="true"
                        />
                      </summary>
                      <div className="border-t border-slate-100 p-5 pt-0">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <span className="text-sm font-bold text-red-800">
                              Не подкрепям
                            </span>
                            <span className="text-sm font-bold text-slate-500">
                              Смесено
                            </span>
                            <span className="text-sm font-bold text-emerald-700">
                              Подкрепям
                            </span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="5"
                            step="1"
                            value={answer ?? 3}
                            onChange={(event) =>
                              setAnswer(policy.id, Number(event.target.value))
                            }
                            className="h-3 w-full cursor-pointer appearance-none rounded-full accent-cyan-700"
                            style={{
                              background:
                                "linear-gradient(90deg, #991b1b 0%, #fca5a5 25%, #cbd5e1 50%, #7dd3fc 75%, #1d4ed8 100%)",
                            }}
                            aria-label={`Отговор за ${policy.title}`}
                          />
                          <div className="mt-3 grid grid-cols-5 gap-2 text-center text-xs font-bold text-slate-500">
                            {[1, 2, 3, 4, 5].map((level) => (
                              <span
                                key={level}
                                className={
                                  answer === level
                                    ? "text-slate-950"
                                    : undefined
                                }
                              >
                                {level}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                          <p className="text-xs font-medium text-slate-500">
                            1 = никаква подкрепа, 3 = смесено/неутрално, 5 =
                            пълна подкрепа.
                          </p>
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            disabled={!hasAnswer}
                            onClick={() => clearAnswer(policy.id)}
                          >
                            <XCircle className="h-4 w-4" aria-hidden="true" />
                            Не искам да отговарям
                          </Button>
                        </div>
                      </div>
                    </details>
                  );
                })}
              </div>
              </details>
            );
          })}

        <Card className="border-cyan-100">
          <CardContent className="flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-bold">Готов ли си?</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Отговорил си на {answeredCount} позиции. Можеш да видиш резултат
                и после да редактираш отговорите си.
              </p>
            </div>
            <Button disabled={answeredCount === 0} onClick={submitQuiz}>
              Покажи класиране
              <Trophy className="h-4 w-4" aria-hidden="true" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {showResults ? (
        <section
          ref={resultsRef}
          className="col-span-full mx-auto grid w-full max-w-5xl scroll-mt-24 gap-4"
          aria-live="polite"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <Badge>Резултат</Badge>
              <h2 className="mt-3 text-2xl font-bold">Най-близки партии</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                Класирането използва само позициите, на които си отговорил.
              </p>
            </div>
            <Button variant="secondary" onClick={resetQuiz}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              Направи теста отново
            </Button>
          </div>
          {ranking.map(({ party, match, comparableCount }) => (
            <ResultPartyCard
              key={party.slug}
              data={data}
              party={party}
              match={match}
              comparableCount={comparableCount}
              answeredPolicies={answeredPolicies}
            />
          ))}
        </section>
      ) : null}
    </div>
  );
}

