import Link from "next/link";
import {
  ArrowRight,
  BookOpenCheck,
  ClipboardList,
  ExternalLink,
  FileText,
  Route,
  ShieldCheck,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { commonPolicies, parties, policyAreas, policyEvidence } from "@/lib/data";

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-12 sm:px-8 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <Badge className="mb-5">Информиран избор</Badge>
            <h1 className="max-w-3xl text-4xl font-bold tracking-normal text-slate-950 sm:text-5xl">
              Бърз начин да сравниш партийни позиции, обещания и действия.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Template събира кратки профили на партии: какво подкрепят, какво
              са обещали и какви действия са открити по тези обещания. Вместо
              да поставя присъда, сайтът ти дава източниците и контекста.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg">
                <Link href="/parties">
                  Разгледай партии
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link href="/quiz">Започни теста</Link>
              </Button>
            </div>
          </div>

          <Card className="overflow-hidden border-cyan-100">
            <CardHeader className="border-b border-slate-100 bg-cyan-50/70">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <CardTitle>Как работи</CardTitle>
                  <CardDescription>
                    Три стъпки, без претоварване на началната страница.
                  </CardDescription>
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
                  title: "Избираш партия",
                  text: "Виждаш позициите и проверените политики в един профил.",
                },
                {
                  icon: FileText,
                  title: "Отваряш сфера",
                  text: "Сферите са еднакви за всички партии, за да сравняваш по-лесно.",
                },
                {
                  icon: ExternalLink,
                  title: "Проверяваш източника",
                  text: "При проверените политики източниците стоят до твърдението и действието.",
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

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-4">
        <Card>
          <CardHeader>
            <Badge variant="neutral">Партии</Badge>
            <CardTitle>{parties.length} партии</CardTitle>
            <CardDescription>
              Всяка партия има собствен профил, за да не се превръща началната
              страница в дълъг списък.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="neutral">Сфери</Badge>
            <CardTitle>{policyAreas.length} общи сфери</CardTitle>
            <CardDescription>
              Сферите са еднакви за всички партии и помагат на теста да сравнява
              по една структура.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="neutral">Позиции</Badge>
            <CardTitle>{commonPolicies.length} позиции</CardTitle>
            <CardDescription>
              Това са общите въпроси, по които тестът сравнява теб и партиите.
            </CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <Badge variant="neutral">Проверки</Badge>
            <CardTitle>{policyEvidence.length} проверки</CardTitle>
            <CardDescription>
              Всяка проверка показва твърдение, намерено действие и източници в
              контекст.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <BookOpenCheck className="h-7 w-7 text-cyan-700" aria-hidden="true" />
              <CardTitle className="text-xl">Партийни профили</CardTitle>
              <CardDescription>
                Профилът показва позициите на партията по сфери. Ако има
                проверено обещание, то се появява под съответната позиция.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href="/parties">
                  Отвори списъка
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <Route className="h-7 w-7 text-cyan-700" aria-hidden="true" />
              <CardTitle className="text-xl">Тест за съвпадение</CardTitle>
              <CardDescription>
                Отговаряш само на позициите, които са важни за теб. Накрая
                виждаш кои партии са най-близо до твоите отговори.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary">
                <Link href="/quiz">Виж теста</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
