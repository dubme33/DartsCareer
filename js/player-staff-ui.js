const PLAYER_STAFF_TEXT = {
    pl: {
        title: 'Sztab zawodnika', tile: '{used}/{limit} miejsc · pensje {amount}/miesiąc',
        intro: 'Trzy miejsca, sześć specjalizacji. Wybierz wsparcie dla treningu, psychiki, regeneracji lub finansów. W sztabie może być tylko jedna osoba z każdej roli.',
        terms: 'Przy zatrudnieniu: podpis + pierwsza pensja. Potem pensja co miesiąc. Brak pieniędzy na wypłatę kończy umowę. W starszych zapisach nowe stawki obowiązują od kolejnej pensji, bez dopłat za opłacony okres.',
        budget: 'Dostępny budżet', slots: 'Zajęte miejsca', payroll: 'Pensje / miesiąc', team: 'Twój sztab', market: 'Dostępni specjaliści',
        filter: 'Specjalizacja', all: 'Wszystkie role', scoring: 'Trener punktacji', doubles: 'Trener podwójnych', physio: 'Fizjoterapeuta', manager: 'Menedżer',
        level: 'Poziom {level}/3', signingFee: 'Opłata za podpis', salary: 'Pensja miesięczna', total: 'Do zapłaty teraz', firstSalary: 'Podpis + pierwsza pensja',
        scoringBonus: '+{bonus}% XP za sesje treningu punktacji.', doublesBonus: '+{bonus}% XP za sesje treningu podwójnych.',
        fitness: 'Trener przygotowania fizycznego', fitnessBonus: '+{bonus}% XP z treningu wytrzymałości. Bez natychmiastowego wzrostu cechy i bez wpływu na bazowy OVR.',
        psychologist: 'Psycholog sportowy', psychologistBonus: '+{bonus}% XP z treningu odporności psychicznej. Bez natychmiastowego wzrostu cechy i bez wpływu na bazowy OVR.',
        physioBonus: '+{bonus} pkt energii w dniu odpoczynku (łącznie {total}, maks. 100). Bez regeneracji podczas treningu.',
        managerBonus: '+{bonus}% do miesięcznych wypłat zwykłych sponsorów. Bez partnera technicznego, premii za cele i nagród turniejowych.',
        hire: 'Zatrudnij: {name}', dismiss: 'Zwolnij: {name}', employed: 'W Twoim sztabie', roleTaken: 'Ta rola jest już zajęta', full: 'Brak wolnego miejsca', funds: 'Za mało pieniędzy', busy: 'Trwa symulacja', unavailable: 'Niedostępny',
        empty: 'Nie masz jeszcze sztabu. Poniżej porównasz bonusy, opłaty za podpis i pensje.', nextPay: 'Następna pensja: {date} · {amount}', signed: 'Współpraca od {date}',
        overdue: 'Zaległa pensja — bonus wyłączony. Rozliczenie przy zmianie dnia.',
        rulesTitle: 'Jak działają umowy?',
        rules: 'Pensja jest płatna z góry. Przy zatrudnieniu płacisz za podpis i pierwszy miesiąc. Kolejne pensje pobieramy na początku dnia, co miesiąc w dniu podpisania umowy, przed wpływami od sponsorów. W krótszym miesiącu wypłata przypada na jego ostatni dzień. Jeśli nie wystarczy pieniędzy, umowa kończy się automatycznie i bonus znika. Wypłaty w tym samym dniu rozliczamy w kolejności zatrudnienia. Zwolnienie jest bezpłatne, bez zwrotu opłat; ponowne zatrudnienie wymaga nowego podpisu i pierwszej pensji. Bonusy trenerów mnożą XP po premii ze sprzętu, nie zmieniają limitu treningów ani bezpośrednio OVR. Sztab nie zmienia pieniędzy w rankingach.',
        confirmHire: 'Zatrudnić: {name}?\n\nPodpis: {fee}\nPierwsza pensja: {salary}\nRazem teraz: {total}\nKolejna pensja: {date}\n\n{bonus}\n\nBrak pieniędzy w dniu wypłaty zakończy współpracę. Opłaty nie podlegają zwrotowi.',
        confirmDismiss: 'Zakończyć współpracę z: {name}?\nBonus przestanie działać od razu. Nie ma odprawy ani zwrotu podpisu i opłaconej pensji.',
        hired: 'Zatrudniono: {name}. Pobrano {fee} za podpis i {salary} pierwszej pensji. Kolejna pensja: {date}.',
        dismissed: 'Zakończono współpracę z: {name}. Bonus został wyłączony. Nie pobrano odprawy; wcześniejsze opłaty nie są zwracane.',
        payrollSubject: 'Rozliczenie sztabu', sender: 'Biuro sztabu', paid: '{name}: pensja {amount} za miesiąc od {date}.',
        ended: '{name}: brak {amount} na pensję w dniu {date}. Umowa zakończona; bonus wyłączony.', paidTotal: 'Łącznie pobrano: {amount}.',
        managerIncome: 'W tej wypłacie: {amount} dodatkowych wpływów dzięki menedżerowi.',
        sponsorNote: 'Menedżer: +{bonus}% do wypłat zwykłych sponsorów. Obecne umowy: około {amount} dodatkowo na miesiąc, przed pensją menedżera.',
        trainingNote: 'Sztab: punktacja +{scoring}% XP · podwójne +{doubles}% XP. Bonusy dotyczą wyłącznie dziennych sesji treningowych.',
        back: 'Wróć do Menu'
    },
    en: {
        title: 'Player staff', tile: '{used}/{limit} slots · salaries {amount}/month',
        intro: 'Three slots, six specialities. Choose support for training, mental toughness, recovery or finances. Only one staff member per role.',
        terms: 'On hiring: signing fee + first salary. Then a salary every month. Insufficient funds on payday end the contract. In older saves, new rates apply from the next salary, with no extra charge for paid periods.',
        budget: 'Available budget', slots: 'Occupied slots', payroll: 'Salaries / month', team: 'Your staff', market: 'Available specialists',
        filter: 'Speciality', all: 'All roles', scoring: 'Scoring coach', doubles: 'Doubles coach', physio: 'Physiotherapist', manager: 'Manager',
        level: 'Level {level}/3', signingFee: 'Signing fee', salary: 'Monthly salary', total: 'Due now', firstSalary: 'Signing fee + first salary',
        scoringBonus: '+{bonus}% XP from scoring training sessions.', doublesBonus: '+{bonus}% XP from doubles training sessions.',
        fitness: 'Fitness coach', fitnessBonus: '+{bonus}% XP from endurance training. No instant trait increase and no effect on base OVR.',
        psychologist: 'Sports psychologist', psychologistBonus: '+{bonus}% XP from mental training. No instant trait increase and no effect on base OVR.',
        physioBonus: '+{bonus} stamina on rest days ({total} total, capped at 100). No recovery on training days.',
        managerBonus: '+{bonus}% on monthly regular sponsor payments. Excludes technical partners, goal bonuses and tournament prizes.',
        hire: 'Hire: {name}', dismiss: 'Dismiss: {name}', employed: 'In your staff', roleTaken: 'Role already filled', full: 'No free slots', funds: 'Not enough money', busy: 'Simulation in progress', unavailable: 'Unavailable',
        empty: 'You have no staff yet. Compare bonuses, signing fees and salaries below.', nextPay: 'Next salary: {date} · {amount}', signed: 'Employed since {date}',
        overdue: 'Overdue salary — bonus inactive. Settled when advancing the day.',
        rulesTitle: 'How do contracts work?',
        rules: 'Salaries are paid in advance. Hiring costs a signing fee plus the first month’s salary. Further salaries are collected at the start of the day, monthly on the signing date, before sponsor income. In shorter months, payment falls on the last day. If you cannot afford a salary, the contract ends automatically and the bonus stops. Same-day payments follow hiring order. Dismissal is free, without refunds; rehiring requires a new signing fee and first salary. Coach bonuses multiply XP after equipment bonuses; they do not change training limits or directly increase OVR. Staff do not affect ranking prize money.',
        confirmHire: 'Hire {name}?\n\nSigning fee: {fee}\nFirst salary: {salary}\nTotal now: {total}\nNext salary: {date}\n\n{bonus}\n\nInsufficient funds on payday end the contract. Fees are non-refundable.',
        confirmDismiss: 'End the contract with {name}?\nThe bonus stops immediately. No severance pay and no refund of the signing fee or paid salary.',
        hired: 'Hired {name}. Charged {fee} signing fee and {salary} first salary. Next salary: {date}.',
        dismissed: 'Contract with {name} ended. Bonus disabled. No severance pay; previous payments are not refunded.',
        payrollSubject: 'Staff payroll', sender: 'Staff office', paid: '{name}: salary {amount} for the month starting {date}.',
        ended: '{name}: could not pay the {amount} salary due on {date}. Contract ended; bonus disabled.', paidTotal: 'Total charged: {amount}.',
        managerIncome: 'This payment includes {amount} extra income from your manager.',
        sponsorNote: 'Manager: +{bonus}% on regular sponsor payments. Current contracts: about {amount} extra per month, before the manager’s salary.',
        trainingNote: 'Staff: scoring +{scoring}% XP · doubles +{doubles}% XP. Bonuses apply only to daily training sessions.',
        back: 'Back to Menu'
    },
    de: {
        title: 'Spielerstab', tile: '{used}/{limit} Plätze · Gehälter {amount}/Monat',
        intro: 'Drei Plätze, sechs Fachgebiete. Wähle Unterstützung für Training, mentale Stärke, Erholung oder Finanzen. Jede Rolle kann nur einmal besetzt werden.',
        terms: 'Bei Einstellung: Unterschriftsprämie + erstes Gehalt. Danach monatliches Gehalt. Bei Geldmangel am Zahltag endet der Vertrag. In älteren Spielständen gelten neue Sätze ab dem nächsten Gehalt, ohne Nachzahlung für bezahlte Zeiträume.',
        budget: 'Verfügbares Budget', slots: 'Besetzte Plätze', payroll: 'Gehälter / Monat', team: 'Dein Stab', market: 'Verfügbare Fachkräfte',
        filter: 'Fachgebiet', all: 'Alle Rollen', scoring: 'Scoring-Trainer', doubles: 'Doppel-Trainer', physio: 'Physiotherapeut', manager: 'Manager',
        level: 'Stufe {level}/3', signingFee: 'Unterschriftsprämie', salary: 'Monatsgehalt', total: 'Jetzt fällig', firstSalary: 'Prämie + erstes Gehalt',
        scoringBonus: '+{bonus}% XP aus Scoring-Trainingseinheiten.', doublesBonus: '+{bonus}% XP aus Doppel-Trainingseinheiten.',
        fitness: 'Fitnesstrainer', fitnessBonus: '+{bonus}% XP aus Ausdauertraining. Kein sofortiger Eigenschaftsbonus und kein Einfluss auf den Basis-OVR.',
        psychologist: 'Sportpsychologe', psychologistBonus: '+{bonus}% XP aus Mentaltraining. Kein sofortiger Eigenschaftsbonus und kein Einfluss auf den Basis-OVR.',
        physioBonus: '+{bonus} Energie an Ruhetagen (insgesamt {total}, maximal 100). Keine Erholung an Trainingstagen.',
        managerBonus: '+{bonus}% auf monatliche Zahlungen regulärer Sponsoren. Ohne Technikpartner, Zielprämien und Turnierpreisgelder.',
        hire: 'Einstellen: {name}', dismiss: 'Entlassen: {name}', employed: 'In deinem Stab', roleTaken: 'Rolle bereits besetzt', full: 'Kein freier Platz', funds: 'Nicht genug Geld', busy: 'Simulation läuft', unavailable: 'Nicht verfügbar',
        empty: 'Du hast noch keinen Stab. Vergleiche unten Boni, Unterschriftsprämien und Gehälter.', nextPay: 'Nächstes Gehalt: {date} · {amount}', signed: 'Beschäftigt seit {date}',
        overdue: 'Gehalt überfällig — Bonus inaktiv. Abrechnung beim Tageswechsel.',
        rulesTitle: 'Wie funktionieren Verträge?',
        rules: 'Gehälter werden im Voraus bezahlt. Bei Einstellung fallen die Unterschriftsprämie und das erste Monatsgehalt an. Weitere Gehälter werden monatlich am Tag der Unterschrift zu Tagesbeginn vor Sponsoreneinnahmen abgebucht. In kürzeren Monaten gilt der letzte Tag. Bei Geldmangel endet der Vertrag automatisch und der Bonus entfällt. Zahlungen am selben Tag erfolgen in Einstellungsreihenfolge. Entlassungen sind kostenlos, ohne Rückerstattung; erneute Einstellung kostet wieder Prämie und erstes Gehalt. Trainerboni multiplizieren XP nach dem Ausrüstungsbonus, ändern aber weder Trainingslimits noch direkt den OVR. Ranglistenpreisgeld bleibt unverändert.',
        confirmHire: '{name} einstellen?\n\nUnterschriftsprämie: {fee}\nErstes Gehalt: {salary}\nJetzt insgesamt: {total}\nNächstes Gehalt: {date}\n\n{bonus}\n\nBei Geldmangel am Zahltag endet der Vertrag. Keine Rückerstattung.',
        confirmDismiss: 'Vertrag mit {name} beenden?\nDer Bonus endet sofort. Keine Abfindung oder Rückerstattung der Prämie und des gezahlten Gehalts.',
        hired: '{name} eingestellt. {fee} Unterschriftsprämie und {salary} erstes Gehalt abgebucht. Nächstes Gehalt: {date}.',
        dismissed: 'Vertrag mit {name} beendet. Bonus deaktiviert. Keine Abfindung; bisherige Zahlungen werden nicht erstattet.',
        payrollSubject: 'Gehaltsabrechnung', sender: 'Stabsbüro', paid: '{name}: Gehalt {amount} für den Monat ab {date}.',
        ended: '{name}: Gehalt von {amount} am {date} nicht bezahlbar. Vertrag beendet; Bonus deaktiviert.', paidTotal: 'Insgesamt abgebucht: {amount}.',
        managerIncome: 'Diese Zahlung enthält {amount} zusätzliche Einnahmen durch den Manager.',
        sponsorNote: 'Manager: +{bonus}% auf reguläre Sponsorenzahlungen. Aktuelle Verträge: etwa {amount} zusätzlich pro Monat, vor dem Managergehalt.',
        trainingNote: 'Stab: Scoring +{scoring}% XP · Doppel +{doubles}% XP. Boni gelten nur für tägliche Trainingseinheiten.',
        back: 'Zurück zum Menü'
    },
    nl: {
        title: 'Spelersstaf', tile: '{used}/{limit} plaatsen · salarissen {amount}/maand',
        intro: 'Drie plaatsen, zes specialisaties. Kies steun voor training, mentale weerbaarheid, herstel of financiën. Elke rol kan maar één keer worden ingevuld.',
        terms: 'Bij aannemen: tekengeld + eerste salaris. Daarna elke maand salaris. Bij geldgebrek op de betaaldag eindigt het contract. In oudere saves gelden nieuwe tarieven vanaf het volgende salaris, zonder bijbetaling voor betaalde periodes.',
        budget: 'Beschikbaar budget', slots: 'Bezette plaatsen', payroll: 'Salarissen / maand', team: 'Jouw staf', market: 'Beschikbare specialisten',
        filter: 'Specialisatie', all: 'Alle rollen', scoring: 'Scoringcoach', doubles: 'Dubbelcoach', physio: 'Fysiotherapeut', manager: 'Manager',
        level: 'Niveau {level}/3', signingFee: 'Tekengeld', salary: 'Maandsalaris', total: 'Nu te betalen', firstSalary: 'Tekengeld + eerste salaris',
        scoringBonus: '+{bonus}% XP uit scoringtrainingen.', doublesBonus: '+{bonus}% XP uit dubbeltrainingen.',
        fitness: 'Conditietrainer', fitnessBonus: '+{bonus}% XP uit training voor uithoudingsvermogen. Geen directe verhoging en geen invloed op de basis-OVR.',
        psychologist: 'Sportpsycholoog', psychologistBonus: '+{bonus}% XP uit mentale training. Geen directe verhoging en geen invloed op de basis-OVR.',
        physioBonus: '+{bonus} energie op rustdagen ({total} totaal, maximaal 100). Geen herstel op trainingsdagen.',
        managerBonus: '+{bonus}% op maandelijkse betalingen van gewone sponsors. Zonder technische partners, doelbonussen en toernooiprijzen.',
        hire: 'Aannemen: {name}', dismiss: 'Ontslaan: {name}', employed: 'In jouw staf', roleTaken: 'Rol al ingevuld', full: 'Geen vrije plaats', funds: 'Niet genoeg geld', busy: 'Simulatie bezig', unavailable: 'Niet beschikbaar',
        empty: 'Je hebt nog geen staf. Vergelijk hieronder bonussen, tekengeld en salarissen.', nextPay: 'Volgend salaris: {date} · {amount}', signed: 'In dienst sinds {date}',
        overdue: 'Achterstallig salaris — bonus inactief. Afrekening bij de volgende dag.',
        rulesTitle: 'Hoe werken contracten?',
        rules: 'Salarissen worden vooraf betaald. Bij aannemen betaal je tekengeld en het eerste maandsalaris. Volgende salarissen worden maandelijks op de tekendatum aan het begin van de dag afgeschreven, vóór sponsorinkomsten. In kortere maanden geldt de laatste dag. Bij geldgebrek eindigt het contract automatisch en vervalt de bonus. Betalingen op dezelfde dag volgen de aannamevolgorde. Ontslag is gratis, zonder terugbetaling; opnieuw aannemen kost opnieuw tekengeld en het eerste salaris. Coachbonussen vermenigvuldigen XP na de uitrustingsbonus, zonder trainingslimieten of direct de OVR te veranderen. Staf heeft geen invloed op rankingprijzengeld.',
        confirmHire: '{name} aannemen?\n\nTekengeld: {fee}\nEerste salaris: {salary}\nTotaal nu: {total}\nVolgend salaris: {date}\n\n{bonus}\n\nBij geldgebrek op de betaaldag eindigt het contract. Geen terugbetaling.',
        confirmDismiss: 'Contract met {name} beëindigen?\nDe bonus stopt direct. Geen ontslagvergoeding of terugbetaling van tekengeld en betaald salaris.',
        hired: '{name} aangenomen. {fee} tekengeld en {salary} eerste salaris betaald. Volgend salaris: {date}.',
        dismissed: 'Contract met {name} beëindigd. Bonus uitgeschakeld. Geen ontslagvergoeding; eerdere betalingen worden niet terugbetaald.',
        payrollSubject: 'Salarisafrekening', sender: 'Stafbureau', paid: '{name}: salaris {amount} voor de maand vanaf {date}.',
        ended: '{name}: salaris van {amount} op {date} niet betaalbaar. Contract beëindigd; bonus uitgeschakeld.', paidTotal: 'Totaal betaald: {amount}.',
        managerIncome: 'Deze betaling bevat {amount} extra inkomsten dankzij je manager.',
        sponsorNote: 'Manager: +{bonus}% op gewone sponsorbetalingen. Huidige contracten: ongeveer {amount} extra per maand, vóór het managersalaris.',
        trainingNote: 'Staf: scoring +{scoring}% XP · dubbels +{doubles}% XP. Bonussen gelden alleen voor dagelijkse trainingen.',
        back: 'Terug naar Menu'
    }
};

