// Editorial limits only. No parameter in this module affects sporting simulation.
const DARTS_NEWS_CONFIG = Object.freeze({ schema: 4, configVersion: 'news-editorial-2', editorialVersion: 2,
    liveLimit: 180, archiveLimit: 1200, archivePerSeason: 36, seasonLimit: 80,
    storylineLimit: 96, supportLimit: 8, timelineLimit: 16, peopleLimit: 650,
    eventIdLimit: 700, matchKeyLimit: 700, templateLimit: 60, debugLimit: 80,
    candidateLimit: 40, combineDays: 3, pendingDays: 7, coolingDays: 120, completedDays: 300,
    minimumImportance: 48, majorImportance: 72, headlineImportance: 90,
    normalWeeklyBudget: 6, majorWeeklyBudget: 10, worldWeeklyBudget: 16, hardWeeklyBudget: 20,
    observationFreshDays: 14, repeatTopicDays: 45, rankingCheckDays: 7,
    coverageMatchLimit: 128, coverageHistoryEvents: 12, articleRouteLimit: 8, relatedLimit: 4,
    categories: ['TOURNAMENT','BREAKING','RANKING','CAREER','FORM','MILESTONE','RECORD',
        'UPSET','WORLD_CHAMPIONSHIP','RIVALRY','RETIREMENT','PREVIEW'] });
