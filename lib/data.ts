export type PolicyArea = {
  slug: string;
  name: string;
  description: string;
};

export type EvidenceSource = {
  label: string;
  url: string;
};

export type PolicyEvidence = {
  id: string;
  partySlug: string;
  areaSlug: string;
  commonPolicyId?: string;
  policyName: string;
  comparisonSignal: "mismatch" | "insufficient_data" | "matches";
  claims: Array<{
    text: string;
    source: EvidenceSource;
  }>;
  actions: Array<{
    text: string;
    source?: EvidenceSource;
  }>;
};

export type Party = {
  slug: string;
  name: string;
  shortName: string;
  description: string;
  logoMark: string;
  primaryColor: string;
  gradientClass: string;
  accentClass: string;
  softClass: string;
  ringClass: string;
};

export type CommonPolicy = {
  id: string;
  areaSlug: string;
  title: string;
  question: string;
  description: string;
};

export type PartyPosition = {
  partySlug: string;
  commonPolicyId: string;
  supportLevel: number;
  reasoning: string;
  source?: EvidenceSource;
};

export const policyAreas: PolicyArea[] = [
  {
    slug: "healthcare",
    name: "Здравеопазване",
    description: "Болници, достъп до лечение, електронно здравеопазване.",
  },
  {
    slug: "education",
    name: "Образование",
    description: "Училища, учители, учебници и достъп до качествено обучение.",
  },
  {
    slug: "housing",
    name: "Жилища",
    description: "Достъпни жилища, наеми, млади семейства и градска среда.",
  },
  {
    slug: "environment",
    name: "Климат и енергия",
    description: "Енергийна политика, замърсяване и зелена трансформация.",
  },
  {
    slug: "transparency",
    name: "Прозрачност",
    description: "Антикорупция, публични данни и контрол върху институциите.",
  },
];

export const parties: Party[] = [
  {
    slug: "demokratichna-bulgaria",
    name: "Демократична България",
    shortName: "ДБ",
    description:
      "Профил с фокус върху институционална реформа, дигитализация, образование и здравеопазване.",
    logoMark: "ДБ",
    primaryColor: "#0b78be",
    gradientClass: "from-[#0b78be] via-[#00a86b] to-[#ffd43b]",
    accentClass: "text-[#075985]",
    softClass: "bg-sky-50",
    ringClass: "border-sky-200",
  },
  {
    slug: "gerb-sds",
    name: "ГЕРБ-СДС",
    shortName: "ГЕРБ-СДС",
    description:
      "Профил с фокус върху инфраструктура, публични услуги, образование и местно развитие.",
    logoMark: "Г",
    primaryColor: "#0c4da2",
    gradientClass: "from-[#0c4da2] to-[#2176d2]",
    accentClass: "text-[#0c4da2]",
    softClass: "bg-blue-50",
    ringClass: "border-blue-200",
  },
  {
    slug: "anti-human-party",
    name: "Античовешка партия",
    shortName: "АЧП",
    description:
      "Фалшива контролна партия за теста. Не е реален политически субект.",
    logoMark: "АЧ",
    primaryColor: "#475569",
    gradientClass: "from-slate-700 to-slate-500",
    accentClass: "text-slate-700",
    softClass: "bg-slate-100",
    ringClass: "border-slate-300",
  },
];

export const commonPolicies: CommonPolicy[] = [
  {
    id: "childrens-hospital",
    areaSlug: "healthcare",
    title: "Национална детска болница",
    question:
      "Държавата трябва приоритетно да инвестира в специализирана детска болница.",
    description:
      "Използва се за теста, защото е конкретна и разбираема здравна позиция.",
  },
  {
    id: "e-health",
    areaSlug: "healthcare",
    title: "Електронно здравеопазване",
    question:
      "Здравеопазването трябва да се дигитализира чрез електронни рецепти, досиета и обмен на данни.",
    description:
      "Обща позиция за дигитализация на системата, отделна от конкретни обещания.",
  },
  {
    id: "doctor-access",
    areaSlug: "healthcare",
    title: "Достъп до лекари в малки населени места",
    question:
      "Държавата трябва да финансира мобилни екипи и телемедицина за отдалечени райони.",
    description:
      "Подходяща позиция за хора, за които регионалният достъп е водещ.",
  },
  {
    id: "free-textbooks",
    areaSlug: "education",
    title: "Безплатни учебници",
    question:
      "Учебниците за учениците трябва да бъдат осигурявани безплатно от държавата.",
    description:
      "Конкретна образователна мярка, която лесно се проверява през бюджет и решения.",
  },
  {
    id: "teacher-pay",
    areaSlug: "education",
    title: "Учителски заплати",
    question:
      "Заплатите на учителите трябва да останат значително над средната заплата за страната.",
    description:
      "Позиция за финансиране и привличане на кадри в образованието.",
  },
  {
    id: "dual-education",
    areaSlug: "education",
    title: "Дуално и професионално обучение",
    question:
      "Средното образование трябва по-силно да се свърже с бизнеса и пазара на труда.",
    description:
      "Политика с по-различен идеологически профил от общото увеличение на разходи.",
  },
  {
    id: "affordable-housing",
    areaSlug: "housing",
    title: "Достъпни жилища",
    question:
      "Държавата трябва активно да подпомага достъпни жилища за млади хора и семейства.",
    description:
      "Социална и градска политика, която може да се развие с повече данни.",
  },
  {
    id: "clean-energy",
    areaSlug: "environment",
    title: "Чиста енергия",
    question:
      "Климатът и чистата енергия трябва да са водещ приоритет в икономическата политика.",
    description:
      "Общ въпрос за баланса между енергийна сигурност, цени и климат.",
  },
  {
    id: "open-data",
    areaSlug: "transparency",
    title: "Отворени данни и контрол",
    question:
      "Институциите трябва да публикуват повече данни и да улесняват гражданския контрол.",
    description:
      "Тема за прозрачност, която може да се сравнява между всички партии.",
  },
];

