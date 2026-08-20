function getPrefix(m) { return m === 1 ? "" : (m === 2 ? "D" : "T"); }
        function logThrow(text, type) {
            const logBox = document.getElementById('match-log');
            logBox.innerHTML = `<div class="log-entry ${type}">${escapeHtml(text)}</div>` + logBox.innerHTML;
        }

        function drawDartboard() {
            const canvas = document.getElementById('dartboard'); const ctx = canvas.getContext('2d');
            const cx = canvas.width / 2, cy = canvas.height / 2;
            ctx.clearRect(0, 0, canvas.width, canvas.height);

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

                ctx.beginPath(); ctx.arc(cx, cy, 130, startAngle, endAngle); ctx.arc(cx, cy, 120, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.beginPath(); ctx.arc(cx, cy, 80, startAngle, endAngle); ctx.arc(cx, cy, 70, endAngle, startAngle, true); ctx.closePath();
                ctx.fillStyle = isBlack ? cRed : cGreen; ctx.fill();

                ctx.fillStyle = '#fff'; 
                ctx.fillText(dartboardOrder[i], cx + 148 * Math.cos(midAngle), cy + 148 * Math.sin(midAngle));
            }

            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 2*Math.PI); ctx.fillStyle = cGreen; ctx.fill();
            ctx.beginPath(); ctx.arc(cx, cy, 6.5, 0, 2*Math.PI); ctx.fillStyle = cRed; ctx.fill();

            ctx.lineWidth = 1; ctx.strokeStyle = 'rgba(210, 210, 210, 0.6)'; 
            for(let i = 0; i < 20; i++) {
                let angle = -Math.PI/2 - Math.PI/20 + (i * (Math.PI/10));
                ctx.beginPath(); ctx.moveTo(cx + 16 * Math.cos(angle), cy + 16 * Math.sin(angle));
                ctx.lineTo(cx + 130 * Math.cos(angle), cy + 130 * Math.sin(angle)); ctx.stroke();
            }
            ctx.beginPath(); ctx.arc(cx, cy, 130, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 120, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 80, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 70, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 16, 0, 2*Math.PI); ctx.stroke();
            ctx.beginPath(); ctx.arc(cx, cy, 6.5, 0, 2*Math.PI); ctx.stroke();
            
            ctx.lineWidth = 2; ctx.strokeStyle = '#888';
            ctx.beginPath(); ctx.arc(cx, cy, 163, 0, 2*Math.PI); ctx.stroke();

            drawnDarts.forEach(d => { 
                ctx.beginPath(); 
                ctx.arc(d.x, d.y, 5, 0, 2*Math.PI); 
                ctx.fillStyle = d.color; 
                ctx.fill(); 
                ctx.lineWidth = 1.5; 
                ctx.strokeStyle = '#000'; 
                ctx.stroke();

                ctx.beginPath(); 
                ctx.arc(d.x, d.y, 1.5, 0, 2*Math.PI); 
                ctx.fillStyle = '#fff'; 
                ctx.fill(); 
            });
        }

        function addDartToCanvas(hitSec, hitMult, color, targetSec, targetMult) {
            const canvas = document.getElementById('dartboard'); const cx = canvas.width / 2, cy = canvas.height / 2; let angle, radius;
            
            let displaySec = hitSec === 0 ? targetSec : hitSec; 
            
            if (displaySec === 25) { 
                angle = Math.random() * 2 * Math.PI; 
                if (hitMult === 2) radius = Math.random() * 6;
                else if (hitMult === 1) radius = 6 + Math.random() * 9;
                else radius = 133 + Math.random() * 20; 
            }
            else {
                let baseAngle = -Math.PI/2 + (dartboardOrder.indexOf(displaySec) * (Math.PI/10)); 
                angle = baseAngle + (Math.random() * 0.8 - 0.4) * (Math.PI/10); 
                
                if (hitMult === 3) radius = 71 + Math.random() * 8; 
                else if (hitMult === 2) radius = 121 + Math.random() * 7; 
                else if (hitMult === 0) radius = 133 + Math.random() * 9;
                // --- NOWOŚĆ: Rzut w bulla, który wylądował w innym sektorze (singlu) ---
                else if (targetSec === 25) radius = 18 + Math.random() * 25; 
                else if (targetMult === 3) radius = Math.random() < 0.55 ? 59 + Math.random() * 9 : 81 + Math.random() * 11;
                else if (targetMult === 2) radius = 106 + Math.random() * 12;
                else radius = 92 + Math.random() * 24;
            }
            drawnDarts.push({x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle), color}); drawDartboard();
        }

        