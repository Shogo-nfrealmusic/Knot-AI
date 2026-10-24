export type ProjectLink = { label: string; href: string };
export type ProjectMetric = { value: string; label: string };
export type ProjectSection = {
  heading: string;
  paragraphs?: string[];
  items?: string[];
};
export type ProjectImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
};

export type Project = {
  slug: string;
  name: string;
  title: string;
  summary: string;
  role: string;
  context?: { label: string; value: string };
  stack: string[];
  /** The first link is the primary one and is shown on the project card. */
  links: ProjectLink[];
  /** The first metric is the headline number on the project card. */
  metrics: ProjectMetric[];
  sections: ProjectSection[];
  images: ProjectImage[];
};

// Ordered by strength of evidence (PORTFOLIO.md §4). Screenshots go in `images`
// (PORTFOLIO.md §12-10, step 8).
export const projects: Project[] = [
  {
    slug: "tps-booking-platform",
    name: "TPS Booking Platform",
    title: "Booking Platform with Deposit-Based Payments for Inbound Travelers",
    summary:
      "Booking and payments for a Tokyo photo studio whose customers book from 20+ countries.",
    role: "Sole developer. Design, build, deploy, and operate.",
    stack: [
      "Next.js",
      "TypeScript",
      "Go",
      "PostgreSQL",
      "AWS",
      "Stripe",
      "Cloudflare",
    ],
    links: [
      { label: "Live site", href: "https://book.tettyphotostudio.com/" },
      { label: "Company site", href: "https://www.tps-collective.com/" },
    ],
    metrics: [
      { value: "$19.9k", label: "best month in revenue" },
      { value: "754", label: "transactions in 8.5 months" },
      { value: "39%", label: "of date selections reached a time slot" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Customers book from 20+ countries, usually on a phone and most often from Instagram, before they have met anyone from the studio. They choose a plan, a location and a time slot and pay a deposit to a business they do not know yet.",
          "For the studio, one photographer cannot be in two places, an abandoned checkout must not block a slot for long, and a payment that arrives must always end in a booking. A booking form with a payment button does not give you any of those three.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "A customer site with no login: plan, location, date and time, contact details, then a 30% deposit through Stripe Checkout",
          "A Go API and PostgreSQL schema where slot capacity, 30-minute buffers and the deposit amount are enforced inside the database, not in the browser",
          "A second Stripe payment for the remaining balance, started from the staff app when the shoot is done, which completes the booking when it is paid",
          "Cancellation and refund paths for owners, including refunds made directly in Stripe",
          "Photographer self-assignment, a shared Google Calendar entry per booking, and email, push and Slack notifications",
          "GA4 events inside every step of the booking screen and Microsoft Clarity session recordings with contact fields masked",
          "Also built the company website, tps-collective.com",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "One repository holds the customer site (Next.js), the staff app, the Go API and the SQL migrations. In production a load balancer sends web routes to one container service and API routes to another, both on AWS Fargate, with PostgreSQL on RDS. Infrastructure is defined in Terraform.",
          "When a customer presses Pay, the API computes the price on the server and calls one SQL function that locks the availability window, counts overlapping holds and bookings including the buffer on each side, and creates a hold only if capacity allows. The API then opens a Stripe Checkout Session that expires five minutes before the hold does.",
          "The browser never confirms anything. A signed Stripe webhook does: it records the event, turns the hold into a booking and the pending payment into a paid one in a single transaction, then queues the confirmation email, the reminder, staff alerts and the calendar entry. The success page only polls until that has happened.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "Two clocks. Holds used to expire after thirty minutes while Stripe's page stayed open for about a day, so a few customers paid for a slot they no longer held. Now opening checkout resets the hold to an hour and Stripe's page closes five minutes earlier.",
          "Idempotency in two layers. Stripe can deliver an event more than once. An event table skips anything already processed and lets failed events be retried; behind it, every step is written so that running it twice changes nothing.",
          "Changing Stripe accounts without stopping. On October 1, 2026 new payments moved from a sole-proprietor account to a corporate one. Each payment records the account that took it, each account has its own webhook endpoint and signing secret, and a refund always goes out from the account that received the money.",
          "Races with staff edits. Staff can add guests while a balance link is being created. The link is created, then the booking row is locked and the total compared; on a mismatch the link is expired at Stripe.",
          "Measuring a phone-only audience. A section counts as viewed only when 40% of it has been on screen for a full second. The booking-screen events carry buckets, never names, emails, dates or amounts.",
        ],
      },
      {
        heading: "Operating it",
        items: [
          "Changes reach production only through a pull request, and the repository settings require CI to pass before merge (the organisation admin can override that inside a pull request). Direct pushes to the main branch are blocked.",
          "CI runs web lint, tests, typecheck and build, Go unit tests, Go integration tests against a real PostgreSQL with a fake Stripe server, a check that every migration has a matching rollback file, secret scanning and a license check.",
          "371 Go test functions. Coverage floors are enforced in CI for the booking, payment and staff packages (69%, 80% and 60%); they only move up.",
          "A browser test books a shoot on desktop and phone layouts up to the handoff to Stripe.",
          "A worker runs every five minutes. It sends queued notifications, retries calendar entries, and alerts owners and managers by push and Slack when a Stripe event has gone unprocessed for five minutes.",
          "Not done yet: dispute handling is manual in Stripe, and there are no infrastructure alarms on the API beyond that webhook alert.",
        ],
      },
      {
        heading: "Results",
        items: [
          "Monthly revenue between ~$4,000 and ~$19,900 in Stripe (converted from JPY at ¥154 = $1)",
          "TPS has handled 1,200+ clients to date, and is working toward ~$1.3M (¥200M) in first-year revenue",
          "754 transactions processed in 8.5 months (Jan 1 – Sep 13, 2026). This is the studio's Stripe total and includes the booking site this platform replaced at the end of June 2026",
          "Found that only 39% of sessions that selected a date went on to select a time, identified a scripted scroll that fought the visitor's finger and a single long page as the likely causes, and shipped fixes. A price cut shipped one day after the main fix, so the effect of the fix alone cannot be isolated",
        ],
      },
    ],
    images: [
      {
        src: "/images/work/tps-booking-desktop.png",
        alt: "Tetty's Photo Studio booking site, desktop home page",
        width: 1440,
        height: 900,
      },
      {
        src: "/images/work/tps-booking-mobile.png",
        alt: "Tetty's Photo Studio booking site on a phone",
        width: 780,
        height: 1688,
      },
    ],
  },
  {
    slug: "tps-staff-app",
    name: "TPS Staff Operations App",
    title: "Staff Operations App for a Multinational Contractor Team",
    summary:
      "An iOS app where contract photographers claim shoots, bill the customer's remaining balance, and send their month-end invoice. Every rule about money, hours and customer data is enforced by the same Go API the booking site uses.",
    role: "Sole developer.",
    context: {
      label: "Platform",
      value: "iOS (App Store). Not publicly downloadable — internal tool.",
    },
    stack: [
      "React Native",
      "Expo (Router, EAS Update)",
      "TypeScript",
      "Go",
      "PostgreSQL",
      "Stripe",
      "Google Calendar API",
      "AWS",
    ],
    links: [],
    metrics: [
      { value: "8", label: "contract photographers on one app" },
      { value: "Weekly", label: "production use by the team" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Eight contract photographers across multiple nationalities needed to claim jobs, track their earnings, and invoice at month end. All of it was happening in DMs and spreadsheets.",
          "The obvious fix is a shared calendar and a spreadsheet template. That fails on the parts that matter. Two people can claim the same shoot. A photographer who is not on a shoot can still read the customer's phone number. Nobody can prove afterwards what an invoice was based on. And once the studio became a company, it had to withhold income tax from every payout, at a rate that depends on each photographer's tax residency.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Self-assignment: photographers claim open shoots and event slots from the app",
          "Shoot completion that starts collection of the customer's remaining balance through Stripe",
          "A monthly payout page priced line by line on the server, with withholding tax, and an invoice that goes through send, return, resend and approve",
          "Requests instead of silent changes: a photographer can ask to be released from a shoot or propose a new time or meeting point, and an owner applies or declines it",
          "An owner area inside the same app: plans, locations, availability slots, events, discount codes, staff, and bookings taken over DM",
          "Push notifications that open the screen they are about",
          "A weekly work limit per person, for staff whose visa caps their working hours",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "The app is one of three parts of a single repository: the customer booking site (Next.js), the staff app (Expo and React Native), and a Go API in front of one PostgreSQL database. The app has no backend of its own. It calls the same API under a staff path and reads the same bookings table the website writes to, so a booking paid on the website shows up for photographers without any sync step.",
          "State on the phone is three small Zustand stores (session, bookings, setup). Nothing is cached to disk except the session token and a remembered-device token, both in the iOS keychain through expo-secure-store. Each request has an eight-second timeout (photo uploads get sixty seconds), the list reloads when the tab regains focus, and any 401 clears the session and returns to sign-in. There is no offline mode and no local copy of bookings: every screen reads from the API and every action is a request to it.",
          "The app does no pay arithmetic. The API returns the month as a list of priced lines and the app renders them. When pay rules changed, only the server changed.",
          "A scheduled task runs every five minutes. It queues what is due (among other things, alerts for shoots in the next seven days with nobody assigned, invoice reminders, work-limit alerts), then sends pending email, push and Slack messages, then writes pending bookings to Google Calendar. Push goes through Expo's push service.",
        ],
      },
      {
        heading: "Authentication and roles",
        paragraphs: [
          "There are four roles: owner, manager, photographer and creative assistant. The app hides what a role cannot do, but that is only for ergonomics. The rule, written in a permissions document that is the source of truth, is that the API must enforce every money, booking, customer-data and payout rule itself. The same document lists the authorization tests that protect each boundary.",
        ],
        items: [
          "Sessions are a random 32-byte token. Only its SHA-256 hash is stored, and it lasts at most 90 days, or 30 days if the app is not opened.",
          "Owners and managers can see every customer's contact details and issue refunds, so a password is not enough for them. After the password they get a six-digit code by email: valid ten minutes, five attempts, one live code per person. A phone that passes can be remembered for 90 days. Photographers are not asked.",
          "Customer email, phone and country are blanked in the SQL query itself unless the caller is an owner, a manager, or assigned to that booking. The fields never reach a phone that should not have them.",
          "Only owners can refund. Photographers cannot remove themselves from a shoot; they send a release request and a manager decides, so responsibility never drops by accident.",
          "Travel allowances and bonuses are added by an owner or manager, not entered by the photographer, and they are locked while that month's invoice is under review.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "Two taps, one shoot. Claiming a shoot is a single UPDATE that only matches a confirmed booking with no photographer. The second request matches zero rows and is refused as not assignable. The booking row needs no separate lock.",
          "A weekly limit that means any seven days. A student visa allows 28 hours of work across all jobs in any seven consecutive days, not per calendar week. The API locks the staff row, writes the assignment, then sums the person's work in all seven windows that contain the shoot date, inside the same transaction, and rolls back if any window is over. The lock is FOR NO KEY UPDATE rather than FOR UPDATE, so two claims by the same person queue up but a manager editing the same booking cannot deadlock with them. The card on the phone and the refusal use the same counting functions, so they cannot disagree.",
          "A limit can still be exceeded without a claim: an owner lowers it, or a customer reschedules. Blocking those would trap customer bookings, so the scheduled task checks four weeks ahead and pushes an alert to owners and managers once per window and total. It never unassigns anyone.",
          "Invoices against a moving month. Shoots keep being completed after an invoice is sent. The invoice stores the lines it was sent with, the payout page shows the live month next to it, and a returned invoice can be sent again with a new submission number. Sending and adding an adjustment take the same row lock, so an adjustment lands either on the invoice or not at all.",
          "Withholding tax. Rates are stored as basis points and computed in whole yen, because the statutory rounding drops fractions of a yen. If nobody has recorded a photographer's residency, the resident rate is assumed and the invoice is flagged for an owner to confirm.",
          "Month boundaries. Shoots were first grouped into months in UTC, so a shoot before 9 a.m. on the 1st in Tokyo was counted in the previous month. I reproduced it against a UTC database. A shoot is now counted in the month it starts in Tokyo time.",
        ],
      },
      {
        heading: "Shipping and operating it",
        paragraphs: [
          "In September 2026 I rebuilt the app shell on Expo 57, NativeWind and Expo Router. The rebuild was run against a parity checklist: every behaviour of the old app, with its API call and role gate, ticked only when the new screen called the same API with the same payload. Nothing was allowed to be dropped to simplify the UI.",
          "Since version 1.2.3 the app loads JavaScript updates from EAS Update at launch. Screens, wording and logic reach phones in minutes without App Store review. The runtime version follows the app version, so an update can never land on a binary that lacks the native code it needs. Only code merged to main with CI passing is published, and anything touching native code still goes through a store build.",
        ],
        items: [
          "A patch to a native dependency once picked up local build output. The cloud build reused a stale framework and the app crashed on launch in TestFlight. The patch is now regenerated with an exclusion list, and the reason is written next to it.",
          "Photo uploads in the owner area failed with a FormData error after the Expo 57 rebuild, because Expo's replacement fetch rejects React Native file parts. Uploads now go through XMLHttpRequest. The fix shipped the same day as an over-the-air update.",
          "The app had no tests until October 2026. It now has 16 screen-level tests for sign-in and the booking detail screen, run in CI. Writing them exposed a real bug: a booking opened from a push but missing from the list showed a spinner forever.",
          "A push for someone with no registered device is counted as skipped and marked cancelled, not failed, so the failure log only holds real delivery errors.",
        ],
      },
      {
        heading: "Results",
        items: [
          "Replaced manual DM-based assignment",
          "Month-end invoicing went from manual aggregation to an invoice priced by the server, with withholding tax and an approval step",
          "Currently in production, used by the team every week",
        ],
      },
      {
        heading: "What it does not do",
        items: [
          "No offline mode",
          "The interface is English only. The payout invoice document is in Japanese because it is a tax record for a Japanese company",
          "Calendar sync is one way: the system writes bookings to Google Calendar and does not read changes back",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "toni-concept-site",
    name: "TONI",
    title: "3D Scroll Site for a Concept Drink Brand",
    summary:
      "A concept site for a matcha tonic brand: one real-time 3D can travels the whole page, and AI-generated video handles the liquid scenes.",
    role: "Sole developer, directing Claude Code. Art direction, 3D, video generation.",
    context: {
      label: "Brand",
      value: "Concept by TPS Collective. Can and logo design by Tetsuta Endo.",
    },
    stack: [
      "Next.js",
      "TypeScript",
      "Three.js",
      "React Three Fiber",
      "GSAP",
      "Lenis",
      "Higgsfield",
      "Vercel",
    ],
    links: [
      { label: "Live site", href: "https://toni.shogo.build/" },
      { label: "How it was built", href: "/blog/you-cant-one-prompt-this" },
    ],
    metrics: [
      { value: "54.3s → 1.0s", label: "until the can appears on a phone" },
      { value: "147.8 → 1.9 MB", label: "initial download after optimizing" },
      { value: "6", label: "flavors from one 3D can" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Scroll-animated product sites can now be generated from a single prompt, and they all look alike. I wanted to find out where the craft actually lives: what award-level sites do that a one-prompt build doesn't.",
          "The blog post linked above tells the story in order. This page is the technical summary of the site as it stands.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "The can as one real-time 3D object: the brand's unrolled label wrapped on a cylinder, with aluminium top and bottom",
          "The whole homepage as a single scroll timeline: camera, can, type, background and light all driven by one 0–1 progress value",
          "Kinetic type the can passes through, a physics-based drop between sections, and a blueprint mode where the can is drawn as line art before the label wraps back on",
          "Powder, ice, splash and pour scenes generated with Higgsfield (Seedance) and scrubbed frame by frame",
          "A spotlight flavor carousel, shop, product pages and a working cart; checkout stops at a concept notice",
        ],
      },
      {
        heading: "Two kinds of motion, one loop",
        paragraphs: [
          "Everything that moves is one of two things. If the can has to react freely to the state of the page, it is real-time 3D. If it is a fixed piece of footage (the can bursting open, the pour, the day scenes), it is a generated video cut into stills and drawn one still per scroll position on a 2D canvas. Stills look richer, but they cannot branch and they are heavy, so each is used only where it is the better tool.",
          "Both are driven the same way. There is one animation loop, the GSAP ticker. It advances Lenis (the smooth-scroll library), Lenis updates ScrollTrigger, and each pinned section reads its own progress from 0 to 1 inside that same tick. Nothing draws from a scroll event. The progress a section shows trails the real scroll position by a time constant of about 0.1 seconds, computed from the frame time, so the motion is identical scrolling down and scrolling back up.",
          "While scrolling, only transform and opacity change. Background colours cross-fade as stacked layers instead of animating a colour, and the scroll-driven sections write no React state, so React almost never re-renders during a scroll.",
        ],
      },
      {
        heading: "The 3D can",
        items: [
          "Built from the real dimensions of a 250 ml slim can. The body is an open cylinder; the top and bottom are lathe geometry turned from hand-entered profiles",
          "The label is the designer's flat artwork wrapped once around the body. An upscaler broke the small nutrition text, so that part was re-typeset by script from the original wording",
          "The label material has no metalness (roughness 0.55, a light clearcoat); only the ends are metal. An early version with a slightly metallic label looked too metallic. Lighting comes from generated light panels, not a downloaded HDR file",
          "The blueprint reveal is a small patch to the built-in material's shader: fragments past a reveal value around the circumference are discarded, so the label sweeps back on from the front",
          "The drop is not a tween. It is free fall, three bounces with a restitution of 0.32, then rest, written as a function of scroll progress. Scroll backwards and the can falls upwards along the same path",
          "The six flavors are six label textures recoloured by script from the one original. No label was generated",
        ],
      },
      {
        heading: "The frame pipeline",
        paragraphs: [
          "Each generated clip is upscaled to 4K, then a script splits it into frames, joins consecutive clips, corrects colour, thins the frames evenly, and writes two WebP sets: 16:9 for desktop and a cropped set for phones.",
        ],
        items: [
          "Colour correction exists because the video model shifts the whole image warm and two clips from the same settings come back with different backgrounds. The script measures the background at the edges of every frame and pulls it to the page background, smoothed over neighbouring frames",
          "The script refuses to upscale. If a requested output is larger than the source pixels it stops with an error. That turns the sharpness rule (on-screen size times pixel ratio must not exceed source pixels) into something the build enforces",
          "On the page, the first frame is a plain image in the HTML so it shows before JavaScript runs. A canvas does not count toward Largest Contentful Paint",
          "Frames are fetched as compressed blobs, starting three screens before the section: every 8th frame, then every 4th, every 2nd, then the rest. A fast scroll can play a coarse version before the full set arrives",
          "Decoding happens off the main thread with createImageBitmap, already resized to the size being drawn, into a small least-recently-used cache around the current position (18 frames on phones, 16 on desktop). If the exact frame is not decoded yet, the nearest decoded one is drawn, never a blank",
          "Phone frames are exported at exactly the size they are drawn on the phone test profile. One chapter exported larger (1440 px wide, drawn at 1170) dropped 16 frames over three screens of scrolling until it was re-exported",
        ],
      },
      {
        heading: "Rendering only when something changed",
        paragraphs: [
          "React Three Fiber renders every frame by default. Here both canvases run with the frame loop off and are advanced from the shared ticker only when asked: scroll progress changed, a spring is still moving, or the canvas was resized. Offscreen canvases do not render. Phones are capped at a pixel ratio of 1.5 for the 3D layer.",
          "Shaders for every material, including objects hidden at load, are compiled up front. Before that, the first time the flavor carousel scrolled into view cost a 65 ms stall while a shader program linked.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "Touch flings. Lenis smooths the wheel by default but not touch, so one flick on a phone travelled 2.4 screens straight through pinned chapters. Touch is now smoothed, and each chapter registers rest positions. The momentum of a fling is clamped at the next one, while a finger still dragging is never held back",
          "The same gates on a trackpad were a mistake. A trackpad keeps sending input during inertia, so the page kept being pulled back to the same spot and felt stuck. Gates now apply to touch flings only",
          "The phone address bar. Viewport-height units jump when it shows or hides. The height is written once in pixels by an inline script before first paint and rewritten only when the width changes",
          "Breakpoints. Choosing the desktop or phone frame set once at load stretched 16:9 frames into a 3:4 box after a resize. The choice now follows a media query",
          "Measuring under load lies. With another process using the CPU, the same code reported long tasks that were not there. Numbers are taken on a production build with the machine idle",
        ],
      },
      {
        heading: "Results",
        items: [
          "Measured on the frame-sequence build, before the can became 3D: on an emulated, throttled phone the can appeared in 1.0 s instead of 54.3 s, and the first download dropped from 147.8 MB to 1.9 MB, both against a deliberately naive version built for the comparison",
          "Scroll audit before and after the smoothness pass, phone profile with the CPU slowed four times, down the page and back up: dropped frames went from 175 and 132 to 0 and 0, the worst frame from 150 ms to 16.8 ms, and React commits from 932 and 942 to 10 and 2. A re-run against the deployed site after two more chapters were added held the same level",
          "With the page at rest, no canvas draws at all. Before, two drew every frame",
          "On the phone profile the page went from holding every loaded frame (1,381 MB if all were decoded) to at most 286 MB of decoded frames at once in that audit",
          "Frames are never drawn above their source resolution at the screen's pixel ratio, so the can stays sharp on Retina and phone screens",
          "These are lab numbers from Lighthouse and Playwright with Chrome's throttling, not field data from real phones",
          "A concept: nothing is for sale, and all prices and nutrition data are samples",
        ],
      },
    ],
    images: [
      {
        src: "/images/work/toni-desktop.png",
        alt: "TONI concept site, desktop hero with the 3D can",
        width: 2880,
        height: 1800,
      },
    ],
  },
  {
    slug: "mercari-pm-ai-agent",
    name: "Mercari PM AI Agent",
    title: "AI Agent for Product Management Workflows",
    summary:
      "A Claude Code Skill that takes a PM from a business problem to a PRD and UI mockups in one session, pulling evidence from four tools over MCP.",
    role: "Product Management Intern",
    context: {
      label: "Company",
      value: "Mercari, Inc. (Japan's largest marketplace, ~$1.5B revenue)",
    },
    stack: ["Claude Code", "MCP (Model Context Protocol)", "Anthropic API"],
    links: [
      {
        label: "Read the article",
        href: "https://engineering.mercari.com/en/blog/entry/20260427-mercari-pm-agent-design-automating-the-pm-workflow-with-claude-code-skills-and-mcp/",
      },
    ],
    metrics: [
      { value: "Published", label: "on the Mercari Engineering blog" },
      { value: "In use", label: "internally at Mercari" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Product managers spend a large share of their time on repeatable work: turning scattered problem signals into a structured PRD, then into a UI prototype for review.",
          "The evidence for one PRD sits in four places: strategy documents and KPI goals in Notion, requests and feedback in Slack, user metrics in Looker, and current screen designs in Figma. Each tool is easy to open. The time goes into switching between them and deciding which data matters. The goal was to move that time from gathering to thinking and deciding.",
          "The technical detail on this page comes from the article I wrote for the Mercari Engineering blog, linked above.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "An agent using Claude Code and the Model Context Protocol that runs the chain from problem discovery through PRD drafting to UI prototyping.",
          "It is a Claude Code Skill: a set of Markdown files that define an agent's steps, constraints and tool access, with no application code. The PM describes a business problem in plain language and the agent works through problem discovery, data gathering, PRD creation and UI mockups in a single session. Once the connections are configured, it starts from one slash command.",
        ],
      },
      {
        heading: "How it works",
        items: [
          "One file defines behaviour: what to do and in what order. It is written in English, because English instructions tend to produce higher accuracy with Claude.",
          "Reference material lives in separate files that the behaviour file points to, including a PRD template, a nine-item PRD quality checklist, a UI spec and Figma prompt template, a data-source guide and an output checklist.",
          "Four MCP servers supply evidence. MCP is an open protocol for connecting an LLM application to external tools and data. Notion (the official server) gives strategy documents and the KPI dashboard. An in-house Slack server gives posts from an internal feedback channel. An in-house server over the company's BigQuery and Looker platform gives metrics such as conversion rate. An in-house Figma server gives component information from design files.",
          "The data-gathering step queries those sources in parallel rather than one after another, to cut waiting time.",
          "The agent may not move to the next stage on its own. The rule in the skill reads: \"You are NOT allowed to infer completeness. Only explicit confirmation from the PM allows progression.\"",
        ],
      },
      {
        heading: "Design decisions",
        items: [
          "Split behaviour from reference data. The first version put everything in one file, and output accuracy fell as the file grew (the \"Lost in the Middle\" problem). Splitting it was a structural change only, and it alone produced a clear improvement in the evaluation score.",
          "Write the evaluation before the agent. Four axes were fixed first: does it capture the essence of the problem, is the spec concrete enough to implement, is it feasible technically and in resources, and is the result easy for customers to use. Real web improvement topics formed the evaluation set.",
          "Let a skill grade a skill. A separate evaluation skill sends test cases to the agent and returns scores for output quality. The file split above came out of that score-driven loop.",
          "Constrain rather than command. Constraints matter more than commands: stating clearly what the model must not do directly improves accuracy.",
        ],
      },
      {
        heading: "When it fails",
        items: [
          "A source that is unavailable is skipped and marked in the output, so one broken connection does not stop the run.",
          "Unconfirmed data must be labelled \"Not provided\" or \"To be validated\". The agent is told never to fabricate numbers or sources. A PRD that looks complete but rests on invented figures is the failure this guards against.",
          "The Slack connection needs the internal VPN and a user token. The token is passed as an environment variable so it never appears in the chat. Slack user tokens expire after seven days, so a separate script refreshes them.",
        ],
      },
      {
        heading: "Results",
        items: [
          "Published as a technical article on Mercari Engineering's blog",
          "Used internally",
          "Joining Mercari full-time as a Product Manager in April 2027",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "iron-and-code",
    name: "Iron & Code",
    title: "Iron & Code — Free Training Tools on a Weekly Deadline",
    summary:
      "Five free tools for lifters, built one per week for five weeks: a strength percentile, a session countdown, a muscle index, a 92-day plan builder, and a squat-depth check that reads a video in the browser. The series has been on hold since September 2026, and the site shows the missed weeks too.",
    role: "Sole developer and creator.",
    stack: ["Next.js", "TypeScript", "Vercel", "Supabase", "MediaPipe", "Vitest"],
    links: [{ label: "Live site", href: "https://ironandcode.dev" }],
    metrics: [
      { value: "5 tools", label: "shipped in 5 weeks, August 2026" },
      { value: "114", label: "unit tests, all on logic modules" },
      { value: "5 of 10", label: "weeks kept as of 11 Oct 2026; the site publishes its own misses" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "I make training videos on Instagram and I write software. I wanted to put the two together: small free tools where each one ends in a result image the user wants to post, and each one says where its numbers come from and where they stop being true.",
          "The constraint is time. The rule in the repository is that a tool must be buildable in one weekend.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Strength Percentile: ranks bench, squat, deadlift and total against bodyweight-ratio standards, with age credit from the Foster and McCulloch coefficient tables",
          "Workouts Left: sessions remaining before a chosen age, and what one session a week is worth over that span",
          "Muscle Index: fat-free mass index normalised to a 1.8 m frame, placed against the range recorded by Kouri et al. (1995), with the lean kilos of room above the user",
          "Arc Builder: a plan for the 92 days from 1 October, multiplied out into totals, saved against a restore code with no account",
          "Depth: squat depth read from a video by pose estimation running in the browser; the video is never uploaded",
          "A shared shell: one tool registry, one share-card renderer (1080 × 1920 PNG drawn on a canvas), one run counter, one shipping record",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Every tool is one entry in a TOOLS array with a week number. The header's week, the 48-cell shipping record, the sitemap and the grid on each share card are derived from that array and a single start date. Adding a tool is a calculation module with tests, a page, and one array entry.",
          "Each tool's logic is a pure TypeScript module with no DOM access, tested with Vitest in a Node environment. React components only collect input and draw the result.",
          "Pages are prerendered and revalidated hourly, so the week number advances without a deploy. Run counts are stored as one row per tool per day in Postgres (Supabase) behind a security-definer function. The table has no insert policy, so a browser cannot write an arbitrary count or backdate a row.",
          "Depth vendors MediaPipe's pose model and WebAssembly runtime (about 18 MB) onto the site's own origin and loads them only when a video is chosen. It sweeps the clip at up to 4 frames a second to find the bottom of the rep, then reads the 0.75 seconds either side at 20 frames a second.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "The age adjustment in the first tool ran backwards, and the test covering it asserted the wrong direction under a correct title. Fixed two days after the first commit by switching to the published tables and pinning individual coefficients in tests.",
          "Depth divided by a thigh length measured in mixed units: landmark x is a fraction of frame width and y of frame height. On a 9:16 clip a horizontal thigh came out about 1.8 times too long and every squat read shallow.",
          "Pose estimation returns joint centres, but the competition rule names the top of the knee. The depth line is offset by a tenth of a thigh to account for that, and anything within a twentieth of a thigh of the line returns 'too close to call'.",
          "Three hangs appeared only on iOS: a dynamic import inside a Function body that WebKit never resolves, a wait for a decoded frame that iOS does not produce before playback is attempted, and a display: none video element that iOS never loads.",
          "The first shipping-record tests read the live tool list, so they broke as soon as a second tool was added. The logic now takes its data as an argument.",
        ],
      },
      {
        heading: "Operating it",
        items: [
          "Every awaited browser event in Depth has a deadline, each loading step reports its own name, and the model load times out after 45 seconds with a message",
          "The run counter is fire-and-forget: a best-effort limit of 60 requests an hour per IP address, and the API returns 204 whether or not the write succeeded, so a failed count never reaches the user",
          "There is no CI. The gate is local: lint, typecheck, tests and build before a release",
          "Known gap: Arc Builder says the plan becomes a daily checklist on 1 October. The storage functions exist, but no screen uses them yet",
          "Measured limits: Depth is tested on synthetic frames only. It has not been validated against real squats judged by a referee",
        ],
      },
      {
        heading: "Results",
        paragraphs: [
          "Five tools shipped between 2 and 30 August 2026, each inside or before its own week. Weeks 6 to 10 were missed. The home page computes that record from the tool list and the calendar, and I have not edited it.",
          "One tool, Discipline Score, was built on a Saturday and deleted on the Sunday, because it only scored what the user had typed in. The rule that came out of it: a tool has to know something the user cannot work out alone.",
          "This project is evidence of how I structure and verify small products under a fixed deadline. It is not evidence of scale, and it is not an unbroken streak.",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "lifters-club",
    name: "Lifters Club",
    title: "Lifters Club — A Training Log That Sets the Next Session",
    summary:
      "A web app for gym training: a plan from your answers, sets logged on the phone even without signal, the next session's weight and reps worked out by rule, and a coach who can read but not rewrite.",
    role: "Sole developer, building with Claude Code. Spec, decisions and review.",
    stack: [
      "Next.js",
      "TypeScript",
      "Cloudflare Workers (OpenNext)",
      "Supabase (Auth, Postgres, Storage)",
      "Zod",
      "Vitest",
      "Playwright",
    ],
    links: [
      { label: "Live site", href: "https://lifters.club" },
      { label: "How it works", href: "/blog/lifters-club" },
    ],
    metrics: [
      { value: "582", label: "exercises, each with a licensed motion clip" },
      { value: "1,079", label: "unit and component tests; 99.5% of lines in server code" },
      { value: "21", label: "migrations, row-level security on every table" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "It started with coaching one person's training. A plan on paper says what to do but nothing comes back: which weight was used, whether a set hurt, and what next time should be.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Onboarding that writes a plan by rule from days a week, minutes, equipment, experience and painful areas",
          "Gym logging on the phone, with the next session's weight and reps worked out by a fixed, tested list of rules",
          "Logging without signal: an outbox in IndexedDB, ids made on the phone, and a choice shown when two devices disagree",
          "Coaching by invite link, with read-only access to logged sets and opt-in sharing of personal details",
          "An exercise library of 582 licensed clips, re-encoded by one import command",
        ],
      },
      {
        heading: "How it works",
        paragraphs: [
          "Next.js 16 on Cloudflare Workers through OpenNext. Every data call goes through one API gate that checks the token's signature, refuses cross-site writes, rate-limits and hides errors. Supabase is called with the user's own token, so row-level security decides every read and write.",
        ],
      },
    ],
    images: [],
  },
  {
    slug: "signal-ai-brief",
    name: "SIGNAL",
    title: "A Daily AI Brief That Ranks Stories by Consequence",
    summary: "A news product that reads 45 feeds plus Techmeme, Hacker News, GitHub and vendor pages six times a day, groups the same event across outlets, and ranks the day by what actually changes — not by how loudly it was covered.",
    role: "Sole developer. Design, build, deploy, and operate in production.",
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "PostgreSQL",
      "Anthropic API",
      "Vercel"
    ],
    links: [
      {
        label: "Live site",
        href: "https://www.sgnl.news/"
      }
    ],
    metrics: [
      {
        value: "6×/day",
        label: "collection runs, unattended, on a cron"
      },
      {
        value: "45 → 12",
        label: "RSS feeds read, stories in the daily issue"
      },
      {
        value: "1.5s",
        label: "mobile first paint in a throttled lab test, down from 2.2s"
      }
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Coverage volume is not importance. The story on 37 outlets is often the one that changes least, and the model release on four is often the one that changes most. Every aggregator ranks by volume anyway, because volume is the number that is easy to count.",
          "I measured this on my own first version before rebuilding it. Over one 16-hour window it had collected 53 items. 21 of them (40%) were not needed: eight repeated a story already in the list, eight were old articles a feed kept listing, five were off topic. A single debate took 15 of the 53 slots. It also missed two stories of about $5 billion each, a funding round and an IPO, because it only took the newest four items from each feed every four hours."
        ]
      },
      {
        heading: "What I built",
        paragraphs: [
          "A pipeline in four stages, each of which can be run and tested without the next: collect everything with its signals, group articles into stories, score stories with arithmetic, and only then pay a model to write the top ones. Collection, grouping and scoring use no model at all. The model is called once to write a story and once to review it.",
          "The reader gets one issue a day: the twelve highest-scoring stories of the last 24 hours, plus up to two labelled as unverified, in English and Japanese."
        ]
      },
      {
        heading: "How it works",
        paragraphs: [
          "Collection runs every source in parallel and writes every item into one table with the signals that source can give: Techmeme's position on the page and the number of other outlets it lists for the story, Hacker News points, GitHub stars gained today, whether the item came from the vendor's own site. That table is also the memory of what has been seen. It is kept for 60 days, separately from the published stories, because deleting it on the same clock as the digest is what let old articles come back as new in the first version.",
          "Grouping is a union-find over the last 48 hours of items. Hard links come first: the same article under another URL, and Techmeme's own human-edited clusters. Soft links join two headlines when the words they share carry at least half the weight of the lighter headline, with rare words weighted more (inverse document frequency over the window), at least two shared words, and at least one of them rare. A group stops growing by headline similarity at 25 items, because a group that large is usually two stories chained together.",
          "Scoring adds named parts and returns the breakdown with the score. Known news outlets count on a log scale and are capped at eight. Sites the system does not recognise add at most one. Techmeme rank adds up to 3. Hacker News points count on the same log scale as outlets. A vendor's own announcement adds 2 and a change on a watched pricing page adds 2.5. Then comes consequence: a product or model launch, a platform integration, a pricing change, a developer-facing change, an enacted policy or a concrete business event each add between 1.5 and 3, capped at 5 in total, judged from verbs and objects in the same headline. Opinion, reviews, guides and curiosities multiply the total by 0.35 to 0.6. The result decays with a 48-hour half-life.",
          "Stories from confirmed sources that score below 3.5 points are never sent to a model. The rest are processed best first until twelve are published."
        ],
        items: [
          "RSS: 45 feeds, 15 of them vendors' own. Every item from the last 48 hours, up to 40 per feed, instead of the newest four.",
          "Techmeme's front page rather than its RSS, because the page carries the cluster rank and the list of other outlets.",
          "Hacker News through the Algolia API: stories with 100 points or more, plus low-vote links to first-party sources.",
          "Five vendor pricing and changelog pages, compared with the previous snapshot on each run. The first fetch only records a baseline.",
          "GitHub releases for seven AI developer tools (minor and major versions only), GitHub Trending at 200 or more stars in a day, new Hugging Face models from eleven official publishers, and four first-party news indexes that have no feed."
        ]
      },
      {
        heading: "Writing and verification",
        paragraphs: [
          "For each selected story the pipeline reads up to three source texts, first-party sources before press before community, within a 12,000-character total. Paywalled outlets are listed as sources and never fetched. If no source yields a usable on-topic body, the story is withheld before any paid call.",
          "The writer returns the English entry and its Japanese translation in one call. A second call, with a separate prompt, audits the draft against only the source texts and returns pass, revise or hold with the claims it relied on and which source supports each. Around those two calls sit deterministic gates: body length limits, a rule that one entry covers one jurisdiction's event, a currency comparison between the two languages, and three narrow guards against overstatement. A draft gets one rewrite. If it still fails, the story is held and not retried for six hours unless a new article joins it.",
          "The currency gate exists because of a real case. A €403M fine came back in Japanese as 403億円: 100 times the amount, in yen. It appeared in a dry run, which writes nothing, and never reached the site. The check that should have caught it accepted the number because the digits 403 appear in the source. The number matched is the full account."
        ]
      },
      {
        heading: "Hard parts",
        paragraphs: [
          "Most of the work was finding out which rule was wrong, by reading what came out."
        ],
        items: [
          "Ranking by outlets plus Hacker News points put an iPhone teardown, a history feature and a healthcare bill into the first twelve, because coverage and Hacker News popularity are not topic. The consequence rules moved them out without a model call. That judgement was made by hand on one run.",
          "A dedicated three-slot lane for markets stories was tried and removed. Of 138 markets stories, 136 scored about the same: one outlet each, no shared signal to rank them by.",
          "The cheaper model wrote Japanese with meaning errors that a token check cannot see, so the one call that writes reader-facing text moved to a larger model. Its first new failure was to skip a real product launch as fiction, because it had never heard of the company. The prompt now says that an unfamiliar name is not evidence of anything, and any skip of that kind is counted separately in the run report.",
          "Pages rendered by JavaScript return no text. The pipeline tries other articles in the same story, reads a repository's README instead of its HTML page, and otherwise withholds the story. I chose not to add a paid rendering service until skips of this kind were counted.",
          "The review call passed a draft that merged California's signed laws with a separate EU proposal. Region conflicts now split stories at grouping, at source gathering and at the draft.",
          "Thirteen published stories carry versioned corrections. They are applied at read time on every surface (issue, story page, search, feed, metadata), the stored original is kept, and the correction text is shown."
        ]
      },
      {
        heading: "Operating it",
        paragraphs: [
          "It runs whether I look at it or not, so the limits are in the database and not in my attention. Three cron jobs: collection and publishing six times a day, four hours apart; a free image-maintenance pass seven minutes after each; and a daily cleanup.",
          "Every run writes one row to a run log: spend, call count, status, and a report that includes per-source health, the thirty top-ranked stories with what happened to each, every skip with its reason, every held draft with the reviewer's issues, and every API failure. A failed run is stored as an error and the endpoint answers 502. A protected endpoint rolls a day of runs into one report, including which runs stopped early and why."
        ],
        items: [
          "Spend is reserved before any paid work, by a Postgres function that takes an advisory lock, so two jobs cannot spend the same balance. Limits are $0.50 per run, $1.50 per day and $40 per month. The daily allowance also paces what is left of the month over the days remaining.",
          "If the reservation call itself fails, the run stops with a 503 before doing anything. If the budget is used up, the run still collects, which is free, and writes no stories. A second collection that starts within six minutes of one still running is turned away.",
          "Before each model call the input is counted with the free token-count endpoint and the maximum output is reserved. After the call the reservation is replaced with the real cost.",
          "Rate-limit and overload responses are retried twice. A request that fails with no clear answer is not retried: the run stops and keeps its full reservation, because it may have been billed.",
          "A run has 280 seconds and at most 25 model calls. It does not start a call it cannot finish. A story the model has already skipped is not sent again until it gains a new article."
        ]
      },
      {
        heading: "Performance",
        paragraphs: [
          "The production pages were slow on a phone. The database is in Mumbai and the serverless functions were running in the US, so each of the several queries a page makes crossed the world twice. The fix was one line of configuration that runs the functions in the Mumbai region, next to the database.",
          "Measured on two preview deployments of the same code that differed only in region, with phone emulation (1.6 Mbps, 150 ms latency, CPU slowed four times), five runs each: median first paint went from 2,160 ms to 1,476 ms. A cold start went from 6,092 ms to 4,052 ms. Without throttling, the time for the server to finish sending the HTML went from 1,480 ms to 822 ms. These are lab numbers, not measurements from real visitors.",
          "Two earlier changes went in before that: the session check verifies the token's signature locally instead of calling the auth server on every page, and the two queries a page needs run together instead of one after the other. On the public site, read queries for published stories are cached for 60 seconds."
        ]
      },
      {
        heading: "Results",
        items: [
          "Unneeded items went from 21 of 53 in the first version to 0 of 11 after the consequence rules. Both counts were judged by hand, and the second is a single run.",
          "Collection is fast and free: one live ingest received 685 items from 70 source reports, kept 627 after de-duplication, and took 13.1 seconds with no source failing.",
          "One measured production run made 10 model calls, published two stories and held one, and cost $0.19.",
          "The two main offline regression suites hold 64 cases covering ranking, grouping, the draft-and-review loop, the per-call budget reservation and the corrections. None of them calls a paid API.",
          "What I have not measured: how many important stories the collector misses on an average day. The audits I ran mostly compare against Techmeme and Hacker News, which are also inputs, so they cannot show what all three missed."
        ]
      },
      {
        heading: "Why it matters",
        paragraphs: [
          "This is the difference between building something and running something. It publishes on a schedule, costs real money per issue, and has to be correct without me watching. The parts I would show another engineer are not the model calls. They are the reservation function, the run log, and the list of rules that each exist because a specific story came out wrong."
        ]
      }
    ],
    images: [
      {
        src: "/images/work/signal-desktop.png",
        alt: "SIGNAL, the day's issue on desktop",
        width: 2880,
        height: 1800
      }
    ]
  },
  {
    slug: "instagram-personal-brand",
    name: "Instagram @imshogo.k",
    title: "Personal Brand — 0 to 30,000 Followers",
    summary:
      "A personal brand built from zero, a measurement system for its reach, and a 13-month analysis that had to be thrown away once before it was right.",
    role: "Founder, creator, analyst.",
    stack: [
      "Next.js",
      "TypeScript",
      "Supabase (Postgres)",
      "Instagram API (Meta Graph v25.0)",
      "Vercel Cron",
      "Vitest",
    ],
    links: [
      { label: "Instagram", href: "https://www.instagram.com/imshogo.k/" },
    ],
    metrics: [
      { value: "30k", label: "followers, built from zero" },
      { value: "1M+", label: "views on multiple videos" },
      { value: "13 mo", label: "of account data analyzed" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "I built a personal brand in the motivation, fitness, and self-growth space from zero. Multiple videos passed 1M views. By the summer of 2026 an ordinary reel was reaching fewer people than it had a year earlier, when the account was about a tenth of the size.",
          "The Instagram app shows insights per post but keeps no history, and the official API returns only the current cumulative value of each metric. There was no way to ask how a reel had grown, or to compare this month with last year on equal terms.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "A private analytics dashboard for one account. It signs in through Meta's official Instagram login, reads media and insights from the Graph API on an hourly cron, and stores every reading as a timestamped snapshot in Postgres. It uses the official API only: no scraping, no password login.",
          "On top of the snapshots: a reel list and detail page with growth over time, manual tags with a top-against-bottom comparison, weekly and monthly trends, and a read-only JSON report of aggregates so the question \"how is it going\" does not need hand-written SQL.",
        ],
      },
      {
        heading: "How it works",
        items: [
          "Every reel is measured at the same eight ages: 1 hour, 6 hours, 24 hours, 72 hours, 7 days, 30 days, 90 days, and a final reading after six months. Each age is a window, not a moment, because the cron is hourly and a run can be cut short.",
          "A reel is due when it sits inside a window it has no reading for. That bounds the lifetime cost at nine API requests per reel, and a test that walks two years of hourly runs pins it.",
          "When the request budget cuts a run short, targets are ordered by how soon their window closes. A one-hour reading exists for three hours; a final reading can wait.",
          "Comparisons across time read from a database view that returns, per reel, the reading closest to day seven, and leaves out any reel that has none in the 4 to 14 day band.",
          "The monthly rollup carries the age each month was read at and a mature flag (27 days or older). An unfinished month is reported but labelled.",
          "The follower count is written down on every sync, and reach split by follower and non-follower is stored once a day. The API has no history endpoint for the follower count.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "The first analysis was wrong. The sync had read the back catalogue once, 27 to 358 days after posting, and new reels only in their first eight days. Comparing those directly showed a 300-times collapse that was mostly the difference between months of accumulation and four days. I found it when a growth-curve query returned zero rows.",
          "I rebuilt the measurement before redoing the analysis, re-read every reel on the same day, and measured the growth curve: 3.19 times between day 1.3 and day 21.3, 1.01 times between day 26.9 and day 56.4. A reel on this account is finished after about 27 days.",
          "Rates misled where counts did not. The share rate hit a twelve-month high in June 2026 because reach had fallen, not because shares had risen. I track absolute shares per reel.",
          "A hypothesis built from the winners (reels that mention the season do well) died when I looked at the same kind of reel among the losers.",
          "Two reels with nearly the same caption reached 2,240 and 26,077. The variables that decide a reel are in the video, and they are not in the database.",
        ],
      },
      {
        heading: "Operating it",
        items: [
          "Three fixed request caps, enforced before the first call of a run: 100 per run, 150 per hour, 1,000 per day. They sit below Meta's allowance on purpose and do not scale with it.",
          "Server errors are retried twice with exponential backoff and jitter. A rate-limit response stops the run with no retry.",
          "For a month the sync reported success while measuring nothing. Runs now record how many reels were due and how many came back empty, and an empty answer downgrades the run to partial.",
          "Media that Meta will never answer for were re-asked every hour: 360 requests a day in one case, 168 in another. A failed attempt is now stored as the reading for any window open longer than a day.",
          "The report endpoint has its own bearer token, separate from the one that triggers syncs, and returns no caption, permalink or media ID.",
          "The repository has 91 unit tests across 10 files, covering the milestone planner, the request budget, the rollups and the tag analysis.",
        ],
      },
      {
        heading: "Results",
        paragraphs: [
          "On comparable data, three things held. Follower count did not raise the floor: with about 3,000 followers in August 2025 an ordinary reel reached 3,397 people, and with about 28,600 in July 2026 it reached 1,694 (checked August 25, 2026). Across 20 reels all read at 0 to 5 days old, share count correlated with reach at r = 0.57 and watch time at r = 0.25. And in weekly cohorts read at day five, shares per reel rose two weeks before median reach did in August and September 2026.",
          "So I read absolute shares per reel first, reach second, and followers as a running total. The same lesson shaped my second account, @copilot_shogo, where posts are now recorded at day one and day seven.",
        ],
      },
      {
        heading: "Limits",
        paragraphs: [
          "This is one account, observed, with no control group. The correlation is from 20 reels between 0 and 5 days old, not at one fixed age. The two September jumps (2025 and 2026) both coincided with reels announcing the same seasonal challenge, which could have moved shares and reach together. Shares per reel is a mean and reach is a median, and I have not yet checked whether the lead survives when both are medians. I describe shares as the best early signal I have on this account, not as a law.",
        ],
      },
      {
        heading: "Why this is on a developer's portfolio",
        paragraphs: [
          "Most developers can build a product but can't get anyone to see it.",
          "Most creators can get attention but can't build anything.",
          "I do both, and I measure both.",
        ],
      },
    ],
    images: [],
  },
];

