import csv
import re
import sys
import unicodedata
from pathlib import Path


SOURCE_COLUMNS = {
    "AREA",
    "POLICY",
    "CLAIM",
    "ACTION",
    "PARTY SUPPORT",
    "PARTY",
    "CLAIM SOURCE",
    "ACTION SOURCE",
}

PARTY_NAMES = {
    "ПП": ("pp", "Продължаваме Промяната", "#0b78be"),
    "ДБ": ("db", "Демократична България", "#00a86b"),
    "ПП-ДБ": ("pp-db", "ПП-ДБ", "#0b78be"),
}

SPHERE_SLUGS = {
    "Здравеопазване": "healthcare",
    "Бюджет": "budget",
    "Данъци": "taxes",
    "Съдебна реформа": "judicial-reform",
    "Антикорупция": "anti-corruption",
    "Образование": "education",
    "Социална държава и доходи": "social-policy-income",
    "Енергетика": "energy",
    "ЕС": "eu",
    "Русия/Украйна": "russia-ukraine",
}

POLICY_SLUGS = {
    "Електронно здравеопазване": "e-health",
    "Достъп до услуги": "healthcare-access",
    "Медицински кадри": "medical-staff",
    "Повишаване на приходите": "revenue-growth",
    "Социални разходи": "social-spending",
    "Икономически растеж": "economic-growth",
    "Плосък данък": "flat-tax",
    "Данъчна събираемост": "tax-collection",
    "Данъчни облекчения": "tax-relief",
    "Главен прокурор": "chief-prosecutor",
    "ВСС": "supreme-judicial-council",
    "Независим съд": "independent-court",
    "КПКОНПИ": "anti-corruption-commission",
    "Обществени поръчки": "public-procurement",
    "Завладяна държава": "captured-state",
    "Учителски заплати": "teacher-pay",
    "STEM обучение": "stem-education",
    "Дигитализация": "digitalization",
    "По-високи пенсии": "higher-pensions",
    "Социални помощи": "social-benefits",
    "Семейна политика": "family-policy",
    "Газова диверсификация": "gas-diversification",
    "Ядрена енергия": "nuclear-energy",
    "Зелен преход": "green-transition",
    "Еврозона": "eurozone",
    "Шенген": "schengen",
    "НАТО": "nato",
    "Помощ за Украйна": "ukraine-aid",
    "Санкции срещу Русия": "russia-sanctions",
    "Контрол на разходите": "healthcare-spending-control",
    "Конкуренция": "healthcare-competition",
    "Фискална дисциплина": "fiscal-discipline",
    "Прозрачност": "budget-transparency",
    "Ефективност": "budget-efficiency",
    "Предвидимост": "tax-predictability",
    "Ниско данъчно бреме": "low-tax-burden",
    "Прокуратура и ВСС": "prosecution-and-sjc",
    "Независимост": "judicial-independence",
    "КПКОНПИ и Прозрачност": "anti-corruption-transparency",
    "Конфликт на интереси": "conflict-of-interest",
    "Автономия": "school-autonomy",
    "Качество": "education-quality",
    "Устойчив модел на пенсиите": "sustainable-pensions",
    "Социална подкрепа": "social-support",
    "Доходи": "income-growth",
    "Диверсификация": "energy-diversification",
    "Военна помощ": "military-aid",
    "Санкции": "sanctions",
    "Ограничаване на руско влияние": "limit-russian-influence",
    "Конституционни промени": "constitutional-changes",
    "Реформа на КПКОНПИ": "anti-corruption-commission-reform",
    "Подкрепа за Украйна": "support-for-ukraine",
    "Модернизация": "education-modernization",
    "Пенсии": "pensions",
    "Финансова стабилност": "financial-stability",
}

INSUFFICIENT_MARKERS = (
    "трябва",
    "необходимо",
    "ограничен",
    "частич",
    "зависим",
    "остава",
    "забав",
    "предложения",
    "инициативи",
    "политически",
    "публични позиции",
)

MISMATCH_MARKERS = (
    "блокирана",
    "орязани",
    "без структурна реформа",
    "без дълбока структурна реформа",
    "не напълно",
    "ограничен практически ефект",
)


def clean(value: str | None) -> str:
    return " ".join((value or "").replace("\ufeff", "").strip().split())


def slugify(value: str) -> str:
    normalized = unicodedata.normalize("NFKD", value)
    ascii_value = normalized.encode("ascii", "ignore").decode("ascii")
    slug = re.sub(r"[^a-zA-Z0-9]+", "-", ascii_value.lower()).strip("-")
    return slug or re.sub(r"\W+", "-", value.lower(), flags=re.UNICODE).strip("-")


def unique_slug(base: str, existing: set[str]) -> str:
    candidate = base
    counter = 2
    while candidate in existing:
        candidate = f"{base}-{counter}"
        counter += 1
    existing.add(candidate)
    return candidate


def get_party(row: dict[str, str]) -> tuple[str, str, str, str]:
    raw = clean(row["PARTY"])
    slug, name, color = PARTY_NAMES.get(raw, (slugify(raw), raw, "#64748b"))
    return slug, name, raw, color


def get_sphere_slug(area: str) -> str:
    return SPHERE_SLUGS.get(area, slugify(area))


def get_policy_base_slug(policy: str) -> str:
    return POLICY_SLUGS.get(policy, slugify(policy))


def comparison_signal(action: str, action_source: str) -> str:
    text = action.lower()
    if any(marker in text for marker in MISMATCH_MARKERS):
        return "mismatch"
    if not action_source or any(marker in text for marker in INSUFFICIENT_MARKERS):
        return "insufficient_data"
    return "matches"


