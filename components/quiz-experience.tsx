"use client";

import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronDown,
  Circle,
  RotateCcw,
  Trophy,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import { PartyMark } from "@/components/party-mark";
import { getTopicPalette } from "@/components/topic-colors";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { AppData } from "@/lib/app-data";
import type { CommonPolicy, Party } from "@/lib/data";
import { isFullyCheckedPolicy } from "@/lib/policy-checks";
import { cn } from "@/lib/utils";

const answerLabels: Record<number, string> = {
  1: "Не подкрепям",
  2: "По-скоро не",
  3: "Смесено",
  4: "По-скоро да",
  5: "Подкрепям",
};

const answerDescriptions: Record<number, string> = {
  1: "Категорично против",
  2: "По-скоро против",
  3: "Неутрално или смесено",
  4: "По-скоро подкрепям",
  5: "Пълна подкрепа",
};

const answerTones: Record<
  number,
  {
    icon: string;
    selected: string;
    unselected: string;
    bar: string;
  }
> = {
  1: {
    icon: "text-red-700",
    selected: "border-red-700 bg-red-50 text-red-950",
    unselected:
      "border-red-100 bg-white text-slate-700 hover:border-red-300 hover:bg-red-50/60",
    bar: "bg-red-700",
  },
  2: {
    icon: "text-orange-600",
    selected: "border-orange-600 bg-orange-50 text-orange-950",
    unselected:
      "border-orange-100 bg-white text-slate-700 hover:border-orange-300 hover:bg-orange-50/60",
    bar: "bg-orange-500",
  },
  3: {
    icon: "text-slate-600",
    selected: "border-slate-600 bg-slate-100 text-slate-950",
    unselected:
      "border-slate-200 bg-white text-slate-700 hover:border-slate-400 hover:bg-slate-50",
    bar: "bg-slate-500",
  },
  4: {
    icon: "text-sky-700",
    selected: "border-sky-700 bg-sky-50 text-sky-950",
    unselected:
      "border-sky-100 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50/60",
    bar: "bg-sky-500",
  },
  5: {
    icon: "text-emerald-700",
    selected: "border-emerald-700 bg-emerald-50 text-emerald-950",
    unselected:
      "border-emerald-100 bg-white text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/60",
    bar: "bg-emerald-600",
  },
};

type Answers = Record<string, number | undefined>;
type ImportanceAnswers = Record<string, boolean | undefined>;

type SavedQuizState = {
  answers?: Answers;
  importance?: Record<string, boolean | number | undefined>;
  submitted?: boolean;
};

type QuizQuestion = CommonPolicy & {
  areaName: string;
  areaDescription: string;
};

type AnsweredPolicy = {
  policyId: string;
  value: number;
  isImportant: boolean;
};

const STORAGE_KEY = "kochina-quiz-answers";
const DEFAULT_IMPORTANCE_WEIGHT = 1;
const IMPORTANT_TOPIC_WEIGHT = 1.75;

function getImportanceWeight(isImportant: boolean) {
  return isImportant ? IMPORTANT_TOPIC_WEIGHT : DEFAULT_IMPORTANCE_WEIGHT;
}

function getAnsweredPolicies(
  answers: Answers,
  importance: ImportanceAnswers,
): AnsweredPolicy[] {
  return Object.entries(answers)
    .filter(([, value]) => typeof value === "number")
    .map(([policyId, value]) => ({
      policyId,
      value: value as number,
      isImportant: importance[policyId] ?? false,
    }));
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
  policyAnswers: AnsweredPolicy[],
  policies: CommonPolicy[],
  partySlug: string,
) {
  let comparableCount = 0;
  let comparableWeight = 0;
  const answeredWeight = policyAnswers.reduce(
    (sum, answer) => sum + getImportanceWeight(answer.isImportant),
    0,
  );
  const totalDistance = policyAnswers.reduce((sum, answer) => {
    const policy = policies.find((item) => item.id === answer.policyId);
    const position = policy
      ? getPartyPosition(data, partySlug, policy.id)
      : undefined;

    if (!position) {
      return sum;
    }

    comparableCount += 1;
    const weight = getImportanceWeight(answer.isImportant);
    comparableWeight += weight;

    return sum + weight * Math.abs(answer.value - position.supportLevel);
  }, 0);
  const maxDistance = Math.max(comparableWeight * 4, 1);
  const coverage = answeredWeight ? comparableWeight / answeredWeight : 0;
  const coveragePenalty = 0.7 + coverage * 0.3;
  const rawMatch = comparableCount
    ? (1 - totalDistance / maxDistance) * 100
    : 0;

  return {
    comparableCount,
    match: comparableCount ? Math.round(rawMatch * coveragePenalty) : 0,
  };
}

