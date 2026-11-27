// Hearthside charts: small SVG charts drawn from the same figures the
// pages show. No library, no network — just geometry.

function polar(cx, cy, r, angleDeg) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
}

function arcPath(cx, cy, rOuter, rInner, startDeg, endDeg) {
  const [x1, y1] = polar(cx, cy, rOuter, startDeg);
  const [x2, y2] = polar(cx, cy, rOuter, endDeg);
  const [x3, y3] = polar(cx, cy, rInner, endDeg);
  const [x4, y4] = polar(cx, cy, rInner, startDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  return [
    `M ${x1.toFixed(1)} ${y1.toFixed(1)}`,
    `A ${rOuter} ${rOuter} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`,
    `L ${x3.toFixed(1)} ${y3.toFixed(1)}`,
    `A ${rInner} ${rInner} 0 ${large} 0 ${x4.toFixed(1)} ${y4.toFixed(1)}`,
    'Z',
  ].join(' ');
}

// Donut of spending by category. slices: [{label, value, color}]
export function donutChart(slices, size = 260) {
  const total = slices.reduce((a, s) => a + s.value, 0) || 1;
  const cx = size / 2;
  const cy = size / 2;
  const rOuter = size / 2 - 6;
  const rInner = rOuter - 42;
  let angle = 0;
  const paths = slices
    .filter((s) => s.value > 0)
    .map((s) => {
      const sweep = (s.value / total) * 360;
      const start = angle;
      angle += sweep;
      // Leave a hairline gap between slices.
      const end = angle - 0.7;
      return `<path d="${arcPath(cx, cy, rOuter, rInner, start, end)}" fill="${s.color}"><title>${s.label}: $${s.value.toLocaleString('en-US')}</title></path>`;
    })
    .join('');
  return `<svg class="chart" viewBox="0 0 ${size} ${size}" role="img" aria-label="Spending by category, donut chart">
    ${paths}
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="26" font-weight="700" fill="#243129">$${total.toLocaleString('en-US')}</text>
    <text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="12" fill="#6b7568">spent in November</text>
  </svg>`;
}

// Grouped bars: income vs. spending per month. rows: [{label, income, spent}]
export function trendChart(rows, width = 640, height = 300) {
  const padL = 48;
  const padB = 28;
  const padT = 14;
  const max = Math.max(...rows.map((r) => Math.max(r.income, r.spent))) * 1.08;
  const plotW = width - padL - 12;
  const plotH = height - padT - padB;
  const groupW = plotW / rows.length;
  const barW = Math.min(30, groupW * 0.28);
  const y = (v) => padT + plotH - (v / max) * plotH;

  const grid = [0, 0.25, 0.5, 0.75, 1].map((f) => {
    const gy = padT + plotH * (1 - f);
    const val = Math.round(max * f);
    return `<line x1="${padL}" y1="${gy}" x2="${width - 12}" y2="${gy}" stroke="#e4dcc7" stroke-width="1"/>
      <text x="${padL - 8}" y="${gy + 4}" text-anchor="end" font-size="11" fill="#6b7568">$${val.toLocaleString('en-US')}</text>`;
  }).join('');

  const bars = rows.map((r, i) => {
    const gx = padL + i * groupW + groupW / 2;
    return `<rect x="${(gx - barW - 3).toFixed(1)}" y="${y(r.income).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.income)).toFixed(1)}" rx="3" fill="#1e4d38"><title>${r.label} income $${r.income.toLocaleString('en-US')}</title></rect>
      <rect x="${(gx + 3).toFixed(1)}" y="${y(r.spent).toFixed(1)}" width="${barW}" height="${(padT + plotH - y(r.spent)).toFixed(1)}" rx="3" fill="#c05f33"><title>${r.label} spending $${r.spent.toLocaleString('en-US')}</title></rect>
      <text x="${gx}" y="${height - 8}" text-anchor="middle" font-size="12" fill="#243129">${r.label}</text>`;
  }).join('');

  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="Income versus spending, June to November">
    ${grid}${bars}
    <text x="${padL}" y="${height - 8}" font-size="11" fill="#6b7568"></text>
  </svg>
  <p class="small"><span class="dot" style="background:#1e4d38"></span>Income &nbsp; <span class="dot" style="background:#c05f33"></span>Spending (not counting the $800 savings transfer)</p>`;
}

// A horizontal bar comparing planned vs. actual for one category.
export function planBar(planned, actual) {
  const max = Math.max(planned, actual, 1);
  const pct = Math.min(100, Math.round((actual / planned) * 100));
  const over = actual > planned;
  return `<div class="bar${over ? ' over' : ''}" role="img" aria-label="$${actual} of $${planned} planned"><span style="width:${pct}%"></span></div>`;
}