// Moved off /work on 2026-09-22 (7-slot rule). Kept here so nothing is lost:
// each still needs a Blog post before it is surfaced again.
export const archivedProjects: Project[] = [
  {
    slug: "tetty-preset-store",
    name: "Tetty Preset Store",
    title: "Preset Store with Stripe Checkout",
    summary:
      "A storefront where the studio sells its own cinematic photo presets, with Stripe checkout.",
    role: "Sole developer. Design, build, deploy, and operate.",
    stack: ["Next.js", "TypeScript", "Supabase", "Stripe", "Vercel"],
    links: [
      { label: "Live site", href: "https://www.tettyphotostudiolut.com/" },
    ],
    metrics: [
      { value: "Live", label: "storefront in production" },
      { value: "Stripe", label: "checkout for a digital product" },
      { value: "Solo", label: "designed, built, and shipped alone" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "The studio had a second thing to sell besides shoots: the presets behind its own look. Selling a digital product needs its own storefront, checkout, and delivery — none of which the booking platform covers.",
        ],
      },
      {
        heading: "What I built",
        items: [
          "Storefront with preset collections and product pages",
          "Cart and Stripe checkout",
          "Supabase for the product catalogue",
          "Deployed on Vercel and operated after launch",
        ],
      },
      {
        heading: "Results",
        items: [
          "In production and selling presets at tettyphotostudiolut.com",
          "A second revenue line for the studio, separate from bookings",
        ],
      },
    ],
    images: [
      {
        src: "/images/work/preset-store-desktop.png",
        alt: "Tetty Preset Store, desktop home page",
        width: 2880,
        height: 1800,
      },
      {
        src: "/images/work/preset-store-mobile.png",
        alt: "Tetty Preset Store on a phone",
        width: 1170,
        height: 2532,
      },
    ],
  },
  {
    slug: "automated-content-pipeline",
    name: "Automated Content Pipeline",
    title: "Fully Automated Short-Form Video Pipeline",
    summary:
      "A nightly job that analyses raw shoot footage, picks what to use, and renders 10 finished short videos for a Tokyo photo studio with no human input.",
    role: "Sole developer. Design, build and operate.",
    stack: [
      "Python",
      "FFmpeg",
      "Swift (Apple Vision)",
      "Claude Code CLI",
      "launchd",
      "Blotato API",
    ],
    links: [
      {
        label: "Output on Instagram",
        href: "https://www.instagram.com/tettyphotostudio/",
      },
      { label: "How it works", href: "/blog/ten-videos-before-i-wake-up" },
      { label: "What broke", href: "/blog/ten-videos-every-morning" },
    ],
    metrics: [
      { value: "10", label: "videos rendered every night, unattended" },
      { value: "1.14M", label: "views on the account in 30 days" },
    ],
    sections: [
      {
        heading: "Problem",
        paragraphs: [
          "Producing short-form content consistently requires selecting clips, writing captions, and publishing across platforms — every single day. That work does not scale with a two-person company.",
          "The two obvious shortcuts do not work. Picking footage at random mostly produces weak videos and repeats the same faces. Asking a language model to do the edit fails because a model sees still frames, and the important decision, where to cut, is about timing.",
        ],
      },
      {
        heading: "What I built",
        paragraphs: [
          "I edited the videos by hand first, measured the cut points of the finished ones, and fixed them as a template: three behind-the-scenes clips, then five retouched photos, eight shots in 10.43 seconds. The pipeline fills that template every night:",
        ],
        items: [
          "Selects source footage with a weighted lottery that remembers what it has used",
          "Cuts each clip around the moment the flash fires",
          "Chooses on-screen text from a tested bank and generates a caption per video",
          "Renders 10 short-form videos, verifies each file, and writes a report of why each clip was chosen",
          "Schedules the best three to TikTok through a posting API",
        ],
      },
      {
        heading: "How it works",
        items: [
          "Schedule: launchd on a Mac starts a shell script at 00:00. The Mac mounts the studio's shared Google Drive, which holds the source material and receives the output. There is no server.",
          "Flash detection: FFmpeg reports the average brightness of every frame. A frame more than 18 levels brighter than the median of its four neighbours is a flash. The candidate segment is placed so the flash lands 65% of the way through.",
          "People and faces: a 28-line Swift tool calls Apple's Vision framework on one frame per candidate segment. Face area, face count and person count go into the segment's score. Blurry segments are penalised using FFmpeg's blur detector.",
          "Model scoring: each new clip's frame is scored once by Claude (Tokyo backdrop, visible happy client, camera in shot), ten frames per call. The result is cached with the analysis, and a clip that has scores is not sent again. If the call fails, the run continues on machine scores.",
          "Selection: clips and photos are drawn without replacement. Quality raises the weight (a flash multiplies it by 3); each past use lowers it; a clip among the 12 most recently used files is multiplied by 0.05.",
          "No near-duplicates: a draw that shares two or more clips, or three or more photos, with any of the last 300 videos is redrawn, up to 30 times. A reused clip uses a different flash moment. A photo or clip appears in at most one of any six consecutive TikTok posts.",
          "Text: on-screen lines come from a bank grouped by sentence pattern. A pattern is not reused within two videos, and the least recently used line wins.",
          "Output: one FFmpeg filter graph per video produces a silent 1080×1920 H.264 file, plus a contact sheet, a caption file and a job file that records every input so the video can be re-rendered.",
        ],
      },
      {
        heading: "Hard parts",
        items: [
          "Deciding what the model should not do. It scores frames. It does not choose cut points and it does not write the on-screen text.",
          "Variety without lowering quality. Ranking gives the same video every night; pure randomness gives bad ones. The answer is weights plus an explicit overlap check against history.",
          "Text that stays true. Each video mixes different customers, so lines that imply a single session are false. Unit tests reject prices, availability and award claims, other accounts' handles, and wording the footage does not support.",
          "Cloud-backed files. A file listed in the Drive folder may not be on disk and may not be readable at midnight. Files are read fully before use, retried with backoff, and dropped from that night's pool if they still fail.",
        ],
      },
      {
        heading: "Operating it",
        items: [
          "Renders go to local disk, are checked by decoding the last second, are copied to Drive and checked again. A second pass after the batch rebuilds any broken file from its job file.",
          "Music is added only from tracks with a recorded source and licence. With none available, nothing is posted.",
          "Posting stops when a file named PAUSE exists. At most four posts are scheduled in any 24 hours.",
          "Two nights in October produced no videos because an unreadable Drive file crashed the generator. The fix (retry, typed error, redraw) was committed on October 3.",
          "The results tracker read stale Instagram numbers for three weeks after a token expired. It now prints a warning with the cause when its newest number is more than two days old.",
          "Known gaps: no alerting, and generation depends on one Mac being awake.",
          "74 unit tests cover selection spacing, text rules, music licensing, rotation and posting logic.",
        ],
      },
      {
        heading: "Results",
        items: [
          "10 videos rendered every night, unattended; three scheduled to TikTok automatically",
          "1.14M views, 1,598 new followers and 61.4K interactions on the studio's Instagram in the last 30 days (Sep 2026)",
          "Those are account totals, not a measured effect of the pipeline. The code that would weight footage by seven-day results is written but waits for 30 linked results, and that threshold has not been reached.",
        ],
      },
    ],
    images: [],
  },
];

export function getProject(slug: string) {
  return projects.find((project) => project.slug === slug);
}