function getQuestions(data: AppData): QuizQuestion[] {
  return data.policyAreas.flatMap((area) =>
    data.commonPolicies
      .filter((policy) => policy.areaSlug === area.slug)
      .map((policy) => ({
        ...policy,
        areaName: area.name,
        areaDescription: area.description,
      })),
  );
}

function ProgressDots({
  questions,
  answers,
  currentIndex,
  onSelect,
}: {
  questions: QuizQuestion[];
  answers: Answers;
  currentIndex: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" aria-label="Прогрес в теста">
      {questions.map((question, index) => {
        const hasAnswer = typeof answers[question.id] === "number";

        return (
          <button
            key={question.id}
            type="button"
            onClick={() => onSelect(index)}
            className={cn(
              "h-2.5 w-2.5 rounded-full transition-colors",
              index === currentIndex && "ring-2 ring-cyan-700 ring-offset-2",
              hasAnswer ? "bg-cyan-700" : "bg-slate-300",
            )}
            aria-label={`Въпрос ${index + 1}${
              hasAnswer ? ", отговорен" : ", пропуснат"
            }`}
          />
        );
      })}
    </div>
  );
}

function AnswerButton({
  value,
  selectedValue,
  onSelect,
}: {
  value: number;
  selectedValue?: number;
  onSelect: (value: number) => void;
}) {
  const isSelected = selectedValue === value;
  const tone = answerTones[value];

  return (
    <button
      type="button"
      onClick={() => onSelect(value)}
      className={cn(
        "flex min-h-20 flex-col items-start justify-center rounded-lg border p-4 text-left transition-colors",
        isSelected ? tone.selected : tone.unselected,
      )}
    >
      <span className="flex items-center gap-2 text-sm font-bold">
        {isSelected ? (
          <CheckCircle2
            className={cn("h-4 w-4", tone.icon)}
            aria-hidden="true"
          />
        ) : (
          <Circle className={cn("h-4 w-4", tone.icon)} aria-hidden="true" />
        )}
        {value}. {answerLabels[value]}
      </span>
      <span className="mt-1 text-xs font-medium text-slate-500">
        {answerDescriptions[value]}
      </span>
    </button>
  );
}

