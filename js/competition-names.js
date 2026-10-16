// Presentation names only. Source names, tournament IDs and ranking keys stay
// stable so that existing careers and community manifests keep their identity.
const COMPETITION_NAMES = Object.freeze({
    pdcQSchool: { fictional: 'Pro Card Trials', real: 'Q-School' },
    womensSeries: { fictional: "Women's Pro Circuit", real: "PDC Women's Series" },
    womensWorldMatchplay: { fictional: "Women's Global Matchplay", real: "PDC Women's World Matchplay" },
    worldYouth: { fictional: 'Future Stars Championship', real: 'PDC World Youth Championship' }
});
let competitionNameOverrides = Object.create(null);

function competitionName(type) {
    return competitionNameOverrides[type] || COMPETITION_NAMES[type]?.fictional || type;
}

function configureCompetitionNames(modData) {
    const overrides = Object.create(null);
    // Also understand older full manifests without the optional names section.
    for (const event of modData?.tournamentDatabase || []) {
        const type = event.specialType;
        if (!COMPETITION_NAMES[type] || event.qualifierFor || event.worldYouthPhase === 'final') continue;
        let name = String(event.name || '').trim();
        if (type === 'pdcQSchool' && name === 'PDC Qualifying School') name = COMPETITION_NAMES[type].real;
        if (type === 'womensSeries') name = name.replace(/\s+\d+$/, '');
        if (name && name !== COMPETITION_NAMES[type].fictional) overrides[type] = name;
    }
    for (const type of Object.keys(COMPETITION_NAMES)) {
        const name = modData?.competitionNames?.[type];
        if (typeof name === 'string' && name.trim()) overrides[type] = name.trim();
    }
    competitionNameOverrides = overrides;
}

function competitionDisplayText(value) {
    let text = String(value ?? '');
    const replacements = [
        [/(?:PDC )?Women['’]s World Matchplay|Kobiecy World Matchplay|Kobiecego World Matchplay|Women['’]s Global Matchplay/g, 'womensWorldMatchplay'],
        [/(?:PDC )?Women['’]s Series(?: — Kobiecy Cykl PDC)?|Kobiecy Cykl PDC|Kobiecego Cyklu PDC|Women['’]s Pro Circuit/g, 'womensSeries'],
        [/(?:PDC )?World Youth Championship|Młodzieżowe Mistrzostwa Świata|młodzieżow(?:ych|e) M[Śś]|Future Stars Championship/g, 'worldYouth'],
        [/PDC Qualifying School|Q-School(?:u|a|em)?|Pro Card Trials/g, 'pdcQSchool']
    ];
    // Placeholders prevent one replacement from being processed a second time.
    replacements.forEach(([pattern, type], index) => { text = text.replace(pattern, () => `\u0001${index}\u0001`); });
    text = text.replace(/World Youth Champion\b/g, () => `${competitionName('worldYouth')} — Champion`)
        .replace(/World Youth(?= —)/g, () => competitionName('worldYouth'))
        .replace(/\bWSOOM\b/g, competitionNameOverrides.womensSeries ? 'WSOOM' : 'WPCOOM')
        .replace(/\bWS(?=\b|\d)/g, competitionNameOverrides.womensSeries ? 'WS' : 'WPC');
    return text.replace(/\u0001(\d)\u0001/g, (_, index) => competitionName(replacements[Number(index)][1]));
}

function competitionDisplayName(event) {
    const name = typeof event === 'string' ? event : event?.name || '';
    if (event?.editorModified || event?.isCustomTournament) return name;
    return competitionDisplayText(name);
}

function applyCompetitionCalendarNames(calendar) {
    for (const event of calendar || []) {
        if (!COMPETITION_NAMES[event.specialType] || event.editorModified || event.isCustomTournament) continue;
        const name = competitionDisplayName(event);
        if (name !== event.name) {
            // Keep the old key for prize histories, deleted-event markers and mods.
            event.sourceName ||= event.name;
            event.name = name;
        }
        if (event.qSchoolDisplayName) event.qSchoolDisplayName = competitionDisplayText(event.qSchoolDisplayName);
    }
    return calendar;
}

function refreshCompetitionNameLabels() {
    if (typeof document === 'undefined') return;
    const labels = {
        'btn-rank-womens-series': competitionName('womensSeries') + ' Order of Merit',
        'btn-rank-womens-world-matchplay': competitionName('womensWorldMatchplay'),
        'btn-rank-world-youth': competitionName('worldYouth')
    };
    for (const [id, text] of Object.entries(labels)) {
        const element = document.getElementById(id);
        if (element) element.textContent = text;
    }
    for (const element of document.querySelectorAll('[data-competition-name]')) {
        element.textContent = competitionName(element.dataset.competitionName);
    }
    if (typeof refreshPdcQSchoolTranslations === 'function') refreshPdcQSchoolTranslations();
}
if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('DOMContentLoaded', refreshCompetitionNameLabels);
}
