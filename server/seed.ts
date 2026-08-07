// GENERATED FILE — do not edit by hand. Run `npm run seed:build` to refresh.
//
// Every number in here is real output from server/analyzer against the live
// page, captured 2026-08-07. No values are estimated or illustrative.
// These are the sample audits a fresh remix boots into, so the app is never
// an empty state on first run.
//
// Scores reflect this template's own rubric and nothing else. They are not a
// judgement of the companies involved, whose pages are public and were fetched
// exactly as any browser would fetch them.
import type { AuditResult } from "../shared/schema";

export type SeedAudit = {
  id: string;
  shareToken: string;
  url: string;
  finalUrl: string;
  pageTitle: string | null;
  createdAt: string;
  result: AuditResult;
};

export const SEED_AUDITS: SeedAudit[] = [
  {
    "id": "sample-basecamp",
    "shareToken": "smpl_basecamp_2f4a9c1b7e",
    "url": "https://basecamp.com",
    "finalUrl": "https://basecamp.com/",
    "pageTitle": "Basecamp",
    "createdAt": "2026-08-06T09:00:00.000Z",
    "result": {
      "score": 78,
      "grade": "C",
      "categories": [
        {
          "key": "clarity",
          "score": 91,
          "weight": 22,
          "issueCount": 1
        },
        {
          "key": "offer",
          "score": 53,
          "weight": 18,
          "issueCount": 3
        },
        {
          "key": "proof",
          "score": 88,
          "weight": 18,
          "issueCount": 1
        },
        {
          "key": "friction",
          "score": 80,
          "weight": 16,
          "issueCount": 2
        },
        {
          "key": "action",
          "score": 71,
          "weight": 16,
          "issueCount": 2
        },
        {
          "key": "craft",
          "score": 89,
          "weight": 10,
          "issueCount": 1
        }
      ],
      "issues": [
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "critical",
          "title": "Nothing removes the risk of saying yes",
          "why": "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
          "fix": "Add one explicit risk reverser near the primary CTA. \"Cancel anytime\", \"no card required\", and \"30-day refund\" all work.",
          "penalty": 26
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "critical",
          "title": "No CTA in the opening section",
          "why": "Visitors who are already sold have nothing to click without scrolling. Making a ready buyer hunt for the button is the cheapest conversion loss on any page.",
          "fix": "Place the primary CTA directly under the headline, then repeat it after each proof section.",
          "penalty": 20
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "warning",
          "title": "Proof is present but not quantified",
          "why": "\"Loved by customers\" is a claim. \"4.8 out of 5 across 1,240 reviews\" is evidence. Only the second one survives a sceptical read.",
          "fix": "Put a real count or rating next to the proof section header.",
          "penalty": 12
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "warning",
          "title": "Opening describes features, not outcomes",
          "why": "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
          "fix": "Rewrite the opening so each feature is followed by the result it produces.",
          "penalty": 11
        },
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "warning",
          "title": "12 navigation links compete with the CTA",
          "why": "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
          "fix": "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
          "penalty": 11
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "warning",
          "title": "12 of 18 images have no alt text",
          "why": "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
          "fix": "Describe what the image communicates. Decorative images take alt=\"\" so they get skipped deliberately.",
          "penalty": 11
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "warning",
          "title": "The offer is described without numbers",
          "why": "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
          "fix": "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
          "penalty": 10
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "warning",
          "title": "Opening does not say who this is for",
          "why": "When a page tries to speak to everyone, no single visitor recognises themselves in it. Naming the audience raises relevance for the right people and filters out the wrong ones.",
          "fix": "Add a qualifier near the headline. \"For agencies billing over $20k a month\" beats \"for teams of all sizes\".",
          "penalty": 9
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "warning",
          "title": "Page talks about itself 86% of the time",
          "why": "Counting first and second person pronouns is a fast read on whose problem the page is about. When \"we\" dominates, the copy is a company introduction rather than an argument for the visitor.",
          "fix": "Rewrite the heaviest \"we\" sentences to start with \"you\". The facts stay, the subject changes.",
          "evidence": "you/your vs we/our ratio is 0.14",
          "penalty": 9
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "warning",
          "title": "Long page with only 1 CTA placement",
          "why": "Readers reach the decision point at different scroll depths. A single button means everyone has to scroll back to the one place it lives.",
          "fix": "Repeat the same primary CTA after the proof section and again at the end.",
          "penalty": 9
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "The refreshingly straightforward project management system that’s rock-solid and easy to use.",
          "penalty": 0
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "pass",
          "title": "H1 is 12 words, a readable length",
          "why": "",
          "fix": "",
          "evidence": "The refreshingly straightforward project management system that’s rock-solid and easy to use.",
          "penalty": 0
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "pass",
          "title": "Title tag is 8 characters",
          "why": "",
          "fix": "",
          "evidence": "Basecamp",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "Trusted by millions, Basecamp puts everything you need to get work done in one place. It’s the calm, organized way to manage projects, work with clients, and communicate company-wide.",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "pass",
          "title": "Testimonial or quote blocks found",
          "why": "",
          "fix": "",
          "evidence": "12 testimonial or quote block(s): \" Simply put, we get more work done, quicker, and better. Productivity is up. Errors are down. Clients are happier. Patrick Sh",
          "penalty": 0
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "pass",
          "title": "Third-party validation referenced",
          "why": "",
          "fix": "",
          "evidence": "book Basecamp ™ is designed, built, and backed by 37signals ™ , the people behind HEY ™ and Fizzy ™ Status Su",
          "penalty": 0
        },
        {
          "id": "form-length",
          "category": "friction",
          "severity": "pass",
          "title": "Form asks for 1 field",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "form-labels",
          "category": "friction",
          "severity": "pass",
          "title": "Every form field is labelled",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "pass",
          "title": "Reading ease 70.2, comfortable for most readers",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "pass",
          "title": "CTA labels are specific",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "pass",
          "title": "Heading hierarchy is sequential",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "pass",
          "title": "HTML document is 53 KB",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "pass",
          "title": "8 script tags, 0 external hosts",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Basecamp",
        "metaDescription": "Trusted by millions, Basecamp puts everything you need to get work done in one place. It’s the calm, organized way to manage projects, work with clients, and communicate company-wide.",
        "h1": [
          "The refreshingly straightforward project management system that’s rock-solid and easy to use."
        ],
        "headings": [
          {
            "level": 1,
            "text": "The refreshingly straightforward project management system that’s rock-solid and easy to use."
          },
          {
            "level": 2,
            "text": "Tell me if this sounds about right."
          },
          {
            "level": 2,
            "text": "Big numbers. Highly-trusted. Rugged, reliable, and ready."
          },
          {
            "level": 2,
            "text": "Remember when companies cared about service? We still do."
          },
          {
            "level": 2,
            "text": "All these questions have the same answer: Yes!"
          },
          {
            "level": 2,
            "text": "Join us for a free live class."
          },
          {
            "level": 2,
            "text": "And there’s more…"
          }
        ],
        "ctas": [
          {
            "text": "Try Basecamp free",
            "kind": "link",
            "href": "/pricing"
          }
        ],
        "formFields": [
          {
            "name": "checkbox",
            "type": "checkbox",
            "labelled": true
          }
        ],
        "proofSignals": [
          {
            "kind": "testimonial",
            "evidence": "12 testimonial or quote block(s): \" Simply put, we get more work done, quicker, and better. Productivity is up. Errors are down. Clients are happier. Patrick Sh"
          },
          {
            "kind": "rating",
            "evidence": "Rating markup or star glyphs present (1 node(s))"
          },
          {
            "kind": "authority",
            "evidence": "book Basecamp ™ is designed, built, and backed by 37signals ™ , the people behind HEY ™ and Fizzy ™ Status Su"
          }
        ],
        "navLinks": 12,
        "images": {
          "total": 18,
          "missingAlt": 12
        }
      },
      "metrics": {
        "wordCount": 1134,
        "proseSentences": 120,
        "avgSentenceWords": 8.5,
        "readingEase": 70.2,
        "youRatio": 0.14,
        "htmlBytes": 53932,
        "scriptCount": 8,
        "externalHosts": 0,
        "fetchMs": 424,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  },
  {
    "id": "sample-linear",
    "shareToken": "smpl_linear_9b1c7d5e3a",
    "url": "https://linear.app",
    "finalUrl": "https://linear.app/",
    "pageTitle": "Linear – The system for product development",
    "createdAt": "2026-08-06T10:00:00.000Z",
    "result": {
      "score": 84,
      "grade": "B",
      "categories": [
        {
          "key": "clarity",
          "score": 100,
          "weight": 22,
          "issueCount": 0
        },
        {
          "key": "offer",
          "score": 74,
          "weight": 18,
          "issueCount": 1
        },
        {
          "key": "proof",
          "score": 88,
          "weight": 18,
          "issueCount": 1
        },
        {
          "key": "friction",
          "score": 70,
          "weight": 16,
          "issueCount": 3
        },
        {
          "key": "action",
          "score": 100,
          "weight": 16,
          "issueCount": 0
        },
        {
          "key": "craft",
          "score": 55,
          "weight": 10,
          "issueCount": 4
        }
      ],
      "issues": [
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "critical",
          "title": "Nothing removes the risk of saying yes",
          "why": "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
          "fix": "Add one explicit risk reverser near the primary CTA. \"Cancel anytime\", \"no card required\", and \"30-day refund\" all work.",
          "penalty": 26
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "critical",
          "title": "HTML document is 1236 KB before any assets load",
          "why": "The document has to arrive and parse before anything renders. On a mid-range phone over mobile data, this is measured in seconds of blank screen.",
          "fix": "Move inlined data and styles into cached files, and render below-fold sections on demand.",
          "penalty": 16
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "critical",
          "title": "215 script tags across 3 external hosts",
          "why": "Every third-party host adds a DNS lookup and a TLS handshake before its script even starts. Tag stacks are the usual reason a well-built page still feels slow.",
          "fix": "Audit what each tag is for, drop the ones nobody reads, and defer the rest.",
          "penalty": 14
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "warning",
          "title": "Proof is present but not quantified",
          "why": "\"Loved by customers\" is a claim. \"4.8 out of 5 across 1,240 reviews\" is evidence. Only the second one survives a sceptical read.",
          "fix": "Put a real count or rating next to the proof section header.",
          "penalty": 12
        },
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "warning",
          "title": "9 navigation links compete with the CTA",
          "why": "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
          "fix": "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
          "penalty": 11
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "warning",
          "title": "Reading ease scores 51.2 out of 100",
          "why": "Dense prose slows skimming, and visitors skim before they read. Copy that needs concentration gets skipped, not decoded.",
          "fix": "Shorten sentences, swap abstract nouns for verbs, and cut clauses that qualify rather than persuade.",
          "evidence": "Average sentence runs 9.8 words",
          "penalty": 10
        },
        {
          "id": "form-labels",
          "category": "friction",
          "severity": "warning",
          "title": "1 form field without a label",
          "why": "Placeholder-only fields vanish the moment someone starts typing, so people lose track of what they are filling in and screen readers announce nothing.",
          "fix": "Add a visible <label> tied to each input with for/id.",
          "evidence": "Tell Linear what to do next…",
          "penalty": 9
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "warning",
          "title": "17 of 31 images have no alt text",
          "why": "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
          "fix": "Describe what the image communicates. Decorative images take alt=\"\" so they get skipped deliberately.",
          "penalty": 9
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "warning",
          "title": "Heading levels skip 1 time",
          "why": "Assistive tech builds a document outline from heading order. Jumping from H2 to H4 reads as a missing section.",
          "fix": "Choose heading levels by position in the outline, then style them with CSS.",
          "penalty": 6
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "The product development system for teams and agents",
          "penalty": 0
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "pass",
          "title": "H1 is 8 words, a readable length",
          "why": "",
          "fix": "",
          "evidence": "The product development system for teams and agents",
          "penalty": 0
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "pass",
          "title": "Title tag is 43 characters",
          "why": "",
          "fix": "",
          "evidence": "Linear – The system for product development",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "Purpose-built for planning and building products with AI agents.",
          "penalty": 0
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "pass",
          "title": "Opening names a specific audience",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "pass",
          "title": "2 quantified claims",
          "why": "",
          "fix": "",
          "evidence": "1 day, 3 hours",
          "penalty": 0
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "pass",
          "title": "Opening is written around outcomes",
          "why": "",
          "fix": "",
          "evidence": "faster, launch",
          "penalty": 0
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "pass",
          "title": "Testimonial or quote blocks found",
          "why": "",
          "fix": "",
          "evidence": "6 testimonial or quote block(s): \"kinetic-ios/src/screens/Home/HomeScreen.tsx kinetic-ios/src/HomeScreen.tsx Linear import React from ' react ' import { View , ",
          "penalty": 0
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "pass",
          "title": "Third-party validation referenced",
          "why": "",
          "fix": "",
          "evidence": "streams ENG-2092 Reduce startup delay caused by vehicle sync ENG-2200 Fix delayed route updates during rero",
          "penalty": 0
        },
        {
          "id": "form-length",
          "category": "friction",
          "severity": "pass",
          "title": "Form asks for 3 fields",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "pass",
          "title": "Reader-focused language at 61%",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "pass",
          "title": "A CTA appears in the opening section",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "pass",
          "title": "CTA labels are specific",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "pass",
          "title": "CTA appears in 3 places down the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Linear – The system for product development",
        "metaDescription": "Purpose-built for planning and building products with AI agents.",
        "h1": [
          "The product development system for teams and agents"
        ],
        "headings": [
          {
            "level": 1,
            "text": "The product development system for teams and agents"
          },
          {
            "level": 3,
            "text": "Faster app launch"
          },
          {
            "level": 4,
            "text": "Activity"
          },
          {
            "level": 2,
            "text": "A new species of product tool. Purpose-built for modern teams with AI workflows at its core, Linear sets a new standard for planning and building products."
          },
          {
            "level": 2,
            "text": "Make product operations self-driving"
          },
          {
            "level": 2,
            "text": "Define the product direction"
          },
          {
            "level": 2,
            "text": "Move work forward across teams and agents"
          },
          {
            "level": 2,
            "text": "Review PRs and agent output"
          },
          {
            "level": 2,
            "text": "Understand progress at scale"
          },
          {
            "level": 2,
            "text": "Changelog"
          },
          {
            "level": 2,
            "text": "Built for the future. Available today."
          },
          {
            "level": 3,
            "text": "Product"
          },
          {
            "level": 3,
            "text": "Features"
          },
          {
            "level": 3,
            "text": "Company"
          },
          {
            "level": 3,
            "text": "Resources"
          },
          {
            "level": 3,
            "text": "Connect"
          },
          {
            "level": 3,
            "text": "Legal"
          }
        ],
        "ctas": [
          {
            "text": "Get started",
            "kind": "link",
            "href": "/signup"
          },
          {
            "text": "Contact sales",
            "kind": "link",
            "href": "/contact/sales"
          },
          {
            "text": "Open app",
            "kind": "link",
            "href": "/login"
          }
        ],
        "formFields": [
          {
            "name": "Tell Linear what to do next…",
            "type": "textarea",
            "labelled": false
          },
          {
            "name": "Assign to…",
            "type": "text",
            "labelled": true
          },
          {
            "name": "textarea",
            "type": "textarea",
            "labelled": true
          }
        ],
        "proofSignals": [
          {
            "kind": "testimonial",
            "evidence": "6 testimonial or quote block(s): \"kinetic-ios/src/screens/Home/HomeScreen.tsx kinetic-ios/src/HomeScreen.tsx Linear import React from ' react ' import { View , "
          },
          {
            "kind": "rating",
            "evidence": "Rating markup or star glyphs present (3 node(s))"
          },
          {
            "kind": "authority",
            "evidence": "streams ENG-2092 Reduce startup delay caused by vehicle sync ENG-2200 Fix delayed route updates during rero"
          }
        ],
        "navLinks": 9,
        "images": {
          "total": 31,
          "missingAlt": 17
        }
      },
      "metrics": {
        "wordCount": 1251,
        "proseSentences": 101,
        "avgSentenceWords": 9.8,
        "readingEase": 51.2,
        "youRatio": 0.61,
        "htmlBytes": 1266001,
        "scriptCount": 215,
        "externalHosts": 3,
        "fetchMs": 736,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  },
  {
    "id": "sample-stripe",
    "shareToken": "smpl_stripe_1a7d4b9e2f",
    "url": "https://www.stripe.com",
    "finalUrl": "https://stripe.com/in",
    "pageTitle": "Stripe | Financial Infrastructure to Grow Your Revenue",
    "createdAt": "2026-08-06T11:00:00.000Z",
    "result": {
      "score": 78,
      "grade": "C",
      "categories": [
        {
          "key": "clarity",
          "score": 92,
          "weight": 22,
          "issueCount": 1
        },
        {
          "key": "offer",
          "score": 53,
          "weight": 18,
          "issueCount": 3
        },
        {
          "key": "proof",
          "score": 100,
          "weight": 18,
          "issueCount": 0
        },
        {
          "key": "friction",
          "score": 79,
          "weight": 16,
          "issueCount": 2
        },
        {
          "key": "action",
          "score": 70,
          "weight": 16,
          "issueCount": 2
        },
        {
          "key": "craft",
          "score": 64,
          "weight": 10,
          "issueCount": 3
        }
      ],
      "issues": [
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "critical",
          "title": "Nothing removes the risk of saying yes",
          "why": "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
          "fix": "Add one explicit risk reverser near the primary CTA. \"Cancel anytime\", \"no card required\", and \"30-day refund\" all work.",
          "penalty": 26
        },
        {
          "id": "cta-competing",
          "category": "action",
          "severity": "critical",
          "title": "23 different actions on one page",
          "why": "Each additional choice adds a decision the visitor did not come here to make. Pages with one job convert better than pages offering a menu.",
          "fix": "Pick one primary action and repeat it. Demote everything else to a text link.",
          "evidence": "\"create a card issuing programme\", \"request an invite\", \"watch now\", \"stripe for enterprises\", \"read the story\", \"stripe for startups\", \"stripe for platforms\", \"view developer docs\"",
          "penalty": 18
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "critical",
          "title": "77 script tags across 5 external hosts",
          "why": "Every third-party host adds a DNS lookup and a TLS handshake before its script even starts. Tag stacks are the usual reason a well-built page still feels slow.",
          "fix": "Audit what each tag is for, drop the ones nobody reads, and defer the rest.",
          "penalty": 14
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "warning",
          "title": "26 of 30 images have no alt text",
          "why": "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
          "fix": "Describe what the image communicates. Decorative images take alt=\"\" so they get skipped deliberately.",
          "penalty": 14
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "warning",
          "title": "1 CTA use generic wording",
          "why": "Generic labels make the visitor guess what happens next. Uncertainty at the moment of clicking is exactly where hesitation costs conversions.",
          "fix": "Name the outcome instead. \"Get my free audit\" outperforms \"Submit\" because it says what arrives.",
          "evidence": "\"Read more\"",
          "penalty": 12
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "warning",
          "title": "Opening describes features, not outcomes",
          "why": "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
          "fix": "Rewrite the opening so each feature is followed by the result it produces.",
          "penalty": 11
        },
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "warning",
          "title": "10 navigation links compete with the CTA",
          "why": "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
          "fix": "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
          "penalty": 11
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "warning",
          "title": "The offer is described without numbers",
          "why": "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
          "fix": "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
          "penalty": 10
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "warning",
          "title": "Reading ease scores 43.1 out of 100",
          "why": "Dense prose slows skimming, and visitors skim before they read. Copy that needs concentration gets skipped, not decoded.",
          "fix": "Shorten sentences, swap abstract nouns for verbs, and cut clauses that qualify rather than persuade.",
          "evidence": "Average sentence runs 11.1 words",
          "penalty": 10
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "warning",
          "title": "H1 runs to 24 words",
          "why": "Long headlines get skimmed rather than read. The promise ends up buried in the second half, which most visitors never reach.",
          "fix": "Cut to under 14 words and move the qualifier into a subhead.",
          "evidence": "Financial infrastructure to grow your revenue. Accept payments, offer financial services and implement custom revenue models – from your first transaction to your billionth.",
          "penalty": 8
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "warning",
          "title": "HTML document is 665 KB before any assets load",
          "why": "The document has to arrive and parse before anything renders. On a mid-range phone over mobile data, this is measured in seconds of blank screen.",
          "fix": "Move inlined data and styles into cached files, and render below-fold sections on demand.",
          "penalty": 8
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "Financial infrastructure to grow your revenue. Accept payments, offer financial services and implement custom revenue models – from your first transaction to your billionth.",
          "penalty": 0
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "pass",
          "title": "Title tag is 54 characters",
          "why": "",
          "fix": "",
          "evidence": "Stripe | Financial Infrastructure to Grow Your Revenue",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "Stripe is a financial services platform that helps all types of businesses accept payments, build flexible billing models and manage money movement.",
          "penalty": 0
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "pass",
          "title": "Opening names a specific audience",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "pass",
          "title": "Testimonial or quote blocks found",
          "why": "",
          "fix": "",
          "evidence": "28 testimonial or quote block(s): \" With Stripe, we have a global technology partner to help our customers – from Canadian yoga studios to British boxing classe",
          "penalty": 0
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "pass",
          "title": "Quantified proof present",
          "why": "",
          "fix": "",
          "evidence": "150K+ users",
          "penalty": 0
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "pass",
          "title": "Third-party validation referenced",
          "why": "",
          "fix": "",
          "evidence": "Mentions forbes",
          "penalty": 0
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "pass",
          "title": "Reader-focused language at 59%",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "pass",
          "title": "A CTA appears in the opening section",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "pass",
          "title": "CTA appears in 32 places down the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "pass",
          "title": "Heading hierarchy is sequential",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Stripe | Financial Infrastructure to Grow Your Revenue",
        "metaDescription": "Stripe is a financial services platform that helps all types of businesses accept payments, build flexible billing models and manage money movement.",
        "h1": [
          "Financial infrastructure to grow your revenue. Accept payments, offer financial services and implement custom revenue models – from your first transaction to your billionth."
        ],
        "headings": [
          {
            "level": 1,
            "text": "Financial infrastructure to grow your revenue. Accept payments, offer financial services and implement custom revenue models – from your first transaction to your billionth."
          },
          {
            "level": 2,
            "text": "Flexible solutions for every business model."
          },
          {
            "level": 3,
            "text": "Accept and optimise payments globally – online and in person"
          },
          {
            "level": 3,
            "text": "Enable any billing model"
          },
          {
            "level": 3,
            "text": "Monetise through agentic commerce"
          },
          {
            "level": 3,
            "text": "Create a card issuing programme"
          },
          {
            "level": 3,
            "text": "Access borderless money movement with stablecoins and crypto"
          },
          {
            "level": 3,
            "text": "Embed payments in your platform"
          },
          {
            "level": 2,
            "text": "The backbone of global commerce"
          },
          {
            "level": 2,
            "text": "Powering businesses of all sizes."
          },
          {
            "level": 3,
            "text": "Transform your enterprise with agile financial infrastructure"
          },
          {
            "level": 3,
            "text": "Hertz unifies commerce with Stripe."
          },
          {
            "level": 3,
            "text": "URBN consolidates $5 billion in online and in-store revenue onto Stripe."
          },
          {
            "level": 3,
            "text": "Instacart powers online grocery delivery with Stripe."
          },
          {
            "level": 3,
            "text": "Le Monde improves local and international payments with Stripe."
          },
          {
            "level": 4,
            "text": "Professional services."
          },
          {
            "level": 4,
            "text": "Stripe-certified experts."
          },
          {
            "level": 4,
            "text": "Support plans."
          },
          {
            "level": 3,
            "text": "Build a foundation for your startup that enables faster growth"
          },
          {
            "level": 4,
            "text": "Lovable grows into a vibe-coding juggernaut with Stripe."
          },
          {
            "level": 4,
            "text": "Gamma expands to US$100m ARR and 70 million users with Stripe."
          },
          {
            "level": 4,
            "text": "Runway protects developer time with no-code solutions from Stripe."
          },
          {
            "level": 4,
            "text": "Supabase delivers its backend-as-a-service to 150 countries with Stripe."
          },
          {
            "level": 4,
            "text": "Linear partners with Stripe to handle billing and payments."
          },
          {
            "level": 4,
            "text": "ElevenLabs grows into a US$3bn AI audio leader with Stripe."
          },
          {
            "level": 4,
            "text": "Browserbase offers usage-based billing for an AI agent browser with Stripe."
          },
          {
            "level": 4,
            "text": "Decagon decreases support costs by 65% with Stripe-integrated agents."
          },
          {
            "level": 4,
            "text": "Stripe Startups programme."
          },
          {
            "level": 4,
            "text": "Stripe Atlas."
          },
          {
            "level": 3,
            "text": "Make your SaaS platform a complete financial operating system"
          },
          {
            "level": 4,
            "text": "Get to market faster."
          },
          {
            "level": 4,
            "text": "Grow new lines of revenue."
          },
          {
            "level": 4,
            "text": "Manage platform risk."
          },
          {
            "level": 2,
            "text": "Reliable, extensible infrastructure for every stack."
          },
          {
            "level": 3,
            "text": "Connect to existing systems."
          },
          {
            "level": 3,
            "text": "Scale with confidence."
          },
          {
            "level": 4,
            "text": "500M+"
          },
          {
            "level": 4,
            "text": "10K+"
          },
          {
            "level": 4,
            "text": "150K+"
          },
          {
            "level": 3,
            "text": "Choose an integration path."
          },
          {
            "level": 4,
            "text": "Don't code?"
          },
          {
            "level": 4,
            "text": "Use a pre-integrated platform."
          },
          {
            "level": 4,
            "text": "Build your own integration."
          },
          {
            "level": 2,
            "text": "What's happening"
          },
          {
            "level": 3,
            "text": "Businesses on Stripe generated US$1.9tn in 2025."
          },
          {
            "level": 3,
            "text": "Book of the week"
          },
          {
            "level": 4,
            "text": "See what you'll pay"
          },
          {
            "level": 4,
            "text": "Start building"
          }
        ],
        "ctas": [
          {
            "text": "Create a card issuing programme",
            "kind": "button",
            "href": null
          },
          {
            "text": "Request an invite",
            "kind": "link",
            "href": "/in/contact/sales"
          },
          {
            "text": "Watch now",
            "kind": "link",
            "href": "https://stripe.com/sessions/2026?utm_medium=owned-surfaces&utm_source=9cb9&utm_campaign=GLOBAL_4301&utm_content=8a70&utm_term=5a728d3d167c"
          },
          {
            "text": "Stripe for enterprises",
            "kind": "link",
            "href": "/in/enterprise"
          },
          {
            "text": "Read the story",
            "kind": "link",
            "href": "/in/customers/hertz"
          },
          {
            "text": "Stripe for startups",
            "kind": "link",
            "href": "/in/startups"
          },
          {
            "text": "Stripe for platforms",
            "kind": "link",
            "href": "/in/use-cases/platforms"
          },
          {
            "text": "View developer docs",
            "kind": "link",
            "href": "https://docs.stripe.com/development"
          },
          {
            "text": "View Stripe's GitHub",
            "kind": "link",
            "href": "https://github.com/stripe"
          },
          {
            "text": "Get started",
            "kind": "link",
            "href": "https://docs.stripe.com/development"
          },
          {
            "text": "Read the letter",
            "kind": "link",
            "href": "/in/annual-updates/2025"
          },
          {
            "text": "See the numbers",
            "kind": "link",
            "href": "/in/newsroom/news/bfcm2025"
          },
          {
            "text": "Get the data",
            "kind": "link",
            "href": "/in/lp/vertical-saas-benchmark-2025?utm_medium=owned-surfaces&utm_source=33d6&utm_campaign=GLOBAL_4250&utm_content=819a&utm_term=a6a6d7b23e01"
          },
          {
            "text": "Watch video",
            "kind": "link",
            "href": "https://www.youtube.com/watch?v=eMSqlQMk480"
          },
          {
            "text": "Learn how",
            "kind": "link",
            "href": "/in/use-cases/in-app-payments"
          },
          {
            "text": "View announcement",
            "kind": "link",
            "href": "/in/customers/crypto-com-spotlight"
          },
          {
            "text": "Read more",
            "kind": "link",
            "href": "/in/blog/introducing-our-agentic-commerce-solutions"
          },
          {
            "text": "Get the report",
            "kind": "link",
            "href": "/in/lp/how-retailers-drive-growth"
          },
          {
            "text": "Stripe Press",
            "kind": "link",
            "href": "https://press.stripe.com/"
          },
          {
            "text": "Works in Progress",
            "kind": "link",
            "href": "https://worksinprogress.co/"
          },
          {
            "text": "Contact sales",
            "kind": "link",
            "href": "/in/contact/sales"
          },
          {
            "text": "Checkout",
            "kind": "link",
            "href": "/in/payments/checkout"
          },
          {
            "text": "Get support",
            "kind": "link",
            "href": "https://support.stripe.com/"
          }
        ],
        "formFields": [],
        "proofSignals": [
          {
            "kind": "testimonial",
            "evidence": "28 testimonial or quote block(s): \" With Stripe, we have a global technology partner to help our customers – from Canadian yoga studios to British boxing classe"
          },
          {
            "kind": "rating",
            "evidence": "Rating markup or star glyphs present (24 node(s))"
          },
          {
            "kind": "volume",
            "evidence": "150K+ users"
          },
          {
            "kind": "third-party",
            "evidence": "Mentions forbes"
          }
        ],
        "navLinks": 10,
        "images": {
          "total": 30,
          "missingAlt": 26
        }
      },
      "metrics": {
        "wordCount": 1552,
        "proseSentences": 122,
        "avgSentenceWords": 11.1,
        "readingEase": 43.1,
        "youRatio": 0.59,
        "htmlBytes": 680856,
        "scriptCount": 77,
        "externalHosts": 5,
        "fetchMs": 2003,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  },
  {
    "id": "sample-plausible",
    "shareToken": "smpl_plausible_6d3e8a2f4c",
    "url": "https://plausible.io",
    "finalUrl": "https://plausible.io/",
    "pageTitle": "Plausible Analytics | Simple, privacy-friendly Google Analytics alternative",
    "createdAt": "2026-08-06T12:00:00.000Z",
    "result": {
      "score": 84,
      "grade": "B",
      "categories": [
        {
          "key": "clarity",
          "score": 86,
          "weight": 22,
          "issueCount": 2
        },
        {
          "key": "offer",
          "score": 79,
          "weight": 18,
          "issueCount": 2
        },
        {
          "key": "proof",
          "score": 74,
          "weight": 18,
          "issueCount": 2
        },
        {
          "key": "friction",
          "score": 71,
          "weight": 16,
          "issueCount": 2
        },
        {
          "key": "action",
          "score": 100,
          "weight": 16,
          "issueCount": 0
        },
        {
          "key": "craft",
          "score": 97,
          "weight": 10,
          "issueCount": 1
        }
      ],
      "issues": [
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "critical",
          "title": "53 navigation links compete with the CTA",
          "why": "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
          "fix": "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
          "penalty": 20
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "warning",
          "title": "No customer testimonials",
          "why": "Logos and counts prove popularity. A quote proves the thing actually solved somebody's problem, which is the objection most visitors are stuck on.",
          "fix": "Add two or three quotes naming the specific problem and the result. Include full name, role, and photo.",
          "penalty": 14
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "warning",
          "title": "Proof is present but not quantified",
          "why": "\"Loved by customers\" is a claim. \"4.8 out of 5 across 1,240 reviews\" is evidence. Only the second one survives a sceptical read.",
          "fix": "Put a real count or rating next to the proof section header.",
          "penalty": 12
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "warning",
          "title": "Opening describes features, not outcomes",
          "why": "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
          "fix": "Rewrite the opening so each feature is followed by the result it produces.",
          "penalty": 11
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "warning",
          "title": "The offer is described without numbers",
          "why": "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
          "fix": "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
          "penalty": 10
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "warning",
          "title": "Opening does not say who this is for",
          "why": "When a page tries to speak to everyone, no single visitor recognises themselves in it. Naming the audience raises relevance for the right people and filters out the wrong ones.",
          "fix": "Add a qualifier near the headline. \"For agencies billing over $20k a month\" beats \"for teams of all sizes\".",
          "penalty": 9
        },
        {
          "id": "form-labels",
          "category": "friction",
          "severity": "warning",
          "title": "1 form field without a label",
          "why": "Placeholder-only fields vanish the moment someone starts typing, so people lose track of what they are filling in and screen readers announce nothing.",
          "fix": "Add a visible <label> tied to each input with for/id.",
          "evidence": "range",
          "penalty": 9
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "warning",
          "title": "Title tag is 75 characters",
          "why": "Search results and link previews truncate around 60 characters, so the tail gets cut mid-word.",
          "fix": "Trim to 60 characters or fewer, with the important half first.",
          "evidence": "Plausible Analytics | Simple, privacy-friendly Google Analytics alternative",
          "penalty": 5
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "warning",
          "title": "2 of 10 images have no alt text",
          "why": "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
          "fix": "Describe what the image communicates. Decorative images take alt=\"\" so they get skipped deliberately.",
          "penalty": 3
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "Easy to use and privacy-friendly Google Analytics alternative",
          "penalty": 0
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "pass",
          "title": "H1 is 8 words, a readable length",
          "why": "",
          "fix": "",
          "evidence": "Easy to use and privacy-friendly Google Analytics alternative",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "Plausible is a lightweight and open-source Google Analytics alternative. Your website data is 100% yours and the privacy of your visitors is respected.",
          "penalty": 0
        },
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "pass",
          "title": "Risk reversal present",
          "why": "",
          "fix": "",
          "evidence": "ign up for 30-day free trial. No credit card required. 2 months free Monthly Yearly Up to 10k monthl",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "pass",
          "title": "Third-party validation referenced",
          "why": "",
          "fix": "",
          "evidence": "of millions of monthly visitors, and is trusted by thousands of companies that have switched from Google Analy",
          "penalty": 0
        },
        {
          "id": "form-length",
          "category": "friction",
          "severity": "pass",
          "title": "Form asks for 3 fields",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "pass",
          "title": "Reading ease 57.4, comfortable for most readers",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "pass",
          "title": "Reader-focused language at 53%",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "pass",
          "title": "A CTA appears in the opening section",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "pass",
          "title": "CTA labels are specific",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "pass",
          "title": "CTA appears in 6 places down the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "pass",
          "title": "Heading hierarchy is sequential",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "pass",
          "title": "HTML document is 74 KB",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "pass",
          "title": "6 script tags, 0 external hosts",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Plausible Analytics | Simple, privacy-friendly Google Analytics alternative",
        "metaDescription": "Plausible is a lightweight and open-source Google Analytics alternative. Your website data is 100% yours and the privacy of your visitors is respected.",
        "h1": [
          "Easy to use and privacy-friendly Google Analytics alternative"
        ],
        "headings": [
          {
            "level": 3,
            "text": "Who it's for"
          },
          {
            "level": 3,
            "text": "Compare"
          },
          {
            "level": 3,
            "text": "Follow Plausible: Twitter, Bluesky, Mastodon and LinkedIn"
          },
          {
            "level": 1,
            "text": "Easy to use and privacy-friendly Google Analytics alternative"
          },
          {
            "level": 2,
            "text": "Why use Plausible Analytics?"
          },
          {
            "level": 2,
            "text": "People ❤️ Plausible"
          },
          {
            "level": 2,
            "text": "It's time to ditch Google Analytics"
          },
          {
            "level": 3,
            "text": "Simple analytics at a glance"
          },
          {
            "level": 3,
            "text": "Lightweight script that keeps your site speed fast"
          },
          {
            "level": 3,
            "text": "No need for cookie banners or GDPR consent"
          },
          {
            "level": 2,
            "text": "Traffic based plans that match your growth"
          },
          {
            "level": 3,
            "text": "Starter"
          },
          {
            "level": 3,
            "text": "Growth"
          },
          {
            "level": 3,
            "text": "Business"
          },
          {
            "level": 3,
            "text": "Enterprise"
          },
          {
            "level": 3,
            "text": "Ready to ditch Google Analytics? Start your free trial today"
          },
          {
            "level": 4,
            "text": "Why Plausible?"
          },
          {
            "level": 4,
            "text": "Explore"
          },
          {
            "level": 4,
            "text": "Resources"
          },
          {
            "level": 4,
            "text": "Company"
          }
        ],
        "ctas": [
          {
            "text": "Start free trial",
            "kind": "link",
            "href": "/register"
          },
          {
            "text": "try Plausible",
            "kind": "link",
            "href": "/register"
          }
        ],
        "formFields": [
          {
            "name": "frequency",
            "type": "radio",
            "labelled": true
          },
          {
            "name": "frequency",
            "type": "radio",
            "labelled": true
          },
          {
            "name": "range",
            "type": "range",
            "labelled": false
          }
        ],
        "proofSignals": [
          {
            "kind": "rating",
            "evidence": "Rating markup or star glyphs present (10 node(s))"
          },
          {
            "kind": "authority",
            "evidence": "of millions of monthly visitors, and is trusted by thousands of companies that have switched from Google Analy"
          },
          {
            "kind": "guarantee",
            "evidence": "ign up for 30-day free trial. No credit card required. 2 months free Monthly Yearly Up to 10k monthl"
          }
        ],
        "navLinks": 53,
        "images": {
          "total": 10,
          "missingAlt": 2
        }
      },
      "metrics": {
        "wordCount": 1300,
        "proseSentences": 124,
        "avgSentenceWords": 8.7,
        "readingEase": 57.4,
        "youRatio": 0.53,
        "htmlBytes": 76121,
        "scriptCount": 6,
        "externalHosts": 0,
        "fetchMs": 278,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  },
  {
    "id": "sample-ghost",
    "shareToken": "smpl_ghost_4e8f2a6c9d",
    "url": "https://ghost.org",
    "finalUrl": "https://ghost.org/",
    "pageTitle": "Ghost: The best open source blog & newsletter platform",
    "createdAt": "2026-08-06T13:00:00.000Z",
    "result": {
      "score": 80,
      "grade": "B",
      "categories": [
        {
          "key": "clarity",
          "score": 100,
          "weight": 22,
          "issueCount": 0
        },
        {
          "key": "offer",
          "score": 53,
          "weight": 18,
          "issueCount": 3
        },
        {
          "key": "proof",
          "score": 76,
          "weight": 18,
          "issueCount": 2
        },
        {
          "key": "friction",
          "score": 80,
          "weight": 16,
          "issueCount": 1
        },
        {
          "key": "action",
          "score": 80,
          "weight": 16,
          "issueCount": 1
        },
        {
          "key": "craft",
          "score": 96,
          "weight": 10,
          "issueCount": 1
        }
      ],
      "issues": [
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "critical",
          "title": "Nothing removes the risk of saying yes",
          "why": "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
          "fix": "Add one explicit risk reverser near the primary CTA. \"Cancel anytime\", \"no card required\", and \"30-day refund\" all work.",
          "penalty": 26
        },
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "critical",
          "title": "43 navigation links compete with the CTA",
          "why": "Each header link is an exit the visitor can take instead of converting. On a page with one job, full site navigation leaks the traffic you paid for.",
          "fix": "Strip the header to a logo and the primary CTA. Move the rest to the footer.",
          "penalty": 20
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "critical",
          "title": "No CTA in the opening section",
          "why": "Visitors who are already sold have nothing to click without scrolling. Making a ready buyer hunt for the button is the cheapest conversion loss on any page.",
          "fix": "Place the primary CTA directly under the headline, then repeat it after each proof section.",
          "penalty": 20
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "warning",
          "title": "No customer testimonials",
          "why": "Logos and counts prove popularity. A quote proves the thing actually solved somebody's problem, which is the objection most visitors are stuck on.",
          "fix": "Add two or three quotes naming the specific problem and the result. Include full name, role, and photo.",
          "penalty": 14
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "warning",
          "title": "Opening describes features, not outcomes",
          "why": "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
          "fix": "Rewrite the opening so each feature is followed by the result it produces.",
          "penalty": 11
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "warning",
          "title": "The offer is described without numbers",
          "why": "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
          "fix": "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
          "penalty": 10
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "warning",
          "title": "No third-party validation",
          "why": "Proof hosted on your own page is proof you control. A rating from a platform the visitor already trusts does work that self-reported claims cannot.",
          "fix": "Link a review platform, a press mention, a certification, or a named customer the audience recognises.",
          "penalty": 10
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "warning",
          "title": "18 of 73 images have no alt text",
          "why": "Screen reader users get silence where the proof, product shot, or logo wall should be. It is also the single most common accessibility failure on landing pages.",
          "fix": "Describe what the image communicates. Decorative images take alt=\"\" so they get skipped deliberately.",
          "penalty": 4
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "Turn your audience into a business.",
          "penalty": 0
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "pass",
          "title": "H1 is 6 words, a readable length",
          "why": "",
          "fix": "",
          "evidence": "Turn your audience into a business.",
          "penalty": 0
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "pass",
          "title": "Title tag is 54 characters",
          "why": "",
          "fix": "",
          "evidence": "Ghost: The best open source blog & newsletter platform",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "Beautiful, modern publishing with email newsletters and paid subscriptions built-in. Used by Platformer, 404Media, Lever News, Tangle, The Browser, and thousands more.",
          "penalty": 0
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "pass",
          "title": "Opening names a specific audience",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "pass",
          "title": "Quantified proof present",
          "why": "",
          "fix": "",
          "evidence": "123K members",
          "penalty": 0
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "pass",
          "title": "Reading ease 56.8, comfortable for most readers",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "pass",
          "title": "Reader-focused language at 89%",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "pass",
          "title": "CTA labels are specific",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "pass",
          "title": "CTA appears in 5 places down the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "pass",
          "title": "Heading hierarchy is sequential",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "pass",
          "title": "HTML document is 118 KB",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "pass",
          "title": "9 script tags, 4 external hosts",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Ghost: The best open source blog & newsletter platform",
        "metaDescription": "Beautiful, modern publishing with email newsletters and paid subscriptions built-in. Used by Platformer, 404Media, Lever News, Tangle, The Browser, and thousands more.",
        "h1": [
          "Turn your audience into a business."
        ],
        "headings": [
          {
            "level": 1,
            "text": "Turn your audience into a business."
          },
          {
            "level": 2,
            "text": "Easy site design"
          },
          {
            "level": 2,
            "text": "Advanced creator tools"
          },
          {
            "level": 3,
            "text": "Rich media & dynamic cards."
          },
          {
            "level": 3,
            "text": "Newsletters built-in."
          },
          {
            "level": 2,
            "text": "Grow your audiences"
          },
          {
            "level": 2,
            "text": "Run your business"
          },
          {
            "level": 3,
            "text": "Native analytics."
          },
          {
            "level": 3,
            "text": "Offers & promotions."
          },
          {
            "level": 2,
            "text": "Integrations"
          },
          {
            "level": 3,
            "text": "$100,000,000+"
          },
          {
            "level": 2,
            "text": "Publishers"
          },
          {
            "level": 3,
            "text": "404 Media"
          },
          {
            "level": 3,
            "text": "Tangle"
          },
          {
            "level": 3,
            "text": "Platformer"
          },
          {
            "level": 3,
            "text": "The Lever"
          },
          {
            "level": 2,
            "text": "Creators"
          },
          {
            "level": 3,
            "text": "Gone With The Wynns"
          },
          {
            "level": 3,
            "text": "Creator Science"
          },
          {
            "level": 3,
            "text": "DESK Magazine"
          },
          {
            "level": 3,
            "text": "Jeff Su"
          },
          {
            "level": 2,
            "text": "Businesses"
          },
          {
            "level": 3,
            "text": "YCombinator"
          },
          {
            "level": 3,
            "text": "Kickstarter"
          },
          {
            "level": 3,
            "text": "Buffer"
          },
          {
            "level": 3,
            "text": "Unsplash"
          },
          {
            "level": 2,
            "text": "Built to last"
          },
          {
            "level": 2,
            "text": "You've been referred!"
          },
          {
            "level": 2,
            "text": "has gifted you"
          },
          {
            "level": 2,
            "text": "Launch your big idea"
          }
        ],
        "ctas": [
          {
            "text": "Continue →",
            "kind": "button",
            "href": null
          },
          {
            "text": "Get Started — free",
            "kind": "link",
            "href": "https://account.ghost.org/signup/"
          },
          {
            "text": "Start publishing now →",
            "kind": "link",
            "href": "https://account.ghost.org/signup/"
          }
        ],
        "formFields": [],
        "proofSignals": [
          {
            "kind": "rating",
            "evidence": "Rating markup or star glyphs present (31 node(s))"
          },
          {
            "kind": "volume",
            "evidence": "123K members"
          }
        ],
        "navLinks": 43,
        "images": {
          "total": 73,
          "missingAlt": 18
        }
      },
      "metrics": {
        "wordCount": 875,
        "proseSentences": 66,
        "avgSentenceWords": 9.5,
        "readingEase": 56.8,
        "youRatio": 0.89,
        "htmlBytes": 121270,
        "scriptCount": 9,
        "externalHosts": 4,
        "fetchMs": 475,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  },
  {
    "id": "sample-tally",
    "shareToken": "smpl_tally_5b2e9f7a1c",
    "url": "https://tally.so",
    "finalUrl": "https://tally.so/",
    "pageTitle": "Tally - Create Beautiful Forms for Free | Unlimited Forms & Submissions",
    "createdAt": "2026-08-06T14:00:00.000Z",
    "result": {
      "score": 80,
      "grade": "B",
      "categories": [
        {
          "key": "clarity",
          "score": 86,
          "weight": 22,
          "issueCount": 2
        },
        {
          "key": "offer",
          "score": 53,
          "weight": 18,
          "issueCount": 3
        },
        {
          "key": "proof",
          "score": 76,
          "weight": 18,
          "issueCount": 2
        },
        {
          "key": "friction",
          "score": 100,
          "weight": 16,
          "issueCount": 0
        },
        {
          "key": "action",
          "score": 82,
          "weight": 16,
          "issueCount": 1
        },
        {
          "key": "craft",
          "score": 86,
          "weight": 10,
          "issueCount": 1
        }
      ],
      "issues": [
        {
          "id": "risk-reversal",
          "category": "offer",
          "severity": "critical",
          "title": "Nothing removes the risk of saying yes",
          "why": "Every conversion asks the visitor to bet something: money, time, or an email address. With no guarantee, free tier, or cancellation promise, the visitor carries all of that risk alone and the safest move is to leave.",
          "fix": "Add one explicit risk reverser near the primary CTA. \"Cancel anytime\", \"no card required\", and \"30-day refund\" all work.",
          "penalty": 26
        },
        {
          "id": "cta-competing",
          "category": "action",
          "severity": "critical",
          "title": "10 different actions on one page",
          "why": "Each additional choice adds a decision the visitor did not come here to make. Pages with one job convert better than pages offering a menu.",
          "fix": "Pick one primary action and repeat it. Demote everything else to a text link.",
          "evidence": "\"create a free form\", \"sign up\", \"create form\", \"get started right away\", \"create your first form here\", \"signup page\", \"get started guide\", \"get started\"",
          "penalty": 18
        },
        {
          "id": "script-load",
          "category": "craft",
          "severity": "critical",
          "title": "42 script tags across 2 external hosts",
          "why": "Every third-party host adds a DNS lookup and a TLS handshake before its script even starts. Tag stacks are the usual reason a well-built page still feels slow.",
          "fix": "Audit what each tag is for, drop the ones nobody reads, and defer the rest.",
          "penalty": 14
        },
        {
          "id": "proof-testimonial",
          "category": "proof",
          "severity": "warning",
          "title": "No customer testimonials",
          "why": "Logos and counts prove popularity. A quote proves the thing actually solved somebody's problem, which is the objection most visitors are stuck on.",
          "fix": "Add two or three quotes naming the specific problem and the result. Include full name, role, and photo.",
          "penalty": 14
        },
        {
          "id": "outcome-language",
          "category": "offer",
          "severity": "warning",
          "title": "Opening describes features, not outcomes",
          "why": "Features answer \"what is it\". Visitors are buying the answer to \"what changes for me\". Pages that never make that jump convert the already-convinced and nobody else.",
          "fix": "Rewrite the opening so each feature is followed by the result it produces.",
          "penalty": 11
        },
        {
          "id": "concrete-numbers",
          "category": "offer",
          "severity": "warning",
          "title": "The offer is described without numbers",
          "why": "Unquantified claims read as opinion. A visitor cannot compare \"saves you time\" against a competitor, but they can compare \"cuts invoicing from 3 hours to 20 minutes\".",
          "fix": "Attach a number to the two strongest claims. Time saved, percentage gained, or count delivered.",
          "penalty": 10
        },
        {
          "id": "proof-thirdparty",
          "category": "proof",
          "severity": "warning",
          "title": "No third-party validation",
          "why": "Proof hosted on your own page is proof you control. A rating from a platform the visitor already trusts does work that self-reported claims cannot.",
          "fix": "Link a review platform, a press mention, a certification, or a named customer the audience recognises.",
          "penalty": 10
        },
        {
          "id": "audience-named",
          "category": "clarity",
          "severity": "warning",
          "title": "Opening does not say who this is for",
          "why": "When a page tries to speak to everyone, no single visitor recognises themselves in it. Naming the audience raises relevance for the right people and filters out the wrong ones.",
          "fix": "Add a qualifier near the headline. \"For agencies billing over $20k a month\" beats \"for teams of all sizes\".",
          "penalty": 9
        },
        {
          "id": "title-tag",
          "category": "clarity",
          "severity": "warning",
          "title": "Title tag is 71 characters",
          "why": "Search results and link previews truncate around 60 characters, so the tail gets cut mid-word.",
          "fix": "Trim to 60 characters or fewer, with the important half first.",
          "evidence": "Tally - Create Beautiful Forms for Free | Unlimited Forms & Submissions",
          "penalty": 5
        },
        {
          "id": "h1-present",
          "category": "clarity",
          "severity": "pass",
          "title": "Page has an H1",
          "why": "",
          "fix": "",
          "evidence": "The simplest way to create forms",
          "penalty": 0
        },
        {
          "id": "h1-length",
          "category": "clarity",
          "severity": "pass",
          "title": "H1 is 6 words, a readable length",
          "why": "",
          "fix": "",
          "evidence": "The simplest way to create forms",
          "penalty": 0
        },
        {
          "id": "meta-description",
          "category": "clarity",
          "severity": "pass",
          "title": "Meta description present",
          "why": "",
          "fix": "",
          "evidence": "The simplest way to create beautiful, professional forms in seconds. Unlimited forms, unlimited submissions, forever free. Just start typing - no coding needed.",
          "penalty": 0
        },
        {
          "id": "price-transparency",
          "category": "offer",
          "severity": "pass",
          "title": "Price or pricing signal is on the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "proof-quantified",
          "category": "proof",
          "severity": "pass",
          "title": "Quantified proof present",
          "why": "",
          "fix": "",
          "evidence": "500,000+ teams",
          "penalty": 0
        },
        {
          "id": "nav-leaks",
          "category": "friction",
          "severity": "pass",
          "title": "5 navigation links in the header",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reading-ease",
          "category": "friction",
          "severity": "pass",
          "title": "Reading ease 63.4, comfortable for most readers",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "reader-focus",
          "category": "friction",
          "severity": "pass",
          "title": "Reader-focused language at 68%",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-opening",
          "category": "action",
          "severity": "pass",
          "title": "A CTA appears in the opening section",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-weak-text",
          "category": "action",
          "severity": "pass",
          "title": "CTA labels are specific",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "cta-repetition",
          "category": "action",
          "severity": "pass",
          "title": "CTA appears in 11 places down the page",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "viewport",
          "category": "craft",
          "severity": "pass",
          "title": "Viewport meta tag present",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "https",
          "category": "craft",
          "severity": "pass",
          "title": "Served over HTTPS",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "img-alt",
          "category": "craft",
          "severity": "pass",
          "title": "All 51 images have alt text",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "heading-order",
          "category": "craft",
          "severity": "pass",
          "title": "Heading hierarchy is sequential",
          "why": "",
          "fix": "",
          "penalty": 0
        },
        {
          "id": "page-weight",
          "category": "craft",
          "severity": "pass",
          "title": "HTML document is 290 KB",
          "why": "",
          "fix": "",
          "penalty": 0
        }
      ],
      "extracted": {
        "title": "Tally - Create Beautiful Forms for Free | Unlimited Forms & Submissions",
        "metaDescription": "The simplest way to create beautiful, professional forms in seconds. Unlimited forms, unlimited submissions, forever free. Just start typing - no coding needed.",
        "h1": [
          "The simplest way to create forms"
        ],
        "headings": [
          {
            "level": 1,
            "text": "The simplest way to create forms"
          },
          {
            "level": 2,
            "text": "A form builder like no other"
          },
          {
            "level": 3,
            "text": "Unlimited forms and submissions for free"
          },
          {
            "level": 3,
            "text": "Just start typing"
          },
          {
            "level": 3,
            "text": "Privacy-friendly form builder"
          },
          {
            "level": 2,
            "text": "Simple but powerful"
          },
          {
            "level": 3,
            "text": "Build any form in seconds"
          },
          {
            "level": 2,
            "text": "Craft intelligent forms"
          },
          {
            "level": 3,
            "text": "Conditional logic"
          },
          {
            "level": 3,
            "text": "Calculator"
          },
          {
            "level": 3,
            "text": "Hidden fields"
          },
          {
            "level": 2,
            "text": "Make forms uniquely yours"
          },
          {
            "level": 3,
            "text": "Customize your form"
          },
          {
            "level": 2,
            "text": "Share with your audience"
          },
          {
            "level": 3,
            "text": "Embed"
          },
          {
            "level": 3,
            "text": "Popup"
          },
          {
            "level": 3,
            "text": "Tally links"
          },
          {
            "level": 3,
            "text": "Custom domains"
          },
          {
            "level": 2,
            "text": "Connect your favorite tools"
          },
          {
            "level": 2,
            "text": "Designed for you"
          },
          {
            "level": 3,
            "text": "Creators"
          },
          {
            "level": 3,
            "text": "Product"
          },
          {
            "level": 3,
            "text": "Marketing"
          },
          {
            "level": 3,
            "text": "HR"
          },
          {
            "level": 3,
            "text": "Office"
          },
          {
            "level": 3,
            "text": "Personal"
          },
          {
            "level": 2,
            "text": "Build stunning forms for free"
          },
          {
            "level": 2,
            "text": "Questions & answers"
          }
        ],
        "ctas": [
          {
            "text": "Create a free form",
            "kind": "button",
            "href": null
          },
          {
            "text": "Sign up",
            "kind": "link",
            "href": "/signup"
          },
          {
            "text": "Create form",
            "kind": "link",
            "href": "/create"
          },
          {
            "text": "get started right away",
            "kind": "link",
            "href": "/create"
          },
          {
            "text": "Create your first form here",
            "kind": "link",
            "href": "/create"
          },
          {
            "text": "signup page",
            "kind": "link",
            "href": "/signup"
          },
          {
            "text": "Get started guide",
            "kind": "link",
            "href": "/help/create-a-form"
          },
          {
            "text": "Get started",
            "kind": "link",
            "href": "/help/create-a-form"
          },
          {
            "text": "Contact support",
            "kind": "link",
            "href": "/support"
          },
          {
            "text": "Join the community",
            "kind": "link",
            "href": "/community"
          }
        ],
        "formFields": [],
        "proofSignals": [
          {
            "kind": "volume",
            "evidence": "500,000+ teams"
          }
        ],
        "navLinks": 5,
        "images": {
          "total": 51,
          "missingAlt": 0
        }
      },
      "metrics": {
        "wordCount": 1270,
        "proseSentences": 129,
        "avgSentenceWords": 8.8,
        "readingEase": 63.4,
        "youRatio": 0.68,
        "htmlBytes": 297260,
        "scriptCount": 42,
        "externalHosts": 2,
        "fetchMs": 1024,
        "hasViewport": true,
        "hasLang": true,
        "https": true
      },
      "rewrites": [],
      "verdict": null,
      "engine": "heuristic"
    }
  }
];
