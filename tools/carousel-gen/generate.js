import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// CAROUSEL DATA — edit this to change content
// ─────────────────────────────────────────────
const CAROUSEL = {
  theme: {
    background: '#0A0A0F',
    accent: '#7C5CFC',
    textColor: '#F0EFFF',
    brand: 'Built Simple AI',
    cta: 'Follow for more →',
  },
  slides: [
    {
      tag: 'AI Automation',
      headline: 'Your restaurant is <em>losing money</em> every time the phone rings.',
      body: "Missed calls = missed reservations. Here's what an AI receptionist actually changes.",
      headlineSize: 88,
    },
    {
      tag: 'The Problem',
      stat: '67%',
      statLabel: "of callers hang up if put on hold — and they don't call back.",
    },
    {
      tag: 'What Changes',
      headline: 'An AI receptionist <em>never</em> puts anyone on hold.',
      bullets: [
        'Answers every call instantly, 24/7',
        'Takes reservations directly into your POS',
        'Handles FAQs so your staff stays focused',
        'Escalates to a human only when needed',
      ],
      headlineSize: 72,
    },
    {
      tag: 'Real Impact',
      headline: 'A 50-table restaurant recovers <em>$8,400/mo</em> in missed reservations.',
      body: "That's the average we see in the first 90 days. Setup takes one afternoon.",
      headlineSize: 80,
    },
    {
      tag: 'Get Started',
      headline: 'Built Simple AI sets this up <em>for you.</em>',
      body: 'No tech team required. No long contracts. We handle everything.',
      headlineSize: 88,
    },
  ],
};

// ─────────────────────────────────────────────
// ENGINE
// ─────────────────────────────────────────────
async function buildHTML(fonts) {
  const ff = (key, family, weight) =>
    `@font-face{font-family:'${family}';font-weight:${weight};src:url('data:font/woff2;base64,${fonts[key]}') format('woff2');}`;

  const fontCSS = [
    ff('syne-700','Syne',700), ff('syne-800','Syne',800),
    ff('dm-300','DM',300), ff('dm-400','DM',400), ff('dm-500','DM',500),
  ].join('');

  return `<!DOCTYPE html>
<html><head><meta charset="UTF-8"><style>
${fontCSS}
*{margin:0;padding:0;box-sizing:border-box;}
body{width:1080px;height:1350px;overflow:hidden;font-family:'DM',sans-serif;background:{{background}};}
.slide{width:100%;height:100%;display:flex;flex-direction:column;justify-content:space-between;padding:80px;position:relative;}
.accent-bar{position:absolute;top:0;left:80px;width:6px;height:220px;background:{{accent}};border-radius:0 0 4px 4px;}
.dot-grid{position:absolute;bottom:120px;right:80px;width:130px;height:130px;background-image:radial-gradient(circle,{{accent}}55 1.5px,transparent 1.5px);background-size:18px 18px;opacity:.45;}
.slide-num{position:absolute;top:66px;right:80px;font-family:'Syne';font-size:18px;font-weight:700;color:{{accent}};letter-spacing:3px;text-transform:uppercase;}
.tag{display:inline-block;background:{{accent}}20;color:{{accent}};font-size:15px;font-weight:500;letter-spacing:2px;text-transform:uppercase;padding:8px 18px;border-radius:4px;border:1px solid {{accent}}44;margin-bottom:32px;width:fit-content;}
.headline{font-family:'Syne';font-size:{{headlineSize}}px;font-weight:700;line-height:1.18;color:{{textColor}};letter-spacing:0px;margin-bottom:40px;}
.headline em{font-style:normal;color:{{accent}};}
.body{font-size:28px;font-weight:300;line-height:1.65;color:{{textColor}}cc;max-width:820px;}
.bullets{list-style:none;display:flex;flex-direction:column;gap:24px;}
.bullets li{display:flex;align-items:flex-start;gap:20px;font-size:26px;font-weight:400;line-height:1.5;color:{{textColor}}dd;}
.bullets li::before{content:'';flex-shrink:0;width:10px;height:10px;border-radius:50%;background:{{accent}};margin-top:12px;}
.stat{font-family:'Syne';font-size:160px;font-weight:800;line-height:1;color:{{accent}};letter-spacing:-6px;}
.stat-label{font-size:28px;font-weight:400;color:{{textColor}}99;margin-top:12px;}
.footer{display:flex;justify-content:space-between;align-items:center;}
.brand{font-family:'Syne';font-size:20px;font-weight:700;color:{{textColor}}55;letter-spacing:2px;text-transform:uppercase;}
.cta{font-size:18px;font-weight:500;color:{{accent}};letter-spacing:1px;}
.content{flex:1;display:flex;flex-direction:column;justify-content:center;padding-top:60px;}
</style></head>
<body><div class="slide">
  <div class="accent-bar"></div>
  <div class="dot-grid"></div>
  <div class="slide-num">{{slideNum}} / {{totalSlides}}</div>
  <div class="content">
    {{#if tag}}<div class="tag">{{tag}}</div>{{/if}}
    {{#if headline}}<div class="headline">{{{headline}}}</div>{{/if}}
    {{#if body}}<p class="body">{{body}}</p>{{/if}}
    {{#if bullets}}<ul class="bullets">{{#each bullets}}<li>{{this}}</li>{{/each}}</ul>{{/if}}
    {{#if stat}}<div class="stat">{{stat}}</div><div class="stat-label">{{statLabel}}</div>{{/if}}
  </div>
  <div class="footer">
    <span class="brand">{{brand}}</span>
    {{#if isLastSlide}}<span class="cta">{{cta}}</span>{{/if}}
  </div>
</div></body></html>`;
}

