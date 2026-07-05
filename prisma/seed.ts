import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient, SectionKind } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

type SeedCriterion = {
  order: number;
  key: string;
  label: string;
  description: string;
};

type SeedPrompt = {
  order: number;
  prompt: string;
  instructions?: string;
  minWords?: number;
  maxWords?: number;
  criteria: SeedCriterion[];
};

type SeedSection = {
  order: number;
  kind: SectionKind;
  heading?: string;
  content: string;
};

type SeedLesson = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  order: number;
  deviceSlugs: string[];
  sections: SeedSection[];
  prompts: SeedPrompt[];
};

const devices: { slug: string; name: string; description: string }[] = [
  {
    slug: "ethos",
    name: "Ethos",
    description: "Persuasion through the writer's demonstrated credibility, fairness, and goodwill.",
  },
  {
    slug: "pathos",
    name: "Pathos",
    description: "Persuasion through earned emotional resonance, grounded in concrete, particular detail.",
  },
  {
    slug: "logos",
    name: "Logos",
    description: "Persuasion through explicit, verifiable logical structure — claim, evidence, and warrant.",
  },
  {
    slug: "anaphora",
    name: "Anaphora",
    description: "Repetition of a word or phrase at the start of successive clauses to build rhythm and cumulative force.",
  },
  {
    slug: "antithesis",
    name: "Antithesis",
    description: "Juxtaposing contrasting ideas in grammatically parallel form to sharpen a point.",
  },
  {
    slug: "chiasmus",
    name: "Chiasmus",
    description: "Mirrored reversal of word order (ABBA structure) that resolves tension into a new meaning.",
  },
];