def read_rows(source: Path) -> list[dict[str, str]]:
    with source.open("r", encoding="utf-8-sig", newline="") as handle:
        reader = csv.DictReader(handle)
        if set(reader.fieldnames or []) != SOURCE_COLUMNS:
            raise ValueError(f"Unexpected columns: {reader.fieldnames}")
        return [{key: clean(value) for key, value in row.items()} for row in reader]


def write_csv(path: Path, fieldnames: list[str], rows: list[dict[str, object]]) -> None:
    with path.open("w", encoding="utf-8", newline="") as handle:
        writer = csv.DictWriter(handle, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def transform(source: Path, output_dir: Path) -> None:
    rows = read_rows(source)
    output_dir.mkdir(parents=True, exist_ok=True)

    parties: dict[str, dict[str, object]] = {}
    spheres: dict[str, dict[str, object]] = {}
    common_policies: dict[tuple[str, str], dict[str, object]] = {}
    party_positions: dict[tuple[str, str], dict[str, object]] = {}
    checks: list[dict[str, object]] = []
    claims: list[dict[str, object]] = []
    actions: list[dict[str, object]] = []
    used_check_slugs: set[str] = set()
    used_policy_slugs: set[str] = set()
    policy_slug_by_key: dict[tuple[str, str], str] = {}

    for row in rows:
        area = clean(row["AREA"])
        policy = clean(row["POLICY"])
        claim = clean(row["CLAIM"])
        action = clean(row["ACTION"])
        party_slug, party_name, short_name, color_hex = get_party(row)
        sphere_slug = get_sphere_slug(area)
        policy_key = (sphere_slug, policy)
        if policy_key not in policy_slug_by_key:
            base_policy_slug = get_policy_base_slug(policy)
            if base_policy_slug in used_policy_slugs:
                base_policy_slug = f"{sphere_slug}-{base_policy_slug}"
            policy_slug_by_key[policy_key] = unique_slug(
                base_policy_slug,
                used_policy_slugs,
            )
        policy_slug = policy_slug_by_key[policy_key]

        parties[party_slug] = {
            "party_slug": party_slug,
            "party_name": party_name,
            "short_name": short_name,
            "color_hex": color_hex,
        }
        spheres[sphere_slug] = {
            "sphere_slug": sphere_slug,
            "sphere_name": area,
            "description": "",
        }
        common_policies[(sphere_slug, policy_slug)] = {
            "policy_slug": policy_slug,
            "sphere_slug": sphere_slug,
            "title": policy,
            "opinion_statement": claim,
        }

        support = clean(row["PARTY SUPPORT"])
        party_positions[(party_slug, policy_slug)] = {
            "party_slug": party_slug,
            "policy_slug": policy_slug,
            "support_level": support,
            "reasoning": claim,
            "source_url": clean(row["CLAIM SOURCE"]),
            "source_title": "",
        }

        check_slug = unique_slug(f"{party_slug}-{policy_slug}", used_check_slugs)
        checks.append(
            {
                "check_slug": check_slug,
                "party_slug": party_slug,
                "sphere_slug": sphere_slug,
                "policy_slug": policy_slug,
                "title": policy,
                "comparison_signal": comparison_signal(action, clean(row["ACTION SOURCE"])),
            }
        )
        claims.append(
            {
                "check_slug": check_slug,
                "claim_text": claim,
                "source_url": clean(row["CLAIM SOURCE"]),
                "source_title": "",
                "source_date": "",
            }
        )
        actions.append(
            {
                "check_slug": check_slug,
                "action_text": action,
                "source_url": clean(row["ACTION SOURCE"]),
                "source_title": "",
                "source_date": "",
            }
        )

    write_csv(
        output_dir / "01_parties.csv",
        ["party_slug", "party_name", "short_name", "color_hex"],
        sorted(parties.values(), key=lambda row: str(row["party_slug"])),
    )
    write_csv(
        output_dir / "02_spheres.csv",
        ["sphere_slug", "sphere_name", "description"],
        sorted(spheres.values(), key=lambda row: str(row["sphere_slug"])),
    )
    write_csv(
        output_dir / "03_common_policies.csv",
        ["policy_slug", "sphere_slug", "title", "opinion_statement"],
        sorted(common_policies.values(), key=lambda row: str(row["policy_slug"])),
    )
    write_csv(
        output_dir / "04_party_positions.csv",
        [
            "party_slug",
            "policy_slug",
            "support_level",
            "reasoning",
            "source_url",
            "source_title",
        ],
        sorted(
            party_positions.values(),
            key=lambda row: (str(row["party_slug"]), str(row["policy_slug"])),
        ),
    )
    write_csv(
        output_dir / "05_policy_checks.csv",
        [
            "check_slug",
            "party_slug",
            "sphere_slug",
            "policy_slug",
            "title",
            "comparison_signal",
        ],
        checks,
    )
    write_csv(
        output_dir / "06_claims.csv",
        ["check_slug", "claim_text", "source_url", "source_title", "source_date"],
        claims,
    )
    write_csv(
        output_dir / "07_actions.csv",
        ["check_slug", "action_text", "source_url", "source_title", "source_date"],
        actions,
    )


def main() -> int:
    if len(sys.argv) != 3:
        print("Usage: refactor_research_csv.py <source.csv> <output_dir>")
        return 2

    transform(Path(sys.argv[1]), Path(sys.argv[2]))
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
