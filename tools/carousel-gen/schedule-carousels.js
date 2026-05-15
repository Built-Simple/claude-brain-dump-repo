import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CAROUSELS_DIR = path.join(__dirname, 'carousels');
const BUFFER_KILLER_URL = 'http://192.168.1.149:3080';

// ─────────────────────────────────────────────
// CONFIGURATION
// ─────────────────────────────────────────────
const PLATFORMS = ['linkedin', 'instagram', 'late_threads'];
const POST_HOUR_ET = 6;  // 6:00 AM Eastern Time
const START_DATE = new Date();  // Start tomorrow
START_DATE.setDate(START_DATE.getDate() + 1);

// Skip these carousels (need lawyer review)
const SKIP_IDS = ['07-hipaa-compliance', '19-tcpa-cliff'];

// ─────────────────────────────────────────────
// IMAGE HOSTING (catbox.moe - free, permanent)
// Using curl because catbox blocks Node.js fetch
// ─────────────────────────────────────────────
async function uploadToCatbox(filepath) {
  const { stdout, stderr } = await execAsync(
    `curl -s "https://catbox.moe/user/api.php" -F "reqtype=fileupload" -F "fileToUpload=@${filepath}"`
  );

  const url = stdout.trim();
  if (!url.startsWith('https://')) {
    throw new Error(`Invalid catbox response: ${url || stderr}`);
  }

  return url;
}

// ─────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────
function getScheduledTime(dayOffset) {
  const date = new Date(START_DATE);
  date.setDate(date.getDate() + dayOffset);
  // Set to 6 AM ET (UTC-4 during EDT, UTC-5 during EST)
  // Using 10:00 UTC which is 6:00 AM ET during daylight saving
  date.setUTCHours(10, 0, 0, 0);
  return date.toISOString();
}

async function schedulePost(text, platforms, imageUrls, scheduledTime) {
  const response = await fetch(`${BUFFER_KILLER_URL}/api/v1/post`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      platforms,
      imageUrls,  // Array of public URLs for carousel
      scheduledTime,
    }),
  });
  return response.json();
}

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log('║  SCHEDULE SMB AI CAROUSELS                                     ║');
  console.log('║                                                                ║');
  console.log(`║  Time: ${POST_HOUR_ET}:00 AM ET daily                                        ║`);
  console.log(`║  Platforms: ${PLATFORMS.join(', ')}                      ║`);
  console.log('║  Images: Uploaded to catbox.moe (permanent storage)           ║');
  console.log('╚════════════════════════════════════════════════════════════════╝');
  console.log('');

  // Get all carousel folders
  const folders = await fs.readdir(CAROUSELS_DIR);
  const carouselDirs = folders.filter(f => !f.startsWith('.') && !SKIP_IDS.includes(f)).sort();

  console.log(`Found ${carouselDirs.length} carousels to schedule (skipping ${SKIP_IDS.length} for lawyer review)\n`);

  let scheduled = 0;
  let dayOffset = 0;

  for (const dir of carouselDirs) {
    const carouselPath = path.join(CAROUSELS_DIR, dir);
    const metadataPath = path.join(carouselPath, 'metadata.json');

    // Read metadata
    let metadata;
    try {
      metadata = JSON.parse(await fs.readFile(metadataPath, 'utf8'));
    } catch (e) {
      console.log(`  ⚠️  Skipping ${dir} - no metadata.json`);
      continue;
    }

    if (metadata.lawyerReview) {
      console.log(`  ⚠️  Skipping ${dir} - needs lawyer review`);
      continue;
    }

    // Get slide images
    const files = await fs.readdir(carouselPath);
    const slideFiles = files.filter(f => f.startsWith('slide-') && f.endsWith('.png')).sort();

    if (slideFiles.length === 0) {
      console.log(`  ⚠️  Skipping ${dir} - no slides found`);
      continue;
    }

    const scheduledTime = getScheduledTime(dayOffset);
    const scheduleDate = new Date(scheduledTime);

    console.log(`[${scheduled + 1}] ${metadata.name}`);
    console.log(`    📅 ${scheduleDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} at 6:00 AM ET`);
    console.log(`    🖼️  ${slideFiles.length} slides`);

    // Upload ALL slides to catbox for carousel support
    console.log(`    📤 Uploading slides to catbox.moe...`);
    const imageUrls = [];
    try {
      for (let i = 0; i < slideFiles.length; i++) {
        const slidePath = path.join(carouselPath, slideFiles[i]);
        const url = await uploadToCatbox(slidePath);
        imageUrls.push(url);
        console.log(`       Slide ${i + 1}/${slideFiles.length} ✓`);
        // Rate limit - be nice to catbox
        await new Promise(r => setTimeout(r, 500));
      }
      console.log(`    ✓ All ${slideFiles.length} slides uploaded`);
    } catch (err) {
      console.log(`    ✗ Upload failed: ${err.message}`);
      continue;
    }

    // Create caption from metadata
    const caption = `${metadata.name}\n\n📱 Swipe for ${slideFiles.length} slides →\n\n#AI #SmallBusiness #AIAutomation #BuiltSimple`;

    try {
      const result = await schedulePost(caption, PLATFORMS, imageUrls, scheduledTime);

      if (result.success || result.scheduled) {
        console.log(`    ✓ Scheduled for ${scheduleDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`);
        scheduled++;
        dayOffset++;
      } else {
        console.log(`    ✗ Failed: ${JSON.stringify(result)}`);
      }
    } catch (err) {
      console.log(`    ✗ Error: ${err.message}`);
    }

    console.log('');

    // Delay between carousels to avoid rate limiting
    await new Promise(r => setTimeout(r, 1000));
  }

  console.log('╔════════════════════════════════════════════════════════════════╗');
  console.log(`║  DONE - ${scheduled} carousels scheduled                              ║`);
  console.log('╚════════════════════════════════════════════════════════════════╝');
}

main().catch(console.error);
