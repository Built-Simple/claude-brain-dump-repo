import puppeteer from 'puppeteer';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { exec } from 'child_process';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ─────────────────────────────────────────────
// THEME PRESETS
// ─────────────────────────────────────────────
const THEMES = {
  purple: {
    background: '#0A0A0F',
    accent: '#7C5CFC',
    textColor: '#F0EFFF',
    brand: 'Built Simple AI',
    cta: 'built-simple.ai',
  },
  gold: {
    background: '#0a0f14',
    accent: '#ffc800',
    textColor: '#ffffff',
    brand: 'Built Simple AI',
    cta: 'built-simple.ai',
  },
  cyan: {
    background: '#0a0f1a',
    accent: '#00d4ff',
    textColor: '#ffffff',
    brand: 'Built Simple AI',
    cta: 'built-simple.ai',
  },
  green: {
    background: '#0a0f1a',
    accent: '#00ff88',
    textColor: '#ffffff',
    brand: 'Built Simple AI',
    cta: 'built-simple.ai',
  },
  coral: {
    background: '#0f0a0a',
    accent: '#ff6b4a',
    textColor: '#ffffff',
    brand: 'Built Simple AI',
    cta: 'built-simple.ai',
  },
};

// ─────────────────────────────────────────────
// ALL 21 CAROUSELS FROM PLAYBOOK V4
// ─────────────────────────────────────────────
const ALL_CAROUSELS = [
  // ═══════════════════════════════════════════
  // REVIEWMASTER CAROUSELS (8)
  // ═══════════════════════════════════════════
  {
    name: 'RM-1: Generic Review Responses Are Killing Your Reputation',
    theme: THEMES.coral,
    slides: [
      {
        tag: 'Mistake',
        headline: 'Your review responses are making customers <em>cringe.</em>',
        body: 'Swipe →',
        headlineSize: 80,
      },
      {
        tag: 'The Problem',
        headline: '"Thank you for your <em>wonderful</em> review!"',
        body: 'This is what almost every business posts. Customers see right through it.',
        headlineSize: 72,
      },
      {
        tag: 'Reality',
        headline: 'People read your responses <em>before</em> deciding to visit.',
        body: "When every reply is the same copy-paste, it tells them you don't actually care.",
        headlineSize: 72,
      },
      {
        tag: 'Comparison',
        headline: '<em>Generic</em> vs <em>ReviewMaster</em>',
        bullets: [
          'GENERIC: "Thanks for the great review!"',
          'REVIEWMASTER: "Sarah, we\'re thrilled you loved the pasta! Maria will be delighted. Can\'t wait to welcome you back."',
        ],
        headlineSize: 64,
      },
      {
        tag: 'How It Works',
        headline: 'ReviewMaster reads <em>every detail</em> of the review.',
        body: 'Names, specific compliments, staff mentions. Crafts a personal response automatically.',
        headlineSize: 72,
      },
      {
        tag: 'Results',
        headline: 'Customers feel <em>seen.</em> Reputation grows.',
        body: "You didn't write a single word. We've generated over 2,000 responses for businesses like yours.",
        headlineSize: 72,
      },
      {
        tag: 'Get Started',
        headline: 'Try free <em>14 days.</em> $29/month.',
        body: 'built-simple.ai',
        headlineSize: 88,
      },
    ],
  },
  {
    name: 'RM-2: The Cost of Ignoring Your Reviews',
    theme: THEMES.gold,
    slides: [
      {
        tag: 'Research',
        stat: '5-9%',
        statLabel: 'revenue growth from a 1-star Yelp increase (Harvard study)',
      },
      {
        tag: 'Think About It',
        headline: 'How do <em>you</em> choose a restaurant, dentist, or contractor?',
        body: 'You check reviews. Everyone does. And you skip anything under 4 stars without thinking twice.',
        headlineSize: 72,
      },
      {
        tag: 'Your Profile',
        headline: 'How many of your reviews have a <em>response?</em>',
        body: "If the answer is 'barely any' — that's what every potential customer sees too.",
        headlineSize: 72,
      },
      {
        tag: 'The Truth',
        headline: 'Your replies are for everyone reading <em>after</em> them.',
        body: "Businesses that engage with reviews build trust with people who haven't visited yet.",
        headlineSize: 72,
      },
      {
        tag: 'The Problem',
        headline: 'Who has <em>time</em> to write personalized responses?',
        body: "You're running a business.",
        headlineSize: 80,
      },
      {
        tag: 'The Solution',
        headline: 'ReviewMaster does it. AI responses that <em>sound like you.</em>',
        body: 'Autopilot mode. Never miss a review again.',
        headlineSize: 72,
      },
      {
        tag: 'Get Started',
        headline: '14-day free trial. <em>$29/month</em> unlimited.',
        body: 'built-simple.ai',
        headlineSize: 80,
      },
    ],
  },
  {
    name: 'RM-3: I Set My Reviews on Autopilot',
    theme: THEMES.purple,
    slides: [
      {
        tag: 'Curiosity',
        headline: 'I stopped responding to reviews manually. My rating went <em>UP.</em>',
        body: "Here's how.",
        headlineSize: 72,
      },
      {
        tag: 'The Old Way',
        headline: 'Every morning: open Google, copy review, think, paste, <em>repeat.</em>',
        body: "That's time you're not spending on your actual business.",
        headlineSize: 68,
      },
      {
        tag: 'Autopilot',
        headline: 'ReviewMaster Autopilot. Set it once. Responds <em>24/7.</em>',
        body: 'Every new Google review. Automatically.',
        headlineSize: 72,
      },
      {
        tag: 'Smart Controls',
        headline: 'Auto-respond to <em>3+ stars.</em>',
        body: 'Handle 1-2 stars yourself with pre-built templates.',
        headlineSize: 80,
      },
      {
        tag: 'Your Voice',
        headline: 'Sounds like you because <em>you train it.</em>',
        body: 'Tone, phrases, signature. Not robot speak.',
        headlineSize: 80,
      },
      {
        tag: 'Natural Timing',
        headline: 'Waits <em>30 minutes</em> before posting.',
        body: 'So it looks natural.',
        headlineSize: 88,
      },
      {
        tag: 'Get Started',
        headline: 'Connect Google → Enable Autopilot → <em>Done.</em>',
        body: 'Free 14 days. built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'RM-4: 5 Review Mistakes Costing You Customers',
    theme: THEMES.coral,
    slides: [
      {
        tag: 'Listicle',
        headline: '5 review mistakes costing you customers',
        body: '(most businesses make #3)',
        headlineSize: 80,
      },
      {
        tag: 'Mistake 1',
        headline: '<em>Never</em> responding.',
        body: 'Most customers never hear back. They notice. So does everyone reading your profile.',
        headlineSize: 88,
      },
      {
        tag: 'Mistake 2',
        headline: '<em>Copy-pasting</em> the same response.',
        body: 'Customers can tell. Google can tell. It hurts credibility and search ranking.',
        headlineSize: 80,
      },
      {
        tag: 'Mistake 3',
        headline: '<em>Arguing</em> with negative reviewers.',
        body: "Acknowledge, empathize, move offline. The moment you get defensive, you've already lost.",
        headlineSize: 80,
      },
      {
        tag: 'Mistake 4',
        headline: 'Making it <em>complicated</em> to leave a review.',
        body: "QR code on your counter. Direct link to Google reviews. That's it.",
        headlineSize: 72,
      },
      {
        tag: 'Mistake 5',
        headline: '<em>Waiting days</em> to respond.',
        body: "People expect timely replies. The longer you wait, the more it looks like you don't care.",
        headlineSize: 80,
      },
      {
        tag: 'The Fix',
        headline: 'ReviewMaster handles mistakes <em>1, 2, 3, and 5</em> automatically.',
        body: 'Mistake 4 is a $3 printed sign.',
        headlineSize: 72,
      },
      {
        tag: 'Question',
        headline: 'Which mistake are <em>you</em> making?',
        body: 'Comment below. built-simple.ai',
        headlineSize: 88,
      },
    ],
  },
  {
    name: 'RM-5: What to Do When You Get a Fake 1-Star Review',
    theme: THEMES.coral,
    slides: [
      {
        tag: 'Crisis',
        headline: "You just got a fake 1-star review. <em>Don't panic.</em>",
        body: "Here's what to do.",
        headlineSize: 72,
      },
      {
        tag: 'Reality',
        headline: '<em>Fake reviews</em> are everywhere.',
        body: "Scammers, competitors, people who were never even customers. Run a business long enough and it'll happen.",
        headlineSize: 80,
      },
      {
        tag: "Don't",
        headline: "<em>DON'T</em> let AI auto-respond to suspicious reviews.",
        body: 'It might accidentally validate false claims. Use a safe template instead.',
        headlineSize: 68,
      },
      {
        tag: 'Do',
        headline: '<em>DO</em> respond professionally:',
        body: '"We don\'t have a record of your visit. Please contact us at [email] so we can look into this."',
        headlineSize: 72,
      },
      {
        tag: 'Document',
        headline: '<em>Flag</em> the review to Google.',
        body: 'Screenshot everything. Document the pattern if it continues.',
        headlineSize: 80,
      },
      {
        tag: 'Long-term',
        headline: 'Best defense: <em>volume.</em>',
        body: 'The more real reviews you have, the less one fake one matters. QR code on the counter. Ask happy customers.',
        headlineSize: 80,
      },
      {
        tag: 'Solution',
        headline: 'ReviewMaster: <em>Autopilot</em> for positives + safe templates for negatives.',
        body: 'Best of both worlds.',
        headlineSize: 68,
      },
      {
        tag: 'Save This',
        headline: 'Save this for when you <em>need it.</em>',
        body: 'built-simple.ai',
        headlineSize: 88,
      },
    ],
  },
  {
    name: 'RM-6: ReviewMaster vs. Doing It Yourself',
    theme: THEMES.gold,
    slides: [
      {
        tag: 'ROI',
        headline: 'Is <em>$29/month</em> worth it?',
        body: "Let's do the math.",
        headlineSize: 88,
      },
      {
        tag: 'Your Time',
        headline: 'Time to write a thoughtful response: <em>3-5 minutes.</em>',
        body: '10 reviews a week = 3+ hours/month. What\'s your hourly rate?',
        headlineSize: 72,
      },
      {
        tag: 'Cost of Silence',
        headline: "Not responding <em>isn't free.</em>",
        body: 'Every unanswered review is a potential customer choosing someone else. Harvard: 1-star improvement = 5-9% more revenue.',
        headlineSize: 68,
      },
      {
        tag: 'What You Get',
        headline: 'What <em>$29</em> gets you:',
        bullets: [
          'Unlimited AI responses',
          'Google integration',
          'Autopilot mode',
          'Brand voice matching',
          'Per-rating rules',
        ],
        headlineSize: 80,
      },
      {
        tag: 'What You Skip',
        headline: "What you <em>DON'T</em> need:",
        body: 'A $249/month "reputation management platform" that does what a QR code and ReviewMaster handle for $29 combined.',
        headlineSize: 68,
      },
      {
        tag: 'Proof',
        headline: "<em>2,000+</em> responses generated for real businesses.",
        body: '14-day free trial. No credit card. built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'RM-7: Stop Overcomplicating Your Review Strategy',
    theme: THEMES.green,
    slides: [
      {
        tag: 'Contrarian',
        headline: "Your review strategy doesn't need to be <em>complicated.</em>",
        body: 'It needs to exist.',
        headlineSize: 72,
      },
      {
        tag: 'Step 1',
        headline: 'Print a <em>QR code</em> that links to your Google review page.',
        body: 'Counter, receipt, table tent. Cost: $3.',
        headlineSize: 72,
      },
      {
        tag: 'Step 2',
        headline: 'Actually <em>ask.</em>',
        body: '"If you had a good experience, we\'d really appreciate a Google review." No scripts. No automation. Just ask.',
        headlineSize: 80,
      },
      {
        tag: 'Step 3',
        headline: 'Respond to <em>every</em> review.',
        body: "This is the only part that should be automated because it takes forever and you'll never keep up manually.",
        headlineSize: 72,
      },
      {
        tag: "Don't Need",
        headline: "What you <em>DON'T</em> need:",
        bullets: [
          'A $300/month review solicitation platform',
          'An SMS drip campaign',
          'A 47-step funnel',
          'A "reputation management agency"',
        ],
        headlineSize: 72,
      },
      {
        tag: 'Total Cost',
        headline: 'Getting reviews = <em>QR code + asking.</em>',
        body: 'Responding to reviews = ReviewMaster at $29/month. Total: $32.',
        headlineSize: 72,
      },
      {
        tag: 'Truth',
        headline: "The businesses with the most reviews <em>aren't using fancy software.</em>",
        body: "They're just asking.",
        headlineSize: 68,
      },
      {
        tag: 'CTA',
        headline: 'ReviewMaster handles the <em>response side.</em>',
        body: 'You focus on the asking side. built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'RM-8: What a $300/Month Reputation Platform Actually Does',
    theme: THEMES.gold,
    slides: [
      {
        tag: 'Myth-Busting',
        headline: 'Reputation platforms charge <em>$300/month.</em>',
        body: "Here's what you're actually paying for.",
        headlineSize: 72,
      },
      {
        tag: 'What They Sell',
        headline: 'What they <em>sell</em> you:',
        bullets: [
          'Dashboard with 14 tabs',
          'Multi-platform monitoring',
          'Review solicitation automation',
          'Sentiment analysis',
          'Competitor benchmarking',
          'Monthly reports',
        ],
        headlineSize: 72,
      },
      {
        tag: 'What You Use',
        headline: 'What you actually <em>use:</em>',
        body: 'The part that responds to reviews. Maybe the dashboard once a month.',
        headlineSize: 80,
      },
      {
        tag: 'What You Need',
        headline: 'What you actually <em>NEED:</em>',
        bullets: [
          'A way to get reviews (QR code, free)',
          'A way to respond to reviews (AI, $29/mo)',
          'Occasionally check Google Business Profile (free)',
        ],
        headlineSize: 72,
      },
      {
        tag: 'Reality',
        headline: "The dashboard, the sentiment analysis, the competitor benchmarking — <em>none of that</em> is getting you more customers.",
        body: 'Responding to reviews is.',
        headlineSize: 56,
      },
      {
        tag: 'Our Approach',
        headline: 'ReviewMaster does <em>one thing</em> and does it well.',
        body: 'Personalized, human-sounding responses on autopilot. $29/month unlimited. 2,000+ generated.',
        headlineSize: 68,
      },
      {
        tag: 'CTA',
        headline: "Stop paying for features you <em>don't use.</em>",
        body: 'built-simple.ai',
        headlineSize: 80,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // AI RECEPTIONIST CAROUSELS (9)
  // ═══════════════════════════════════════════
  {
    name: 'AR-1: Most of Your Phone Calls Go Unanswered',
    theme: THEMES.coral,
    slides: [
      {
        tag: 'Pain Point',
        headline: 'How many calls did you <em>miss</em> this week?',
        body: 'Check your phone. The real number is worse than you think.',
        headlineSize: 72,
      },
      {
        tag: 'You Know This',
        headline: 'When <em>you</em> call a business and nobody picks up...',
        body: "You don't leave a voicemail. You Google the next one. Your customers do the same.",
        headlineSize: 68,
      },
      {
        tag: 'The Irony',
        headline: "You're missing calls <em>BECAUSE</em> you're busy doing the work.",
        body: 'The better you are at your job, the less available you are to get new work.',
        headlineSize: 68,
      },
      {
        tag: 'Reality',
        headline: 'Every missed call is someone <em>ready to spend money</em> with you.',
        body: "They'll spend it with someone else instead. Not because they're better. Because they answered.",
        headlineSize: 64,
      },
      {
        tag: 'Solution',
        headline: 'AI Receptionist answers every call in <em>seconds.</em>',
        body: '24/7. Handles it the way YOU would — built specifically for your business.',
        headlineSize: 72,
      },
      {
        tag: 'CTA',
        headline: 'Stop losing customers you <em>never even knew about.</em>',
        body: 'built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'AR-2: What Happens When Your Phone Rings at 9 PM',
    theme: THEMES.cyan,
    slides: [
      {
        tag: 'Scenario',
        headline: 'A customer calls your business at <em>9 PM.</em>',
        body: 'What happens next?',
        headlineSize: 80,
      },
      {
        tag: 'Without AI',
        headline: '<em>Without AI:</em>',
        bullets: [
          'Voicemail',
          'They hang up',
          'They Google your competitor',
          'Your competitor answers',
          'You lost the job and never knew it existed',
        ],
        headlineSize: 88,
      },
      {
        tag: 'Reality',
        headline: 'When do your customers actually <em>need</em> you?',
        body: 'Homeowners call after work. Toothaches happen on Saturday. Pipes burst at midnight. The phone rings hardest when nobody\'s there.',
        headlineSize: 64,
      },
      {
        tag: 'With AI',
        headline: '<em>With AI:</em>',
        bullets: [
          'Picks up in seconds',
          'Greets the caller',
          'Answers their questions',
          'Books the appointment',
          'Sends you a summary',
        ],
        headlineSize: 88,
      },
      {
        tag: 'Comparison',
        headline: 'Same customer. Same 9 PM call. <em>Different outcome.</em>',
        body: 'One = lost revenue. The other = booked appointment waiting in the morning.',
        headlineSize: 68,
      },
      {
        tag: 'CTA',
        headline: 'Your business deserves a front desk that <em>never sleeps.</em>',
        body: 'built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'AR-3: The Real Cost of a Receptionist',
    theme: THEMES.gold,
    slides: [
      {
        tag: 'Myth-Busting',
        headline: 'Think a receptionist costs <em>$37K/year?</em>',
        body: "That's just the salary. The real number is way higher.",
        headlineSize: 72,
      },
      {
        tag: 'Real Cost',
        headline: 'Add benefits, payroll taxes, desk space, equipment, training...',
        body: 'Easily $50-65K/year all-in.',
        headlineSize: 68,
      },
      {
        tag: 'Limited Hours',
        headline: 'And that only covers <em>40 hours a week.</em>',
        body: "When they're sick, on vacation, at lunch, or after 5pm — nobody's answering.",
        headlineSize: 72,
      },
      {
        tag: 'Turnover',
        headline: "Then there's <em>turnover.</em>",
        body: 'Every time you lose a receptionist = weeks hiring and training. Weeks of missed calls.',
        headlineSize: 80,
      },
      {
        tag: 'Our Pricing',
        headline: 'AI Receptionist:',
        bullets: [
          '$500 one-time setup',
          '$200/month + usage-based calls',
          'Answers 24/7/365',
          'No sick days. No turnover. No benefits.',
        ],
        headlineSize: 80,
      },
      {
        tag: 'Why Setup Fee',
        headline: 'The setup fee exists because <em>cookie-cutter doesn\'t work.</em>',
        body: 'A restaurant needs different handling than a plumber. We build it for YOUR business.',
        headlineSize: 64,
      },
      {
        tag: 'CTA',
        headline: 'Way less than a human. <em>Actually</em> works around the clock.',
        body: 'built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'AR-4: Stop Choosing Between Your Customers and Your Phone',
    theme: THEMES.purple,
    slides: [
      {
        tag: 'Empathy',
        headline: "You're with a client. Phone rings. <em>You can't answer.</em>",
        body: 'Sound familiar?',
        headlineSize: 72,
      },
      {
        tag: 'Scenarios',
        headline: 'The salon owner <em>mid-color,</em> hearing the phone ring.',
        body: 'The contractor under a house, phone buzzing in his truck. The dentist whose front desk is juggling three things.',
        headlineSize: 64,
      },
      {
        tag: 'The Guilt',
        headline: 'You <em>KNOW</em> every unanswered call could be money.',
        body: "But you can't stop what you're doing. So you tell yourself you'll call back later.",
        headlineSize: 68,
      },
      {
        tag: 'Reality',
        headline: "Later <em>doesn't work.</em>",
        body: "By the time you call back, they've booked with someone else. Or they don't pick up. Phone tag for a week.",
        headlineSize: 72,
      },
      {
        tag: 'Solution',
        headline: 'AI Receptionist answers <em>while you work.</em>',
        body: 'Books appointments. Answers questions. Sends you a summary when you\'re free. No interruption. No guilt.',
        headlineSize: 64,
      },
      {
        tag: 'CTA',
        headline: 'Focus on what you do best. Let AI <em>handle the phone.</em>',
        body: 'built-simple.ai',
        headlineSize: 72,
      },
    ],
  },
  {
    name: 'AR-5: The Missed Call You Never Knew About',
    theme: THEMES.coral,
    slides: [
      {
        tag: 'Story',
        headline: 'The most expensive thing in your business is the call you <em>never knew you missed.</em>',
        headlineSize: 64,
      },
      {
        tag: 'Real Story',
        headline: 'A contractor thought business was <em>slow.</em>',
        body: 'Then he checked his call logs. Dozens of missed calls. Almost no voicemails. Those weren\'t slow months — those were months full of customers who called someone else.',
        headlineSize: 64,
      },
      {
        tag: 'The Sting',
        headline: "You can't <em>feel</em> a missed call.",
        body: 'There\'s no notification saying "you just lost a job because you were working." It just quietly doesn\'t happen.',
        headlineSize: 72,
      },
      {
        tag: 'Voicemail Reality',
        headline: 'The people who DO leave voicemails? <em>Tiny fraction.</em>',
        body: "Most hang up and move on. You already know this — when's the last time YOU left a voicemail?",
        headlineSize: 68,
      },
      {
        tag: 'Solution',
        headline: 'AI Receptionist makes the invisible <em>visible.</em>',
        body: 'Every call answered. Every lead captured. Every conversation summarized and sent to you.',
        headlineSize: 68,
      },
      {
        tag: 'CTA',
        headline: 'Your calls are worth more than you realize. Stop sending them into the <em>void.</em>',
        body: 'built-simple.ai',
        headlineSize: 64,
      },
    ],
  },
  {
    name: 'AR-6: 5 Signs You Need an AI Receptionist',
    theme: THEMES.purple,
    slides: [
      {
        tag: 'Checklist',
        headline: 'If <em>3+</em> of these sound like you, you\'re losing money every week.',
        body: 'Check your score.',
        headlineSize: 68,
      },
      {
        tag: 'Sign 1',
        headline: 'You regularly see <em>missed calls</em> after finishing with a client.',
        headlineSize: 72,
      },
      {
        tag: 'Sign 2',
        headline: 'Customers have told you <em>"I tried calling but nobody picked up."</em>',
        body: 'And you felt that sinking feeling.',
        headlineSize: 64,
      },
      {
        tag: 'Sign 3',
        headline: "You can't afford a full-time receptionist but you <em>need someone</em> answering phones.",
        headlineSize: 64,
      },
      {
        tag: 'Sign 4',
        headline: 'You get calls after hours, on weekends, and on holidays — and they all go to <em>voicemail.</em>',
        headlineSize: 64,
      },
      {
        tag: 'Sign 5',
        headline: 'You spend your evenings <em>returning calls</em> instead of being present with your family.',
        headlineSize: 64,
      },
      {
        tag: 'Solution',
        headline: '<em>3+?</em> An AI Receptionist pays for itself fast.',
        body: '$500 setup, $200/month. Every answered call is a booking you would have lost.',
        headlineSize: 72,
      },
      {
        tag: 'CTA',
        headline: 'Comment your <em>score.</em>',
        body: 'built-simple.ai',
        headlineSize: 88,
      },
    ],
  },
  {
    name: 'AR-7: Why Every AI Receptionist Ad Sounds the Same',
    theme: THEMES.cyan,
    slides: [
      {
        tag: 'Contrarian',
        headline: 'Every AI receptionist company says <em>"Never miss a call!"</em>',
        body: "Here's what they don't tell you.",
        headlineSize: 68,
      },
      {
        tag: 'What They Sell',
        headline: 'What they sell: A <em>template.</em>',
        body: 'Same script for a restaurant, a law firm, a plumber, and a dog groomer. "Hi, thanks for calling! How can I help you today?"',
        headlineSize: 64,
      },
      {
        tag: 'The Problem',
        headline: "Why that's a <em>problem:</em>",
        body: 'A restaurant caller wants outdoor seating for 8. A plumbing caller has water flooding their basement RIGHT NOW. Same script doesn\'t work.',
        headlineSize: 64,
      },
      {
        tag: 'Dirty Secret',
        headline: 'The dirty secret: Most "AI receptionists" are <em>glorified voicemail.</em>',
        body: "They take a message. They don't actually DO anything.",
        headlineSize: 68,
      },
      {
        tag: 'What We Do',
        headline: 'What <em>ours</em> does:',
        body: 'We map out every type of call you get. Reservations get booked. Questions get answered. Event inquiries get routed. Each call type has its own outcome.',
        headlineSize: 64,
      },
      {
        tag: 'Outbound',
        headline: 'Want callbacks and outbound follow-ups? <em>We build that too.</em>',
        body: "It costs more because outbound calls cost more. But it's built for YOUR business.",
        headlineSize: 64,
      },
      {
        tag: 'CTA',
        headline: 'Cookie-cutter AI is cheap. <em>Custom AI</em> is $500 setup + $200/month.',
        body: "And it's worth every penny. built-simple.ai",
        headlineSize: 64,
      },
    ],
  },
  {
    name: 'AR-8: Your Phone System Doesn\'t Need to Be Complicated',
    theme: THEMES.green,
    slides: [
      {
        tag: 'KISS',
        headline: "You don't need a $500/month phone system.",
        body: 'You need someone to answer the damn phone.',
        headlineSize: 72,
      },
      {
        tag: 'What They Sell',
        headline: 'What the phone industry <em>sells</em> you:',
        bullets: [
          'IVR trees (Press 1 for this...)',
          'Call routing',
          'CRM integrations',
          'Analytics dashboards',
          '"Omnichannel communication platforms"',
        ],
        headlineSize: 68,
      },
      {
        tag: 'What Customer Wants',
        headline: 'What your customer <em>wants:</em>',
        body: "To talk to someone who can help them. Right now. That's it.",
        headlineSize: 72,
      },
      {
        tag: 'You Hate It Too',
        headline: 'How do you feel when YOU call and get <em>"press 1 for sales..."</em>',
        body: "You hate it. Everyone hates it. Don't do it to your customers.",
        headlineSize: 68,
      },
      {
        tag: 'Simple Version',
        headline: 'The <em>simplest</em> version that works:',
        body: 'An AI that picks up, sounds human, knows your business, and either handles the call or gets the right info to you immediately.',
        headlineSize: 64,
      },
      {
        tag: 'Flexibility',
        headline: 'Match the tool to the <em>actual problem.</em>',
        body: 'Need appointment booking? We build that. Just need intelligent call routing? That works too.',
        headlineSize: 68,
      },
      {
        tag: 'CTA',
        headline: 'Keep it simple. An answered call beats a sophisticated phone system <em>every time.</em>',
        body: 'built-simple.ai',
        headlineSize: 60,
      },
    ],
  },
  {
    name: 'AR-9: How We Set Up Your AI Receptionist',
    theme: THEMES.purple,
    slides: [
      {
        tag: 'Behind the Scenes',
        headline: "Here's exactly how we build your AI Receptionist.",
        body: 'No templates. No guessing.',
        headlineSize: 72,
      },
      {
        tag: 'Step 1',
        headline: 'Step 1: You tell us <em>every type of call</em> you get.',
        body: 'Reservations. General questions. Event inquiries. Emergency calls. Sales calls. Whatever your business deals with.',
        headlineSize: 64,
      },
      {
        tag: 'Step 2',
        headline: 'Step 2: For each call type, we define <em>what should happen.</em>',
        body: 'Reservation? Book it. Question? Answer it. Event inquiry? Route to events manager. Spam? Handle it so you never have to.',
        headlineSize: 60,
      },
      {
        tag: 'Step 3',
        headline: 'Step 3: We <em>wire it</em> into your systems.',
        body: 'Your calendar. Your CRM. Your email. Up to 5 integrations included. The AI doesn\'t just take messages — it actually DOES the thing.',
        headlineSize: 60,
      },
      {
        tag: 'Step 4',
        headline: 'Step 4: We optimize the <em>voice, script, and prompts.</em>',
        body: 'Until it sounds right for your brand. Not generic. Not robotic. YOUR front desk, running 24/7.',
        headlineSize: 64,
      },
      {
        tag: 'Step 5',
        headline: 'Step 5: You <em>go live.</em>',
        body: 'Every call answered. Every conversation summarized. We maintain and optimize ongoing.',
        headlineSize: 72,
      },
      {
        tag: 'Pricing',
        headline: '<em>$500</em> one-time setup. <em>$200/month</em> maintenance.',
        body: 'Usage-based call volume. No contracts. built-simple.ai',
        headlineSize: 72,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // CROSS-PRODUCT CAROUSELS (2)
  // ═══════════════════════════════════════════
  {
    name: 'BRAND-1: The Keep It Simple Framework',
    theme: THEMES.green,
    slides: [
      {
        tag: 'Framework',
        headline: "Most small business tech is <em>overbuilt garbage</em> they'll never fully use.",
        body: "Here's a better framework.",
        headlineSize: 64,
      },
      {
        tag: 'The Question',
        headline: 'Before you buy ANY software, ask:',
        body: '"What\'s the simplest version of this that actually solves my problem?" If the answer is a piece of paper, use the piece of paper.',
        headlineSize: 64,
      },
      {
        tag: 'Reviews',
        headline: 'Getting more reviews:',
        body: "Simplest version = QR code on the counter + asking customers directly. Cost: $3. Don't buy a $300/month platform.",
        headlineSize: 68,
      },
      {
        tag: 'Phone',
        headline: 'Not missing phone calls:',
        body: 'Simplest version = AI that answers and handles the call YOUR way. Don\'t buy a $500/month "omnichannel suite" with 40 features.',
        headlineSize: 64,
      },
      {
        tag: 'Responses',
        headline: 'Responding to reviews:',
        body: "Simplest version = AI that writes personalized responses on autopilot. Don't hire a $2,000/month agency.",
        headlineSize: 68,
      },
      {
        tag: 'Pattern',
        headline: 'The pattern:',
        body: 'Automate the thing that takes real time and skill. Do the simple stuff yourself. Skip everything in between.',
        headlineSize: 72,
      },
      {
        tag: 'Us',
        headline: "That's why we called it <em>Built Simple.</em>",
        body: 'AI receptionist built for your business. Review responses on autopilot. Nothing you don\'t need.',
        headlineSize: 72,
      },
      {
        tag: 'CTA',
        headline: 'built-simple.ai',
        headlineSize: 96,
      },
    ],
  },
  {
    name: 'BRAND-2: What I\'d Spend If I Owned a Restaurant',
    theme: THEMES.gold,
    slides: [
      {
        tag: 'Specific Advice',
        headline: "If I owned a restaurant, here's exactly where I'd spend money on tech.",
        body: "And where I wouldn't.",
        headlineSize: 64,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to answer the phone during the dinner rush.',
        body: "You're missing calls when the place is packed. Each one is a reservation walking out the door.",
        headlineSize: 64,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to respond to every Google review.',
        body: 'People check reviews before choosing where to eat. Your responses are marketing.',
        headlineSize: 68,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A $300/month review solicitation tool.',
        body: 'Put a QR code on the check presenter. "Loved your meal? Leave us a review!" Done.',
        headlineSize: 64,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> An "omnichannel" platform.',
        body: "Combines phones, texts, social DMs, email into one dashboard you'll check once and forget.",
        headlineSize: 64,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A chatbot on your website.',
        body: "Nobody's using it. They're calling or checking Google. Meet them where they already are.",
        headlineSize: 68,
      },
      {
        tag: 'Total',
        headline: 'Total monthly tech that moves the needle:',
        body: 'AI Receptionist + ReviewMaster. Everything else is noise.',
        headlineSize: 72,
      },
      {
        tag: 'CTA',
        headline: 'built-simple.ai',
        headlineSize: 96,
      },
    ],
  },

  // ═══════════════════════════════════════════
  // VERTICAL CAROUSELS (3)
  // ═══════════════════════════════════════════
  {
    name: 'VERT-1: What I\'d Spend If I Were a Contractor',
    theme: THEMES.cyan,
    slides: [
      {
        tag: 'Contractors',
        headline: "Contractors: here's where your tech budget should go.",
        body: "And where it shouldn't.",
        headlineSize: 72,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to answer the phone while you\'re on a job.',
        body: "You can't pick up when you're on a roof or under a house. Every missed call is a job going to the next guy on Google.",
        headlineSize: 60,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to respond to your Google reviews.',
        body: 'Homeowners choosing a contractor check reviews harder than almost any other industry. Unanswered reviews look abandoned.',
        headlineSize: 60,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A $300/month "lead management platform."',
        body: 'You need leads to manage first. Answer the phone and respond to reviews — that\'s lead management.',
        headlineSize: 60,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A website chatbot.',
        body: "Homeowners with a burst pipe aren't typing into a chat widget. They're calling. Be there when they call.",
        headlineSize: 64,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> Automated review solicitation.',
        body: 'Hand the homeowner a card after the job with a QR code. "If we did a good job, we\'d appreciate a review." Costs nothing.',
        headlineSize: 60,
      },
      {
        tag: 'Total',
        headline: 'AI Receptionist ($500 setup + $200/mo) + ReviewMaster ($29/mo).',
        body: "That's your tech stack. Everything else is noise.",
        headlineSize: 60,
      },
      {
        tag: 'CTA',
        headline: 'built-simple.ai',
        headlineSize: 96,
      },
    ],
  },
  {
    name: 'VERT-2: What I\'d Spend If I Owned a Salon',
    theme: THEMES.purple,
    slides: [
      {
        tag: 'Salons',
        headline: "Salon owners: here's the tech that's actually worth your money.",
        body: "And what's not.",
        headlineSize: 72,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to answer the phone when your hands are literally full.',
        body: "You're mid-color, mid-cut, mid-facial. Phone rings. You can't pick up. Client calls the salon down the street.",
        headlineSize: 56,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to respond to your Google reviews.',
        body: 'Salons live and die by reviews. People scroll your review page like they scroll your Instagram — unanswered reviews = dead feed.',
        headlineSize: 56,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> An expensive booking platform you\'re only using for the calendar.',
        body: 'If your current system works, just connect the AI receptionist to it.',
        headlineSize: 60,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> Automated review request texts.',
        body: 'Ask at checkout. "If you love your hair, we\'d appreciate a Google review — here\'s the QR code!" That personal moment converts way better.',
        headlineSize: 56,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> Social media scheduling tools before you\'ve handled the basics.',
        body: 'Reviews and phone coverage come first. Content comes second.',
        headlineSize: 60,
      },
      {
        tag: 'Total',
        headline: 'AI Receptionist + ReviewMaster. Under <em>$250/month</em> for both.',
        body: "Handles the two things you can't do while you're with a client.",
        headlineSize: 64,
      },
      {
        tag: 'CTA',
        headline: 'built-simple.ai',
        headlineSize: 96,
      },
    ],
  },
  {
    name: 'VERT-3: What I\'d Spend If I Ran a Dental Practice',
    theme: THEMES.cyan,
    slides: [
      {
        tag: 'Dental/Medical',
        headline: 'Dental and medical offices: your front desk is <em>overwhelmed.</em>',
        body: "Here's what actually helps.",
        headlineSize: 68,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to handle phone overflow and after-hours calls.',
        body: "Your front desk is checking patients in, verifying insurance, answering questions — AND the phone won't stop. They can't do all of it.",
        headlineSize: 56,
      },
      {
        tag: 'Would',
        headline: '<em>WOULD:</em> AI to respond to every patient review.',
        body: 'Healthcare reviews carry enormous weight. Thoughtful responses build loyalty. Professional responses to negatives show you take feedback seriously.',
        headlineSize: 56,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A $300/month reputation platform.',
        body: "Patients aren't leaving reviews because you lack software. They're not leaving reviews because nobody asked. Hand them a card at checkout.",
        headlineSize: 56,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> A complicated phone tree.',
        body: '"Press 1 for appointments, press 2 for billing..." Patients hate this. An AI that just picks up and talks to them is better.',
        headlineSize: 60,
      },
      {
        tag: 'Would Not',
        headline: '<em>WOULD NOT:</em> Anything that adds MORE work to your front desk.',
        body: "The whole point is to take things OFF their plate.",
        headlineSize: 68,
      },
      {
        tag: 'Total',
        headline: 'AI Receptionist handles overflow and after-hours. ReviewMaster handles every review.',
        body: 'Your front desk handles what actually needs a human.',
        headlineSize: 56,
      },
      {
        tag: 'CTA',
        headline: 'built-simple.ai',
        headlineSize: 96,
      },
    ],
  },
];

// ─────────────────────────────────────────────
// ENGINE (same as generate.js)
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

async function generateCarousel(carousel, outputDir, browser, template) {
  await fs.mkdir(outputDir, { recursive: true });

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

  await page.close();
  return paths;
}

// ─────────────────────────────────────────────
// EMAIL DELIVERY
// ─────────────────────────────────────────────
const EMAIL_TO = process.env.CAROUSEL_EMAIL || 'info@built-simple.ai';

async function emailCarousel(paths, carousel) {
  const boundary = `----=_Part_${Date.now()}`;
  const subject = carousel.name || `Carousel: ${carousel.slides[0]?.tag || 'New Carousel'}`;

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

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
async function main() {
  console.log('\n🎠 Generating ALL 21 carousels from Playbook V4...\n');
  const start = Date.now();

  const fonts = JSON.parse(await fs.readFile(path.join(__dirname, 'fonts.json'), 'utf8'));
  const templateSrc = await buildHTML(fonts);
  const template = Handlebars.compile(templateSrc);

  const browser = await puppeteer.launch({
    headless: 'new',
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH || '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--font-render-hinting=none'],
  });

  const baseDir = path.join(__dirname, 'output-all');
  await fs.mkdir(baseDir, { recursive: true });

  let totalSlides = 0;

  for (let idx = 0; idx < ALL_CAROUSELS.length; idx++) {
    const carousel = ALL_CAROUSELS[idx];
    const safeName = carousel.name.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').substring(0, 50);
    const carouselDir = path.join(baseDir, `${String(idx + 1).padStart(2, '0')}-${safeName}`);

    console.log(`[${idx + 1}/${ALL_CAROUSELS.length}] ${carousel.name}`);

    const paths = await generateCarousel(carousel, carouselDir, browser, template);
    totalSlides += paths.length;

    // Email each carousel
    try {
      await emailCarousel(paths, carousel);
      console.log(`    ✓ ${paths.length} slides → emailed`);
    } catch (err) {
      console.log(`    ✓ ${paths.length} slides (email failed: ${err.message})`);
    }
  }

  await browser.close();

  console.log(`\n✅ Done — ${ALL_CAROUSELS.length} carousels, ${totalSlides} total slides in ${Math.round((Date.now() - start) / 1000)}s`);
  console.log(`   Output: ${baseDir}\n`);
}

main().catch(err => {
  console.error('\n❌', err.message);
  process.exit(1);
});
