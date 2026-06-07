import Link from "next/link";
import {
  ArrowRight,
  ClipboardList,
  Route,
  ShieldCheck,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAppData } from "@/lib/app-data";
import { isFullyCheckedPolicy } from "@/lib/policy-checks";

export default async function Home() {
  const data = await getAppData();
  const { commonPolicies, parties, partyPositions, policyEvidence } = data;
  const fullCheckCount = policyEvidence.filter((evidence) =>
    isFullyCheckedPolicy(
      evidence,
      partyPositions.find(
        (position) =>
          position.partySlug === evidence.partySlug &&
          position.commonPolicyId === evidence.commonPolicyId,
      ),
    ),
  ).length;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
              Оформи политическите си предпочитания с Кочина.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Тук можеш да видиш дали думите на една партия отговарят на действията ѝ 
              или да откриеш коя партия е най-близо до твоите възгледи чрез кратък тест.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="secondary" size="lg">
                <Link href="/parties">
                  Разгледай партии
                </Link>
              </Button>
              <Button asChild size="lg">
                <Link href="/quiz">
                  Започни теста
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-cyan-100">
            <CardHeader className="border-b border-slate-100 bg-cyan-50/70">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Двете основни функции</CardTitle>
                </div>
                <ShieldCheck
                  className="h-9 w-9 text-cyan-700"
                  aria-hidden="true"
                />
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 pt-5">
              {[
                {
                  icon: ClipboardList,
                  title: "Проследявай обещания",
                  text: "За всяка партия можеш да видиш обещания и действията, които са последвали. И сам да прецениш дали са си свършили работата",
                },
                {
                  icon: Route,
                  title: "Сравни себе си",
                  text: "В теста отговаряш само на това, което те интересува, и получаваш партията най-близо до твоите възгледи.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4"
                >
                  <item.icon
                    className="mt-1 h-5 w-5 shrink-0 text-cyan-700"
                    aria-hidden="true"
                  />
                  <div>
                    <h2 className="font-bold">{item.title}</h2>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      {item.text}
                    </p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-3">
        <Card>
          <CardHeader>
            
            <CardTitle>{parties.length} Партии</CardTitle>
            <CardDescription>
              Всяка партия има собствен профил, където ясно се виждат приоритетие ѝ.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            
            <CardTitle>{commonPolicies.length} Политики</CardTitle>
            <CardDescription>
              Това са общите проблеми, по които партиите работят (или не), и по които тестът използва за сравнение. 
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            
            <CardTitle>{fullCheckCount} Проверки</CardTitle>
            <CardDescription>
              Толкова твърдения са проверени с последвалите ги действия и потвърдени с надеждни източници.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      
    </main>
  );
}
