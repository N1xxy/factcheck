import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { PartyMark } from "@/components/party-mark";
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
import {
  commonPolicies,
  getEvidenceForParty,
  parties,
  policyAreas,
} from "@/lib/data";

export default function PartiesPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <SiteHeader />

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <Badge>Партии</Badge>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold">
            Избери партия и разгледай позициите по сфери.
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-slate-600">
            Във всеки профил има еднакви сфери и общи позиции за сравнение.
            Когато има конкретно обещание или твърдение, добавяме и проверка с
            източници.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-4 px-5 py-8 sm:px-8 md:grid-cols-2">
        {parties.map((party) => {
          const evidenceCount = getEvidenceForParty(party.slug).length;

          return (
            <Card key={party.slug} className={party.ringClass}>
              <CardHeader
                className={`${party.softClass} border-b border-slate-100`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <Badge variant="neutral">Партиен профил</Badge>
                    <CardTitle className={`mt-3 text-2xl ${party.accentClass}`}>
                      {party.name}
                    </CardTitle>
                    <CardDescription>{party.description}</CardDescription>
                  </div>
                  <PartyMark party={party} />
                </div>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="mb-5 grid grid-cols-3 gap-3">
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xl font-bold">{policyAreas.length}</div>
                    <div className="text-sm font-medium text-slate-500">
                      сфери
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xl font-bold">{commonPolicies.length}</div>
                    <div className="text-sm font-medium text-slate-500">
                      позиции
                    </div>
                  </div>
                  <div className="rounded-lg bg-slate-50 p-4">
                    <div className="text-xl font-bold">{evidenceCount}</div>
                    <div className="text-sm font-medium text-slate-500">
                      проверки
                    </div>
                  </div>
                </div>
                <Button asChild>
                  <Link href={`/parties/${party.slug}`}>
                    Отвори профила
                    <ArrowRight className="h-4 w-4" aria-hidden="true" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
