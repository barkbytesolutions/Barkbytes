// Everything the chatbot knows about BarkBytes, built from the same content
// file the landing page renders, so the bot and the page can't drift apart.
// Wrangler bundles this TypeScript import at deploy time.
import {
  bundle,
  heroPoints,
  integrations,
  projects,
  services,
  site,
  steps,
  team,
  trustPoints,
} from "../../src/data/content.ts";

export const KNOWLEDGE = `
# ${site.name} (${site.legalName})

Based in ${site.location}. A small team that builds automation, bots, booking systems, and web apps for Filipino small businesses.
Promises: ${heroPoints.join("; ")}.
Tools we connect: ${integrations.join(", ")}.

## Services
${services
  .map(
    (s) => `### ${s.title}
${s.description}
Good for: ${s.goodFor}.
Price: ${s.price}. (${s.badge})`,
  )
  .join("\n\n")}

### ${bundle.title.replace(/\.$/, "")} (${bundle.eyebrow.toLowerCase()})
${bundle.description}

## Past work
${projects
  .map(
    (p) => `### ${p.title}
Client: ${p.client}.
${p.description}
Features: ${p.tags.join(", ")}.
Result: ${p.result}`,
  )
  .join("\n\n")}

## How we work
${steps.map((s, i) => `${i + 1}. ${s.title}: ${s.body}`).join("\n")}

## Trust
${trustPoints.map((t) => `- ${t.title}: ${t.body}`).join("\n")}

## Team
${team.map((m) => `- ${m.name}: ${m.role}`).join("\n")}

## Contact
The best way to reach the team is the enquiry form in the "Contact" section of this page.
Email: ${site.email}
`;
