import Link from "next/link";
import { ArrowRight, BarChart3 } from "lucide-react";

import { QuizExperience } from "@/components/quiz-experience";
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

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Badge>Тест</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold">
            Разбери кои партии са най-близо до твоите позиции.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Отвори сферите, избери позициите, които те интересуват, и отговори
            по скала от 1 до 5. Партиите се показват чак в резултатите.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <Card className="border-cyan-100">
          <CardHeader>
            <BarChart3 className="h-7 w-7 text-cyan-700" aria-hidden="true" />
            <CardTitle>Как ще се смята резултатът</CardTitle>
            <CardDescription>
              Сравняваме твоите отговори с позициите на всяка партия. Колкото
              по-малка е разликата, толкова по-високо е съвпадението.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/parties">
                Виж партийните профили
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="mx-auto max-w-7xl px-5 pb-8 sm:px-8">
        <QuizExperience />
      </section>
    </main>
  );
}