export const partyPositions: PartyPosition[] = [
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "childrens-hospital",
    supportLevel: 5,
    reasoning:
      "Детското здравеопазване и Националната детска болница са поставяни сред приоритетите.",
    source: {
      label: "Източник: партийна програма",
      url: "https://example.com/position-db-childrens-hospital",
    },
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "e-health",
    supportLevel: 5,
    reasoning:
      "Партията поставя дигитализацията на здравеопазването сред реформите, които подкрепя.",
    source: {
      label: "Източник: здравна програма",
      url: "https://example.com/position-db-e-health",
    },
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "doctor-access",
    supportLevel: 3,
    reasoning:
      "Има обща подкрепа за достъп до здравеопазване, но не е намерена достатъчно конкретна позиция за мобилни екипи.",
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "free-textbooks",
    supportLevel: 5,
    reasoning:
      "Безплатните учебници са представяни като част от подкрепата за ученици и родители.",
    source: {
      label: "Източник: публична позиция",
      url: "https://example.com/position-db-free-textbooks",
    },
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "teacher-pay",
    supportLevel: 4,
    reasoning:
      "Партията подкрепя по-добро финансиране и модернизация на образованието.",
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "dual-education",
    supportLevel: 3,
    reasoning:
      "Намерена е по-обща подкрепа за връзка с пазара на труда, но не силно отделена позиция.",
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "clean-energy",
    supportLevel: 4,
    reasoning:
      "Партията обикновено поставя по-силен акцент върху зелена трансформация и чиста енергия.",
  },
  {
    partySlug: "demokratichna-bulgaria",
    commonPolicyId: "open-data",
    supportLevel: 5,
    reasoning:
      "Прозрачност, електронно управление и контрол върху институциите са сред основните акценти.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "childrens-hospital",
    supportLevel: 4,
    reasoning:
      "Партията заявява подкрепа за развитие на здравната инфраструктура, включително детско здравеопазване.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "e-health",
    supportLevel: 4,
    reasoning:
      "Подкрепя се модернизация на публичните услуги, включително дигитални решения в здравеопазването.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "doctor-access",
    supportLevel: 4,
    reasoning:
      "Има заявена подкрепа за телемедицина, мобилни екипи и достъп в малки населени места.",
    source: {
      label: "Източник: здравна позиция",
      url: "https://example.com/position-gerb-doctor-access",
    },
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "free-textbooks",
    supportLevel: 4,
    reasoning:
      "Позицията е по-скоро подкрепяща, но в прототипа трябва да се добави по-точен източник.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "teacher-pay",
    supportLevel: 5,
    reasoning:
      "Партията изрично говори за заплати на педагогическите специалисти над 125% от средната брутна заплата.",
    source: {
      label: "Източник: предизборна платформа",
      url: "https://example.com/position-gerb-teacher-pay",
    },
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "dual-education",
    supportLevel: 4,
    reasoning:
      "Партията подкрепя разширяване на професионалното и дуалното обучение.",
    source: {
      label: "Източник: образователна програма",
      url: "https://example.com/position-gerb-dual-education",
    },
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "affordable-housing",
    supportLevel: 3,
    reasoning:
      "Не е намерена силно изразена позиция в прототипните данни, затова стойността е неутрална.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "clean-energy",
    supportLevel: 3,
    reasoning:
      "Позицията изглежда балансира между енергийна сигурност, цена и климатични цели.",
  },
  {
    partySlug: "gerb-sds",
    commonPolicyId: "open-data",
    supportLevel: 3,
    reasoning:
      "Няма достатъчно ясно изразена позиция в прототипните данни.",
  },
  ...commonPolicies.map((policy) => ({
    partySlug: "anti-human-party",
    commonPolicyId: policy.id,
    supportLevel: 1,
    reasoning: "Контролна фиктивна партия, която не подкрепя нито една позиция.",
  })),
];

