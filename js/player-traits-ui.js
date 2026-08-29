const PLAYER_TRAITS_TEXT = {
    pl: {
        title: 'Cechy zawodnika', separate: 'Osobne cechy 0–100. Nie wchodzą do bazowego OVR.',
        endurance: 'Wytrzymałość', consistency: 'Regularność', mental: 'Odporność psychiczna',
        mentalDesc: 'Ogranicza spadek skuteczności w decydujących legach i setach, przy lotkach meczowych, na największych turniejach oraz przez trzy lotki po błędzie. Nie gwarantuje zwycięstwa.',
        mentalEffect: 'Maksymalna kara presji: −{value} pkt efektywnej punktacji i podwójnych. Bazowe oceny pozostają bez zmian.',
        mentalRules: 'Odporność zaczyna od 45 pkt: +1 za każde dwa lata po 18. roku życia (maks. +20) i +1 za każdy zapisany tytuł (maks. +20). Kwalifikacje nie są tytułami. Wiek i nowe tytuły zwiększają również już rozwiniętą cechę, do 100. Starsze zapisy korzystają z dostępnej historii, bez dopisywania nieznanych zwycięstw. Trening mentalny daje XP na tych samych zasadach co pozostałe cechy; psycholog przyspiesza go o 5%, 10% lub 15%.',
        psychologistNote: 'Psycholog: +{bonus}% XP z treningu odporności psychicznej. Bez natychmiastowej premii za samo zatrudnienie.',
        enduranceDesc: 'Ogranicza zmęczenie w długich meczach i koszt energii za udział w turnieju. Energia nadal regeneruje się podczas odpoczynku.',
        consistencyDesc: 'Zmniejsza wahania formy między legami, meczami i turniejami. Bez stałej premii do celności; wyjątkowe występy nadal są możliwe.',
        energy: 'Mnożnik kosztu energii turniejowej: {value}%. Koszt zaokrąglany do pełnych punktów.', spread: 'Rozrzut zwykłej formy: {value}% standardu.',
        age: 'Startowa wytrzymałość: 82 do 25 lat, potem −1 rocznie do 35 lat i −2 rocznie powyżej 35 lat (baza min. 20). Starzenie odejmuje te same punkty od rozwiniętej cechy; trening pozwala wyrównywać spadek.',
        training: 'Rozwój cech', train: 'Trenuj: {trait}', session: '1 dzień · 20 energii · wspólny limit 2 treningów/tydzień',
        progress: '{xp}/100 XP do następnego punktu', max: 'Osiągnięto maksimum',
        rules: '100 XP = +1 punkt. Sesja daje bazowo 14–18 XP, zależnie od profesjonalizmu; od 80 pkt postęp jest o połowę wolniejszy, od 90 pkt cztery razy wolniejszy. Sprzęt do darta nie zwiększa XP tych cech. Trener przygotowania fizycznego daje +5%, +10% lub +15% XP z treningu wytrzymałości, bez natychmiastowego wzrostu cechy.',
        matches: 'Oficjalny mecz singlowy daje 2 bazowe XP regularności, a przy co najmniej 12 legach także 2 XP wytrzymałości. Maks. 8 bazowych XP na cechę tygodniowo; powyżej 80 i 90 pkt działa spowolnienie. Bez XP z meczów towarzyskich i wolnych rzutów.',
        levelUp: '{trait}: +1 punkt! Bazowy OVR pozostaje bez zmian.',
        tournamentBlocked: 'Najpierw dokończ turniej albo wybierz opcję „Odpuść turniej”.',
        fitnessNote: 'Trener fizyczny: +{bonus}% XP wytrzymałości. Fizjoterapeuta odpowiada za regenerację energii.'
    },
    en: {
        title: 'Player traits', separate: 'Separate 0–100 traits. Not included in base OVR.',
        endurance: 'Endurance', consistency: 'Consistency', mental: 'Mental toughness',
        mentalDesc: 'Limits performance loss in deciding legs and sets, on match darts, at major tournaments and for three darts after a mistake. Does not guarantee victory.',
        mentalEffect: 'Maximum pressure penalty: −{value} effective scoring and doubles points. Base ratings stay unchanged.',
        mentalRules: 'Mental toughness starts at 45: +1 for every two years after age 18 (up to +20) and +1 per recorded title (up to +20). Qualifiers do not count as titles. Age and new titles also improve a trained trait, up to 100. Older saves use available history without inventing past wins. Mental training follows the same XP rules as other traits; psychologists accelerate it by 5%, 10% or 15%.',
        psychologistNote: 'Psychologist: +{bonus}% mental training XP. Hiring alone gives no immediate trait bonus.',
        enduranceDesc: 'Reduces fatigue in long matches and the energy cost of entering tournaments. Energy still recovers on rest days.',
        consistencyDesc: 'Reduces ordinary form swings between legs, matches and tournaments. No flat accuracy bonus; exceptional performances remain possible.',
        energy: 'Tournament energy cost multiplier: {value}%. Cost rounded to whole points.', spread: 'Ordinary form spread: {value}% of standard.',
        age: 'Starting endurance: 82 up to age 25, then −1 per year to 35 and −2 per year above 35 (base minimum 20). Ageing subtracts the same points from the developed trait; training can offset the decline.',
        training: 'Trait development', train: 'Train: {trait}', session: '1 day · 20 energy · shared limit of 2 sessions/week',
        progress: '{xp}/100 XP to the next point', max: 'Maximum reached',
        rules: '100 XP = +1 point. A session gives 14–18 base XP, adjusted for professionalism; progress halves at 80 and quarters at 90. Dart equipment does not boost trait XP. Fitness coaches add +5%, +10% or +15% endurance training XP, without an instant trait increase.',
        matches: 'An official singles match gives 2 base consistency XP, plus 2 endurance XP if at least 12 legs were played. Maximum 8 base XP per trait each week; progress slows at 80 and 90. Friendlies and free throws give no XP.',
        levelUp: '{trait}: +1 point! Base OVR stays unchanged.',
        tournamentBlocked: 'Finish the tournament first or choose “Skip tournament”.',
        fitnessNote: 'Fitness coach: +{bonus}% endurance XP. The physiotherapist handles energy recovery.'
    },
    de: {
        title: 'Spielereigenschaften', separate: 'Separate Eigenschaften von 0–100. Nicht im Basis-OVR enthalten.',
        endurance: 'Ausdauer', consistency: 'Konstanz', mental: 'Mentale Stärke',
        mentalDesc: 'Begrenzt Leistungseinbußen in entscheidenden Legs und Sätzen, bei Matchdarts, großen Turnieren und für drei Darts nach einem Fehler. Garantiert keinen Sieg.',
        mentalEffect: 'Maximaler Druckabzug: −{value} effektive Scoring- und Doppelpunkte. Basiswerte bleiben unverändert.',
        mentalRules: 'Mentale Stärke beginnt bei 45: +1 je zwei Jahre nach dem 18. Geburtstag (max. +20) und +1 je gespeichertem Titel (max. +20). Qualifikationen zählen nicht als Titel. Alter und neue Titel erhöhen auch trainierte Werte bis maximal 100. Ältere Spielstände nutzen vorhandene Historie, ohne Siege zu erfinden. Mentaltraining nutzt dieselben XP-Regeln wie andere Eigenschaften; Psychologen beschleunigen es um 5%, 10% oder 15%.',
        psychologistNote: 'Psychologe: +{bonus}% Mentaltrainings-XP. Die Einstellung allein gibt keinen sofortigen Eigenschaftsbonus.',
        enduranceDesc: 'Verringert Ermüdung in langen Spielen und die Energiekosten der Turnierteilnahme. Energie erholt sich weiterhin an Ruhetagen.',
        consistencyDesc: 'Verringert normale Formschwankungen zwischen Legs, Spielen und Turnieren. Kein fester Genauigkeitsbonus; außergewöhnliche Leistungen bleiben möglich.',
        energy: 'Multiplikator der Turnierenergiekosten: {value}%. Kosten auf ganze Punkte gerundet.', spread: 'Normale Formstreuung: {value}% des Standards.',
        age: 'Startausdauer: 82 bis 25 Jahre, danach −1 pro Jahr bis 35 und −2 pro Jahr über 35 (Basisminimum 20). Alterung zieht dieselben Punkte von der entwickelten Eigenschaft ab; Training kann den Rückgang ausgleichen.',
        training: 'Eigenschaften trainieren', train: 'Trainieren: {trait}', session: '1 Tag · 20 Energie · gemeinsames Limit: 2 Einheiten/Woche',
        progress: '{xp}/100 XP bis zum nächsten Punkt', max: 'Maximum erreicht',
        rules: '100 XP = +1 Punkt. Eine Einheit gibt 14–18 Basis-XP, angepasst an Professionalität; ab 80 halbiert und ab 90 viertelt sich der Fortschritt. Dartausrüstung erhöht diese XP nicht. Fitnesstrainer geben +5%, +10% oder +15% Ausdauertrainings-XP, ohne sofortigen Eigenschaftsbonus.',
        matches: 'Ein offizielles Einzel gibt 2 Basis-XP Konstanz, ab 12 gespielten Legs auch 2 Ausdauer-XP. Maximal 8 Basis-XP je Eigenschaft und Woche; langsamerer Fortschritt ab 80 und 90. Keine XP aus Freundschaftsspielen oder freien Würfen.',
        levelUp: '{trait}: +1 Punkt! Basis-OVR unverändert.',
        tournamentBlocked: 'Beende zuerst das Turnier oder wähle „Turnier überspringen“.',
        fitnessNote: 'Fitnesstrainer: +{bonus}% Ausdauer-XP. Der Physiotherapeut hilft bei der Energieregeneration.'
    },
    nl: {
        title: 'Spelerseigenschappen', separate: 'Aparte eigenschappen van 0–100. Tellen niet mee voor de basis-OVR.',
        endurance: 'Uithoudingsvermogen', consistency: 'Regelmaat', mental: 'Mentale weerbaarheid',
        mentalDesc: 'Beperkt prestatieverlies in beslissende legs en sets, bij matchdarts, grote toernooien en tijdens drie darts na een fout. Garandeert geen overwinning.',
        mentalEffect: 'Maximale drukstraf: −{value} effectieve scoring- en dubbelpunten. Basiswaarden blijven gelijk.',
        mentalRules: 'Mentale weerbaarheid begint op 45: +1 per twee jaar na 18 (max. +20) en +1 per opgeslagen titel (max. +20). Kwalificaties tellen niet als titels. Leeftijd en nieuwe titels verhogen ook getrainde waarden tot maximaal 100. Oudere saves gebruiken beschikbare historie, zonder overwinningen te verzinnen. Mentale training volgt dezelfde XP-regels als andere eigenschappen; psychologen versnellen dit met 5%, 10% of 15%.',
        psychologistNote: 'Psycholoog: +{bonus}% mentale trainings-XP. Aannemen alleen geeft geen directe verhoging.',
        enduranceDesc: 'Vermindert vermoeidheid in lange wedstrijden en de energiekosten van toernooideelname. Energie herstelt nog steeds op rustdagen.',
        consistencyDesc: 'Vermindert normale vormschommelingen tussen legs, wedstrijden en toernooien. Geen vaste nauwkeurigheidsbonus; uitzonderlijke prestaties blijven mogelijk.',
        energy: 'Vermenigvuldiger toernooienergiekosten: {value}%. Kosten afgerond op hele punten.', spread: 'Normale vormspreiding: {value}% van standaard.',
        age: 'Startwaarde: 82 tot 25 jaar, daarna −1 per jaar tot 35 en −2 per jaar boven 35 (basisminimum 20). Ouder worden trekt dezelfde punten af van de ontwikkelde eigenschap; training kan dit compenseren.',
        training: 'Eigenschappen trainen', train: 'Train: {trait}', session: '1 dag · 20 energie · gedeelde limiet: 2 trainingen/week',
        progress: '{xp}/100 XP tot het volgende punt', max: 'Maximum bereikt',
        rules: '100 XP = +1 punt. Een sessie geeft 14–18 basis-XP, aangepast aan professionaliteit; vanaf 80 halveert de voortgang en vanaf 90 wordt deze een kwart. Dartuitrusting verhoogt deze XP niet. Conditietrainers geven +5%, +10% of +15% trainings-XP voor uithoudingsvermogen, zonder directe verhoging.',
        matches: 'Een officiële enkelwedstrijd geeft 2 basis-XP regelmaat, en vanaf 12 gespeelde legs ook 2 XP uithoudingsvermogen. Maximaal 8 basis-XP per eigenschap per week; tragere groei vanaf 80 en 90. Geen XP uit oefenwedstrijden of vrije worpen.',
        levelUp: '{trait}: +1 punt! Basis-OVR blijft gelijk.',
        tournamentBlocked: 'Maak eerst het toernooi af of kies „Toernooi overslaan“.',
        fitnessNote: 'Conditietrainer: +{bonus}% XP uithoudingsvermogen. De fysiotherapeut helpt met energieherstel.'
    }
};