function ScoreBars({
  label,
  value,
}: {
  label: string;
  value?: number;
}) {
  const tone = value ? answerTones[value] : undefined;

  return (
    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-3">
      <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
        <span className="uppercase">{label}</span>
        <span>{value ? `${value} - ${answerLabels[value]}` : "Няма позиция"}</span>
      </div>
      <div className="grid grid-cols-5 gap-1.5">
        {Array.from({ length: 5 }).map((_, index) => (
          <span
            key={index}
            className={cn(
              "h-3 rounded-full",
              value && index < value ? tone?.bar : "bg-slate-200",
            )}
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
  answeredPolicies: AnsweredPolicy[];
}) {
  return (
    <details
      className={cn(
        "group overflow-hidden rounded-lg border bg-white shadow-sm",
        party.ringClass,
      )}
    >
      <summary
        className={cn(
          "flex cursor-pointer list-none flex-col gap-4 p-5 marker:hidden sm:flex-row sm:items-center sm:justify-between [&::-webkit-details-marker]:hidden",
          party.softClass,
        )}
      >
        <div className="flex w-full min-w-0 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-center gap-3">
            <PartyMark party={party} />
            <div className="min-w-0">
              <h3
                className={cn(
                  "wrap-break-word text-xl font-bold",
                  party.accentClass,
                )}
              >
                {party.name}
              </h3>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                {comparableCount} сравнени позиции
              </p>
            </div>
          </div>
          <div className="grid min-w-0 gap-2 sm:min-w-56">
            <div>
              <div className="mb-1 flex items-center justify-between text-xs font-bold uppercase text-slate-500">
                <span>Съвпадение</span>
                <span>{match}%</span>
              </div>
              <div className="h-3 rounded-full bg-white ring-1 ring-slate-200">
                <div
                  className="h-3 rounded-full bg-cyan-600"
                  style={{ width: `${match}%` }}
                />
              </div>
            </div>
          </div>
          <span className="inline-flex w-fit items-center justify-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-800 shadow-sm transition-colors group-open:bg-slate-50">
            Виж отговорите
            <ChevronDown
              className="h-4 w-4 transition-transform group-open:rotate-180"
              aria-hidden="true"
            />
          </span>
        </div>
      </summary>
      <div className="grid gap-4 border-t border-slate-100 p-5">
        <Button asChild variant="secondary" size="sm" className="w-fit">
          <Link href={`/parties/${party.slug}`}>Пълен профил</Link>
        </Button>
        <div className="grid gap-3">
          {answeredPolicies.map((answer) => {
            const policy = data.commonPolicies.find(
              (item) => item.id === answer.policyId,
            );
            const position = policy
              ? getPartyPosition(data, party.slug, policy.id)
              : undefined;
            const evidence = policy
              ? data.policyEvidence.find(
                  (item) =>
                    item.partySlug === party.slug &&
                    item.commonPolicyId === policy.id,
                )
              : undefined;
            const isFullyChecked = isFullyCheckedPolicy(evidence, position);

            if (!policy) {
              return null;
            }

            return (
              <div
                key={policy.id}
                className="rounded-lg border border-slate-200 bg-slate-50 p-3"
              >
                <h3 className="wrap-break-word text-sm font-bold">
                  {policy.title}
                </h3>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  {policy.question}
                </p>
                <div className="mt-3 grid gap-3 md:grid-cols-2">
                  <ScoreBars label="Ти" value={answer.value} />
                  <ScoreBars
                    label={party.shortName}
                    value={position?.supportLevel}
                  />
                </div>
                {answer.isImportant ? (
                  <p className="mt-1 text-xs font-semibold text-cyan-700">
                    Тази тема е важна за теб
                  </p>
                ) : null}
                {isFullyChecked && evidence ? (
                  <Button
                    asChild
                    variant="secondary"
                    size="sm"
                    className="mt-3 w-fit"
                  >
                    <Link href={`/parties/${party.slug}#${evidence.id}`}>
                      Виж проверката
                    </Link>
                  </Button>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </details>
  );
}

export function QuizExperience({ data }: { data: AppData }) {
  const [answers, setAnswers] = useState<Answers>({});
  const [importance, setImportance] = useState<ImportanceAnswers>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const hasLoadedSavedAnswers = useRef(false);
  const questions = useMemo(() => getQuestions(data), [data]);
  const currentQuestion = questions[currentIndex];
  const answeredPolicies = getAnsweredPolicies(answers, importance);
  const answeredCount = answeredPolicies.length;
  const progressPercent = questions.length
    ? Math.round(((currentIndex + 1) / questions.length) * 100)
    : 0;

  useEffect(() => {
    const storedAnswers = window.localStorage.getItem(STORAGE_KEY);

    if (!storedAnswers) {
      hasLoadedSavedAnswers.current = true;
      return undefined;
    }

    let timeoutId = 0;

    try {
      const parsed = JSON.parse(storedAnswers) as unknown;
      const parsedState =
        parsed && typeof parsed === "object" ? (parsed as SavedQuizState) : {};
      const parsedAnswers =
        "answers" in parsedState
          ? parsedState.answers ?? {}
          : (parsedState as Answers);
      const parsedImportance = Object.fromEntries(
        Object.entries(parsedState.importance ?? {}).map(([policyId, value]) => [
          policyId,
          typeof value === "number" ? value > 2 : Boolean(value),
        ]),
      );
      timeoutId = window.setTimeout(() => {
        hasLoadedSavedAnswers.current = true;
        setAnswers(parsedAnswers);
        setImportance(parsedImportance);
        setShowResults(Boolean(parsedState.submitted));
      }, 0);
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
      hasLoadedSavedAnswers.current = true;
    }

    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, []);

  useEffect(() => {
    if (!showResults) {
      return;
    }

    resultsRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [showResults]);

  useEffect(() => {
    if (!hasLoadedSavedAnswers.current) {
      return;
    }

    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ answers, importance, submitted: showResults }),
    );
  }, [answers, importance, showResults]);

  const ranking = useMemo(() => {
    return data.parties
      .map((party) => ({
        party,
        ...scoreParty(data, answeredPolicies, data.commonPolicies, party.slug),
      }))
      .sort(
        (first, second) =>
          second.match - first.match ||
          second.comparableCount - first.comparableCount,
      );
  }, [answeredPolicies, data]);

  function goToQuestion(index: number) {
    setCurrentIndex(Math.min(Math.max(index, 0), questions.length - 1));
    setShowResults(false);
  }

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

  function setPolicyImportance(policyId: string, value: boolean) {
    setImportance((current) => ({ ...current, [policyId]: value }));
    setShowResults(false);
  }

  function skipQuestion() {
    if (!currentQuestion) {
      return;
    }

    clearAnswer(currentQuestion.id);
    goToQuestion(currentIndex + 1);
  }

  function submitQuiz() {
    if (answeredCount === 0) {
      return;
    }

    setShowResults(true);
  }

  function resetQuiz() {
    setAnswers({});
    setImportance({});
    setCurrentIndex(0);
    setShowResults(false);
    window.localStorage.removeItem(STORAGE_KEY);
  }

  if (!currentQuestion) {
    return (
      <Card className="border-slate-200">
        <CardContent className="p-6">
          Няма въведени въпроси за теста.
        </CardContent>
      </Card>
    );
  }

  const currentAnswer = answers[currentQuestion.id];
  const isImportant = importance[currentQuestion.id] ?? false;
  const topicPalette = getTopicPalette(currentQuestion.areaSlug);

  return (
    <div className="grid gap-6">
      <Card
        className={cn(
          "overflow-hidden border-cyan-100",
          showResults && "hidden",
        )}
      >
        <CardHeader className="border-b border-slate-100 bg-white">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-bold uppercase text-slate-500">
                Въпрос {currentIndex + 1} от {questions.length}
              </div>
              <CardTitle className="mt-3 text-2xl">
                Отговори само на темите, които имат значение за теб.
              </CardTitle>
            </div>
            <div className="min-w-0 md:w-80">
              <div className="mb-2 flex items-center justify-between text-xs font-bold uppercase text-slate-500">
                <span>{answeredCount} отговорени</span>
                <span>{progressPercent}%</span>
              </div>
              <div className="h-2.5 rounded-full bg-slate-100">
                <div
                  className="h-2.5 rounded-full bg-cyan-600"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="mt-3">
                <ProgressDots
                  questions={questions}
                  answers={answers}
                  currentIndex={currentIndex}
                  onSelect={goToQuestion}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 p-5 sm:p-6">
          <div
            className={cn(
              "rounded-lg border p-4",
              topicPalette.border,
              topicPalette.header,
            )}
          >
            <h2 className="mt-4 wrap-break-word text-2xl font-bold leading-tight text-slate-950 sm:text-3xl">
              {currentQuestion.title}
            </h2>
            <p className="mt-3 text-base leading-7 text-slate-700">
              {currentQuestion.question}
            </p>
          </div>

          <div className="grid gap-3 md:grid-cols-5">
            {[1, 2, 3, 4, 5].map((value) => (
              <AnswerButton
                key={value}
                value={value}
                selectedValue={currentAnswer}
                onSelect={(nextValue) => setAnswer(currentQuestion.id, nextValue)}
              />
            ))}
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">
            <input
              type="checkbox"
              checked={isImportant}
              onChange={(event) =>
                setPolicyImportance(currentQuestion.id, event.target.checked)
              }
              className="mt-0.5 h-4 w-4 shrink-0 rounded border-slate-300 accent-cyan-700"
            />
            <span>This topic is important to me</span>
          </label>

          <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                disabled={currentIndex === 0}
                onClick={() => goToQuestion(currentIndex - 1)}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Назад
              </Button>
              <Button
                type="button"
                variant="secondary"
                onClick={skipQuestion}
              >
                Пропусни
              </Button>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                aria-disabled={answeredCount === 0}
                className={
                  answeredCount === 0
                    ? "pointer-events-none opacity-50"
                    : undefined
                }
                onClick={submitQuiz}
              >
                Предай сега
                <Trophy className="h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                type="button"
                disabled={currentIndex === questions.length - 1}
                onClick={() => goToQuestion(currentIndex + 1)}
              >
                Следващ
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm leading-6 text-slate-600">
          Можеш да предадеш теста рано, но резултатът става по-точен с повече
          отговорени теми.
        </p>
        <Button type="button" variant="secondary" onClick={resetQuiz}>
          <RotateCcw className="h-4 w-4" aria-hidden="true" />
          Започни отначало
        </Button>
      </div>

      {showResults ? (
        <section
          ref={resultsRef}
          className="grid scroll-mt-24 gap-4"
          aria-live="polite"
        >
          <div>
            <h2 className="mt-3 text-2xl font-bold">Най-близки партии</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
              Съвпадението измерва близостта между твоите отговори и
              въведените позиции на партиите. Важните за теб теми имат по-голяма
              тежест.
            </p>
          </div>
          <div className="grid items-start gap-4 xl:grid-cols-2">
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
          </div>
        </section>
      ) : null}
    </div>
  );
}