const lessons: SeedLesson[] = [
  {
    slug: "ethos-establishing-credibility",
    title: "Ethos: Establishing Credibility",
    subtitle: "Earning the reader's trust before you ask them to believe anything else",
    summary:
      "How writers build authority, fairness, and goodwill with an audience — and how to weave those signals into your own prose without sounding like you're bragging.",
    order: 1,
    deviceSlugs: ["ethos"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Ethos Actually Is",
        content: `Aristotle named three appeals a speaker uses to persuade: logos (reasoning), pathos (emotion), and ethos (character). Ethos is the most misunderstood of the three, because writers confuse it with credentials. It isn't. Ethos is the impression your writing creates that you are knowledgeable, fair-minded, and genuinely invested in the reader's interest, not just your own.

Classical rhetoricians broke ethos into three components: **phronesis** (practical wisdom — you actually know this subject), **arete** (virtue — you argue in good faith), and **eunoia** (goodwill — you have the audience's interest at heart, not just your own). A writer can be technically correct and still fail at ethos if the prose reads as self-serving, dismissive of other views, or careless with nuance.

The most common mistake is trying to manufacture ethos by *asserting* it directly: "As an expert in this field..." or "Everyone who has studied this knows...". These moves usually backfire — they ask the reader to take credibility on faith, which is the opposite of earning it. Real ethos is demonstrated in the texture of the writing itself, not claimed in a sentence.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "How Ethos Shows Up on the Page",
        content: `Five concrete techniques build ethos without ever stating "trust me":

1. **Steelman before you rebut.** State the strongest version of an opposing view before you argue against it. This demonstrates arete (fairness) — you're not afraid of the best counterargument.
2. **Use precise, checkable detail instead of vague generalization.** Specific numbers, named sources, and exact mechanisms signal phronesis (you actually know the terrain) far more than confident tone does.
3. **Calibrate your certainty.** "In most cases" and "the evidence suggests" read as more credible than absolute claims, because overclaiming is what readers associate with people who don't actually know the limits of their own knowledge.
4. **Prefer understatement to overclaiming.** A modest claim that holds up under scrutiny builds more trust than a dramatic claim that invites skepticism.
5. **Show the reader you share their stakes (eunoia).** Frame the subject in terms of what the reader loses or gains, not just what interests you.

Compare: *"Everyone knows tariffs are bad economics."* versus *"Economists disagree sharply on tariffs' long-run effects on employment, but three points command near-consensus: they raise consumer prices, they invite retaliation, and their benefits concentrate in a few protected industries while their costs spread thinly across everyone else."* The second version does more work to earn belief, precisely because it doesn't ask for it directly.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Martin Luther King Jr., 'Letter from Birmingham Jail' (1963)",
        content: `King was writing in response to a public letter from eight white clergymen calling his presence in Birmingham "unwise and untimely" — framing him as an outside agitator. Rather than simply asserting his right to be there, he builds ethos through escalating association with figures the clergymen themselves would recognize as authoritative:

> "I am in Birmingham because injustice is here... Just as the eighth century prophets left their villages and carried their 'thus saith the Lord' far beyond the boundaries of their home towns, and just as the Apostle Paul left his village of Tarsus and carried the gospel of Jesus Christ to the far corners of the Greco-Roman world, so am I compelled to carry the gospel of freedom beyond my own home town."

Notice what King does *not* do: he never says "I am a legitimate authority on justice." Instead he places himself inside a lineage the clergymen already revere (Hebrew prophets, the Apostle Paul), and lets the parallel structure do the arguing. The reader is left to draw the conclusion — that leaving one's home town to answer injustice elsewhere has scriptural precedent — rather than being told what to conclude. That's ethos built through demonstration, not assertion.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Building Ethos in Your Own Writing",
        content: `- Have you demonstrated fairness by stating the strongest opposing view, rather than a weak version of it?
- Is your certainty calibrated to your actual evidence, rather than uniformly confident?
- Have you used specific, checkable detail instead of sweeping generalization?
- Does the writing show you understand what's at stake *for the reader*, not just for you?
- Have you avoided directly claiming authority ("as an expert...", "everyone knows...")?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word opening paragraph for an essay or argument on a topic you genuinely care about, in which you establish your credibility on the subject without ever directly claiming authority.",
        instructions:
          "Do not write phrases like 'I am an expert' or 'trust me.' Instead, build credibility through demonstration: precise detail, fairness to an opposing view, or calibrated honesty about uncertainty.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Ethos Established Through Demonstration",
            description:
              "Does the passage build credibility through demonstration (precise detail, fairness, calibrated honesty) rather than direct assertion of authority or credentials?",
          },
          {
            order: 2,
            key: "fairness",
            label: "Fairness to Opposing Views",
            description:
              "Does the writing acknowledge counterarguments or the limits of its claims fairly, rather than ignoring or strawmanning them?",
          },
          {
            order: 3,
            key: "calibration",
            label: "Calibrated, Non-Overclaiming Tone",
            description:
              "Is confidence calibrated to the evidence given — hedged where appropriate — rather than absolute or self-congratulatory?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler or vague abstraction?",
          },
        ],
      },
    ],
  },
  {
    slug: "pathos-emotional-appeal",
    title: "Pathos: Emotional Appeal in Persuasion",
    subtitle: "Moving the reader without manipulating them",
    summary:
      "How to earn genuine emotional resonance through concrete, particular detail — and how to avoid the maudlin, manipulative pathos that readers instinctively distrust.",
    order: 2,
    deviceSlugs: ["pathos"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Pathos Is Not the Same as Sentimentality",
        content: `Aristotle's caution about pathos is still the right one: emotional appeal should help an audience see a truth more clearly, not override their judgment. Manipulative pathos — melodrama, sentimentality, emotional language stacked on top of a thin argument — tends to backfire, because readers register it as a substitute for substance rather than a support for it.

The engine of earned pathos is **specificity**. Abstract claims about suffering ("many people were affected") don't move readers, because there's nothing for the imagination to grab onto. A single concrete particular does the work instead: not "many families lost everything," but "the photograph, still creased from where she'd folded it into her coat pocket during the evacuation." The general statement asks the reader to feel on command. The particular image lets them feel without being asked.

This is sometimes called the "iceberg principle" (after Hemingway): the emotional weight comes from what's implied by a carefully chosen detail, not from what's stated outright. A writer who says "it was devastating" is doing the reader's feeling *for* them. A writer who shows the detail that would devastate anyone trusts the reader to arrive at the feeling themselves — which lands harder.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Structural Techniques for Earned Pathos",
        content: `Five techniques for pathos that doesn't feel manipulative:

1. **Particular over general.** One named person, object, or moment outperforms a paragraph of aggregate statistics for emotional effect (though the statistics still matter for logos).
2. **Contrast and juxtaposition.** Placing peace next to war, or before next to after, sharpens feeling more than describing either state alone.
3. **Show, then let the fact speak.** State what happened plainly and trust the reader's judgment, rather than editorializing about how tragic it is.
4. **Control pacing at emotional peaks.** Short sentences at a climactic moment carry more weight than a long, qualifying one.
5. **Avoid stacking intensifiers.** Words like "tragic," "heartbreaking," and "devastating," used directly and repeatedly, are usually a *weaker* choice than the image that would make a reader arrive at those words unprompted.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Abraham Lincoln, Second Inaugural Address (1865)",
        content: `Lincoln closes his address, delivered weeks before the Civil War's end, with a call for reconciliation:

> "With malice toward none, with charity for all, with firmness in the right as God gives us to see the right, let us strive on to finish the work we are in, to bind up the nation's wounds, to care for him who shall have borne the battle, and for his widow, and his orphan..."

Notice that Lincoln never writes "this war has been tragic" or "the suffering has been immense." Instead he names three specific figures — the wounded soldier, his widow, his orphan — in a plain, unadorned list. The pathos comes entirely from the particularity of who is named and the restraint of the language around them. A less disciplined writer would have reached for adjectives; Lincoln reaches for nouns.`,
      },
      {
        order: 4,
        kind: SectionKind.EXAMPLE,
        heading: "A Modern Instance",
        content: `Compare two sentences a journalist might write about a factory closing:

Weak (manipulative): *"The tragic closure devastated the heartbroken community, leaving countless families in despair."*

Strong (earned): *"Maria Alvarez worked the third shift at the plant for nineteen years. On her last day, she took her badge home instead of turning it in."*

The second version never uses the word "sad." It doesn't need to — the specific detail (nineteen years, keeping the badge) does the emotional work that the pile of adjectives in the first version only gestures at.`,
      },
      {
        order: 5,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Earning Pathos Without Manipulating",
        content: `- Have you replaced at least one general emotional claim with a specific, concrete particular?
- Does a contrast (before/after, peace/war) do some of the emotional work instead of adjectives?
- Have you resisted stacking intensifiers ("tragic," "heartbreaking," "devastating")?
- Does the emotional appeal support your argument's substance, rather than standing in for it?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a passage of 200-350 words persuading the reader to care about an issue you find important, using pathos earned through concrete, specific detail rather than emotionally loaded adjectives.",
        instructions:
          "At least one image should be sensory and particular — a specific person, object, or moment — rather than a general appeal to emotion. Avoid words like 'tragic,' 'heartbreaking,' or 'devastating.'",
        minWords: 200,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Earned Pathos via Concrete Detail",
            description:
              "Does the passage generate emotional resonance primarily through a specific, sensory, particular detail rather than general or abstract emotional claims?",
          },
          {
            order: 2,
            key: "restraint",
            label: "Avoids Manipulative Sentimentality",
            description:
              "Does the writing avoid stacking intensifier adjectives or melodrama, relying instead on the weight of the detail itself?",
          },
          {
            order: 3,
            key: "supports_argument",
            label: "Emotion Serves the Argument",
            description:
              "Does the pathos support a substantive point rather than replacing logical or ethical grounding entirely?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose controlled, well-paced, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "logos-architecture-of-argument",
    title: "Logos: The Architecture of Logical Argument",
    subtitle: "Building arguments readers can't easily knock down",
    summary:
      "How to construct arguments with real logical architecture — clear claims, sufficient evidence, and reasoning the reader can follow and verify — rather than assertions dressed up as logic.",
    order: 3,
    deviceSlugs: ["logos"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Logos Requires",
        content: `Logos is persuasion through reasoning, but "reasoning" is doing a lot of work in that sentence. A useful minimal architecture, adapted loosely from the philosopher Stephen Toulmin, has three parts: the **claim** (what you want the reader to believe), the **evidence** (the facts or data offered in support), and the **warrant** (the reasoning that connects the evidence to the claim — why this evidence supports this claim, specifically).

Most weak arguments fail at the warrant. A writer states a claim, offers evidence, and simply assumes the connection between them is obvious. It usually isn't — not to a reader who doesn't already agree. "Company X raised prices by 12%; therefore Company X is gouging customers" skips the warrant entirely: it needs an explicit bridge like "a price increase substantially above the rate of input cost inflation indicates the increase is capturing margin rather than passing through costs." Making that bridge explicit is what separates an argument from an assertion.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Common Logical Traps to Avoid",
        content: `A few failure modes worth naming so you can catch them in your own drafts:

- **Hasty generalization** — drawing a broad conclusion from too small or unrepresentative a sample.
- **False dichotomy** — presenting only two options when a third (or fourth) plausible one exists.
- **Begging the question** — using the claim itself, restated, as if it were evidence for the claim.
- **Post hoc reasoning** — assuming that because B followed A, A caused B.

Just as importantly: the strongest arguments address their own best counterargument rather than ignoring it. This isn't only an ethos move (see the ethos lesson) — it's a logos move too, because an argument that survives contact with its strongest objection is more logically sound than one that was never tested against it.`,
      },
      {
        order: 3,
        kind: SectionKind.EXAMPLE,
        heading: "Making the Warrant Explicit",
        content: `Weak (claim + evidence, no warrant): *"We should extend the return window to 60 days. Our main competitor already offers 60 days."*

Strong (warrant made explicit): *"We should extend the return window to 60 days. Our main competitor already offers 60 days, and in retail, buyers treat a shorter return window as a signal of lower product confidence — meaning our current 30-day policy is quietly costing us sales to comparison shoppers before they ever reach checkout, not just costing us returns after."*

The strong version doesn't just add words — it adds the missing logical link: *why* matching the competitor's return window matters (it's a confidence signal that affects purchase decisions, not just a post-purchase convenience).`,
      },
      {
        order: 4,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "James Madison, Federalist No. 10 (1787)",
        content: `Madison's essay on the dangers of political faction is a model of explicit logical architecture. He poses a clean dilemma: there are only two ways to cure the "mischiefs of faction" — remove its causes, or control its effects.

> "There are two methods of curing the mischiefs of faction: the one, by removing its causes; the other, by controlling its effects."

He then eliminates the first branch through sub-argument: removing the causes of faction would mean destroying liberty itself (since faction arises from liberty) or giving everyone identical opinions and interests (impossible, since it "is sown in the nature of man"). Having eliminated the first branch, the conclusion — control the effects instead — follows because it is now the only remaining option, not because Madison simply asserts it is correct. That is a warrant made fully explicit: the reader can check each step, not just the conclusion.`,
      },
      {
        order: 5,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Building Airtight Logos",
        content: `- Is your claim stated plainly, rather than left implicit?
- Have you supplied the warrant — the explicit reasoning connecting evidence to claim — rather than assuming the reader will supply it?
- Is your evidence the best available, not just the evidence that happens to support you?
- Have you addressed the strongest plausible counterargument?
- Have you checked for hasty generalization, false dichotomy, begging the question, or post hoc reasoning?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a persuasive paragraph of 200-350 words arguing for a position on a topic of your choice.",
        instructions:
          "Make your logical structure explicit: state your claim, present your evidence, and explicitly state the warrant connecting them — don't leave the reader to infer why the evidence supports the claim. Address at least one plausible counterargument.",
        minWords: 200,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Explicit Logical Structure",
            description:
              "Does the argument make its warrant explicit — the reasoning connecting evidence to claim — rather than leaving that connection for the reader to infer?",
          },
          {
            order: 2,
            key: "evidence_quality",
            label: "Quality and Relevance of Evidence",
            description: "Is the evidence offered actually relevant and reasonably strong support for the claim made?",
          },
          {
            order: 3,
            key: "counterargument",
            label: "Addresses a Real Counterargument",
            description:
              "Does the passage engage with a genuine, plausible objection rather than a strawman or no counterargument at all?",
          },
          {
            order: 4,
            key: "fallacy_check",
            label: "Free of Obvious Logical Fallacies",
            description:
              "Is the argument free of hasty generalization, false dichotomy, begging the question, or post hoc reasoning?",
          },
          {
            order: 5,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear and well organized?",
          },
        ],
      },
    ],
  },
  {
    slug: "anaphora-and-repetition",
    title: "Anaphora and Repetition for Emphasis",
    subtitle: "Using deliberate repetition to build rhythm and drive a point home",
    summary:
      "How repeating a word or phrase at the start of successive clauses creates rhythm, cumulative force, and memorability — and how to avoid the monotony of overuse.",
    order: 4,
    deviceSlugs: ["anaphora"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Anaphora Does",
        content: `Anaphora is the repetition of a word or phrase at the beginning of successive clauses or sentences. Done well, it builds momentum: each repetition signals to the reader that a parallel structure is underway, so attention shifts from tracking the syntax (which stays constant) to weighing what follows the repeated phrase (which should change and escalate).

This is the crucial distinction between anaphora and the kind of accidental repetition that's a genuine writing flaw. Plain redundancy repeats an idea without developing it — the second instance adds nothing the first didn't already say. Anaphora repeats a *frame* while the content inside that frame escalates or varies. "The company failed its customers. The company failed its employees. The company failed its own stated mission" is anaphora, because each sentence names a distinct, escalating failure inside the same repeated structure — not three ways of saying the same thing.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Where and How Much",
        content: `Practical guidance for using anaphora without it curdling into a gimmick:

- **Save it for climactic moments.** Anaphora used throughout an entire piece loses force fast; used at a single turning point, it stands out.
- **Three is usually the sweet spot** — the "rule of three." Two repetitions can feel incomplete; three feels satisfyingly complete; more than four or five, without real escalation in content, starts to feel like a tic rather than a technique.
- **Escalate, don't just restate.** Each repeated clause should add weight, specificity, or stakes beyond the previous one.
- **Vary the length of what follows the repeated phrase.** A string of identically-shaped clauses can slip into sing-song monotony; varying clause length while keeping the opening phrase constant keeps the rhythm alive rather than mechanical.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Winston Churchill, 'We Shall Fight on the Beaches' (1940)",
        content: `> "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."

The repetition of "we shall fight" is not static — it escalates geographically, moving from the coastline (beaches) inward through the landing grounds, the fields and streets, and finally the hills: a literal progression from the edge of the country to its interior, implying resistance at every stage of a hypothetical invasion. Then Churchill breaks the pattern entirely for the final clause — "we shall never surrender" — which lands harder precisely because it deviates from the rhythm the previous four clauses established.

Martin Luther King Jr.'s "I have a dream that..." repetition in the 1963 March on Washington speech works the same way: each repetition is paired with a distinct, escalating vision, not a restatement of the previous one.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Anaphora Well",
        content: `- Is the repeated phrase framing genuinely different, escalating content each time — not just restating the same point?
- Have you used roughly three repetitions, rather than one or two (too abrupt) or six-plus (monotonous)?
- Does the passage end with a variation that breaks the established pattern for emphasis?
- Have you varied the length of the clauses following the repeated phrase, to avoid a sing-song rhythm?
- Is this reserved for a genuine climactic moment, rather than used throughout the whole piece?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a passage of 150-300 words that uses anaphora — repetition of a word or phrase at the start of 3-5 successive clauses or sentences — to build toward a point you care about.",
        instructions:
          "Each repeated clause should escalate or add something new, not simply restate the previous one. End the passage with a line that breaks the established pattern for emphasis.",
        minWords: 150,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Anaphora Used Correctly",
            description:
              "Is a phrase repeated at the start of 3-5 successive clauses or sentences, with each iteration escalating or adding new content rather than merely restating the previous one?",
          },
          {
            order: 2,
            key: "pattern_break",
            label: "Effective Break From the Pattern",
            description:
              "Does the closing line vary from the repeated structure in a way that lands as emphasis, in the manner of Churchill's final clause?",
          },
          {
            order: 3,
            key: "rhythm",
            label: "Rhythmic Control",
            description:
              "Does the passage vary clause length enough to avoid sing-song monotony, while keeping the repeated opening phrase intact?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose otherwise clear and purposeful?",
          },
        ],
      },
    ],
  },
  {
    slug: "antithesis-and-chiasmus",
    title: "Antithesis and Chiasmus: The Power of Structural Contrast",
    subtitle: "Using balanced opposites and mirrored structure to sharpen an idea",
    summary:
      "Two related devices of structural contrast — antithesis (balancing opposite ideas in parallel form) and chiasmus (mirroring word order to reverse and resolve an idea) — and how they compress complex ideas into memorable, quotable form.",
    order: 5,
    deviceSlugs: ["antithesis", "chiasmus"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Antithesis: Contrast in Parallel Form",
        content: `Antithesis juxtaposes two contrasting ideas using grammatically parallel structure — the same syntactic shape on both sides of the contrast, with only the substance changing. Shakespeare gives the textbook example, Brutus justifying Caesar's assassination in *Julius Caesar*: "Not that I loved Caesar less, but that I loved Rome more."

The parallel grammar ("that I loved X less" / "that I loved Y more") matters because it isolates the contrast to exactly one variable — object of affection and degree — while holding everything else about the sentence's shape constant. That isolation is what makes the contrast land as a clean, weighable choice rather than a vague comparison. If the two halves were structured differently, the reader would have to do extra work just to see what's actually being contrasted.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Chiasmus: Mirrored Reversal",
        content: `Chiasmus reverses the order of the same (or closely related) terms across two clauses, producing an ABBA structure. John F. Kennedy's 1961 inaugural line is the canonical modern instance: "Ask not what your country can do for you — ask what you can do for your country."

Here the terms are "country," "do," and "you" — and the second clause is built from the same material as the first, just reordered. That reversal is the whole argument: it reframes the relationship between citizen and country by flipping which one is the subject and which is the object of "do for." Chiasmus differs from antithesis in an important way: antithesis contrasts two *different* ideas in matching grammatical form, while chiasmus takes the *same* terms and reverses their order to generate a new meaning from identical material.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Shakespeare and Kennedy, Side by Side",
        content: `Antithesis (Shakespeare, *Julius Caesar*, 1599):
> "Not that I loved Caesar less, but that I loved Rome more."

Chiasmus (Kennedy, Inaugural Address, 1961):
> "Ask not what your country can do for you — ask what you can do for your country."

Reading them side by side makes the distinction concrete: Brutus's line contrasts two different objects of love (Caesar, Rome) in matching form — that's antithesis. Kennedy's line uses the exact same three terms in both halves, just reordered — that's chiasmus. Both compress a complex relationship into a single, quotable line, which is precisely why both are still cited centuries and decades later.`,
      },
      {
        order: 4,
        kind: SectionKind.EXAMPLE,
        heading: "A Modern Attempt at Both",
        content: `Antithesis: *"The startup didn't fail for lack of ambition; it failed for lack of discipline."*

Chiasmus: *"We don't hire people to fit our culture — we build our culture around the people we hire."*

Notice the chiasmus example reuses "our culture" and "hire" in reversed roles across the two clauses, exactly as the Kennedy line reuses "country," "you," and "do."`,
      },
      {
        order: 5,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Antithesis and Chiasmus",
        content: `- For antithesis: are the two contrasting ideas placed in genuinely matching grammatical form, so the contrast is isolated to the substance rather than the sentence shape?
- For chiasmus: does the second clause reuse the same terms as the first, just reordered, to produce a new meaning — rather than simply repeating the same idea?
- Does either device feel earned by the surrounding argument, rather than bolted on for effect?
- Is the line quotable on its own — compressed enough to stand outside the paragraph?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write two to four sentences on a topic of your choice: at least one using antithesis (balancing two contrasting ideas in parallel grammatical form), and at least one using chiasmus (reversing the word order of the same terms to produce a new meaning). Then write a short paragraph (100-200 words) that puts these sentences to work in a larger argument or reflection.",
        instructions:
          "Label neither sentence explicitly — the surrounding paragraph should make each one feel earned rather than bolted on for effect.",
        minWords: 100,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "antithesis_used",
            label: "Antithesis Correctly Formed",
            description:
              "Is there a sentence contrasting two different ideas in genuinely matching grammatical form (true antithesis), rather than an unstructured comparison?",
          },
          {
            order: 2,
            key: "chiasmus_used",
            label: "Chiasmus Correctly Formed",
            description:
              "Is there a sentence that reuses the same terms in reversed order (ABBA structure) to produce a new meaning, rather than simply repeating the same idea?",
          },
          {
            order: 3,
            key: "integration",
            label: "Integrated Into a Coherent Passage",
            description:
              "Do the constructed sentences feel earned within the surrounding paragraph, rather than dropped in disconnected from the argument around them?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the surrounding paragraph itself clear and purposeful?",
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const device of devices) {
    await prisma.rhetoricalDevice.upsert({
      where: { slug: device.slug },
      update: { name: device.name, description: device.description },
      create: device,
    });
  }

  for (const lesson of lessons) {
    const { deviceSlugs, sections, prompts, ...lessonFields } = lesson;

    const created = await prisma.lesson.upsert({
      where: { slug: lesson.slug },
      update: {},
      create: {
        ...lessonFields,
        sections: { create: sections },
        prompts: {
          create: prompts.map((p) => {
            const { criteria, ...promptFields } = p;
            return { ...promptFields, criteria: { create: criteria } };
          }),
        },
      },
    });

    for (const slug of deviceSlugs) {
      const device = await prisma.rhetoricalDevice.findUniqueOrThrow({ where: { slug } });
      await prisma.lessonDevice.upsert({
        where: { lessonId_deviceId: { lessonId: created.id, deviceId: device.id } },
        update: {},
        create: { lessonId: created.id, deviceId: device.id },
      });
    }
  }
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
