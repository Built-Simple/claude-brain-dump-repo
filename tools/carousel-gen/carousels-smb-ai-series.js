/**
 * SMB AI Series - 20 Carousels
 * Generated: May 2026
 *
 * IMPORTANT: These carousels are stored in ./carousels/{number}-{slug}/
 * DO NOT delete the carousels folder - these are needed for scheduling!
 *
 * To regenerate: node carousels-smb-ai-series.js
 * Output: ./carousels/01-5-minute-cliff/, ./carousels/02-ai-receptionist-phone-bot/, etc.
 */

import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// ALL 20 CAROUSELS
// ─────────────────────────────────────────────

const THEME = {
  background: '#0A0A0F',
  accent: '#00D97E',
  textColor: '#F0EFFF',
  brand: 'Built Simple AI',
  cta: 'Follow for more →',
};

const CAROUSELS = [
  // #1 - The 5-minute Cliff
  {
    id: '01-5-minute-cliff',
    name: 'The 5-minute Cliff',
    theme: THEME,
    slides: [
      { tag: 'Speed to Lead', headline: 'Your customer expects a reply in <em>10 minutes.</em>', body: 'The industry average is 42 hours.', headlineSize: 76 },
      { tag: 'The Math', headline: '<em>66%</em> of B2C buyers want a response inside 10 minutes.', body: '78% buy from whoever responds first.', headlineSize: 72 },
      { tag: 'The 5-Minute Cliff', headline: 'Respond in 5 minutes: <em>21×</em> more likely to close.', body: 'After an hour, it\'s effectively over.', headlineSize: 72 },
      { tag: 'The Reality', headline: 'Most SMBs respond in <em>42 hours.</em> Or never.', body: '63% of inbound leads get no reply at all.', headlineSize: 76 },
      { tag: 'The Diagnosis', headline: 'You don\'t have a <em>sales problem.</em>', body: 'You have a clock problem.', headlineSize: 88 },
      { tag: 'The Fix', headline: 'The fix isn\'t another rep.', body: 'It\'s AI that picks up at 9pm on a Tuesday.', headlineSize: 80 },
    ],
  },

  // #2 - AI Receptionist is a Phone Bot
  {
    id: '02-ai-receptionist-phone-bot',
    name: 'AI Receptionist is a Phone Bot',
    theme: THEME,
    slides: [
      { tag: 'Hard Truth', headline: 'You bought an <em>"AI Receptionist."</em>', body: 'It only answers your phone.', headlineSize: 80 },
      { tag: 'Where Leads Actually Come From', headline: 'Your leads arrive on <em>7 channels:</em>', bullets: ['Facebook DMs', 'Google Business chat', 'Instagram', 'Your contact form', 'Text'], headlineSize: 76 },
      { tag: 'The Coverage Gap', headline: 'Nobody covers it all.', bullets: ['Jobber AI Receptionist: phone only', 'Podium\'s Jerry: phone + text', 'Mindbody Messenger: text only'], headlineSize: 80 },
      { tag: 'The Math', headline: '<em>52%</em> of leads arrive after hours.', body: 'Your "receptionist" is at lunch on 80% of them.', headlineSize: 76 },
      { tag: 'The Cost', headline: '<em>$349–$599/mo</em> for one channel out of seven.', headlineSize: 76 },
      { tag: 'The Fix', headline: 'Multi-channel coverage on the channels <em>your customers</em> actually use.', body: 'Not one bot in a tuxedo.', headlineSize: 72 },
    ],
  },

  // #3 - Reviews Older Than 90 Days
  {
    id: '03-reviews-90-days',
    name: 'Reviews Older Than 90 Days',
    theme: THEME,
    slides: [
      { tag: 'Review Reality', headline: 'You\'ve been collecting trophies that <em>expire.</em>', body: '74% of consumers only care about reviews from the last 90 days.', headlineSize: 76 },
      { tag: 'The Bar Is Rising', headline: 'In 2025, <em>17%</em> required 4.5+ stars.', body: 'In 2026, that jumped to 31%. Nearly doubled in a year.', headlineSize: 76 },
      { tag: 'The Threshold', headline: '<em>68%</em> won\'t use a business rated under 4 stars.', headlineSize: 80 },
      { tag: 'The New Search', headline: '<em>45%</em> now use ChatGPT to find local businesses.', body: 'Up from 6% one year ago.', headlineSize: 76 },
      { tag: 'Platform Shift', headline: 'Google\'s review share dropped from <em>83% to 71%</em> in 12 months.', body: 'Apple Maps almost doubled.', headlineSize: 72 },
      { tag: 'The Metric', headline: 'The metric that matters isn\'t total count.', body: 'It\'s review velocity — how many in the last 90 days.', headlineSize: 76 },
      { tag: 'The Warning', headline: 'No review in 3 months?', body: 'You\'re invisible to a third of your future customers.', headlineSize: 80 },
    ],
  },

  // #4 - The Plus Plan Trap
  {
    id: '04-plus-plan-trap',
    name: 'The Plus Plan Trap',
    theme: THEME,
    slides: [
      { tag: 'Pricing Games', headline: 'You don\'t have an AI strategy.', body: 'You have a $599 Jobber Plus subscription you upgraded to get one feature.', headlineSize: 76 },
      { tag: 'Jobber Pricing', headline: 'The tier ladder:', bullets: ['Core: $109/mo', 'Connect: $229/mo', 'Grow: $349/mo', 'Plus: $599/mo'], headlineSize: 88 },
      { tag: 'What\'s in Plus', headline: 'AI Receptionist is in <em>Plus.</em>', body: 'Marketing Suite is in Plus. Online Booking is in Plus.', headlineSize: 80 },
      { tag: 'The Math', headline: 'Grow ($349) + add-ons = <em>$527</em>', body: 'Plus is $599. By design.', headlineSize: 80 },
      { tag: 'Same Pattern', headline: 'Mindbody Ultimate Plus: <em>$599/mo</em>', body: 'Same architecture. Same trap.', headlineSize: 80 },
      { tag: 'ServiceTitan', headline: 'AI add-ons: <em>$250–$500</em> per tech per month.', body: 'On top of base.', headlineSize: 76 },
      { tag: 'The Reality', headline: 'You bought a tier. You use <em>three features.</em>', body: 'The other twelve are paying for a sales narrative.', headlineSize: 76 },
    ],
  },

  // #5 - The Colorado Panic That Died
  {
    id: '05-colorado-panic',
    name: 'The Colorado Panic That Died',
    theme: THEME,
    slides: [
      { tag: 'Compliance Update', headline: 'The Colorado AI deadline your consultant is selling you <em>doesn\'t exist anymore.</em>', headlineSize: 72 },
      { tag: 'April 27, 2026', headline: 'A federal court <em>blocked</em> the original Colorado AI Act with a TRO.', headlineSize: 76 },
      { tag: 'May 9, 2026', headline: 'Colorado House passed <em>SB 26-189</em> (57-6) to replace it.', body: 'Effective January 1, 2027.', headlineSize: 76 },
      { tag: 'What Got Dropped', headline: 'The new law dropped:', bullets: ['Bias audits', 'Impact assessments', '$20,000-per-violation penalty'], headlineSize: 88 },
      { tag: 'What\'s Actually Live', headline: 'Meanwhile, these are <em>already in effect:</em>', bullets: ['Texas TRAIGA: $10K–$200K per violation', 'California AB 2905: $500 per undisclosed AI call'], headlineSize: 72 },
      { tag: 'The Reality', headline: 'The federal panic died. The <em>state patchwork</em> won.', body: 'Your AI consultant is reading a 2024 playbook.', headlineSize: 76 },
    ],
  },

  // #6 - $5K Chatbot Made You the Defendant
  {
    id: '06-5k-chatbot-liability',
    name: '$5K Chatbot Made You the Defendant',
    theme: THEME,
    slides: [
      { tag: 'Legal Risk', headline: 'You paid an agency <em>$5,000</em> for a voice agent.', body: 'They handed you the liability.', headlineSize: 76 },
      { tag: 'The Case', headline: 'Taylor v. ConverseNow Technologies', body: 'N.D. Cal., Aug 11, 2025. Motion to dismiss DENIED.', headlineSize: 72 },
      { tag: 'What Happened', headline: 'Plaintiff called Domino\'s. AI answered.', body: 'She thought she was talking to a person. She gave name, address, credit card.', headlineSize: 72 },
      { tag: 'The Ruling', headline: 'The court adopted the <em>"capability test."</em>', body: 'If the AI uses caller data to improve its own product, it\'s a third party. Not an extension of the business.', headlineSize: 68 },
      { tag: 'The Penalty', headline: 'CIPA §§ 631/632: <em>$5,000 per violation.</em>', body: 'Statutory.', headlineSize: 76 },
      { tag: 'Two-Party Consent States', headline: '10 states require both parties to consent:', bullets: ['CA, CT, FL, IL, MD', 'MA, MT, NH, PA, WA'], headlineSize: 72 },
      { tag: 'The Reality', headline: 'The agency isn\'t holding the bag.', body: 'You are.', headlineSize: 88 },
      { tag: 'The Question', headline: 'Ask before signing:', body: '"Who\'s named on the lawsuit when this gets sued?"', headlineSize: 76 },
    ],
  },

  // #7 - HIPAA-Compliant Agency Probably Isn't (LAWYER REVIEW RECOMMENDED)
  {
    id: '07-hipaa-compliance',
    name: 'HIPAA-Compliant Agency Probably Isn\'t',
    theme: THEME,
    lawyerReview: true,
    slides: [
      { tag: 'Healthcare AI', headline: 'If you run a dental practice or med spa:', body: 'The AI agency you hired is probably not HIPAA-compliant.', headlineSize: 76 },
      { tag: 'What They\'re Missing', headline: 'Three things they likely don\'t have:', bullets: ['Signed BAA between them and you', 'Signed BAA between them and OpenAI/Anthropic', 'Access controls on conversation logs'], headlineSize: 72 },
      { tag: 'The OpenAI Problem', headline: 'OpenAI does not sign BAAs on consumer ChatGPT.', body: 'Period.', headlineSize: 76 },
      { tag: 'GoHighLevel', headline: 'GHL HIPAA add-on: <em>$297/mo</em>', body: 'Non-cancelable, account-wide. The agency reselling it still needs ITS OWN BAA with you.', headlineSize: 72 },
      { tag: 'The Penalties', headline: '2025 HIPAA penalty range:', body: '$13,785 to $63,973 per violation. $2M annual cap.', headlineSize: 72 },
      { tag: 'Shadow AI Cost', headline: 'Shadow AI in a breach adds <em>$670,000</em> to your average cost.', body: 'IBM Cost of a Data Breach 2025.', headlineSize: 72 },
      { tag: 'The Test', headline: 'Don\'t ask if your AI tool is HIPAA-compliant.', body: 'Ask the agency for the BAAs in writing. If they hesitate, you have the answer.', headlineSize: 72 },
    ],
  },

  // #8 - The Skool Funnel Agency
  {
    id: '08-skool-funnel-agency',
    name: 'The Skool Funnel Agency',
    theme: THEME,
    slides: [
      { tag: 'Agency Reality', headline: 'The AI agency selling you "transformation"', body: 'learned n8n three weeks ago from a $5,000 Skool course.', headlineSize: 76 },
      { tag: 'The Economics', headline: 'The pitch: <em>$5,000 setup + $2,000/mo</em>', body: 'The actual stack cost: about $200/mo.', headlineSize: 76 },
      { tag: 'The Stack', headline: 'The whole thing:', bullets: ['GHL ($297)', 'Vapi (per-minute)', 'ElevenLabs ($22)', 'OpenAI API (usage)'], headlineSize: 88 },
      { tag: 'The Pattern', headline: 'They\'re not building. They\'re <em>reselling.</em>', body: 'Same template for the dentist, the HVAC guy, and the med spa.', headlineSize: 76 },
      { tag: 'The Test', headline: 'Ask what they\'d change if you switched verticals tomorrow.', body: 'If the answer is "nothing," you\'re buying their homework.', headlineSize: 72 },
      { tag: 'Real Implementation', headline: 'Real implementation is <em>custom:</em>', bullets: ['Lead channels', 'Tone', 'Escalation', 'Compliance', 'Edge cases'], headlineSize: 80 },
      { tag: 'The COGS Tell', headline: 'Real implementation costs more than $200/mo in COGS', body: 'because somebody actually built it for YOU.', headlineSize: 72 },
      { tag: 'The Bottom Line', headline: 'Resold templates are a scam.', body: 'Custom builds are a craft. Know which one you\'re buying.', headlineSize: 80 },
    ],
  },

  // #9 - 95% of AI Pilots Fail
  {
    id: '09-95-percent-ai-pilots-fail',
    name: '95% of AI Pilots Fail',
    theme: THEME,
    slides: [
      { tag: 'MIT Research', headline: 'MIT studied <em>$30–40 billion</em> in enterprise AI spending.', body: '95% of pilots produced zero measurable P&L impact.', headlineSize: 72 },
      { tag: 'The Pattern', headline: 'The 5% that worked had one thing in common:', body: 'They bought. They didn\'t build.', headlineSize: 76 },
      { tag: 'The Numbers', headline: 'Vendor-purchased AI: <em>~67%</em> succeed.', body: 'Built in-house: ~33% succeed. Exactly half the success rate.', headlineSize: 72 },
      { tag: 'The Variable', headline: 'The companies that won didn\'t have better engineers.', body: 'They had better partnerships.', headlineSize: 76 },
      { tag: 'The Divide', headline: 'MIT calls it <em>"the GenAI Divide"</em>', body: 'High adoption, almost no transformation.', headlineSize: 80 },
      { tag: 'The Playbook', headline: 'Stop building. <em>Start buying.</em>', body: 'Then customize what you bought.', headlineSize: 88 },
    ],
  },

  // #10 - The 14% Champion Problem
  {
    id: '10-14-percent-champion',
    name: 'The 14% Champion Problem',
    theme: THEME,
    slides: [
      { tag: 'The Gap', headline: '<em>76%</em> of small businesses use AI.', body: 'Only 14% have it embedded in operations.', headlineSize: 80 },
      { tag: 'The Variable', headline: 'The variable isn\'t software.', body: 'It\'s whether one person at your company owns making it work for 90 days.', headlineSize: 72 },
      { tag: 'The Barrier', headline: '<em>49%</em> of SMB owners say lack of technical expertise is the #1 barrier.', body: '73% want more training.', headlineSize: 68 },
      { tag: 'Why Projects Die', headline: 'AI projects don\'t die from bad tools.', body: 'They die because nobody is responsible for them on day 47.', headlineSize: 76 },
      { tag: 'The Formula', headline: 'Pick <em>one person.</em> Give them <em>one workflow.</em>', body: 'Measure it weekly for 90 days. Don\'t expand until it works.', headlineSize: 72 },
      { tag: 'The Unlock', headline: 'The champion is the unlock.', body: 'Not the model.', headlineSize: 88 },
    ],
  },

  // #11 - The 76% Lie
  {
    id: '11-76-percent-lie',
    name: 'The 76% Lie',
    theme: THEME,
    slides: [
      { tag: 'Survey Artifact', headline: 'You\'ve been told <em>76%</em> of small businesses use AI.', body: 'The number is a survey artifact.', headlineSize: 76 },
      { tag: 'Goldman Sachs', headline: 'Goldman Sachs says <em>76%.</em>', body: 'Their sample: 1,256 graduates of their own elite small-business program.', headlineSize: 76 },
      { tag: 'US Chamber', headline: 'The US Chamber says <em>58%.</em>', body: 'Their definition: any generative AI use, including one ChatGPT login.', headlineSize: 76 },
      { tag: 'NFIB', headline: 'NFIB says <em>24%.</em>', body: 'Their definition: actually using AI for business operations.', headlineSize: 80 },
      { tag: 'Census Bureau', headline: 'Census Bureau (BTOS): <em>8.8%</em>', body: 'The only nationally representative measurement. 200,000 businesses surveyed.', headlineSize: 76 },
      { tag: 'The Reality', headline: 'The average Main Street operator is <em>average.</em>', body: 'You\'re not behind. You\'ve been sold panic.', headlineSize: 80 },
      { tag: 'The Right Question', headline: 'The right question isn\'t "am I behind?"', body: 'It\'s "is one workflow at my business slow because I\'m not using AI for it?"', headlineSize: 68 },
    ],
  },

  // #12 - The Shadow AI Tax
  {
    id: '12-shadow-ai-tax',
    name: 'The Shadow AI Tax',
    theme: THEME,
    slides: [
      { tag: 'The Hidden Use', headline: 'Your front desk is already using ChatGPT.', body: 'They\'re just not telling you.', headlineSize: 80 },
      { tag: 'The Cost', headline: 'When shadow AI is involved in a breach:', body: 'IBM measured an extra $670,000 added to the total bill.', headlineSize: 72 },
      { tag: 'The Numbers', headline: '<em>20%</em> of breaches in 2025 involved shadow AI.', body: '97% of AI-related breaches happened with zero access controls.', headlineSize: 72 },
      { tag: 'The Gap', headline: '<em>63%</em> of breached organizations have no AI governance policy.', body: 'At all.', headlineSize: 76 },
      { tag: 'Why Bans Fail', headline: 'Banning ChatGPT doesn\'t prevent its use.', body: 'It guarantees you won\'t know when it goes wrong.', headlineSize: 76 },
      { tag: 'The Fix', headline: 'The fix isn\'t a ban.', body: 'It\'s a sanctioned alternative + a clear policy + a logging mechanism.', headlineSize: 76 },
    ],
  },

  // #13 - The 47-Hour Ghost
  {
    id: '13-47-hour-ghost',
    name: 'The 47-Hour Ghost',
    theme: THEME,
    slides: [
      { tag: 'Invisible Work', headline: 'Every owner has <em>47 hours a week</em> of work no customer ever sees.', headlineSize: 72 },
      { tag: 'Bookkeeping', headline: 'Bookkeeping + invoice chasing: <em>10 hrs/week</em>', body: 'The average SMB spends 10% of its workday on unpaid invoices alone.', headlineSize: 72 },
      { tag: 'Social Media', headline: 'Social posting: <em>6 hrs/week</em>', body: '43% of owners spend that much. Most of it is below the noise floor.', headlineSize: 72 },
      { tag: 'Lead Follow-up', headline: 'Quote rewriting + lead follow-up: <em>8 hrs/week</em>', body: 'Usually after dinner, on the couch.', headlineSize: 72 },
      { tag: 'Tax Admin', headline: '1 in 4 owners spends <em>120+ hours/year</em> on federal taxes.', body: 'Even when outsourced.', headlineSize: 72 },
      { tag: 'Work About Work', headline: 'Knowledge workers spend <em>60%</em> of time on "work about work."', body: 'Coordination, status updates, finding files.', headlineSize: 72 },
      { tag: 'The Opportunity', headline: 'You don\'t need to delegate everything.', body: 'Just the 4 hours you hate the most. AI is the first delegation target without HR overhead.', headlineSize: 68 },
    ],
  },

  // #14 - Calls That Just Ring
  {
    id: '14-calls-that-ring',
    name: 'Calls That Just Ring',
    theme: THEME,
    slides: [
      { tag: 'The Gap', headline: '<em>24.3%</em> of calls to small businesses don\'t get answered.', body: 'They don\'t even hit voicemail. They just ring.', headlineSize: 72 },
      { tag: 'The Breakdown', headline: 'Of inbound business calls:', bullets: ['37.8% answered live', '37.8% to voicemail', '24.3% no response at all'], headlineSize: 80 },
      { tag: 'Caller ID Problem', headline: '<em>46%</em> of unidentified calls now go unanswered.', body: 'Consumers assume fraud.', headlineSize: 76 },
      { tag: 'Voicemail Reality', headline: '<em>85%</em> of people who get voicemail don\'t call back.', headlineSize: 80 },
      { tag: 'The Conversion Gap', headline: 'Phone leads convert <em>~10×</em> web forms.', body: 'Industry pattern across services businesses.', headlineSize: 76 },
      { tag: 'The Cost', headline: 'A phone that rings without answering', body: 'is the most expensive missed revenue you\'ll ever measure.', headlineSize: 76 },
    ],
  },

  // #15 - AI Beat Humans Twice
  {
    id: '15-ai-beat-humans-twice',
    name: 'AI Beat Humans Twice',
    theme: THEME,
    slides: [
      { tag: 'Research', headline: 'Consumers prefer <em>AI-written</em> review responses over human-written ones.', body: 'In blind tests. Two years in a row.', headlineSize: 68 },
      { tag: '2024 Test', headline: 'BrightLocal 2024: restaurant review, two responses.', body: 'One by the real owner, one by ChatGPT. 58% preferred the AI.', headlineSize: 68 },
      { tag: '2025 Test', headline: 'BrightLocal 2025: vet clinic review.', body: 'Same test. Majority again preferred the AI version.', headlineSize: 72 },
      { tag: 'Why', headline: 'It\'s not that AI sounds more human.', body: 'It\'s that your response at 11pm after service sounds tired.', headlineSize: 72 },
      { tag: 'The Expectations', headline: '<em>89%</em> of consumers expect a reply.', body: '50% are put off by generic, templated responses.', headlineSize: 76 },
      { tag: 'The Real Risk', headline: 'The risk isn\'t that AI sounds robotic.', body: 'The risk is that you sound rushed.', headlineSize: 80 },
    ],
  },

  // #16 - The Mindbody Decade
  {
    id: '16-mindbody-decade',
    name: 'The Mindbody Decade',
    theme: THEME,
    slides: [
      { tag: 'Lock-In', headline: 'In 10 years, one yoga studio\'s Mindbody bill went from <em>$80/mo to $469/mo.</em>', body: 'You\'re not paying for software. You\'re paying because you can\'t leave.', headlineSize: 64 },
      { tag: 'The Pattern', headline: 'Lock-in is the silent operating cost of every SMB stack.', headlineSize: 76 },
      { tag: 'Mindbody', headline: 'Mindbody\'s marketplace takes <em>23.5%</em> all-in on referred customers.', body: 'You pay them to send you your own clients.', headlineSize: 68 },
      { tag: 'ServiceTitan', headline: 'ServiceTitan early-termination fees in BBB complaints:', body: '$24K, $39K, $46K, $50K+', headlineSize: 72 },
      { tag: 'Square', headline: 'Square account-deactivation freezes routinely hold <em>$40K+</em> for 90+ days.', headlineSize: 72 },
      { tag: 'Toast', headline: 'Toast hardware: <em>$494–$1,300</em> per device.', body: 'Locked to platform. Can\'t take them to a competitor.', headlineSize: 72 },
      { tag: 'Before You Sign', headline: 'Read three things:', bullets: ['Exit terms', 'Data portability terms', 'Rate-increase clause'], headlineSize: 88 },
      { tag: 'The Rule', headline: 'The cheapest tool is the one you can <em>actually leave.</em>', headlineSize: 80 },
    ],
  },

  // #17 - Outbound Is the Unwon Channel
  {
    id: '17-outbound-unwon-channel',
    name: 'Outbound Is the Unwon Channel',
    theme: THEME,
    slides: [
      { tag: 'Market Gap', headline: 'Every AI agency is selling "AI Receptionist."', body: 'Almost nobody is selling outbound.', headlineSize: 76 },
      { tag: 'The Difference', headline: '<em>Inbound:</em> someone calls, AI answers. Saturated.', body: 'Outbound: your AI calls THEM. Almost no agencies offer it.', headlineSize: 68 },
      { tag: 'Outbound Use Cases', headline: 'What outbound AI does:', bullets: ['Win-back campaigns', 'Reactivation', 'Booking confirmations', 'Estimate revival'], headlineSize: 80 },
      { tag: 'Win-Back Math', headline: 'Structured reactivation campaigns recover <em>15–25%</em> of cancelled members in 60 days.', headlineSize: 68 },
      { tag: 'Salon Math', headline: '10% no-show on $85 avg ticket = <em>$30–$60K/year</em> per chair.', body: 'Outbound rebooking captures most of it.', headlineSize: 68 },
      { tag: 'The Timing', headline: '<em>46–50%</em> of salon bookings happen when the salon is closed.', body: 'Outbound AI works that window.', headlineSize: 72 },
      { tag: 'The Difference', headline: 'Inbound <em>saves</em> missed revenue.', body: 'Outbound creates revenue. They\'re not the same product.', headlineSize: 76 },
    ],
  },

  // #18 - Every Vertical's Unnamed Problem
  {
    id: '18-vertical-unnamed-problems',
    name: 'Every Vertical\'s Unnamed Problem',
    theme: THEME,
    slides: [
      { tag: 'The Pattern', headline: 'Every vertical has a problem its operators feel daily but <em>can\'t name.</em>', body: 'Once you name it, you can fix it.', headlineSize: 68 },
      { tag: 'Restaurants', headline: '<em>MENU DRIFT</em>', body: 'Your prices on the printed menu, the POS, DoorDash, and Google don\'t match. You don\'t know which is wrong.', headlineSize: 88 },
      { tag: 'Dental', headline: '<em>BENEFIT BLINDNESS</em>', body: 'Patient calls for a cleaning. Front desk has no idea what insurance covers. Patient says "I\'ll call back" and doesn\'t.', headlineSize: 80 },
      { tag: 'Med Spa', headline: '<em>CONSULT CANNIBALISM</em>', body: 'Free 30-min "meet and greets" eating your injector\'s chair time. They convert 11%.', headlineSize: 76 },
      { tag: 'HVAC/Plumbing', headline: '<em>THE QUOTE STACK</em>', body: 'Estimates promised tonight, sent tomorrow at 11pm. Customer signed with someone faster.', headlineSize: 76 },
      { tag: 'Auto Repair', headline: '<em>THE APPROVAL GAP</em>', body: 'Recommended-but-declined work is 30–50% of your shop\'s potential revenue. You never follow up.', headlineSize: 72 },
      { tag: 'Gyms', headline: '<em>HABIT DRIFT</em>', body: 'The 3×/week member now at 1× is your next cancellation. Nobody notices until they\'re gone.', headlineSize: 76 },
      { tag: 'Salons', headline: '<em>THE COLOR HOLE</em>', body: 'Mid-day balayage cancels. The chair sits empty for 4 hours. Outbound rebooking doesn\'t exist.', headlineSize: 76 },
      { tag: 'The Work', headline: 'Pick your vertical. <em>Name the unnamed problem.</em>', body: 'That\'s where the work is.', headlineSize: 76 },
    ],
  },

  // #19 - The TCPA Cliff (LAWYER REVIEW RECOMMENDED)
  {
    id: '19-tcpa-cliff',
    name: 'The TCPA Cliff Under Your AI SMS',
    theme: THEME,
    lawyerReview: true,
    slides: [
      { tag: 'Compliance Risk', headline: 'Your AI sends 200 confirmation texts a week.', body: 'If your brand isn\'t on 10DLC and your campaign isn\'t approved, every text is a TCPA exposure.', headlineSize: 68 },
      { tag: 'The Penalty', headline: 'TCPA damages: <em>$500 per text</em>', body: 'Up to $1,500 for willful. Uncapped. No class-action ceiling.', headlineSize: 76 },
      { tag: 'FCC Ruling', headline: 'FCC Feb 8, 2024 Declaratory Ruling:', body: 'AI-generated voice on a call = "artificial voice" under TCPA. Same consent rules. Same penalties.', headlineSize: 68 },
      { tag: '10DLC', headline: '10DLC brand + campaign registration has been <em>mandatory</em> at every major carrier since 2023.', headlineSize: 68 },
      { tag: 'Why It Matters', headline: 'SMS opens at <em>98%.</em>', body: 'It\'s the channel you lean on hardest — and the one most exposed.', headlineSize: 76 },
      { tag: 'Before You Scale', headline: 'Before you scale outbound SMS or voice:', bullets: ['Get 10DLC done', 'Get express written consent in writing', 'Document opt-outs'], headlineSize: 72 },
    ],
  },

  // #20 - The Real Fear Isn't Job Loss
  {
    id: '20-real-fear',
    name: 'The Real Fear Isn\'t Job Loss',
    theme: THEME,
    slides: [
      { tag: 'The Headline', headline: '<em>52%</em> of workers fear AI will displace their job.', body: 'Double a year ago.', headlineSize: 80 },
      { tag: 'But Ask Owners', headline: 'Ask owners what they actually fear?', body: 'Job loss isn\'t in the top three.', headlineSize: 80 },
      { tag: 'Employee Concerns', headline: 'Top employee concerns:', bullets: ['Security (29%)', 'Incorrect decisions (24%)', 'Cost (24%)', 'Job loss: 7%'], headlineSize: 80 },
      { tag: 'Owner Concerns', headline: 'Top owner concerns:', bullets: ['Looking dumb in front of staff', 'Being publicly embarrassed by an AI mistake', 'Spending $5,000 with an agency that can\'t deliver'], headlineSize: 72 },
      { tag: 'The Barrier', headline: '<em>49%</em> of SMB owners say "I don\'t know what I don\'t know"', body: 'is their #1 barrier.', headlineSize: 72 },
      { tag: 'The Real Objection', headline: 'The objection you hear is almost never the objection underneath it.', body: '"Too expensive" usually means "I don\'t want to look stupid."', headlineSize: 68 },
      { tag: 'The Approach', headline: 'Respect the fear.', body: 'Don\'t punch down on the owner who got burned by ChatGPT once. Start with one workflow they trust.', headlineSize: 72 },
    ],
  },
];