function trPlayerStaff(key, params = {}) {
    const language = typeof currentLang === 'string' ? currentLang : 'en';
    let text = PLAYER_STAFF_TEXT[language]?.[key] || PLAYER_STAFF_TEXT.en[key] || key;
    for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
}

function playerStaffLocale() {
    return ({ pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' })[typeof currentLang === 'string' ? currentLang : 'en'] || 'en-GB';
}

function playerStaffMoney(value) {
    return '£' + Number(value || 0).toLocaleString(playerStaffLocale(), { maximumFractionDigits: 0 });
}

function playerStaffDisplayDate(value) {
    return parsePlayerStaffDate(value)?.toLocaleDateString(playerStaffLocale()) || '—';
}

function playerStaffBonusDescription(candidate) {
    return trPlayerStaff(candidate.role + 'Bonus', { bonus: candidate.bonus,
        total: (typeof STAMINA_CONFIG === 'object' ? STAMINA_CONFIG.dailyRecovery : 10) + candidate.bonus });
}

function playerStaffContractParams(candidate, contract) {
    return { name: candidate.name, fee: playerStaffMoney(candidate.signingFee), salary: playerStaffMoney(candidate.salary),
        total: playerStaffMoney(candidate.signingFee + candidate.salary), date: playerStaffDisplayDate(getPlayerStaffNextPayDate(contract)),
        bonus: playerStaffBonusDescription(candidate) };
}

function notifyPlayerStaffEvent(kind, data) {
    if (typeof addEmail !== 'function') return;
    let lines;
    if (kind === 'payroll') {
        lines = [trPlayerStaff('paidTotal', { amount: playerStaffMoney(data.total) }),
            ...data.paid.map(item => trPlayerStaff('paid', { name: item.candidate.name, amount: playerStaffMoney(item.candidate.salary), date: playerStaffDisplayDate(item.date) })),
            ...data.ended.map(item => trPlayerStaff('ended', { name: item.candidate.name, amount: playerStaffMoney(item.candidate.salary), date: playerStaffDisplayDate(item.date) }))];
    } else {
        lines = [trPlayerStaff(kind, kind === 'hired' ? playerStaffContractParams(data.candidate, data.contract) : { name: data.candidate.name })];
    }
    addEmail(trPlayerStaff('sender'), trPlayerStaff('payrollSubject'), lines.map(line => `<p>${escapeHtml(line)}</p>`).join(''));
}

function updatePlayerStaffHub() {
    const node = document.getElementById('player-staff-tile-desc');
    if (!node) return;
    const contracts = getPlayerStaffState().contracts;
    node.textContent = trPlayerStaff('tile', { used: contracts.length, limit: PLAYER_STAFF_CONFIG.slots,
        amount: playerStaffMoney(contracts.reduce((sum, contract) => sum + getPlayerStaffCandidate(contract.candidateId).salary, 0)) });
}

function renderPlayerStaffContextNotes() {
    if (typeof player === 'undefined' || !player) return;
    const training = document.getElementById('train-staff-note');
    if (training) training.textContent = trPlayerStaff('trainingNote', {
        scoring: getPlayerStaffTrainingBonus('scoring'), doubles: getPlayerStaffTrainingBonus('doubles') });
    const sponsors = document.getElementById('sponsor-staff-note');
    if (sponsors) {
        const bonus = getPlayerStaffBonus('manager');
        sponsors.hidden = bonus === 0;
        const regular = (player.activeSponsors || []).reduce((sum, sponsor) => sum + (Number(sponsor.monthlyValue) || 0), 0);
        sponsors.textContent = trPlayerStaff('sponsorNote', { bonus, amount: playerStaffMoney(getPlayerStaffSponsorBonus(regular)) });
    }
}

function renderPlayerStaffCard(candidate, contract = null) {
    const e = escapeHtml;
    const status = getPlayerStaffHireStatus(candidate.id);
    const due = contract && getPlayerStaffNextPayDate(contract);
    return `<article class="staff-card${contract ? ' staff-employed' : ''}" aria-label="${e(candidate.name)}">
        <div class="staff-card-top"><span>${e(trPlayerStaff(candidate.role))}</span><span class="staff-level">${e(trPlayerStaff('level', { level: candidate.level }))}</span></div>
        <h4>${e(candidate.name)}</h4><p class="staff-bonus">${e(playerStaffBonusDescription(candidate))}</p>
        <dl class="staff-prices"><div><dt>${e(trPlayerStaff('signingFee'))}</dt><dd>${e(playerStaffMoney(candidate.signingFee))}</dd></div>
            <div><dt>${e(trPlayerStaff('salary'))}</dt><dd>${e(playerStaffMoney(candidate.salary))}</dd></div></dl>
        ${contract ? `<p class="staff-note">${e(trPlayerStaff('signed', { date: playerStaffDisplayDate(contract.signedOn) }))}</p>
            <p class="staff-next-pay">${e(trPlayerStaff('nextPay', { date: playerStaffDisplayDate(due), amount: playerStaffMoney(candidate.salary) }))}</p>
            ${due <= playerStaffDateKey() ? `<p class="staff-warning">${e(trPlayerStaff('overdue'))}</p>` : ''}
            <button type="button" class="staff-button staff-dismiss" onclick="requestDismissPlayerStaff('${candidate.id}')"${status === 'busy' ? ' disabled' : ''}>${e(trPlayerStaff('dismiss', { name: candidate.name }))}</button>`
        : `<div class="staff-upfront"><span>${e(trPlayerStaff('total'))}<small>${e(trPlayerStaff('firstSalary'))}</small></span><strong>${e(playerStaffMoney(candidate.signingFee + candidate.salary))}</strong></div>
            <button type="button" class="staff-button" onclick="requestHirePlayerStaff('${candidate.id}')"${status !== 'available' ? ' disabled' : ''}>${e(trPlayerStaff(status === 'available' ? 'hire' : status, { name: candidate.name }))}</button>`}
    </article>`;
}

function renderPlayerStaff() {
    if (typeof player === 'undefined' || !player) return;
    const contracts = getPlayerStaffState().contracts;
    const e = escapeHtml;
    const summary = document.getElementById('player-staff-summary');
    if (summary) summary.innerHTML = [['budget', playerStaffMoney(player.budget)], ['slots', `${contracts.length}/${PLAYER_STAFF_CONFIG.slots}`],
        ['payroll', playerStaffMoney(contracts.reduce((sum, contract) => sum + getPlayerStaffCandidate(contract.candidateId).salary, 0))]]
        .map(([label, value]) => `<div><span>${e(trPlayerStaff(label))}</span><strong>${e(value)}</strong></div>`).join('');
    const team = document.getElementById('player-staff-team');
    if (team) team.innerHTML = contracts.length
        ? contracts.map(contract => renderPlayerStaffCard(getPlayerStaffCandidate(contract.candidateId), contract)).join('')
        : `<p class="staff-empty">${e(trPlayerStaff('empty'))}</p>`;
    const filter = document.getElementById('player-staff-filter');
    const role = filter?.value || 'all';
    const market = document.getElementById('player-staff-market');
    if (market) market.innerHTML = PLAYER_STAFF_CANDIDATES.filter(candidate => role === 'all' || candidate.role === role)
        .map(candidate => renderPlayerStaffCard(candidate)).join('');
}

function refreshPlayerStaffViews() {
    updatePlayerStaffHub();
    renderPlayerStaffContextNotes();
    if (document.getElementById('screen-player-staff')?.classList.contains('active')) renderPlayerStaff();
}

function refreshPlayerStaffTranslations() {
    const ids = { 'player-staff-tile-title': 'title', 'player-staff-title': 'title', 'player-staff-intro': 'intro',
        'player-staff-terms': 'terms',
        'player-staff-team-title': 'team', 'player-staff-market-title': 'market', 'player-staff-filter-label': 'filter',
        'player-staff-rules-title': 'rulesTitle', 'player-staff-rules': 'rules', 'player-staff-back': 'back' };
    for (const [id, key] of Object.entries(ids)) {
        const node = document.getElementById(id);
        if (node) node.textContent = (key === 'title' ? '🤝 ' : '') + trPlayerStaff(key);
    }
    const filter = document.getElementById('player-staff-filter');
    if (filter) {
        const role = filter.value || 'all';
        filter.innerHTML = ['all', 'scoring', 'doubles', 'fitness', 'psychologist', 'physio', 'manager'].map(value => `<option value="${value}">${escapeHtml(trPlayerStaff(value))}</option>`).join('');
        filter.value = role;
    }
    const feedback = document.getElementById('player-staff-feedback');
    if (feedback) feedback.textContent = '';
    refreshPlayerStaffViews();
}

function showPlayerStaff() {
    refreshPlayerStaffTranslations();
    renderPlayerStaff();
    showScreen('screen-player-staff');
}

function requestHirePlayerStaff(id) {
    if (getPlayerStaffHireStatus(id) !== 'available') return false;
    const candidate = getPlayerStaffCandidate(id);
    const today = playerStaffDateKey();
    const params = playerStaffContractParams(candidate, { signedOn: today, lastPaidOn: today });
    if (!confirm(trPlayerStaff('confirmHire', params))) return false;
    if (!hirePlayerStaff(id)) return false;
    const feedback = document.getElementById('player-staff-feedback');
    if (feedback) feedback.textContent = trPlayerStaff('hired', params);
    return true;
}

function requestDismissPlayerStaff(id) {
    if (typeof isTournamentSimulationBusy === 'function' && isTournamentSimulationBusy()) return false;
    if (!getPlayerStaffState().contracts.some(contract => contract.candidateId === id)) return false;
    const candidate = getPlayerStaffCandidate(id);
    if (!confirm(trPlayerStaff('confirmDismiss', { name: candidate.name }))) return false;
    if (!dismissPlayerStaff(id)) return false;
    const feedback = document.getElementById('player-staff-feedback');
    if (feedback) feedback.textContent = trPlayerStaff('dismissed', { name: candidate.name });
    return true;
}
