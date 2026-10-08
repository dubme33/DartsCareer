// No match RNG, news prose or direct GROWTH bonuses. All changes use the annual ledger.
function aiCareerClamp(value, minimum, maximum) { return Math.max(minimum, Math.min(maximum, value)); }
function getAiCareerPeriod(date = currentDate) { return date.getFullYear() * 4 + Math.floor(date.getMonth() / 3); }
function getAiCareerRandom(candidate, domain, season = 0, index = 0) {
    prepareAiDevelopmentIdentity(candidate);
    const seed = player?.aiCareerWorldSeed || ensureAiDevelopmentWorldSeed();
    let n = hashAiDevelopmentIdentity(`${seed}|${candidate.aiFoundationIdentity}|career-v2|${domain}|${season}|${index}`);
    n = Math.imul(n ^ n >>> 16, 0x21f0aaad); n = Math.imul(n ^ n >>> 15, 0x735a2d97);
    return ((n ^ n >>> 15) >>> 0) / 4294967296;
}
function getAiCareerWorldState() {
    if (!player?.id) return null;
    if (!player.aiCareerWorldSeed) player.aiCareerWorldSeed = ensureAiDevelopmentWorldSeed();
    if (!player.aiCareerRuntime || player.aiCareerRuntime.schemaVersion !== AI_CAREER_CONFIG.schemaVersion
        || !Array.isArray(player.aiCareerRuntime.observations)) {
        player.aiCareerRuntime = { schemaVersion: AI_CAREER_CONFIG.schemaVersion,
            configVersion: AI_CAREER_CONFIG.configVersion, lastProcessedPeriod: null, observations: [] };
    }
    player.aiCareerRuntime.configVersion = AI_CAREER_CONFIG.configVersion;
    return player.aiCareerRuntime;
}
function getAiLifecycleAge(candidate, date = currentDate) {
    const known = getPlayerAge(candidate, date);
    if (Number.isFinite(known)) return known;
    const estimated = candidate?.aiCareer?.estimatedLifecycleBirthYear;
    return Number.isInteger(estimated) ? date.getFullYear() - estimated : null;
}
function initializeAiCareerCandidate(candidate, referenceDate = currentDate) {
    if (!candidate || candidate.isBye || isCurrentPlayer(candidate) || !player?.id) return;
    referenceDate = referenceDate instanceof Date ? referenceDate : new Date(referenceDate);
    getAiCareerWorldState(); prepareAiDevelopmentIdentity(candidate);
    if (!Number.isFinite(candidate.longevity) || candidate.longevity < 0 || candidate.longevity > 1) {
        const r = getAiCareerRandom(candidate, 'longevity'), mode = AI_CAREER_CONFIG.longevity.mode;
        candidate.longevity = r < mode ? Math.sqrt(r * mode) : 1 - Math.sqrt((1 - r) * (1 - mode));
    }
    if (!Number.isFinite(candidate.volatility) || candidate.volatility < 0 || candidate.volatility > 1) {
        candidate.volatility = (getAiCareerRandom(candidate, 'volatility',0,0)
            + getAiCareerRandom(candidate,'volatility',0,1) + getAiCareerRandom(candidate,'volatility',0,2)) / 3;
    }
    const existing = candidate.aiCareer;
    if (existing?.schemaVersion === AI_CAREER_CONFIG.schemaVersion
        && ['NORMAL','GROWTH','STALLED','DECLINE','RECOVERY'].includes(existing.arc?.type)
        && ['startPeriod','expectedDuration','intensity','phase','cooldown','lastProcessedPeriod']
            .every(key=>Number.isFinite(existing.arc[key]))
        && existing.arc.expectedDuration>=0 && existing.arc.intensity>=0
        && Number.isFinite(existing.lastAccrualDate) && Number.isInteger(existing.lastProcessedPeriod)
        && existing.annual && ['growth','stalled','decline','recovery'].every(k=>Number.isFinite(existing.annual[k]))
        && Number.isFinite(existing.evidence?.score) && Array.isArray(existing.evidence?.confirmations)
        && Number.isFinite(existing.historicalPeak?.ovr) && Array.isArray(existing.history)
        && existing.observationYears && existing.arcStarts) {
        existing.configVersion=AI_CAREER_CONFIG.configVersion;
        existing.evidence.score=aiCareerClamp(existing.evidence.score,0,AI_CAREER_CONFIG.evidence.maxScore);
        ensureAiLifecycleEstimate(candidate,existing,referenceDate); return;
    }
    const period = getAiCareerPeriod(referenceDate), rating = Number(candidate.baseOvr ?? candidate.ovr);
    const c = candidate.aiCareer = { schemaVersion: AI_CAREER_CONFIG.schemaVersion,
        configVersion: AI_CAREER_CONFIG.configVersion, initializedAt: referenceDate.getTime(),
        eligiblePeriod: period + (referenceDate.getDate()===1&&referenceDate.getMonth()%3===0?1:2),
        lastProcessedPeriod: period, lastAccrualDate: referenceDate.getTime(),
        arc: { type: 'NORMAL', startPeriod: period, expectedDuration: 0, intensity: 0,
            phase: 0, cooldown: 0, triggerEvidence: null, lastProcessedPeriod: period },
        annual: { year: referenceDate.getFullYear(), growth: 0, stalled: 0, decline: 0, recovery: 0 },
        evidence: { score: 0, confirmations: [], lastProcessedPeriod: period },
        historicalPeak: { ovr: rating, ranking: null, year: referenceDate.getFullYear() },
        history: [], observationYears: {}, arcStarts: { GROWTH: 0, STALLED: 0, DECLINE: 0, RECOVERY: 0 } };
    ensureAiLifecycleEstimate(candidate,c,referenceDate);
}
function ensureAiLifecycleEstimate(candidate,c,date) {
    if(Number.isInteger(candidate.birthYear)){c.knownLifecycleBirthYear=candidate.birthYear;return;}
    if(Number.isInteger(c.estimatedLifecycleBirthYear))return;
    if(Number.isInteger(c.knownLifecycleBirthYear)){c.estimatedLifecycleBirthYear=c.knownLifecycleBirthYear;return;}
    // Sample the current known population on first migration. Do not invent a
    // decades-long age history for previously immortal, unknown-age founders.
    let known=pdcPlayers.filter(p=>Number.isInteger(p.birthYear)).map(p=>date.getFullYear()-p.birthYear)
        .filter(age=>age>=18&&age<=60).sort((a,b)=>a-b);
    if(!known.length && typeof defaultPdcPlayerTemplates!=='undefined') known=defaultPdcPlayerTemplates
        .filter(p=>Number.isInteger(p.birthYear)).map(p=>2026-p.birthYear).filter(age=>age>=18&&age<=60).sort((a,b)=>a-b);
    const r=getAiCareerRandom(candidate,'estimated-lifecycle-age');
    const age=known.length?known[Math.min(known.length-1,Math.floor(r*known.length))]:30;
    c.estimatedLifecycleBirthYear=date.getFullYear()-age;
}
function getAiArcRamp(arc, period) {
    if (!arc || arc.type === 'NORMAL') return 0;
    const elapsed = period - arc.startPeriod + 0.5, ramp = AI_CAREER_CONFIG.arcs.rampQuarters;
    return aiCareerClamp(Math.min(elapsed/ramp,(arc.expectedDuration-elapsed)/ramp),0,1) * arc.intensity;
}
function accrueAiCareer(candidate, date) {
    initializeAiCareerCandidate(candidate, date);
    const c = candidate.aiCareer, until = date.getTime(); if(!c)return;
    let from = c.lastAccrualDate;
    if (!Number.isFinite(from) || until <= from) return;
    // No fictitious history: at most a year may be accrued in a damaged/ancient save.
    from = Math.max(from, until - 366*86400000);
    while (from < until) {
        const d = new Date(from), year = d.getFullYear(), period = getAiCareerPeriod(d);
        const end = Math.min(until,new Date(year, Math.floor(d.getMonth()/3)*3+3,1).getTime());
        if (c.annual.year !== year) c.annual = { year, growth: 0, stalled: 0, decline: 0, recovery: 0 };
        const key = c.arc.type.toLowerCase();
        if (key !== 'normal') c.annual[key] += getAiArcRamp(c.arc,period) * (end-from)/(365.2425*86400000);
        from = end;
    }
    c.lastAccrualDate = until;
}
function getAiCareerTransitionProbabilities(candidate, date) {
    const c = candidate.aiCareer, cfg = AI_CAREER_CONFIG.arcs, age = getAiLifecycleAge(candidate,date);
    if(!cfg.enabled)return{GROWTH:0,STALLED:0,DECLINE:0,RECOVERY:0};
    const rating = getAiDevelopmentRating(candidate), headroom = candidate.potential-rating;
    const variance = cfg.volatilityBase + cfg.volatilitySpan*candidate.volatility;
    const evidence = 1 + AI_CAREER_CONFIG.evidence.maxProbabilityBonus*Math.min(1,c.evidence.score/AI_CAREER_CONFIG.evidence.maxScore)
        * (c.evidence.confirmations.length >= 2 ? 1 : AI_CAREER_CONFIG.evidence.singleConfirmationInfluence);
    const ageGrowth = 1/(1+Math.exp((age-cfg.growthAgeMidpoint)/cfg.growthAgeWidth));
    const deficit = c.historicalPeak.ovr-rating;
    const probabilities = {
        GROWTH: headroom>cfg.growthMinimumHeadroom ? cfg.growthAnnualChance*variance*ageGrowth*evidence : 0,
        STALLED: headroom>cfg.stalledMinimumHeadroom && age<cfg.stalledMaximumAge ? cfg.stalledAnnualChance*variance : 0,
        DECLINE: age>=cfg.declineMinimumAge && rating>=cfg.declineMinimumOvr ? cfg.declineAnnualChance*variance : 0,
        RECOVERY: deficit>=cfg.recoveryMinimumLoss && c.history.length>=cfg.recoveryMinimumHistory
            ? cfg.recoveryAnnualChance*variance/(1+Math.exp((age-cfg.recoveryAgeMidpoint)/cfg.recoveryAgeWidth)) : 0
    };
    // Absence is not a career trigger; require actual sporting exposure.
    const currentMatches=candidate.aiDevelopment?.year===date.getFullYear()?candidate.aiDevelopment.matches:0;
    const priorMatches=date.getMonth()<3&&candidate.aiDevelopmentSummary?.year===date.getFullYear()-1
        ? candidate.aiDevelopmentSummary.matches:0;
    if (Math.max(currentMatches,priorMatches) < cfg.minimumExposureMatches)
        Object.keys(probabilities).forEach(k=>probabilities[k]=0);
    return Object.fromEntries(Object.entries(probabilities).map(([type,p])=>[type,1-Math.pow(1-p,0.25)]));
}
function processAiCareerPeriods(date = currentDate) {
    const world = getAiCareerWorldState(), period = getAiCareerPeriod(date);
    if (!world || world.lastProcessedPeriod === period) return;
    pdcPlayers.forEach(candidate => {
        if (!candidate || candidate.isBye || isCurrentPlayer(candidate)) return;
        initializeAiCareerCandidate(candidate,date); accrueAiCareer(candidate,date);
        const c = candidate.aiCareer;
        // Capture actual observed standings, including an initial leader that
        // loses the lead before the first annual settlement. No invented history.
        const observedRank=typeof getRankingPosition==='function'?getRankingPosition(candidate,'main'):null;
        if(Number.isFinite(observedRank)&&observedRank>0
            &&(c.historicalPeak.ranking===null||observedRank<c.historicalPeak.ranking))c.historicalPeak.ranking=observedRank;
        if (c.lastProcessedPeriod >= period) return;
        const elapsed = Math.min(4,period-c.evidence.lastProcessedPeriod);
        c.evidence.score *= Math.pow(AI_CAREER_CONFIG.evidence.quarterRetention,elapsed);
        c.evidence.confirmations = c.evidence.confirmations.filter(e=>date.getTime()-e.date < AI_CAREER_CONFIG.evidence.confirmationWindowDays*86400000);
        c.evidence.lastProcessedPeriod = period;
        if (c.arc.type !== 'NORMAL' && period >= c.arc.startPeriod+c.arc.expectedDuration) {
            c.arc = { type:'NORMAL',startPeriod:period,expectedDuration:0,intensity:0,phase:0,
                cooldown:period+AI_CAREER_CONFIG.arcs.cooldownQuarters,triggerEvidence:null,lastProcessedPeriod:period };
        }
        if (c.arc.type === 'NORMAL' && period>=c.eligiblePeriod && period>=c.arc.cooldown) {
            let roll = getAiCareerRandom(candidate,'arc-transitions',date.getFullYear(),period%4);
            for (const [type,chance] of Object.entries(getAiCareerTransitionProbabilities(candidate,date))) {
                if (roll < chance) {
                    const [min,max] = AI_CAREER_CONFIG.arcs.durations[type];
                    const cfg=AI_CAREER_CONFIG.arcs;
                    const extreme = getAiCareerRandom(candidate,'arc-extreme',date.getFullYear(),period%4)<cfg.extremeChance;
                    c.arc = { type,startPeriod:period,
                        expectedDuration:min+Math.floor(getAiCareerRandom(candidate,'arc-duration',date.getFullYear(),period%4)*(max-min+1)),
                        intensity:extreme?cfg.extremeIntensity:cfg.minimumIntensity
                            +(cfg.maximumIntensity-cfg.minimumIntensity)*getAiCareerRandom(candidate,'arc-intensity',date.getFullYear(),period%4),
                        phase:0,cooldown:0,triggerEvidence:{score:c.evidence.score,confirmedResults:c.evidence.confirmations.length},lastProcessedPeriod:period };
                    c.arcStarts[type]++; break;
                }
                roll -= chance;
            }
        }
        c.arc.phase = c.arc.intensity ? getAiArcRamp(c.arc,period)/c.arc.intensity : 0;
        c.arc.lastProcessedPeriod=period; c.lastProcessedPeriod=period;
    });
    world.lastProcessedPeriod=period;
}
function getAiCareerAnnualComponents(candidate, year, seasonStart, exposure) {
    accrueAiCareer(candidate,new Date(year+1,0,1));
    const c=candidate.aiCareer;if(!c)return{maturationMultiplier:1,growthActive:false,decline:0,recovery:0};
    const a=c.annual.year===year?c.annual:{growth:0,stalled:0,decline:0,recovery:0};
    const cfg=AI_CAREER_CONFIG.arcs, age=getAiLifecycleAge(candidate,new Date(year,11,31));
    const target=Math.min(c.historicalPeak.ovr,candidate.potential+AI_DEVELOPMENT_FOUNDATION_CONFIG.performance.potentialOvershootMargin);
    const deficit=Math.max(0,target-seasonStart);
    return { maturationMultiplier:Math.max(cfg.minimumMaturationMultiplier,1+cfg.growthMultiplier*a.growth-cfg.stalledReduction*a.stalled),
        growthActive:a.growth>0, decline:Math.min(cfg.declineCap,cfg.declineStrength*a.decline),
        recovery:Math.min(deficit,cfg.recoveryStrength*a.recovery*(cfg.recoveryMaturationFloor
            +(1-cfg.recoveryMaturationFloor)/(1+Math.exp((age-cfg.recoveryMaturationMidpoint)/cfg.recoveryMaturationWidth)))
            * -Math.expm1(-deficit/cfg.recoveryHeadroomScale)*exposure), annual:{...a} };
}
function recordAiCareerMatchEvidence(candidate, opponent, won, tournament, expected) {
    if (!candidate?.aiCareer || !tournament || tournament.isDoubles) return;
    const key=[currentDate.getFullYear(),tournament.name,tournament.month,tournament.day].join('|');
    if (candidate.aiCareer.tournamentEvidence?.key!==key) candidate.aiCareer.tournamentEvidence={key,matches:0,wins:0,expected:0,quality:0};
    const e=candidate.aiCareer.tournamentEvidence;
    e.matches++; e.wins+=Number(won); e.expected+=expected;
    if(won)e.quality+=Math.max(0,getAiDevelopmentRating(opponent)-getAiDevelopmentRating(candidate))/AI_CAREER_CONFIG.evidence.qualityRatingScale;
}
function recordAiCareerTournamentEvidence(candidate,tournament,result) {
    if (!candidate || isCurrentPlayer(candidate) || tournament.isDoubles || !candidate.aiCareer) return;
    const c=candidate.aiCareer,e=c.tournamentEvidence;
    if(!e || e.processed || e.key!==[currentDate.getFullYear(),tournament.name,tournament.month,tournament.day].join('|')) return;
    e.processed=true;
    if(e.matches<AI_CAREER_CONFIG.evidence.minimumMatches) return;
    const cfg=AI_CAREER_CONFIG.evidence,prestige=getTournamentDevelopmentPrestigeFactor(tournament),
        signal=(e.wins-e.expected)/Math.sqrt(e.matches)+Math.min(1,e.quality)*cfg.qualityWeight;
    if(signal<cfg.minimumSignal || !(prestige>=cfg.importantPrestige && result.round<=cfg.importantRound
        || prestige>=cfg.lowerTourPrestige && result.won && e.wins>=cfg.lowerTourWins))return;
    const confirmation={date:currentDate.getTime(),tournament:result.sourceTournament||tournament.name,
        wins:e.wins,expectedWins:e.expected,quality:e.quality,prestige,round:result.round};
    c.evidence.confirmations.push(confirmation);c.evidence.confirmations=c.evidence.confirmations.slice(-cfg.maximumConfirmations);
    c.evidence.score=Math.min(AI_CAREER_CONFIG.evidence.maxScore,c.evidence.score+Math.min(1,signal)*Math.min(1,prestige));
    const knownAge=getPlayerAge(candidate);
    const important=c.evidence.confirmations.filter(e=>e.prestige>=cfg.importantPrestige);
    const confirmedBreakthrough=important.length>=2&&important.reduce((sum,e)=>sum+e.quality,0)>=cfg.breakthroughQuality
        ||c.evidence.confirmations.length>=cfg.lowerTourConfirmations&&c.evidence.score>=cfg.lowerTourConfirmedScore;
    if(confirmedBreakthrough && c.historicalPeak.ovr<cfg.breakthroughMaximumPreviousPeak
        && Number.isFinite(knownAge) && knownAge<=cfg.breakthroughMaximumAge)
        emitAiCareerObservation(candidate,'breakthrough_confirmed',currentDate.getFullYear(),{confirmedResults:c.evidence.confirmations.map(e=>({...e}))});
}
function emitAiCareerObservation(candidate,type,year,evidence={},previous={}) {
    const c=candidate.aiCareer, world=getAiCareerWorldState();if(!c||!world)return null;
    const last=c.observationYears[type];
    if(Number.isFinite(last)&&year-last<AI_CAREER_CONFIG.observations.cooldownYears)return null;
    const rank=typeof getRankingPosition==='function'?getRankingPosition(candidate,'main'):null;
    const event={eventId:`${hashAiDevelopmentIdentity(player.aiCareerWorldSeed)}:${candidate.id}:${year}:${type}`,
        playerId:candidate.id,name:candidate.name,country:candidate.country,season:year,date:currentDate.getTime(),age:getPlayerAge(candidate,currentDate),
        currentOvr:Number(candidate.baseOvr),previousRelevantOvr:previous.ovr??null,
        currentRanking:Number.isFinite(rank)&&rank>0?rank:null,previousRelevantRanking:previous.ranking??null,
        observationType:type,significance:['young_elite_player','major_decline','veteran_resurgence'].includes(type)?'high':'medium',
        evidence,historicalPeak:{...c.historicalPeak}};
    if(world.observations.some(e=>e.eventId===event.eventId))return null;
    c.observationYears[type]=year;world.observations.push(event);
    world.observations=world.observations.slice(-AI_CAREER_CONFIG.observations.queueLimit);return event;
}
function getAiCareerObservations({sinceSeason=0,afterEventId=null}={}) {
    const events=getAiCareerWorldState()?.observations||[],cursor=afterEventId?events.findIndex(e=>e.eventId===afterEventId):-1;
    return events.slice(cursor+1).filter(e=>e.season>=sinceSeason).map(e=>JSON.parse(JSON.stringify(e)));
}
function finalizeAiCareerSeason(candidate,year,ranking) {
    if(!candidate?.aiCareer)return;
    const c=candidate.aiCareer;if(c.history.at(-1)?.year>=year)return;
    const age=getAiLifecycleAge(candidate,new Date(year,11,31)),knownAge=getPlayerAge(candidate,new Date(year,11,31)),ovr=Number(candidate.baseOvr),summary=candidate.aiDevelopmentSummary;
    const cfg=AI_CAREER_CONFIG.observations;
    const previous=c.history.at(-1), older=c.history.find(h=>h.year===year-cfg.comparisonYears), oldPeak={...c.historicalPeak};
    const hasRanking=Number.isFinite(ranking)&&ranking>0;
    const results=candidate.seasonStats?.year===year?candidate.seasonStats.results||[]:[];
    const singlesTitles=results.filter(r=>r.won&&!r.tournamentIsDoubles);
    const majors=singlesTitles.filter(r=>r.rankingPrizeMoney>0 && ['major','open'].includes(
        getTournamentSimulationProfile({name:r.sourceTournament||r.tournament}).key)).length;
    const history={year,ovr,ranking:ranking??null,age,matches:summary?.matches||0,titles:singlesTitles.length,majors,
        maturation:summary?.maturationComponent||0,performance:summary?.performanceComponent||0,
        aging:summary?.agingComponent||0,decline:summary?.declineComponent||0,recovery:summary?.recoveryComponent||0};
    if(ovr>c.historicalPeak.ovr)c.historicalPeak={...c.historicalPeak,ovr,year};
    if(hasRanking&&(c.historicalPeak.ranking===null||ranking<c.historicalPeak.ranking))c.historicalPeak.ranking=ranking;
    if(Number.isFinite(knownAge)&&age<=cfg.risingMaximumAge && older && ovr-older.ovr>=cfg.risingMinimumGrowth
        && ovr>=cfg.risingMinimumOvr && hasRanking&&ranking<=cfg.risingMaximumRank)
        emitAiCareerObservation(candidate,'rising_star',year,{growth:ovr-older.ovr},older);
    if(Number.isFinite(knownAge)&&age<=cfg.youngEliteMaximumAge && ovr>=cfg.eliteMinimumOvr && hasRanking&&ranking<=cfg.eliteMaximumRank)
        emitAiCareerObservation(candidate,'young_elite_player',year,{qualifiedOvr:ovr,qualifiedRanking:ranking});
    if(Number.isFinite(knownAge)&&age>=cfg.lateMinimumAge&&age<=cfg.lateMaximumAge&&older&&older.ovr<=cfg.latePreviousMaximumOvr
        &&ovr-older.ovr>=cfg.lateMinimumGrowth&&ovr>=cfg.eliteMinimumOvr&&hasRanking&&ranking<=cfg.lateMaximumRank)
        emitAiCareerObservation(candidate,'late_bloomer',year,{growth:ovr-older.ovr},older);
    if(Number.isFinite(knownAge)&&age<cfg.stagnationMaximumAge&&older&&ovr-older.ovr<=cfg.stagnationMaximumGrowth
        &&ovr>=cfg.stagnationMinimumOvr&&history.matches>=cfg.stagnationMinimumMatches)
        emitAiCareerObservation(candidate,'career_stagnation',year,{years:cfg.comparisonYears,growth:ovr-older.ovr},older);
    if(older&&older.ovr>=cfg.eliteMinimumOvr&&older.ovr-ovr>=cfg.declineMinimumLoss)
        emitAiCareerObservation(candidate,'major_decline',year,{loss:older.ovr-ovr},older);
    if(oldPeak.ranking<=cfg.formerStarMaximumPeakRank&&oldPeak.ranking!==null&&hasRanking
        &&ranking>=cfg.formerStarMinimumCurrentRank&&oldPeak.ovr-ovr>=cfg.formerStarMinimumLoss)
        emitAiCareerObservation(candidate,'former_star_falling',year,{loss:oldPeak.ovr-ovr},oldPeak);
    const low=c.history.reduce((a,b)=>b.ovr<a.ovr?b:a,previous||history);
    if(previous&&ovr-low.ovr>=cfg.recoveryMinimumGain&&oldPeak.ovr-low.ovr>=cfg.recoveryMinimumPreviousLoss&&ovr-previous.ovr>0){
        emitAiCareerObservation(candidate,'career_recovery',year,{recovered:ovr-low.ovr,previousLoss:oldPeak.ovr-low.ovr},low);
        if(Number.isFinite(knownAge)&&age>=cfg.resurgenceMinimumAge&&oldPeak.ovr>=cfg.eliteMinimumOvr&&hasRanking&&ranking<=cfg.eliteMaximumRank)
            emitAiCareerObservation(candidate,'veteran_resurgence',year,{recovered:ovr-low.ovr},low);
    }
    if(ovr>=cfg.eliteMinimumOvr&&ovr-oldPeak.ovr>=cfg.peakMinimumGain&&hasRanking&&ranking<=cfg.eliteMaximumRank)
        emitAiCareerObservation(candidate,'career_peak',year,{improvement:ovr-oldPeak.ovr},oldPeak);
    if(Number.isFinite(knownAge)&&age>=cfg.longevityMinimumAge&&ovr>=cfg.eliteMinimumOvr&&hasRanking&&ranking<=cfg.longevityMaximumRank)
        emitAiCareerObservation(candidate,'exceptional_longevity',year,{qualifiedOvr:ovr,qualifiedRanking:ranking});
    const spike=c.history.find(h=>h.year===year-2),beforeSpike=c.history.filter(h=>h.year<year-2).slice(-2);
    if(spike?.majors>=cfg.wonderMinimumMajors && beforeSpike.length===2 && beforeSpike.every(h=>h.majors<=cfg.wonderSurroundingMaximumMajors)
        && (previous?.majors||0)<=cfg.wonderSurroundingMaximumMajors && majors<=cfg.wonderSurroundingMaximumMajors)
        emitAiCareerObservation(candidate,'one_season_wonder',year,{exceptionalSeason:spike.year,majorTitles:spike.majors,
            subsequentMajorTitles:[previous?.majors||0,majors]},spike);
    c.history.push(history);c.history=c.history.slice(-AI_CAREER_CONFIG.observations.historyYears);
}
function getAiIndividualAnnualDecline(candidate,age,year) {
    initializeAiCareerCandidate(candidate,new Date(year,0,1));
    const cfg=AI_CAREER_CONFIG.longevity,onset=cfg.minOnset+(cfg.maxOnset-cfg.minOnset)*candidate.longevity;
    const equivalentAge=age-(onset-cfg.baselineOnset), base=getAnnualDecline(Math.floor(equivalentAge));
    return base*(cfg.declineRateBase-cfg.declineRateSpan*candidate.longevity)
        *(1+cfg.annualVariation*(2*getAiCareerRandom(candidate,'aging',year)-1));
}
function getAiRetirementProbability(candidate,age,year,ranking) {
    const cfg=AI_CAREER_CONFIG.retirement,c=candidate.aiCareer;
    if(age>=cfg.compulsoryAge)return 1;
    if(age<cfg.minimumEarlyAge)return 0;
    const recent=c.history.slice(-cfg.trendYears),trend=recent.length===cfg.trendYears?recent.at(-1).ovr-recent[0].ovr:0;
    const lowRank=ranking>cfg.lowRanking,weak=Number(candidate.baseOvr)<cfg.weakOvr,
        inactive=(candidate.aiDevelopmentSummary?.matches||0)<cfg.inactiveMatches;
    const declining=recent.length===cfg.trendYears&&recent.every(h=>h.maturation+h.performance+h.decline+h.aging+h.recovery<0)
        &&trend<-cfg.minimumTrendLoss;
    if(age<cfg.normalStartAge) return weak&&lowRank&&declining
        ? cfg.earlyMaximumChance*(age-cfg.minimumEarlyAge+1)/(cfg.normalStartAge-cfg.minimumEarlyAge) : 0;
    const longevityShift=(candidate.longevity-AI_CAREER_CONFIG.longevity.mode)*cfg.longevityShiftYears;
    let chance=Math.max(0,(age-(cfg.normalStartAge-1)-longevityShift)*cfg.yearlySlope);
    const context=(weak?cfg.weakAdjustment:0)+(lowRank?cfg.lowRankingAdjustment:0)+(inactive?cfg.inactivityAdjustment:0)
        +(trend<-cfg.minimumTrendLoss?cfg.declineAdjustment:0)
        -(Number.isFinite(ranking)&&ranking>0&&ranking<=cfg.strongRanking&&candidate.baseOvr>=cfg.strongOvr?cfg.strongAdjustment:0);
    chance+=aiCareerClamp(context,-cfg.maximumContextAdjustment,cfg.maximumContextAdjustment);
    if(age>=cfg.oldAgeDominates)chance=Math.max(chance,cfg.oldAgeMinimumChance+(age-cfg.oldAgeDominates)*cfg.oldAgeYearlySlope);
    return aiCareerClamp(chance,0,1);
}
