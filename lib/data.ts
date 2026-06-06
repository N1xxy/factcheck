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
  claim: string;
  claimSource: EvidenceSource;
  action: string;
  actionSource?: EvidenceSource;
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
  partyStances: Record<string, number>;
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
    partyStances: {
      "demokratichna-bulgaria": 5,
      "gerb-sds": 4,
      "anti-human-party": 1,
    },
  },
  {
    id: "e-health",
    areaSlug: "healthcare",
    title: "Електронно здравеопазване",
    question:
      "Здравеопазването трябва да се дигитализира чрез електронни рецепти, досиета и обмен на данни.",
    description:
      "Обща позиция за дигитализация на системата, отделна от конкретни обещания.",
    partyStances: {
      "demokratichna-bulgaria": 5,
      "gerb-sds": 4,
      "anti-human-party": 1,
    },
  },
  {
    id: "doctor-access",
    areaSlug: "healthcare",
    title: "Достъп до лекари в малки населени места",
    question:
      "Държавата трябва да финансира мобилни екипи и телемедицина за отдалечени райони.",
    description:
      "Подходяща позиция за хора, за които регионалният достъп е водещ.",
    partyStances: {
      "demokratichna-bulgaria": 3,
      "gerb-sds": 4,
      "anti-human-party": 1,
    },
  },
  {
    id: "free-textbooks",
    areaSlug: "education",
    title: "Безплатни учебници",
    question:
      "Учебниците за учениците трябва да бъдат осигурявани безплатно от държавата.",
    description:
      "Конкретна образователна мярка, която лесно се проверява през бюджет и решения.",
    partyStances: {
      "demokratichna-bulgaria": 5,
      "gerb-sds": 4,
      "anti-human-party": 1,
    },
  },
  {
    id: "teacher-pay",
    areaSlug: "education",
    title: "Учителски заплати",
    question:
      "Заплатите на учителите трябва да останат значително над средната заплата за страната.",
    description:
      "Позиция за финансиране и привличане на кадри в образованието.",
    partyStances: {
      "demokratichna-bulgaria": 4,
      "gerb-sds": 5,
      "anti-human-party": 1,
    },
  },
  {
    id: "dual-education",
    areaSlug: "education",
    title: "Дуално и професионално обучение",
    question:
      "Средното образование трябва по-силно да се свърже с бизнеса и пазара на труда.",
    description:
      "Политика с по-различен идеологически профил от общото увеличение на разходи.",
    partyStances: {
      "demokratichna-bulgaria": 3,
      "gerb-sds": 4,
      "anti-human-party": 1,
    },
  },
  {
    id: "affordable-housing",
    areaSlug: "housing",
    title: "Достъпни жилища",
    question:
      "Държавата трябва активно да подпомага достъпни жилища за млади хора и семейства.",
    description:
      "Социална и градска политика, която може да се развие с повече данни.",
    partyStances: {
      "demokratichna-bulgaria": 3,
      "gerb-sds": 3,
      "anti-human-party": 1,
    },
  },
  {
    id: "clean-energy",
    areaSlug: "environment",
    title: "Чиста енергия",
    question:
      "Климатът и чистата енергия трябва да са водещ приоритет в икономическата политика.",
    description:
      "Общ въпрос за баланса между енергийна сигурност, цени и климат.",
    partyStances: {
      "demokratichna-bulgaria": 4,
      "gerb-sds": 3,
      "anti-human-party": 1,
    },
  },
  {
    id: "open-data",
    areaSlug: "transparency",
    title: "Отворени данни и контрол",
    question:
      "Институциите трябва да публикуват повече данни и да улесняват гражданския контрол.",
    description:
      "Тема за прозрачност, която може да се сравнява между всички партии.",
    partyStances: {
      "demokratichna-bulgaria": 5,
      "gerb-sds": 3,
      "anti-human-party": 1,
    },
  },
];

export const policyEvidence: PolicyEvidence[] = [
  {
    id: "db-childrens-hospital",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "healthcare",
    commonPolicyId: "childrens-hospital",
    policyName: "Национална детска болница",
    claim:
      "Партията поставя детското здравеопазване и проекта за Национална детска болница сред приоритетите си.",
    claimSource: {
      label: "Източник: партийна програма",
      url: "https://example.com/claim-childrens-hospital",
    },
    action:
      "Има парламентарни решения и публични отчети за напредък по планиране, оборудване и кадрово обезпечаване.",
    actionSource: {
      label: "Източник: парламентарен запис",
      url: "https://example.com/action-childrens-hospital",
    },
  },
  {
    id: "db-e-prescriptions",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "healthcare",
    commonPolicyId: "e-health",
    policyName: "Електронни рецепти",
    claim:
      "В програмни документи се подкрепя дигитализация на здравната система и електронни услуги.",
    claimSource: {
      label: "Източник: здравна програма",
      url: "https://example.com/claim-e-prescriptions",
    },
    action:
      "Въведени са електронни рецепти за определени групи лекарства, включително антибиотици.",
    actionSource: {
      label: "Източник: Министерство на здравеопазването",
      url: "https://example.com/action-e-prescriptions",
    },
  },
  {
    id: "db-free-textbooks",
    partySlug: "demokratichna-bulgaria",
    areaSlug: "education",
    commonPolicyId: "free-textbooks",
    policyName: "Безплатни учебници от I до XII клас",
    claim:
      "Партията представя безплатните учебници за целия училищен курс като част от подкрепата за родители и ученици.",
    claimSource: {
      label: "Източник: публична позиция",
      url: "https://example.com/claim-free-textbooks",
    },
    action:
      "Правителството осигурява средства за безплатни учебници за ученици от I до XII клас.",
    actionSource: {
      label: "Източник: Министерски съвет",
      url: "https://example.com/action-free-textbooks",
    },
  },
  {
    id: "gerb-teacher-pay",
    partySlug: "gerb-sds",
    areaSlug: "education",
    commonPolicyId: "teacher-pay",
    policyName: "Учителски заплати",
    claim:
      "Партията заявява подкрепа за заплати на педагогическите специалисти над 125% от средната брутна заплата.",
    claimSource: {
      label: "Източник: предизборна платформа",
      url: "https://example.com/claim-teacher-pay",
    },
    action:
      "Проучването трябва да се свърже с бюджетни данни и конкретни разчети за заплатите.",
  },
  {
    id: "gerb-dual-education",
    partySlug: "gerb-sds",
    areaSlug: "education",
    commonPolicyId: "dual-education",
    policyName: "Професионално и дуално обучение",
    claim:
      "Партията подкрепя разширяване на професионалното образование и дуалното обучение.",
    claimSource: {
      label: "Източник: образователна програма",
      url: "https://example.com/claim-dual-education",
    },
    action:
      "Проучването трябва да добави данни от МОН, законови промени или бюджетни линии.",
  },
  {
    id: "gerb-mobile-healthcare",
    partySlug: "gerb-sds",
    areaSlug: "healthcare",
    commonPolicyId: "doctor-access",
    policyName: "Достъп до лекари в малки населени места",
    claim:
      "Партията говори за телемедицина, мобилни медицински екипи и по-добър достъп в отдалечени райони.",
    claimSource: {
      label: "Източник: здравна позиция",
      url: "https://example.com/claim-mobile-healthcare",
    },
    action:
      "Проучването трябва да провери пилотни програми, наредби или финансиране от Министерството на здравеопазването.",
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