export const policyEvidence: PolicyEvidence[] = [
  {
    id: "db-childrens-hospital",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "healthcare",
    commonPolicyId: "childrens-hospital",
    policyName: "Национална детска болница",
    comparisonSignal: "insufficient_data",
    claims: [
      {
        text: "Партията поставя детското здравеопазване и проекта за Национална детска болница сред приоритетите си.",
        source: {
          label: "Източник: партийна програма",
          url: "https://example.com/claim-childrens-hospital",
        },
      },
    ],
    actions: [
      {
        text: "Има парламентарни решения и публични отчети за напредък по планиране, оборудване и кадрово обезпечаване.",
        source: {
          label: "Източник: парламентарен запис",
          url: "https://example.com/action-childrens-hospital",
        },
      },
    ],
  },
  {
    id: "db-e-prescriptions",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "healthcare",
    commonPolicyId: "e-health",
    policyName: "Електронни рецепти",
    comparisonSignal: "matches",
    claims: [
      {
        text: "В програмни документи се подкрепя дигитализация на здравната система и електронни услуги.",
        source: {
          label: "Източник: здравна програма",
          url: "https://example.com/claim-e-prescriptions",
        },
      },
    ],
    actions: [
      {
        text: "Въведени са електронни рецепти за определени групи лекарства, включително антибиотици.",
        source: {
          label: "Източник: Министерство на здравеопазването",
          url: "https://example.com/action-e-prescriptions",
        },
      },
    ],
  },
  {
    id: "db-free-textbooks",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "education",
    commonPolicyId: "free-textbooks",
    policyName: "Безплатни учебници от I до XII клас",
    comparisonSignal: "matches",
    claims: [
      {
        text: "Партията представя безплатните учебници за целия училищен курс като част от подкрепата за родители и ученици.",
        source: {
          label: "Източник: публична позиция",
          url: "https://example.com/claim-free-textbooks",
        },
      },
    ],
    actions: [
      {
        text: "Правителството осигурява средства за безплатни учебници за ученици от I до XII клас.",
        source: {
          label: "Източник: Министерски съвет",
          url: "https://example.com/action-free-textbooks",
        },
      },
    ],
  },
  {
    id: "gerb-teacher-pay",
    partySlug: "gerb-sds",
    areaSlug: "education",
    commonPolicyId: "teacher-pay",
    policyName: "Учителски заплати",
    comparisonSignal: "insufficient_data",
    claims: [
      {
        text: "Партията заявява подкрепа за заплати на педагогическите специалисти над 125% от средната брутна заплата.",
        source: {
          label: "Източник: предизборна платформа",
          url: "https://example.com/claim-teacher-pay",
        },
      },
    ],
    actions: [
      {
        text: "Проучването трябва да се свърже с бюджетни данни и конкретни разчети за заплатите.",
      },
    ],
  },
  {
    id: "gerb-dual-education",
    partySlug: "gerb-sds",
    areaSlug: "education",
    commonPolicyId: "dual-education",
    policyName: "Професионално и дуално обучение",
    comparisonSignal: "insufficient_data",
    claims: [
      {
        text: "Партията подкрепя разширяване на професионалното образование и дуалното обучение.",
        source: {
          label: "Източник: образователна програма",
          url: "https://example.com/claim-dual-education",
        },
      },
    ],
    actions: [
      {
        text: "Проучването трябва да добави данни от МОН, законови промени или бюджетни линии.",
      },
    ],
  },
  {
    id: "gerb-mobile-healthcare",
    partySlug: "gerb-sds",
    areaSlug: "healthcare",
    commonPolicyId: "doctor-access",
    policyName: "Достъп до лекари в малки населени места",
    comparisonSignal: "mismatch",
    claims: [
      {
        text: "Партията говори за телемедицина, мобилни медицински екипи и по-добър достъп в отдалечени райони.",
        source: {
          label: "Източник: здравна позиция",
          url: "https://example.com/claim-mobile-healthcare",
        },
      },
    ],
    actions: [
      {
        text: "Проучването трябва да провери пилотни програми, наредби или финансиране от Министерството на здравеопазването.",
      },
    ],
  },
];

export function getParty(slug: string) {
  return parties.find((party) => party.slug === slug);
}

export function getEvidenceForParty(slug: string) {
  return policyEvidence.filter((item) => item.partySlug === slug);
}

export function getEvidenceForPartyArea(partySlug: string, areaSlug: string) {
  return policyEvidence.filter(
    (item) => item.partySlug === partySlug && item.areaSlug === areaSlug,
  );
}

export function getCommonPoliciesForArea(areaSlug: string) {
  return commonPolicies.filter((policy) => policy.areaSlug === areaSlug);
}

export function getEvidenceForCommonPolicy(
  partySlug: string,
  commonPolicyId: string,
) {
  return policyEvidence.find(
    (item) =>
      item.partySlug === partySlug && item.commonPolicyId === commonPolicyId,
  );
}

export function getPartyPosition(partySlug: string, commonPolicyId: string) {
  return partyPositions.find(
    (position) =>
      position.partySlug === partySlug &&
      position.commonPolicyId === commonPolicyId,
  );
}
