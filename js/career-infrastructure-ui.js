const CAREER_INFRASTRUCTURE_TEXT = {
    pl: {
        title: '🏠 Baza treningowa i podróże', tile: '🏠 Baza i podróże',
        tileNoBase: 'Przygotowanie {preparation}/100 · brak własnej bazy',
        tileBase: 'Przygotowanie {preparation}/100 · utrzymanie {maintenance}/mies.',
        intro: 'Długoterminowe inwestycje poza bazowym OVR. Baza pomaga budować przygotowanie, a standard podróży określa koszt i zmęczenie przy następnym turnieju.',
        preparation: 'Przygotowanie', budget: 'Budżet', baseStatus: 'Status bazy', maintenance: 'Utrzymanie / miesiąc',
        neutral: '70 jest poziomem neutralnym', active: 'Aktywna', suspended: 'Zawieszona', notOwned: 'Brak własnej bazy',
        preparationEffect: 'Wpływ meczowy: {value} pkt efektywnego scoringu i podwójnych. Bazowy OVR pozostaje bez zmian.',
        travelTitle: '✈️ Standard podróży i hotelu', travelIntro: 'Wybór obowiązuje przy następnym rozpoczętym turnieju. Cena rośnie przy imprezach międzynarodowych i najważniejszych turniejach.',
        economy: 'Ekonomiczny', comfort: 'Komfortowy', premium: 'Premium',
        economyDesc: 'Bez dodatkowej opłaty. Pełny koszt energii i −8 przygotowania.',
        comfortDesc: '15% mniejszy koszt energii i −4 przygotowania.',
        premiumDesc: '30% mniejszy koszt energii i −1 przygotowania.',
        selected: 'Wybrano', choose: 'Wybierz', nextTournament: 'Cena dla: {tournament}', basePrice: 'Cena bazowa za turniej',
        chargedTravel: 'Podróż została już opłacona: {standard} · {cost} · utrata przygotowania {loss}.',
        travelTile: 'Podróż: {standard} · przewidywany koszt {cost}', travelTileCharged: 'Podróż opłacona: {standard} · {cost}',
        changeTravel: 'Zmień podróż', travelLocked: 'Podróż na ten turniej została już rozpoczęta i nie można jej zmienić.',
        baseTitle: '🏗️ Własna baza treningowa',
        baseIntro: 'Zakup obejmuje pierwszy poziom sali, regeneracji i analizy. Przy zakupie płacisz cenę nieruchomości oraz pierwszy miesiąc utrzymania.',
        purchase: 'Kup bazę', purchasePrice: 'Nieruchomość: {price} · pierwszy miesiąc: {maintenance} · razem: {total}',
        training: 'Sala treningowa', recovery: 'Strefa regeneracji', analysis: 'Analiza wideo', level: 'Poziom {level}/3',
        trainingEffect: '+{prep} przygotowania po każdej sesji treningowej.',
        recoveryEffect: '+{prep} przygotowania i +{energy} energii w dniu odpoczynku.',
        analysisEffect: '+{xp}% XP ze wszystkich treningów i o {reduction} mniejsza utrata przygotowania w podróży.',
        maintenancePart: 'Utrzymanie tej części: {amount}/mies.', nextUpgrade: 'Następny poziom: {price}', upgrade: 'Rozbuduj', maximum: 'Maksymalny poziom',
        nextMaintenance: 'Następna opłata: {date}', resume: 'Wznów działanie bazy za {amount}',
        suspendedDesc: 'Własność i poziomy zostały zachowane, ale wszystkie bonusy są wyłączone do ponownego opłacenia miesiąca.',
        rulesTitle: 'Jak działa przygotowanie i rozliczenia?',
        rules: 'Przygotowanie ma zakres 0–100 i nie wchodzi do bazowego OVR. Przy 70 nie daje modyfikatora; skrajne wartości zmieniają efektywny scoring i podwójne najwyżej od −3 do +2. Podróż jest rozliczana raz, tylko gdy gracz faktycznie bierze udział w turnieju. Jeśli nie stać Cię na wybrany standard, gra automatycznie użyje opcji ekonomicznej, bez długu. Utrzymanie bazy jest pobierane z góry co miesiąc przed wpływami od sponsorów. Brak środków zawiesza bonusy, ale nie odbiera bazy ani rozbudowy.',
        confirmPurchase: 'Kupić bazę treningową?\n\nNieruchomość: £{price}\nPierwszy miesiąc utrzymania: £{maintenance}\nRazem teraz: £{total}\n\nZakup jest bezzwrotny.',
        confirmUpgrade: 'Rozbudować: {facility} do poziomu {level}/3 za £{price}?',
        insufficient: 'Brakuje środków. Potrzebujesz {amount}.', purchased: 'Kupiono bazę i opłacono pierwszy miesiąc: {total}.',
        upgraded: '{facility} ma teraz poziom {level}/3. Zapłacono {price}.', resumed: 'Działanie bazy wznowione za {amount}. Następna opłata: {date}.',
        travelSelected: 'Wybrano standard: {standard}.', maintenanceSubject: 'Utrzymanie bazy', sender: 'Biuro infrastruktury',
        maintenancePaid: 'Opłacono utrzymanie bazy: {amount}. Następny termin: {date}.',
        maintenanceMissed: 'Brak środków na utrzymanie {amount}. Bonusy bazy zostały zawieszone; własność i poziomy pozostają bez zmian.',
        downgradeSubject: 'Zmiana standardu podróży', downgradeBody: 'Nie wystarczyło środków na standard {requested}. Na turniej {tournament} wybrano podróż ekonomiczną bez dodatkowej opłaty.',
        back: 'Wróć do Menu'
    },
    en: {
        title: '🏠 Training base & travel', tile: '🏠 Base & travel',
        tileNoBase: 'Preparation {preparation}/100 · no private base', tileBase: 'Preparation {preparation}/100 · upkeep {maintenance}/mo',
        intro: 'Long-term investments outside base OVR. The base helps build preparation, while travel standard controls cost and fatigue for the next tournament.',
        preparation: 'Preparation', budget: 'Budget', baseStatus: 'Base status', maintenance: 'Monthly upkeep', neutral: '70 is neutral', active: 'Active', suspended: 'Suspended', notOwned: 'No private base',
        preparationEffect: 'Match effect: {value} effective scoring and doubles points. Base OVR stays unchanged.',
        travelTitle: '✈️ Travel & hotel standard', travelIntro: 'The selection applies when the next tournament starts. International and major events cost more.',
        economy: 'Economy', comfort: 'Comfort', premium: 'Premium', economyDesc: 'No extra fee. Full stamina cost and −8 preparation.', comfortDesc: '15% lower stamina cost and −4 preparation.', premiumDesc: '30% lower stamina cost and −1 preparation.',
        selected: 'Selected', choose: 'Choose', nextTournament: 'Price for: {tournament}', basePrice: 'Base price per tournament', chargedTravel: 'Travel is already paid: {standard} · {cost} · preparation loss {loss}.',
        travelTile: 'Travel: {standard} · estimated cost {cost}', travelTileCharged: 'Travel paid: {standard} · {cost}', changeTravel: 'Change travel', travelLocked: 'Travel for this tournament has already started and cannot be changed.',
        baseTitle: '🏗️ Private training base', baseIntro: 'The purchase includes level one training, recovery and analysis facilities. The property price and first month of upkeep are due immediately.',
        purchase: 'Buy base', purchasePrice: 'Property: {price} · first month: {maintenance} · total: {total}', training: 'Training room', recovery: 'Recovery area', analysis: 'Video analysis', level: 'Level {level}/3',
        trainingEffect: '+{prep} preparation after each training session.', recoveryEffect: '+{prep} preparation and +{energy} stamina on rest days.', analysisEffect: '+{xp}% XP from all training and {reduction} less preparation lost during travel.',
        maintenancePart: 'This section costs {amount}/mo to maintain.', nextUpgrade: 'Next level: {price}', upgrade: 'Upgrade', maximum: 'Maximum level', nextMaintenance: 'Next payment: {date}', resume: 'Resume base for {amount}', suspendedDesc: 'Ownership and levels remain, but every bonus is disabled until another month is paid.',
        rulesTitle: 'How do preparation and payments work?', rules: 'Preparation ranges from 0–100 and is outside base OVR. At 70 it is neutral; extreme values change effective scoring and doubles by no more than −3 to +2. Travel is charged once and only when the player actually enters a tournament. If the selected standard is unaffordable, economy is used automatically without debt. Base upkeep is paid monthly in advance before sponsor income. Insufficient funds suspend bonuses without removing ownership or upgrades.',
        confirmPurchase: 'Buy the training base?\n\nProperty: £{price}\nFirst month upkeep: £{maintenance}\nDue now: £{total}\n\nThe purchase is non-refundable.', confirmUpgrade: 'Upgrade {facility} to level {level}/3 for £{price}?',
        insufficient: 'Insufficient funds. You need {amount}.', purchased: 'Base purchased and first month paid: {total}.', upgraded: '{facility} is now level {level}/3. Paid {price}.', resumed: 'Base resumed for {amount}. Next payment: {date}.', travelSelected: 'Selected standard: {standard}.',
        maintenanceSubject: 'Base upkeep', sender: 'Infrastructure office', maintenancePaid: 'Base upkeep paid: {amount}. Next due date: {date}.', maintenanceMissed: 'Unable to pay {amount} upkeep. Base bonuses are suspended; ownership and levels remain.', downgradeSubject: 'Travel standard changed', downgradeBody: 'There were insufficient funds for {requested}. Economy travel was used for {tournament} without an extra fee.', back: 'Back to Menu'
    },
    de: {
        title: '🏠 Trainingsbasis & Reisen', tile: '🏠 Basis & Reisen', tileNoBase: 'Vorbereitung {preparation}/100 · keine eigene Basis', tileBase: 'Vorbereitung {preparation}/100 · Unterhalt {maintenance}/Monat', intro: 'Langfristige Investitionen außerhalb des Basis-OVR. Die Basis verbessert die Vorbereitung, der Reisestandard bestimmt Kosten und Ermüdung beim nächsten Turnier.',
        preparation: 'Vorbereitung', budget: 'Budget', baseStatus: 'Basisstatus', maintenance: 'Unterhalt / Monat', neutral: '70 ist neutral', active: 'Aktiv', suspended: 'Ausgesetzt', notOwned: 'Keine eigene Basis', preparationEffect: 'Match-Effekt: {value} effektive Scoring- und Doppelpunkte. Der Basis-OVR bleibt unverändert.',
        travelTitle: '✈️ Reise- und Hotelstandard', travelIntro: 'Die Auswahl gilt beim Start des nächsten Turniers. Internationale und große Turniere kosten mehr.', economy: 'Economy', comfort: 'Komfort', premium: 'Premium', economyDesc: 'Keine Zusatzkosten. Volle Energiekosten und −8 Vorbereitung.', comfortDesc: '15% geringere Energiekosten und −4 Vorbereitung.', premiumDesc: '30% geringere Energiekosten und −1 Vorbereitung.', selected: 'Ausgewählt', choose: 'Wählen', nextTournament: 'Preis für: {tournament}', basePrice: 'Grundpreis pro Turnier', chargedTravel: 'Reise bereits bezahlt: {standard} · {cost} · Vorbereitungsverlust {loss}.', travelTile: 'Reise: {standard} · geschätzte Kosten {cost}', travelTileCharged: 'Reise bezahlt: {standard} · {cost}', changeTravel: 'Reise ändern', travelLocked: 'Die Reise zu diesem Turnier hat bereits begonnen und kann nicht geändert werden.',
        baseTitle: '🏗️ Eigene Trainingsbasis', baseIntro: 'Der Kauf enthält Stufe eins für Training, Regeneration und Analyse. Kaufpreis und erster Monatsunterhalt werden sofort fällig.', purchase: 'Basis kaufen', purchasePrice: 'Immobilie: {price} · erster Monat: {maintenance} · gesamt: {total}', training: 'Trainingsraum', recovery: 'Regenerationsbereich', analysis: 'Videoanalyse', level: 'Stufe {level}/3', trainingEffect: '+{prep} Vorbereitung nach jeder Trainingseinheit.', recoveryEffect: '+{prep} Vorbereitung und +{energy} Energie an Ruhetagen.', analysisEffect: '+{xp}% XP aus allen Trainings und {reduction} weniger Vorbereitungsverlust auf Reisen.', maintenancePart: 'Unterhalt dieses Bereichs: {amount}/Monat.', nextUpgrade: 'Nächste Stufe: {price}', upgrade: 'Ausbauen', maximum: 'Maximale Stufe', nextMaintenance: 'Nächste Zahlung: {date}', resume: 'Basis für {amount} reaktivieren', suspendedDesc: 'Eigentum und Stufen bleiben erhalten, aber alle Boni sind bis zur nächsten Zahlung deaktiviert.',
        rulesTitle: 'Wie funktionieren Vorbereitung und Zahlungen?', rules: 'Vorbereitung reicht von 0–100 und gehört nicht zum Basis-OVR. Bei 70 ist sie neutral; extreme Werte ändern effektives Scoring und Doppel höchstens um −3 bis +2. Reisen werden einmal und nur bei tatsächlicher Turnierteilnahme berechnet. Ist der gewählte Standard unbezahlbar, wird ohne Schulden Economy genutzt. Der Basisunterhalt wird monatlich im Voraus vor Sponsoreneinnahmen bezahlt. Geldmangel setzt Boni aus, ohne Eigentum oder Ausbauten zu entfernen.', confirmPurchase: 'Trainingsbasis kaufen?\n\nImmobilie: £{price}\nErster Monatsunterhalt: £{maintenance}\nJetzt fällig: £{total}\n\nDer Kauf ist nicht erstattungsfähig.', confirmUpgrade: '{facility} auf Stufe {level}/3 für £{price} ausbauen?', insufficient: 'Nicht genug Geld. Benötigt: {amount}.', purchased: 'Basis gekauft und erster Monat bezahlt: {total}.', upgraded: '{facility} ist jetzt Stufe {level}/3. Bezahlt: {price}.', resumed: 'Basis für {amount} reaktiviert. Nächste Zahlung: {date}.', travelSelected: 'Ausgewählter Standard: {standard}.', maintenanceSubject: 'Basisunterhalt', sender: 'Infrastrukturbüro', maintenancePaid: 'Basisunterhalt bezahlt: {amount}. Nächster Termin: {date}.', maintenanceMissed: '{amount} Unterhalt konnte nicht bezahlt werden. Basisboni sind ausgesetzt; Eigentum und Stufen bleiben.', downgradeSubject: 'Reisestandard geändert', downgradeBody: '{requested} war nicht bezahlbar. Für {tournament} wurde Economy ohne Zusatzkosten genutzt.', back: 'Zurück zum Menü'
    },
    nl: {
        title: '🏠 Trainingsbasis & reizen', tile: '🏠 Basis & reizen', tileNoBase: 'Voorbereiding {preparation}/100 · geen eigen basis', tileBase: 'Voorbereiding {preparation}/100 · onderhoud {maintenance}/mnd', intro: 'Langdurige investeringen buiten de basis-OVR. De basis bouwt voorbereiding op; de reisstandaard bepaalt kosten en vermoeidheid voor het volgende toernooi.',
        preparation: 'Voorbereiding', budget: 'Budget', baseStatus: 'Basisstatus', maintenance: 'Onderhoud / maand', neutral: '70 is neutraal', active: 'Actief', suspended: 'Opgeschort', notOwned: 'Geen eigen basis', preparationEffect: 'Wedstrijdeffect: {value} effectieve scoring- en dubbelpunten. De basis-OVR blijft gelijk.',
        travelTitle: '✈️ Reis- en hotelstandaard', travelIntro: 'De keuze geldt wanneer het volgende toernooi start. Internationale en grote evenementen kosten meer.', economy: 'Economy', comfort: 'Comfort', premium: 'Premium', economyDesc: 'Geen extra kosten. Volledige energiekosten en −8 voorbereiding.', comfortDesc: '15% lagere energiekosten en −4 voorbereiding.', premiumDesc: '30% lagere energiekosten en −1 voorbereiding.', selected: 'Gekozen', choose: 'Kiezen', nextTournament: 'Prijs voor: {tournament}', basePrice: 'Basisprijs per toernooi', chargedTravel: 'Reis is al betaald: {standard} · {cost} · verlies voorbereiding {loss}.', travelTile: 'Reis: {standard} · geschatte kosten {cost}', travelTileCharged: 'Reis betaald: {standard} · {cost}', changeTravel: 'Reis wijzigen', travelLocked: 'De reis naar dit toernooi is al begonnen en kan niet worden gewijzigd.',
        baseTitle: '🏗️ Eigen trainingsbasis', baseIntro: 'De aankoop bevat niveau één voor training, herstel en analyse. De aankoopprijs en eerste maand onderhoud worden direct betaald.', purchase: 'Basis kopen', purchasePrice: 'Vastgoed: {price} · eerste maand: {maintenance} · totaal: {total}', training: 'Trainingsruimte', recovery: 'Herstelruimte', analysis: 'Videoanalyse', level: 'Niveau {level}/3', trainingEffect: '+{prep} voorbereiding na elke training.', recoveryEffect: '+{prep} voorbereiding en +{energy} energie op rustdagen.', analysisEffect: '+{xp}% XP uit alle trainingen en {reduction} minder voorbereidingsverlies tijdens reizen.', maintenancePart: 'Onderhoud van dit onderdeel: {amount}/mnd.', nextUpgrade: 'Volgend niveau: {price}', upgrade: 'Uitbouwen', maximum: 'Maximumniveau', nextMaintenance: 'Volgende betaling: {date}', resume: 'Basis hervatten voor {amount}', suspendedDesc: 'Eigendom en niveaus blijven behouden, maar alle bonussen zijn uitgeschakeld tot een nieuwe maand is betaald.',
        rulesTitle: 'Hoe werken voorbereiding en betalingen?', rules: 'Voorbereiding loopt van 0–100 en telt niet mee voor de basis-OVR. Bij 70 is zij neutraal; extreme waarden veranderen effectieve scoring en dubbels maximaal met −3 tot +2. Reizen worden één keer betaald en alleen bij echte deelname. Is de gekozen standaard onbetaalbaar, dan wordt Economy zonder schuld gebruikt. Basisonderhoud wordt maandelijks vooraf betaald, vóór sponsorinkomsten. Geldgebrek schort bonussen op zonder eigendom of uitbouw te verwijderen.', confirmPurchase: 'Trainingsbasis kopen?\n\nVastgoed: £{price}\nEerste maand onderhoud: £{maintenance}\nNu te betalen: £{total}\n\nDe aankoop wordt niet terugbetaald.', confirmUpgrade: '{facility} uitbouwen naar niveau {level}/3 voor £{price}?', insufficient: 'Onvoldoende geld. Nodig: {amount}.', purchased: 'Basis gekocht en eerste maand betaald: {total}.', upgraded: '{facility} is nu niveau {level}/3. Betaald: {price}.', resumed: 'Basis hervat voor {amount}. Volgende betaling: {date}.', travelSelected: 'Gekozen standaard: {standard}.', maintenanceSubject: 'Basisonderhoud', sender: 'Infrastructuurbureau', maintenancePaid: 'Basisonderhoud betaald: {amount}. Volgende datum: {date}.', maintenanceMissed: 'Onderhoud van {amount} kon niet worden betaald. Basisbonussen zijn opgeschort; eigendom en niveaus blijven.', downgradeSubject: 'Reisstandaard gewijzigd', downgradeBody: '{requested} was niet betaalbaar. Voor {tournament} is Economy zonder extra kosten gebruikt.', back: 'Terug naar menu'
    }
};