// ─────────────────────────────────────────────
// ENGINE (copied from generate.js)
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

async function generateCarousel(carousel, outputDir) {
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
  }

  await browser.close();
  return paths;
}

// ─────────────────────────────────────────────
// MAIN - Generate all carousels
// ─────────────────────────────────────────────

const CAROUSELS_DIR = path.join(__dirname, 'carousels');

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  SMB AI SERIES - 20 CAROUSELS                                  ║
║                                                                ║
║  IMPORTANT: Output saved to ./carousels/{id}/                  ║
║  DO NOT DELETE these folders - needed for scheduling!          ║
╚════════════════════════════════════════════════════════════════╝
`);

const start = Date.now();

for (let i = 0; i < CAROUSELS.length; i++) {
  const carousel = CAROUSELS[i];
  const outputDir = path.join(CAROUSELS_DIR, carousel.id);

  const lawyerNote = carousel.lawyerReview ? ' ⚠️ LAWYER REVIEW' : '';
  console.log(`\n[${i + 1}/20] ${carousel.name}${lawyerNote}`);
  console.log(`       → ${outputDir}`);

  try {
    const paths = await generateCarousel(carousel, outputDir);
    console.log(`       ✓ ${paths.length} slides`);

    // Save metadata
    await fs.writeFile(
      path.join(outputDir, 'metadata.json'),
      JSON.stringify({
        id: carousel.id,
        name: carousel.name,
        slideCount: carousel.slides.length,
        lawyerReview: carousel.lawyerReview || false,
        generatedAt: new Date().toISOString(),
        slides: carousel.slides.map((s, idx) => ({
          number: idx + 1,
          tag: s.tag,
          headline: s.headline?.replace(/<[^>]*>/g, '') || s.stat || '',
        })),
      }, null, 2)
    );
  } catch (err) {
    console.error(`       ✗ Error: ${err.message}`);
  }
}

console.log(`
╔════════════════════════════════════════════════════════════════╗
║  DONE - ${CAROUSELS.length} carousels generated in ${Math.round((Date.now() - start) / 1000)}s
║                                                                ║
║  Output: ${CAROUSELS_DIR}
║                                                                ║
║  ⚠️  LAWYER REVIEW NEEDED:                                     ║
║      - #7 HIPAA-Compliant Agency                               ║
║      - #19 TCPA Cliff                                          ║
╚════════════════════════════════════════════════════════════════╝
`);
