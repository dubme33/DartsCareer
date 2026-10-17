// Match-only calibration. Stored ratings, career progression and eligibility
// remain the source data; these curves describe how those ratings play.
const AMATEUR_THROW_SKILL_POINTS = Object.freeze([[1,9.8],[10,13.5],[20,18],[30,23.3],[40,29],[50,35],[70,70]]);

function getPerformanceOverall(stats) {
    const own = typeof isCurrentPlayer === 'function' && isCurrentPlayer(stats);
    const value = Number(own ? stats?.overall ?? stats?.ovr : stats?.ovr ?? stats?.overall);
    return Number.isFinite(value) && value >= 1 ? value : null;
}

function interpolatePerformancePoints(points, value) {
    if (value <= points[0][0]) return points[0][1];
    for (let index=1;index<points.length;index++) {
        if (value > points[index][0]) continue;
        const [fromX,fromY]=points[index-1],[toX,toY]=points[index];
        return fromY+(toY-fromY)*(value-fromX)/(toX-fromX);
    }
    return points[points.length-1][1];
}

function getLowRatingThrowProfile(stats, targetMult) {
    const overall=getPerformanceOverall(stats);
    if (overall===null || overall>=70) return null;
    const skill=Number(targetMult===2 ? stats.doubles : stats.scoring);
    const transition=Math.max(0,(overall-50)/20);
    return { stat:interpolatePerformancePoints(AMATEUR_THROW_SKILL_POINTS,overall)+(Number.isFinite(skill)?skill-overall:0),
        statFloor:1+24*transition,hitFloor:1+11*transition,
        bullStatFloor:1+19*transition,bullHitFloor:1+9*transition };
}

function getOverallMatchAverage(overall, professionalIntercept=60.5) {
    if (overall>=70) return professionalIntercept+overall*0.42;
    return interpolatePerformancePoints([[1,35],[10,40],[20,45],[30,50],[40,55],[50,60],[70,professionalIntercept+70*0.42]],overall);
}