let careerInfrastructureFeedback = { key: '', params: {} };

function trCareerInfrastructure(key, params = {}) {
    const language = typeof currentLang === 'string' && CAREER_INFRASTRUCTURE_TEXT[currentLang] ? currentLang : 'en';
    let text = CAREER_INFRASTRUCTURE_TEXT[language][key] || CAREER_INFRASTRUCTURE_TEXT.en[key] || key;
    for (const [name, value] of Object.entries(params)) text = text.replaceAll(`{${name}}`, String(value));
    return text;
}

function careerInfrastructureLocale() {
    return ({ pl: 'pl-PL', en: 'en-GB', de: 'de-DE', nl: 'nl-NL' })[typeof currentLang === 'string' ? currentLang : 'en'] || 'en-GB';
}

function careerInfrastructureMoney(value) {
    return '£' + Number(value || 0).toLocaleString(careerInfrastructureLocale(), { maximumFractionDigits: 0 });
}

function careerInfrastructureDate(value) {
    return parseCareerInfrastructureDate(value)?.toLocaleDateString(careerInfrastructureLocale()) || '—';
}

function careerInfrastructureEscape(value) {
    return typeof escapeHtml === 'function' ? escapeHtml(String(value)) : String(value).replace(/[&<>"']/g, char => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    })[char]);
}

function getCareerInfrastructureFeedbackText() {
    if (!careerInfrastructureFeedback.key) return '';
    const params = careerInfrastructureFeedback.params;
    const formatted = Object.fromEntries(Object.entries(params).map(([name, value]) => [name,
        name === 'amount' || name === 'price' || name === 'total' || name === 'maintenance'
            ? careerInfrastructureMoney(value)
            : name === 'date' ? careerInfrastructureDate(value) : value]));
    return trCareerInfrastructure(careerInfrastructureFeedback.key, formatted);
}

function setCareerInfrastructureFeedback(key, params = {}) {
    careerInfrastructureFeedback = { key, params: { ...params } };
    const node = typeof document !== 'undefined' ? document.getElementById('career-infrastructure-feedback') : null;
    if (node) node.textContent = getCareerInfrastructureFeedbackText();
}

function getCareerFacilityEffectText(type, level) {
    const facility = CAREER_INFRASTRUCTURE_CONFIG.facilities[type];
    if (type === 'training') return trCareerInfrastructure('trainingEffect', {
        prep: facility.preparationPerTraining[level]
    });
    if (type === 'recovery') return trCareerInfrastructure('recoveryEffect', {
        prep: facility.preparationPerRest[level], energy: facility.staminaPerRest[level]
    });
    return trCareerInfrastructure('analysisEffect', {
        xp: facility.trainingXpPercent[level], reduction: facility.travelPreparationReduction[level]
    });
}

function renderCareerTravelCard(standard, tournament, locked) {
    const state = getCareerInfrastructureState();
    const quote = getCareerTravelQuote(tournament, standard);
    const selected = state.travelStandard === standard;
    return `<article class="career-infrastructure-card travel-standard-card ${selected ? 'selected' : ''}">
        <div class="career-infrastructure-card-head"><h4>${careerInfrastructureEscape(trCareerInfrastructure(standard))}</h4>
        <strong>${careerInfrastructureEscape(careerInfrastructureMoney(quote.cost))}</strong></div>
        <p>${careerInfrastructureEscape(trCareerInfrastructure(standard + 'Desc'))}</p>
        <button type="button" class="action-btn" onclick="setCareerTravelStandard('${standard}')" ${selected || locked ? 'disabled' : ''}>${careerInfrastructureEscape(trCareerInfrastructure(selected ? 'selected' : 'choose'))}</button>
    </article>`;
}

function renderCareerFacilityCard(type, level) {
    const config = CAREER_INFRASTRUCTURE_CONFIG.facilities[type];
    const nextLevel = level + 1;
    const nextPrice = config.upgradePrices[nextLevel];
    return `<article class="career-infrastructure-card facility-card">
        <div class="career-infrastructure-card-head"><h4>${careerInfrastructureEscape(trCareerInfrastructure(type))}</h4>
        <strong>${careerInfrastructureEscape(trCareerInfrastructure('level', { level }))}</strong></div>
        <p>${careerInfrastructureEscape(getCareerFacilityEffectText(type, level))}</p>
        <small>${careerInfrastructureEscape(trCareerInfrastructure('maintenancePart', {
            amount: careerInfrastructureMoney(config.maintenance[level]) }))}</small>
        ${nextPrice ? `<p class="career-infrastructure-price">${careerInfrastructureEscape(trCareerInfrastructure('nextUpgrade', {
            price: careerInfrastructureMoney(nextPrice) }))}</p>
            <button type="button" class="action-btn" onclick="upgradeCareerFacility('${type}')">${careerInfrastructureEscape(trCareerInfrastructure('upgrade'))}</button>`
            : `<p class="career-infrastructure-max">${careerInfrastructureEscape(trCareerInfrastructure('maximum'))}</p>`}
    </article>`;
}

function renderCareerInfrastructure() {
    if (typeof document === 'undefined' || typeof player === 'undefined' || !player) return;
    const screenTitle = document.getElementById('career-infrastructure-title');
    const backButton = document.getElementById('career-infrastructure-back');
    if (screenTitle) screenTitle.textContent = trCareerInfrastructure('title');
    if (backButton) backButton.textContent = trCareerInfrastructure('back');
    const root = document.getElementById('career-infrastructure-content');
    if (!root) return;
    const state = getCareerInfrastructureState();
    const maintenance = getCareerBaseMaintenance();
    const modifier = getCareerPreparationMatchModifier(player);
    const tournament = typeof activeTournament !== 'undefined' && activeTournament && !activeTournament.completed
        ? activeTournament
        : null;
    const locked = Boolean(tournament && isCareerTournamentTravelCharged(tournament));
    const tournamentName = tournament
        ? (typeof getTournamentDisplayName === 'function' ? getTournamentDisplayName(tournament) : tournament.name)
        : '';
    const travelContext = tournament
        ? trCareerInfrastructure('nextTournament', { tournament: tournamentName })
        : trCareerInfrastructure('basePrice');
    const chargedTravel = locked ? `<p class="career-infrastructure-lock">${careerInfrastructureEscape(trCareerInfrastructure('chargedTravel', {
        standard: trCareerInfrastructure(tournament.travelStandardUsed || 'economy'),
        cost: careerInfrastructureMoney(tournament.travelCostPaid), loss: tournament.travelPreparationLoss || 0
    }))}</p>` : '';

    let baseBody;
    if (!state.baseOwned) {
        const maintenanceFirst = CAREER_INFRASTRUCTURE_CONFIG.facilities.training.maintenance[1]
            + CAREER_INFRASTRUCTURE_CONFIG.facilities.recovery.maintenance[1]
            + CAREER_INFRASTRUCTURE_CONFIG.facilities.analysis.maintenance[1];
        const total = CAREER_INFRASTRUCTURE_CONFIG.basePurchasePrice + maintenanceFirst;
        baseBody = `<div class="career-base-purchase"><p>${careerInfrastructureEscape(trCareerInfrastructure('baseIntro'))}</p>
            <strong>${careerInfrastructureEscape(trCareerInfrastructure('purchasePrice', {
                price: careerInfrastructureMoney(CAREER_INFRASTRUCTURE_CONFIG.basePurchasePrice),
                maintenance: careerInfrastructureMoney(maintenanceFirst), total: careerInfrastructureMoney(total)
            }))}</strong><button type="button" class="action-btn green" onclick="purchaseCareerBase()">${careerInfrastructureEscape(trCareerInfrastructure('purchase'))}</button></div>`;
    } else {
        const suspended = !state.maintenanceActive ? `<div class="career-base-suspended"><p>${careerInfrastructureEscape(trCareerInfrastructure('suspendedDesc'))}</p>
            <button type="button" class="action-btn" onclick="resumeCareerBaseMaintenance()">${careerInfrastructureEscape(trCareerInfrastructure('resume', {
                amount: careerInfrastructureMoney(maintenance) }))}</button></div>` : '';
        baseBody = `${suspended}<p class="career-infrastructure-next">${careerInfrastructureEscape(trCareerInfrastructure('nextMaintenance', {
            date: careerInfrastructureDate(state.nextMaintenanceDueOn) }))}</p>
            <div class="career-infrastructure-grid">${CAREER_FACILITY_TYPES.map(type => renderCareerFacilityCard(type, state.facilityLevels[type])).join('')}</div>`;
    }

    root.innerHTML = `<p class="career-infrastructure-intro">${careerInfrastructureEscape(trCareerInfrastructure('intro'))}</p>
        <div class="career-infrastructure-summary">
            <div><span>${careerInfrastructureEscape(trCareerInfrastructure('preparation'))}</span><strong>${Math.round(state.preparation)}/100</strong><small>${careerInfrastructureEscape(trCareerInfrastructure('neutral'))}</small></div>
            <div><span>${careerInfrastructureEscape(trCareerInfrastructure('budget'))}</span><strong>${careerInfrastructureEscape(careerInfrastructureMoney(player.budget))}</strong></div>
            <div><span>${careerInfrastructureEscape(trCareerInfrastructure('baseStatus'))}</span><strong>${careerInfrastructureEscape(trCareerInfrastructure(!state.baseOwned ? 'notOwned' : state.maintenanceActive ? 'active' : 'suspended'))}</strong></div>
            <div><span>${careerInfrastructureEscape(trCareerInfrastructure('maintenance'))}</span><strong>${careerInfrastructureEscape(careerInfrastructureMoney(maintenance))}</strong></div>
        </div>
        <p class="career-preparation-effect">${careerInfrastructureEscape(trCareerInfrastructure('preparationEffect', {
            value: `${modifier >= 0 ? '+' : ''}${modifier.toFixed(1)}` }))}</p>
        <section><h3>${careerInfrastructureEscape(trCareerInfrastructure('travelTitle'))}</h3>
            <p>${careerInfrastructureEscape(trCareerInfrastructure('travelIntro'))}</p><p class="career-infrastructure-context">${careerInfrastructureEscape(travelContext)}</p>
            ${chargedTravel}<div class="career-infrastructure-grid travel-grid">${CAREER_TRAVEL_STANDARDS.map(standard => renderCareerTravelCard(standard, tournament, locked)).join('')}</div></section>
        <section><h3>${careerInfrastructureEscape(trCareerInfrastructure('baseTitle'))}</h3>${baseBody}</section>
        <details class="career-infrastructure-rules"><summary>${careerInfrastructureEscape(trCareerInfrastructure('rulesTitle'))}</summary><p>${careerInfrastructureEscape(trCareerInfrastructure('rules'))}</p></details>`;
    const feedback = document.getElementById('career-infrastructure-feedback');
    if (feedback) feedback.textContent = getCareerInfrastructureFeedbackText();
}

function updateCareerInfrastructureHub() {
    if (typeof document === 'undefined' || typeof player === 'undefined' || !player) return;
    const state = getCareerInfrastructureState();
    const preparation = document.getElementById('hub-preparation');
    const preparationLabel = document.getElementById('hub-preparation-label');
    if (preparationLabel) preparationLabel.textContent = trCareerInfrastructure('preparation');
    if (preparation) {
        preparation.textContent = Math.round(state.preparation);
        preparation.style.color = state.preparation >= 70 ? '#27ae60' : state.preparation >= 40 ? '#f39c12' : '#c0392b';
        preparation.title = trCareerInfrastructure('preparationEffect', {
            value: `${getCareerPreparationMatchModifier(player) >= 0 ? '+' : ''}${getCareerPreparationMatchModifier(player).toFixed(1)}`
        });
    }
    const title = document.getElementById('career-infrastructure-tile-title');
    if (title) title.textContent = trCareerInfrastructure('tile');
    const tile = document.getElementById('career-infrastructure-tile-desc');
    if (tile) tile.textContent = trCareerInfrastructure(state.baseOwned ? 'tileBase' : 'tileNoBase', {
        preparation: Math.round(state.preparation), maintenance: careerInfrastructureMoney(getCareerBaseMaintenance())
    });
    const tournament = typeof activeTournament !== 'undefined' && activeTournament && !activeTournament.completed ? activeTournament : null;
    const tournamentSummary = document.getElementById('tournament-travel-summary');
    const tournamentButton = document.getElementById('tournament-travel-button');
    if (tournamentSummary && tournament) {
        const charged = isCareerTournamentTravelCharged(tournament);
        const standard = charged ? tournament.travelStandardUsed : state.travelStandard;
        const cost = charged ? Number(tournament.travelCostPaid) || 0 : getCareerTravelQuote(tournament, standard).cost;
        tournamentSummary.textContent = trCareerInfrastructure(charged ? 'travelTileCharged' : 'travelTile', {
            standard: trCareerInfrastructure(standard), cost: careerInfrastructureMoney(cost)
        });
        tournamentSummary.hidden = false;
        if (tournamentButton) {
            tournamentButton.textContent = charged ? trCareerInfrastructure('travelLocked') : trCareerInfrastructure('changeTravel');
            tournamentButton.disabled = charged;
            tournamentButton.hidden = false;
        }
    } else {
        if (tournamentSummary) tournamentSummary.hidden = true;
        if (tournamentButton) tournamentButton.hidden = true;
    }
}

function notifyCareerInfrastructureMaintenance(result) {
    if (!result?.changed) return;
    const state = getCareerInfrastructureState();
    if (typeof addEmail === 'function') {
        const lines = [];
        if (result.paid.length) lines.push(trCareerInfrastructure('maintenancePaid', {
            amount: careerInfrastructureMoney(result.total), date: careerInfrastructureDate(state.nextMaintenanceDueOn)
        }));
        if (result.missed.length) lines.push(trCareerInfrastructure('maintenanceMissed', {
            amount: careerInfrastructureMoney(result.missed.at(-1).amount)
        }));
        addEmail(trCareerInfrastructure('sender'), trCareerInfrastructure('maintenanceSubject'),
            lines.map(line => `<p>${careerInfrastructureEscape(line)}</p>`).join(''));
    }
}

function notifyCareerTournamentTravel(result, tournament) {
    if (!result?.downgraded || typeof addEmail !== 'function') return;
    const tournamentName = typeof getTournamentDisplayName === 'function'
        ? getTournamentDisplayName(tournament)
        : tournament.name;
    addEmail(trCareerInfrastructure('sender'), trCareerInfrastructure('downgradeSubject'),
        `<p>${careerInfrastructureEscape(trCareerInfrastructure('downgradeBody', {
            requested: trCareerInfrastructure(result.requestedStandard), tournament: tournamentName
        }))}</p>`);
}

function showCareerInfrastructure() {
    careerInfrastructureFeedback = { key: '', params: {} };
    renderCareerInfrastructure();
    showScreen('screen-career-infrastructure');
}

function refreshCareerInfrastructureTranslations() {
    const title = typeof document !== 'undefined' ? document.getElementById('career-infrastructure-title') : null;
    const back = typeof document !== 'undefined' ? document.getElementById('career-infrastructure-back') : null;
    if (title) title.textContent = trCareerInfrastructure('title');
    if (back) back.textContent = trCareerInfrastructure('back');
    const feedback = typeof document !== 'undefined' ? document.getElementById('career-infrastructure-feedback') : null;
    if (feedback) feedback.textContent = getCareerInfrastructureFeedbackText();
    updateCareerInfrastructureHub();
    if (typeof document !== 'undefined' && document.getElementById('screen-career-infrastructure')?.classList.contains('active')) {
        renderCareerInfrastructure();
    }
}