async function generateCarousel(carousel, outputDir = './output') {
  const fonts = JSON.parse(await fs.readFile(path.join(__dirname, 'fonts.json'), 'utf8'));
  const templateSrc = await buildHTML(fonts);
  const template = Handlebars.compile(templateSrc);

  await fs.mkdir(outputDir, { recursive: true });

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1080, height: 1350, deviceScaleFactor: 2 });

  const total = carousel.slides.length;
  const paths = [];

  for (let i = 0; i < total; i++) {
    const slide = carousel.slides[i];
    const data = {
      ...carousel.theme,
      ...slide,
      slideNum: String(i + 1).padStart(2, '0'),
      totalSlides: String(total).padStart(2, '0'),
      isLastSlide: i === total - 1,
      headlineSize: slide.headlineSize ?? 88,
    };

    const html = template(data);
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.evaluate(() => document.fonts.ready);

    const filename = path.join(outputDir, `slide-${String(i + 1).padStart(2, '0')}.png`);
    await page.screenshot({ path: filename, type: 'png' });
    paths.push(filename);
    console.log(`  ✓ Slide ${i + 1}/${total}`);
  }

  await browser.close();
  return paths;
}

// ─────────────────────────────────────────────
// EMAIL DELIVERY
// ─────────────────────────────────────────────
const EMAIL_TO = process.env.CAROUSEL_EMAIL || 'info@built-simple.ai';

async function emailCarousel(paths, carousel) {
  const boundary = `----=_Part_${Date.now()}`;
  const subject = carousel.name || `Carousel: ${carousel.slides[0]?.tag || 'New Carousel'}`;

  // Build slide summary
  const slideList = carousel.slides.map((s, i) =>
    `  ${i + 1}. ${s.tag || 'Slide'}: ${s.headline?.replace(/<[^>]*>/g, '') || s.stat || 'Content'}`
  ).join('\n');

  let email = `To: ${EMAIL_TO}
From: carousel-gen@giratina
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="${boundary}"

--${boundary}
Content-Type: text/plain; charset=utf-8

Carousel Generated: ${paths.length} slides

Theme:
  Brand: ${carousel.theme.brand}
  Accent: ${carousel.theme.accent}
  Background: ${carousel.theme.background}

Slides:
${slideList}

Generated on Giratina at ${new Date().toISOString()}
`;

  // Attach each PNG
  for (const filepath of paths) {
    const filename = path.basename(filepath);
    const data = await fs.readFile(filepath);
    const base64 = data.toString('base64');

    email += `
--${boundary}
Content-Type: image/png; name="${filename}"
Content-Transfer-Encoding: base64
Content-Disposition: attachment; filename="${filename}"

${base64.match(/.{1,76}/g).join('\n')}
`;
  }

  email += `\n--${boundary}--\n`;

  return new Promise((resolve, reject) => {
    const proc = exec('msmtp -t', (error, stdout, stderr) => {
      if (error) reject(new Error(`Email failed: ${stderr || error.message}`));
      else resolve();
    });
    proc.stdin.write(email);
    proc.stdin.end();
  });
}

// ─── RUN ───
console.log('\n🎠 Generating carousel...\n');
const start = Date.now();

generateCarousel(CAROUSEL)
  .then(async (paths) => {
    console.log(`\n✅ Done — ${paths.length} slides in ${Date.now() - start}ms`);
    console.log(`   Output: ${path.resolve('./output')}\n`);

    // Email the slides
    console.log(`📧 Emailing to ${EMAIL_TO}...`);
    try {
      await emailCarousel(paths, CAROUSEL);
      console.log(`   ✓ Sent!\n`);
    } catch (err) {
      console.error(`   ✗ Email failed: ${err.message}\n`);
    }
  })
  .catch(err => {
    console.error('\n❌', err.message);
    process.exit(1);
  });