function trPlayerTraits(key, params = {}) {
    const lang = typeof currentLang === 'string' ? currentLang : 'en';
    let text = PLAYER_TRAITS_TEXT[lang]?.[key] || PLAYER_TRAITS_TEXT.en[key] || key;
    for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
}

function getPlayerTraitEffectText(candidate, type) {
    if (type === 'mental') return trPlayerTraits('mentalEffect', { value: (4 * (1 - getPlayerTrait(candidate, type) / 100)).toFixed(1) });
    const value = type === 'endurance' ? 120 - getPlayerTrait(candidate, type) * 0.4 : getConsistencySpread(candidate) * 100;
    return trPlayerTraits(type === 'endurance' ? 'energy' : 'spread', { value: Math.round(value) });
}

function renderPlayerTraitsHub() {
    const root = document.getElementById('hub-player-traits');
    if (!root || typeof player === 'undefined' || !player) return;
    root.innerHTML = PLAYER_TRAIT_TYPES.map(type => {
        const label = trPlayerTraits(type);
        const value = getPlayerTrait(player, type);
        const effect = getPlayerTraitEffectText(player, type);
        return `<div class="stat-box hub-trait-stat" title="${escapeHtml(effect)}" aria-label="${escapeHtml(`${label}: ${value}/100. ${effect}`)}">
            <span class="hub-trait-label">${escapeHtml(label)}</span>
            <span class="stat-value hub-trait-value">${value}<small>/100</small></span>
        </div>`;
    }).join('');
    const note = document.getElementById('hub-player-traits-note');
    if (note) note.textContent = trPlayerTraits('separate');
}

