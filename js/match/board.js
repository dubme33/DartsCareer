function getPrefix(m) { return m === 1 ? "" : (m === 2 ? "D" : "T"); }
        function logThrow(text, type) {
            const logBox = document.getElementById('match-log');
            logBox.insertAdjacentHTML('afterbegin', `<div class="log-entry ${escapeHtml(type)}">${escapeHtml(text)}</div>`);
        }

        function drawDartboard() {
            if (typeof window !== 'undefined' && window.matchBoard3D?.sync(drawnDarts)) return;
            const canvas = document.getElementById('dartboard'); const ctx = canvas.getContext('2d');
            const cx = canvas.width / 2, cy = canvas.height / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            const { innerBull, outerBull, trebleInner, trebleOuter, doubleInner } = matchBoardLayout.radii;
            const skin = typeof window !== 'undefined' ? window.matchBoardSkin?.getCanvas() : null;
            if (skin) {
                ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = 'high';
                ctx.drawImage(skin, 0, 0, canvas.width, canvas.height);
            } else {
            ctx.beginPath(); ctx.arc(cx, cy, canvas.width/2, 0, 2*Math.PI); 
            let grad = ctx.createRadialGradient(cx, cy, 140, cx, cy, 170);
            grad.addColorStop(0, '#1a1a1a'); grad.addColorStop(1, '#0a0a0a');
            ctx.fillStyle = grad; ctx.fill();

            ctx.font = "bold 20px 'Trebuchet MS', Arial, sans-serif"; ctx.textAlign = "center"; ctx.textBaseline = "middle";

            const cBlack = '#1a1a1a'; const cWhite = '#f0e5d3'; const cRed = '#c21e24'; const cGreen = '#008a3d';

            for(let i = 0; i < 20; i++) {
                let startAngle = -Math.PI/2 - Math.PI/20 + (i * (Math.PI/10));
                let endAngle = startAngle + (Math.PI/10);
                let midAngle = startAngle + (Math.PI/20);
                let isBlack = i % 2 === 0;

                ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, 130, startAngle, endAngle);
                ctx.fillStyle = isBlack ? cBlack : cWhite; ctx.fill();

                ctx.beginPath(); ctx.arc(cx, cy, 130, startAngle, endAngle); ctx.arc(cx, cy, doubleInner, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.beginPath(); ctx.arc(cx, cy, trebleOuter, startAngle, endAngle); ctx.arc(cx, cy, trebleInner, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.fillStyle = '#fff'; 
                ctx.fillText(dartboardOrder[i], cx + 148 * Math.cos(midAngle), cy + 148 * Math.sin(midAngle));
            }

            ctx.beginPath(); ctx.arc(cx, cy, outerBull, 0, 2*Math.PI); ctx.fillStyle = cGreen; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, innerBull, 0, 2*Math.PI); ctx.fillStyle = cRed; ctx.fill();

            ctx.lineWidth = .75; ctx.lineCap = 'butt'; ctx.strokeStyle = 'rgba(210, 210, 210, 0.62)'; 
            for(let i = 0; i < 20; i++) {
                let angle = -Math.PI/2 - Math.PI/20 + (i * (Math.PI/10));
                ctx.beginPath(); ctx.moveTo(cx + outerBull * Math.cos(angle), cy + outerBull * Math.sin(angle));
                ctx.lineTo(cx + 130 * Math.cos(angle), cy + 130 * Math.sin(angle)); ctx.stroke();
            }
            ctx.beginPath(); ctx.arc(cx, cy, 130, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, doubleInner, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, trebleOuter, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, trebleInner, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, outerBull, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, innerBull, 0, 2*Math.PI); ctx.stroke();
            
            ctx.lineWidth = 2; ctx.strokeStyle = '#888';
            ctx.beginPath(); ctx.arc(cx, cy, 163, 0, 2*Math.PI); ctx.stroke();
            }

            const presentations = matchBoardLayout.presentDarts(drawnDarts);
            drawnDarts.forEach((d, index) => { 
                const display = presentations[index].point;
                ctx.beginPath(); 
                ctx.arc(display.x, display.y, 5, 0, 2*Math.PI); 
                ctx.fillStyle = d.dartStyle?.flightColor || d.color; 
                ctx.fill(); 
                ctx.lineWidth = 1.5; 
                ctx.strokeStyle = '#000'; 
                ctx.stroke();

                ctx.beginPath(); 
                ctx.arc(display.x, display.y, 1.5, 0, 2*Math.PI); 
                ctx.fillStyle = '#fff'; 
                ctx.fill(); 
            });
        }

        function animateBounceOutDart(result) {
            if (typeof window !== 'undefined' && window.matchBoard3D?.bounceOut(result)) return;
            const canvas = document.getElementById('dartboard');
            if (!canvas?.parentElement || typeof canvas.getBoundingClientRect !== 'function') return;
            const boardRect = canvas.getBoundingClientRect(), parentRect = canvas.parentElement.getBoundingClientRect();
            const sector = result.bouncedSector, mult = result.bouncedMult;
            const angle = sector === 25 ? 0 : -Math.PI / 2 + dartboardOrder.indexOf(sector) * Math.PI / 10;
            const radius = sector === 25 ? (mult === 2 ? 0 : 11) : mult === 3 ? 75 : mult === 2 ? 125 : 105;
            const display = matchBoardLayout.toDisplayPoint(result.boardPoint || { x: 170 + radius * Math.cos(angle), y: 170 + radius * Math.sin(angle) });
            const dart = document.createElement('span');
            dart.className = 'bounce-out-dart'; dart.setAttribute('aria-hidden', 'true');
            dart.style.left = `${boardRect.left - parentRect.left + display.x * boardRect.width / canvas.width}px`;
            dart.style.top = `${boardRect.top - parentRect.top + display.y * boardRect.height / canvas.height}px`;
            canvas.parentElement.appendChild(dart);
            dart.addEventListener('animationend', () => dart.remove(), { once: true });
            setTimeout(() => dart.remove(), 600);
        }

        // Both renderers use this point, inside the field chosen by the match logic.
        function getDartboardHitPoint(hitSec, hitMult, targetSec, targetMult, random = Math.random) {
            let angle, radius;
            
            let displaySec = hitSec === 0 ? targetSec : hitSec; 
            
            if (displaySec === 25) { 
                angle = random() * 2 * Math.PI;
                if (hitMult === 2) radius = random() * 6;
                else if (hitMult === 1) radius = 6.8 + random() * 8.2;
                else radius = 133 + random() * 20;
            }
            else {
                let baseAngle = -Math.PI/2 + (dartboardOrder.indexOf(displaySec) * (Math.PI/10)); 
                angle = baseAngle + (random() * 0.8 - 0.4) * (Math.PI/10);
                
                if (hitMult === 3) radius = 71 + random() * 8;
                else if (hitMult === 2) radius = 121 + random() * 7;
                else if (hitMult === 0) radius = 133 + random() * 9;
                // Single po próbie środka nadal leży poza zielonym pierścieniem,
                // ale wizualnie pozostaje blisko celu (promień 17-32 zamiast 18-43).
                else if (targetSec === 25) radius = 17 + Math.pow(random(), 1.6) * 15;
                else if (targetMult === 3) radius = random() < 0.55 ? 59 + random() * 9 : 81 + random() * 11;
                else if (targetMult === 2) radius = 106 + random() * 12;
                else radius = 92 + random() * 24;
            }
            return { x: 170 + radius * Math.cos(angle), y: 170 + radius * Math.sin(angle) };
        }

        function getDartCollisionText(result) {
            const labels = {
                pl: ['Kontakt lotek — zmiana kąta', 'Kontakt lotek — odbicie'],
                en: ['Dart collision — changed angle', 'Dart collision — deflection'],
                de: ['Dartkontakt — anderer Winkel', 'Dartkontakt — Ablenkung'],
                nl: ['Dartcontact — andere hoek', 'Dartcontact — afbuiging']
            }[typeof currentLang === 'string' ? currentLang : 'pl'] || ['Dart collision — changed angle', 'Dart collision — deflection'];
            if (result.bounceOut) return `${labels[1]}: bounce-out (0)`;
            if (!result.collision.deflected) return labels[0];
            const field = (sector, mult) => sector === 25 ? (mult === 2 ? 'Bull' : '25') : `${getPrefix(mult)}${sector}`;
            return `${labels[1]}: ${field(result.collision.originalSector, result.collision.originalMult)} → ${field(result.sector, result.mult)}`;
        }

        function addDartToCanvas(hitSec, hitMult, color, targetSec, targetMult, result = null, side = null) {
            const dartSide = side || (typeof currentMatch !== 'undefined' && currentMatch?.turn === 'p2' ? 'p2' : 'p1');
            const dartStyle = typeof window !== 'undefined' && typeof window.getMatchDartLoadout === 'function'
                ? window.getMatchDartLoadout(dartSide) : null;
            drawnDarts.push({ ...(result?.boardPoint || getDartboardHitPoint(hitSec, hitMult, targetSec, targetMult)),
                color, dartSide, ...(dartStyle ? { dartStyle } : {}),
                ...(result?.dartPose ? { dartPose: result.dartPose } : {}), ...(result?.collision ? { collision: result.collision } : {}) });
            drawDartboard();
        }

        