function renderPlayerTraitProfile(candidate) {
    return `<section class="profile-panel"><h3>${escapeHtml(trPlayerTraits('title'))}</h3>
        <p class="trait-note">${escapeHtml(trPlayerTraits('separate'))}</p><div class="trait-grid">
        ${PLAYER_TRAIT_TYPES.map(type => `<div class="trait-profile-card"><span>${escapeHtml(trPlayerTraits(type))}</span>
            <strong>${getPlayerTrait(candidate, type)}/100</strong><p>${escapeHtml(trPlayerTraits(type + 'Desc'))}</p>
            <small>${escapeHtml(getPlayerTraitEffectText(candidate, type))}</small></div>`).join('')}</div></section>`;
}

function renderPlayerTraitTraining(sessionsRemaining) {
    const root = document.getElementById('train-player-traits');
    if (!root || typeof player === 'undefined' || !player) return;
    const unavailable = sessionsRemaining <= 0 || player.stamina < 20;
    root.innerHTML = `<h3 id="train-player-traits-title">${escapeHtml(trPlayerTraits('training'))}</h3><p class="trait-note">${escapeHtml(trPlayerTraits('separate'))}</p>
        <div class="trait-grid">${PLAYER_TRAIT_TYPES.map(type => {
            const value = getPlayerTrait(player, type);
            const xp = Math.max(0, Math.min(99.9, Number(player.traits?.[`${type}XP`]) || 0));
            const progress = value === 100 ? trPlayerTraits('max') : trPlayerTraits('progress', { xp: xp.toFixed(1) });
            return `<article class="trait-training-card"><h4>${escapeHtml(trPlayerTraits(type))}</h4><strong>${value}/100</strong>
                <p>${escapeHtml(trPlayerTraits(type + 'Desc'))}</p><small>${escapeHtml(getPlayerTraitEffectText(player, type))}</small>
                <progress max="100" value="${value === 100 ? 100 : xp}" aria-label="${escapeHtml(trPlayerTraits(type) + ': ' + progress)}"></progress>
                <span class="trait-xp">${escapeHtml(progress)}</span><small>${escapeHtml(trPlayerTraits('session'))}</small>
                <button type="button" class="action-btn" id="train-${type}-btn" onclick="performTraining('${type}')" ${unavailable || value === 100 ? 'disabled' : ''}>${escapeHtml(trPlayerTraits('train', { trait: trPlayerTraits(type) }))}</button></article>`;
        }).join('')}</div><p class="trait-note">${escapeHtml(trPlayerTraits('fitnessNote', { bonus: typeof getPlayerStaffTrainingBonus === 'function' ? getPlayerStaffTrainingBonus('endurance') : 0 }))}</p>
        <p class="trait-note">${escapeHtml(trPlayerTraits('psychologistNote', { bonus: typeof getPlayerStaffTrainingBonus === 'function' ? getPlayerStaffTrainingBonus('mental') : 0 }))}</p>
        <details class="trait-rules"><summary>${escapeHtml(trPlayerTraits('title'))} — ${escapeHtml(trPlayerTraits('training'))}</summary>
            <p>${escapeHtml(trPlayerTraits('rules'))}</p><p>${escapeHtml(trPlayerTraits('matches'))}</p><p>${escapeHtml(trPlayerTraits('age'))}</p>
            <p>${escapeHtml(trPlayerTraits('mentalRules'))}</p></details>`;
}

function refreshPlayerTraitsTranslations() {
    renderPlayerTraitsHub();
    if (document.getElementById('screen-training')?.classList.contains('active')) showTrainingScreen();
    if (document.getElementById('screen-player-profile')?.classList.contains('active') && typeof currentPlayerProfileId !== 'undefined') {
        openPlayerProfile(currentPlayerProfileId, playerProfileReturnRanking);
    }
}
