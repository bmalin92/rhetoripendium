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

type SeedCategory = {
  slug: string;
  name: string;
  description: string;
  order: number;
};

type SeedLesson = {
  slug: string;
  title: string;
  subtitle?: string;
  summary: string;
  order: number;
  categorySlug: string;
  deviceSlugs: string[];
  sections: SeedSection[];
  prompts: SeedPrompt[];
};

const categories: SeedCategory[] = [
  {
    slug: "appeals",
    name: "The Rhetorical Appeals",
    description:
      "The three classical grounds of persuasion — credibility, emotion, and reasoning — plus the classical sense of timing that determines whether any of them land.",
    order: 1,
  },
  {
    slug: "repetition",
    name: "Schemes of Repetition & Rhythm",
    description:
      "Devices that repeat a word, phrase, or structure deliberately to build rhythm, emphasis, and memorability.",
    order: 2,
  },
  {
    slug: "balance",
    name: "Schemes of Balance & Structure",
    description:
      "Devices that use matched or mirrored grammatical structure to make comparisons, contrasts, and complex sentences easier to follow.",
    order: 3,
  },
  {
    slug: "tropes",
    name: "Tropes of Comparison & Substitution",
    description:
      "Devices that substitute or compare one thing for another — metaphor, metonymy, exaggeration, and irony — to say more than the literal words state.",
    order: 4,
  },
  {
    slug: "argumentation",
    name: "Argumentation & Persuasive Structure",
    description:
      "Structural devices for building, defending, and dismantling arguments, from formal logic to handling an opponent's strongest objection.",
    order: 5,
  },
];

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
  {
    slug: "kairos",
    name: "Kairos",
    description:
      "The classical appeal of timing and occasion — the argument that persuasion depends not only on what is said but on whether it is said at the opportune moment, to an audience ready to receive it.",
  },
  {
    slug: "epistrophe",
    name: "Epistrophe",
    description:
      "Repetition of the same word or phrase at the end of successive clauses or sentences — the mirror image of anaphora, used to drive a series of statements toward a single, unifying conclusion.",
  },
  {
    slug: "tricolon",
    name: "Tricolon",
    description:
      "A series of three parallel words, phrases, or clauses, often building in weight toward the final item — exploiting a basic human preference for triads to create rhythm, completeness, and memorability.",
  },
  {
    slug: "polysyndeton",
    name: "Polysyndeton",
    description:
      "Deliberate, excessive use of conjunctions between coordinate items where normal usage would omit them, slowing a passage down and giving each item in a list equal, cumulative weight.",
  },
  {
    slug: "asyndeton",
    name: "Asyndeton",
    description:
      "Deliberate omission of conjunctions between coordinate words, phrases, or clauses, compressing a series into a rapid, clipped sequence that reads as urgent or forceful.",
  },
  {
    slug: "parallelism",
    name: "Parallelism",
    description:
      "Matching the grammatical structure of coordinated words, phrases, or clauses so a sentence's form reinforces its meaning.",
  },
  {
    slug: "periodic-sentence",
    name: "Periodic Sentence",
    description:
      "A sentence that withholds its main clause until the end, building suspense through a chain of subordinate elements.",
  },
  {
    slug: "loose-sentence",
    name: "Loose Sentence",
    description:
      "A sentence that states its main clause first, then extends it with trailing modifiers, mimicking natural thought.",
  },
  {
    slug: "zeugma",
    name: "Zeugma",
    description:
      "A single word, usually a verb, governing two or more parts of a sentence in grammatically similar but semantically distinct ways.",
  },
  {
    slug: "syllogism",
    name: "Syllogism",
    description:
      "A formal argument in three explicit steps — major premise, minor premise, conclusion — in which the conclusion follows necessarily from the premises.",
  },
  {
    slug: "enthymeme",
    name: "Enthymeme",
    description:
      "A syllogism compressed for everyday speech, with one premise — usually the one the audience already accepts — left unstated for them to supply.",
  },
  {
    slug: "hypophora",
    name: "Hypophora",
    description:
      "Raising a question aloud and then immediately answering it yourself, rather than leaving it hanging as a merely rhetorical question.",
  },
  {
    slug: "concession",
    name: "Concession",
    description:
      "Acknowledging a genuine point in an opposing position before turning to argue against it, or against a related claim it seems to support.",
  },
  {
    slug: "refutation",
    name: "Refutation",
    description:
      "Directly answering and dismantling an opposing argument, typically by attacking a premise, a piece of evidence, or an inference.",
  },
  {
    slug: "reductio-ad-absurdum",
    name: "Reductio ad Absurdum",
    description:
      "Temporarily granting an opponent's premise and extending its own logic to an absurd, self-contradictory, or otherwise unacceptable conclusion.",
  },
  {
    slug: "metaphor",
    name: "Metaphor",
    description: "A direct, implicit comparison that identifies one thing as another to transfer meaning and feeling between them.",
  },
  {
    slug: "simile",
    name: "Simile",
    description: "An explicit comparison using 'like' or 'as' that holds two things side by side without collapsing them into one.",
  },
  {
    slug: "metonymy",
    name: "Metonymy",
    description: "Substituting a closely associated term for the thing itself, letting the association carry the meaning.",
  },
  {
    slug: "synecdoche",
    name: "Synecdoche",
    description: "Using a part to stand for the whole, or the whole to stand for a part.",
  },
  {
    slug: "hyperbole",
    name: "Hyperbole",
    description: "Deliberate, self-evident exaggeration used for emphasis rather than literal belief.",
  },
  {
    slug: "litotes",
    name: "Litotes",
    description: "Deliberate understatement, often through negating the contrary, that makes a point by appearing to soften it.",
  },
  {
    slug: "verbal-irony",
    name: "Verbal Irony",
    description: "Saying one thing while meaning another, relying on the audience to detect the gap between statement and intent.",
  },
  {
    slug: "dramatic-irony",
    name: "Dramatic Irony",
    description: "A gap in knowledge where the audience understands something a character does not, charging every line the character speaks.",
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
    categorySlug: "appeals",
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
    categorySlug: "appeals",
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
    categorySlug: "appeals",
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
    order: 1,
    categorySlug: "repetition",
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
    order: 1,
    categorySlug: "balance",
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
  {
    slug: "kairos-timing-and-occasion",
    title: "Kairos: The Rhetoric of Timing and Occasion",
    subtitle: "The same words, at the wrong moment, persuade no one",
    summary:
      "How the classical appeal of 'the opportune moment' shapes whether an argument lands — and how to read an occasion, time a hard truth, and avoid manufacturing false urgency.",
    order: 4,
    categorySlug: "appeals",
    deviceSlugs: ["kairos"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Kairos Actually Is",
        content: `Alongside ethos, pathos, and logos, classical rhetoricians named a fourth condition of persuasion: kairos, the "opportune moment." Where the other appeals concern the content and character of an argument, kairos concerns its fitness to the moment — whether this audience, in this circumstance, at this instant, is positioned to hear this claim. The Greeks distinguished kairos from chronos, ordinary sequential time, precisely because kairos is not a point on a clock. It is a qualitative window: a moment when conditions align so that a particular utterance becomes possible, credible, or urgent in a way it would not be five minutes or five years earlier or later.

This is a harder idea to internalize than ethos or logos because it is not a property of the text at all — it is a property of the fit between text and situation. The identical argument, delivered word for word, can succeed spectacularly at one moment and fail completely at another. A warning about a risk lands as wisdom right after the risk has visibly materialized for someone; the same warning offered a year earlier reads as alarmism, and offered a year later reads as an unhelpful post-mortem. Nothing about the sentence changed. What changed was the audience's readiness to hear it.

Kairos therefore requires a skill logos and ethos don't: reading the room before you speak, not just constructing a sound argument in the abstract. A rhetorician attentive to kairos asks not only "is this true and well-supported?" but "is this the moment this audience can actually absorb it?" Ignoring that second question is why technically correct arguments routinely fail to persuade — they were right, but untimely.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Techniques for Reading and Using the Moment",
        content: `Four moves let a writer work with kairos rather than against it:

1. **Name the occasion explicitly.** Acknowledging directly why you are speaking now — what has just happened, what the audience is primed to feel — signals that you understand the moment rather than reciting prepared material at it. This costs little and buys significant goodwill, because it shows the audience you are responding to them, not just performing at them.
2. **Time a concession or hard truth for receptivity, not for your own convenience.** A hard truth delivered the moment someone is defensive will be rejected regardless of its accuracy; the same truth offered once they've already absorbed the first shock of bad news often lands. Patience about *when* to say something is itself a rhetorical skill, separate from crafting *what* to say.
3. **Exploit or overcome a moment of heightened attention.** Crises, anniversaries, and sudden events create windows where audiences are unusually attentive and unusually open to reconsidering settled views. A rhetor who recognizes such a window can make an argument that would have been ignored in ordinary time — but the window closes, often quickly, so the same content offered too late has missed its kairos entirely.
4. **Match scale to the moment.** Part of reading an occasion is judging how much the moment can bear — a short, spare statement can be exactly right when an audience is exhausted, grieving, or already saturated with words, where a longer, more elaborate case would be tone-deaf regardless of its quality.

The risk running through all four techniques is that kairos can be counterfeited. Genuine kairos responds to a real, audience-felt condition — an event that actually happened, an attention that is actually heightened. Manufactured urgency — inventing a crisis, exaggerating a deadline, insisting "now or never" when nothing has actually changed — borrows the *form* of kairos without the underlying fact, and audiences that catch the counterfeit extend that suspicion to everything else the writer says. Real kairos is discovered by watching the situation closely; false kairos is asserted because urgency is rhetorically convenient.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Lincoln's Gettysburg Address (1863)",
        content: `On November 19, 1863, at the dedication of the Soldiers' National Cemetery in Gettysburg, the day's featured orator was Edward Everett, one of the most celebrated speakers in America, who delivered a formal two-hour oration reviewing the battle in classical detail. Lincoln followed him with a speech of only about ten sentences and roughly two minutes — "Four score and seven years ago our fathers brought forth on this continent a new nation, conceived in Liberty, and dedicated to the proposition that all men are created equal..."

Lincoln's brevity was not a failure to fill his allotted time; it was a reading of the occasion Everett had just created. A crowd that had stood through two hours of elaborate rhetoric was saturated, not receptive to more elaborate argument — the moment called for compression, not elaboration. Lincoln's address restates the nation's founding proposition and reframes the war's purpose in spare, almost liturgical language suited to a dedication of graves, not a policy oration. It closes by asking listeners to take up "the great task remaining before us" — language fitted to mourners standing at a battlefield cemetery, not to a legislative chamber.

The clearest evidence that contemporaries recognized this as a matter of timing, not just talent, comes from Everett himself. The day after the ceremony, he wrote to Lincoln that he wished he could flatter himself that he had come as close to the central idea of the occasion in his two-hour speech as Lincoln had in his two minutes. Everett — the professional orator of the two — was crediting Lincoln's brevity for fitting the moment, not merely for its eloquence. That is kairos: the identical two hundred and seventy-some words, delivered as the opening speech of the day instead of the closing one, would have been a different, and likely lesser, rhetorical act.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Reading Kairos Before You Write",
        content: `- Have you identified what has actually just happened or changed that makes this the moment to speak, rather than any other moment?
- Does your piece acknowledge the occasion explicitly, rather than reading as generic material that could have been delivered any time?
- Is a hard truth or concession timed for when the audience can actually absorb it, not simply for when it's convenient for you to say it?
- Does the scale and tone of your piece match what this moment can bear — brief where the audience is saturated, expansive only where there's genuine appetite?
- Have you checked that any urgency you're invoking is real, rather than asserted for rhetorical convenience?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Choose a single argument or claim you want to make (about anything: a policy, a personal decision, a piece of advice). Write two different opening passages of the same underlying argument, each 100-175 words, aimed at two distinct moments or audiences — for example, one delivered right after a crisis has just made the issue urgent, and one delivered in a calm, ordinary moment when the audience has no particular reason yet to care. Label each passage with the moment it is written for.",
        instructions:
          "The underlying claim should stay essentially the same across both passages — what should change is how you acknowledge the occasion, how much you can assume the audience already feels, and how much groundwork you need to lay before the audience is ready to hear the claim. Do not simply change the tone; change what the passage assumes about audience readiness.",
        minWords: 200,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Distinct Reading of Each Occasion",
            description:
              "Do the two passages genuinely differ in how they read and respond to their stated moment, rather than being the same generic text with a label swapped on top?",
          },
          {
            order: 2,
            key: "occasion_acknowledgment",
            label: "Explicit Acknowledgment of the Moment",
            description:
              "Does at least one passage explicitly name or gesture at the occasion (the event, the audience's current state of attention) rather than speaking as if from a vacuum?",
          },
          {
            order: 3,
            key: "authenticity_of_urgency",
            label: "Genuine vs. Manufactured Urgency",
            description:
              "Where urgency is invoked, is it grounded in a real, stated circumstance rather than asserted for effect ('now more than ever') without justification?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description:
              "Is the prose clear, well organized, and free of unnecessary filler or vague abstraction?",
          },
        ],
      },
    ],
  },
  {
    slug: "epistrophe-ending-repetition",
    title: "Epistrophe: Ending Repetition",
    subtitle: "Driving a series of clauses toward the same closing word",
    summary:
      "How repeating a word or phrase at the end of successive clauses — rather than the beginning, as in anaphora — builds a sense of cumulative conclusion, and how to use that convergence without sounding like a broken record.",
    order: 2,
    categorySlug: "repetition",
    deviceSlugs: ["epistrophe"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Epistrophe Actually Is",
        content: `Epistrophe (also called antistrophe) is the repetition of a word or phrase at the *end* of successive clauses or sentences. It is anaphora's mirror image: where anaphora repeats at the start of each clause and lets the ending vary, epistrophe holds the ending fixed and lets everything leading up to it vary. The clauses arrive from different directions but land in the same place.

That shared landing point is what gives epistrophe its distinct effect. Anaphora tends to feel propulsive — each clause launches from the same word and pushes outward into new territory. Epistrophe tends to feel conclusive — each clause is a different argument or image, but all of them are shown to terminate in the same idea, which starts to feel less like a rhetorical flourish and more like an inevitability. By the third or fourth repetition, the reader isn't just hearing an echo; they're being shown that multiple, independent lines of thought all resolve to the same word.

This makes epistrophe especially suited to moments where a writer wants to demonstrate convergence: several different facts, memories, or arguments that all point to one unavoidable conclusion. It is less suited to moments of forward momentum or escalating urgency, where anaphora's start-repetition does more work.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Why the End Position Changes the Effect",
        content: `Because the repeated word lands at the close of each clause, it is also the last thing the reader's ear hears before the next clause begins — which means epistrophe accumulates emphasis with each repetition rather than merely restating it. The first occurrence registers as incidental; the second suggests a pattern; by the third, the reader senses the word is the actual subject of the passage, regardless of what else the sentence was nominally about.

Compare a flat, unrepeated version — *"I was young and didn't understand money, didn't understand risk, and didn't plan for the future"* — with an epistrophic one: *"When I signed the lease, I was thinking like a child. When I quit the job, I was thinking like a child. When I spent the savings, I was thinking like a child."* The second version doesn't just list three mistakes; it insists, through the repeated closing clause, that all three had the same root cause. The repetition does the analytical work that a topic sentence would otherwise have to do explicitly.

The main risk is monotony: if the varying material before the repeated word is too similar in length or rhythm, the passage can start to feel mechanical rather than cumulative. The strongest epistrophe varies the *setup* of each clause substantially while keeping the *landing* identical — the contrast between variation and repetition is what produces the effect.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "1 Corinthians 13:11 (King James Version)",
        content: `> "When I was a child, I spake as a child, I understood as a child, I thought as a child: but when I became a man, I put away childish things."

Three successive clauses — "I spake," "I understood," "I thought" — each report a different faculty (speech, comprehension, reasoning), and each one closes on the identical phrase "as a child." The verse could have simply said "I did everything as a child does," but that would state the conclusion rather than demonstrate it. By repeating "as a child" after three separate faculties, the verse builds the case piece by piece — speech, then understanding, then thought — so that by the time the reader reaches "but when I became a man," the contrast has already been earned three times over, not asserted once. The turn to adulthood in the final clause lands with more force precisely because the repetition has spent three clauses establishing exactly what is being left behind.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Epistrophe Well",
        content: `- Does the repeated word or phrase fall at the *end* of each clause, with the material before it varying substantially?
- Does the repetition span at least three clauses, so the reader perceives a pattern rather than a coincidence?
- Is the device used to demonstrate a convergence (multiple lines of thought arriving at one conclusion), rather than just to sound rhythmic?
- Have you avoided making the varying setup material so similar in length and rhythm that the passage feels mechanical rather than cumulative?
- Would the passage lose real argumentative force if the repeated ending were cut — proving the repetition is doing work, not just decorating the prose?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage — reflective, persuasive, or narrative — in which at least three consecutive sentences or clauses end on the same repeated word or phrase, building toward a conclusion that the repetition itself helps establish.",
        instructions:
          "Vary the content and length of what comes before the repeated ending in each clause; the repetition should feel like separate lines of evidence converging, not a single idea restated three times in nearly identical sentences.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Epistrophe Correctly Formed",
            description:
              "Does the passage contain at least three clauses or sentences that end on the same repeated word or phrase, with genuinely varied material preceding it each time?",
          },
          {
            order: 2,
            key: "cumulative_effect",
            label: "Repetition Builds Toward a Conclusion",
            description:
              "Does the repeated ending function to demonstrate a convergence of separate points toward one idea, rather than simply restating the same point three times?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Avoids Mechanical Monotony",
            description:
              "Do the clauses leading up to the repeated ending differ enough in rhythm, length, and content that the repetition reads as cumulative rather than robotic?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the surrounding prose clear, purposeful, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "tricolon-rule-of-three",
    title: "Tricolon and the Rule of Three",
    subtitle: "Why three parallel items feel complete when two feel thin and four feel padded",
    summary:
      "How a series of exactly three parallel words, phrases, or clauses exploits a basic human preference for triads — and how to build a tricolon that escalates toward its final item rather than just listing.",
    order: 3,
    categorySlug: "repetition",
    deviceSlugs: ["tricolon"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What a Tricolon Is",
        content: `A tricolon is a series of exactly three parallel words, phrases, or clauses — matched in grammatical form, delivered in sequence. "Blood, sweat, and tears" is a tricolon; so is "veni, vidi, vici." The device rests on an observed pattern in how audiences process short series: two items read as a pairing or a choice, four or more start to read as an open-ended list whose exact count doesn't matter, but three reads as complete. It's the smallest number that can establish a pattern (item one, item two) and then satisfy it (item three) within a single breath.

Not every tricolon is a flat list, however. The strongest examples are often *ascending* — each item slightly longer, weightier, or more consequential than the last, so the series builds rather than simply enumerates. Grammarians call this variant tricolon crescens ("the growing tricolon"). "I came, I saw, I conquered" is technically flat in length, but escalates in the magnitude of the act each verb names — arriving somewhere is minor, observing it is more active, conquering it is the payoff. The three-beat structure makes the escalation legible in a way a two-item or five-item series would not.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Why Three Works",
        content: `Part of the tricolon's power is simply rhythmic: read aloud, a three-beat phrase has a natural cadence that two beats (which can feel clipped) and four-plus beats (which can feel like it's trailing off) tend to lack. But the device also does real argumentative work. A writer choosing three examples, three reasons, or three consequences is implicitly claiming just enough evidence to establish a pattern without belaboring it — three is the rhetorical minimum for "this is a trend," not an anecdote, while stopping well short of an exhaustive list that would slow the sentence down.

Consider the difference between a flat catalogue and a tricolon: *"The plan failed because of poor timing, insufficient funding, weak execution, unclear communication, and bad luck"* reads as a shrug — too many causes to feel like an argument. Trimmed to a tricolon — *"The plan failed for lack of money, lack of time, and lack of nerve"* — the same idea reads as a verdict. Cutting a five-item list down to its three most essential members isn't just compression; it's an editorial claim about which causes actually mattered.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Julius Caesar, Reported by Suetonius",
        content: `> "Veni, vidi, vici." ("I came, I saw, I conquered.")

According to Suetonius's *Life of the Deified Julius*, Caesar had this phrase displayed at his triumph to summarize the swiftness of his victory over Pharnaces II at the Battle of Zela in 47 BC. The three one-word verbs are grammatically identical — same tense, same person, same length in Latin — which strips the sentence to its structural minimum and lets the *sequence* carry all the meaning: arrival, then observation, then conquest, each a precondition for the next. Nothing is added between the three verbs — no conjunctions, no elaboration — which is part of why the phrase reads as an assertion of effortlessness. A very different real tricolon, Lincoln's line from the Gettysburg Address — "that government of the people, by the people, for the people, shall not perish from the earth" — shows the same three-beat structure used for the opposite effect: three parallel prepositional phrases building toward a single, weighty claim about legitimacy, rather than compressing a whole campaign into three syllables.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Building an Effective Tricolon",
        content: `- Are there exactly three items, matched in grammatical form (same part of speech, same tense, same basic shape)?
- If you started with a longer list, have you cut it down to the three items that actually matter, rather than padding to reach three?
- Does the series escalate — in length, stakes, or intensity — toward the final item, rather than reading as three interchangeable examples?
- Does the tricolon read naturally aloud, with a clear three-beat rhythm?
- Would the sentence lose its punch if a fourth item were added — confirming that three is the right count, not an arbitrary one?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage on a subject of your choice that includes at least two distinct tricolons — series of exactly three grammatically parallel words, phrases, or clauses — with at least one of them escalating in weight toward its final item.",
        instructions:
          "Do not pad a two-item or four-item list to force a count of three; each tricolon should reflect an actual editorial choice about which three elements matter most.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Tricolons Correctly Formed",
            description:
              "Are there at least two genuine tricolons — three grammatically parallel items in sequence — rather than lists of two, four, or more items, or items that don't match in form?",
          },
          {
            order: 2,
            key: "escalation",
            label: "At Least One Tricolon Escalates",
            description:
              "Does at least one of the tricolons build in weight, length, or stakes toward its final item, rather than reading as three interchangeable examples?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Three Items Feel Chosen, Not Padded",
            description:
              "Does each tricolon read as the essential three elements rather than an arbitrary count reached by padding or trimming an unrelated list?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the surrounding prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "polysyndeton-and-asyndeton",
    title: "Polysyndeton and Asyndeton: Conjunctions as a Dial",
    subtitle: "Adding or stripping 'and' to slow a sentence down or speed it up",
    summary:
      "Two opposite manipulations of the same grammatical knob — polysyndeton (deliberately excessive conjunctions) and asyndeton (deliberately omitted conjunctions) — and how each reshapes the pace and weight of a list or series.",
    order: 4,
    categorySlug: "repetition",
    deviceSlugs: ["polysyndeton", "asyndeton"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Polysyndeton: The Deliberate Excess of 'And'",
        content: `Standard usage joins a list with a single conjunction before the last item: "bread, cheese, and wine." Polysyndeton breaks that convention by inserting the conjunction between *every* item: "bread and cheese and wine." Grammatically the extra conjunctions are unnecessary — the sentence parses fine without them — which is exactly why their presence registers as a deliberate choice rather than an error.

The effect is to slow the sentence down and give each item equal, individual weight. In an ordinary list, the items blur together into a single category ("groceries"); in a polysyndetic list, each "and" forces a small pause before the next item, so the reader registers bread, then cheese, then wine as separate, weighty additions rather than as members of a single blurred set. Polysyndeton is especially effective for conveying accumulation, exhaustion, or overwhelming quantity — a list that keeps going, and going, and going, with the writer refusing to let the conjunctions disappear into the background the way they normally would.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Asyndeton: The Deliberate Omission of 'And'",
        content: `Asyndeton does the opposite: it strips out conjunctions that convention would normally supply, including the one before the final item. "Bread, cheese, wine" instead of "bread, cheese, and wine." Where polysyndeton adds friction between items, asyndeton removes it, and the effect is compression and speed — the list reads as clipped, urgent, and rapid-fire, as if there's no time to spare on connective words.

Asyndeton also works at the level of whole clauses, not just single-word list items — independent clauses strung together with commas or semicolons instead of "and" or "but," producing a staccato rhythm well suited to urgency, command, or forceful summary. The key point is that polysyndeton and asyndeton are not opposites in effect by accident — they are the same underlying manipulation (the density of conjunctions in a series) turned in opposite directions. Reach for polysyndeton when you want the reader to feel the weight and number of items; reach for asyndeton when you want the reader to feel speed, urgency, or clipped finality.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Joshua 7:24 and Churchill's 1940 Commons Speech, Side by Side",
        content: `Polysyndeton (Joshua 7:24, King James Version):
> "And Joshua, and all Israel with him, took Achan the son of Zerah, and the silver, and the garment, and the wedge of gold, and his sons, and his daughters, and his oxen, and his asses, and his sheep, and his tent, and all that he had... and they brought them unto the valley of Achor."

Asyndeton (Winston Churchill, address to the House of Commons, June 4, 1940):
> "We shall fight on the beaches, we shall fight on the landing grounds, we shall fight in the fields and in the streets, we shall fight in the hills; we shall never surrender."

The Joshua passage piles up "and" before nearly every item seized from Achan's household — sons, daughters, oxen, tent — so that the sheer scope of the confiscation lands item by item rather than as a single blurred inventory; the repeated conjunction makes the list feel exhaustive and relentless. Churchill's clauses do the reverse: rather than joining "we shall fight on the beaches" to "we shall fight on the landing grounds" with "and," he simply sets them side by side, separated only by commas. The missing conjunctions compress the sentence into a rapid drumbeat, each clause landing right on top of the last with no connective pause — a rhythm that reads as defiant momentum rather than a leisurely list.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Polysyndeton and Asyndeton",
        content: `- For polysyndeton: have you inserted a conjunction between every item in a series, rather than only before the last, and does the resulting weight/accumulation serve the passage's meaning?
- For asyndeton: have you removed conjunctions that convention would supply, and does the resulting speed or compression fit a moment of urgency or forceful summary?
- Have you used each device deliberately, in a passage where the ordinary conjunction convention would otherwise feel too neutral for the moment?
- Does the choice between the two match the emotional register you want — polysyndeton for weight and accumulation, asyndeton for speed and urgency?
- Read aloud, does the passage's rhythm actually differ from a conventionally punctuated version — proof the device is doing real work, not just replacing punctuation cosmetically?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage that includes two clearly marked moments: one using polysyndeton (a series with a conjunction inserted between every item, to convey weight or accumulation) and one using asyndeton (a series or set of clauses with conjunctions omitted, to convey speed or urgency).",
        instructions:
          "The two moments should serve different purposes within the passage — for instance, a slow, accumulating list of what was lost, versus a rapid, clipped sequence of what happens next. Do not label the devices explicitly in the text itself.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "polysyndeton_used",
            label: "Polysyndeton Correctly Formed",
            description:
              "Is there a series in which a conjunction is inserted between every item (not just before the last), producing a sense of accumulation or weight?",
          },
          {
            order: 2,
            key: "asyndeton_used",
            label: "Asyndeton Correctly Formed",
            description:
              "Is there a series or set of clauses with conjunctions omitted where convention would normally supply them, producing a sense of speed or compression?",
          },
          {
            order: 3,
            key: "contrast_purposeful",
            label: "Contrast Serves Distinct Effects",
            description:
              "Do the two devices serve genuinely different rhetorical purposes within the passage (e.g., weight/accumulation vs. speed/urgency), rather than being interchangeable or arbitrary?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the surrounding prose clear, purposeful, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "parallelism-and-balanced-construction",
    title: "Parallelism and Balanced Construction",
    subtitle: "Matching grammatical structure to make coordinated ideas legible",
    summary:
      "The foundational structural device — placing coordinate words, phrases, or clauses in matching grammatical form — that makes lists, comparisons, and arguments easier to follow and harder to forget.",
    order: 2,
    categorySlug: "balance",
    deviceSlugs: ["parallelism"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Parallelism: The Grammar of Equivalence",
        content: `Parallelism means giving coordinate elements — items in a list, halves of a comparison, clauses joined by "and" or "but" — the same grammatical form. "I like hiking, swimming, and to bike" breaks parallelism because two items are gerunds ("hiking," "swimming") and the third is an infinitive phrase ("to bike"); the mismatch makes the sentence stumble even though the meaning is clear. "I like hiking, swimming, and biking" fixes it by putting all three in the same form. The content hasn't changed at all — only the grammar has been made consistent — but the sentence now reads as a single coherent thought rather than three loosely associated fragments.

This matters because readers use grammatical form as a signal of logical relationship. When items share structure, we process them as members of one category; when they don't, we have to do extra work reconciling why they're listed together at all. Parallelism is therefore not merely a matter of "correctness" — it's a comprehension aid. Lincoln's "of the people, by the people, for the people" uses three identical prepositional-phrase templates to assert that these are three equal facets of one single relationship between government and citizens, not three separate claims.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Where Parallelism Does Its Heaviest Work",
        content: `Parallelism carries the most weight in three places: lists, comparisons, and correlative constructions ("either/or," "not only/but also," "both/and"). In a list, broken parallelism is often just a proofreading slip, but in comparisons and correlatives it can actually distort meaning. "She not only finished the report but also her presentation" is off balance — "not only" is followed by a verb phrase ("finished the report"), while "but also" is followed by a noun phrase ("her presentation"), so the two halves of the correlative aren't structurally equivalent. Rebuilt as "she finished not only the report but also the presentation," both halves sit after the verb as parallel direct objects, and the sentence reads cleanly.

Parallelism is also the scaffolding that antithesis and chiasmus are built on top of: both of those devices depend on two clauses sharing identical grammatical structure so that a contrast or reversal can register clearly. Where parallelism differs from those devices is that it doesn't require opposition — it can just as easily bind together a series of complementary or escalating ideas. Learning to hear when a sentence's grammar has quietly drifted out of alignment is the single most transferable editing skill for prose that aims at rhetorical effect, because almost every other structural device assumes parallel form as a starting point.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Abraham Lincoln, the Gettysburg Address (1863)",
        content: `Lincoln's closing line is built almost entirely out of parallel structure:

> "...that government of the people, by the people, for the people, shall not perish from the earth."

Each of the three prepositional phrases — "of the people," "by the people," "for the people" — follows the identical template of preposition plus the same two-word noun phrase. Only the preposition changes, and each preposition names a distinct relationship (origin, agency, purpose) between government and citizens. Because the grammar is held perfectly constant, the reader's attention goes entirely to the one word that varies in each phrase, which is exactly where Lincoln wants it: on the claim that democratic government belongs to, is operated by, and exists for the same body of people, in three distinct but equally essential senses.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Parallelism",
        content: `- Do all items in a list share the same grammatical form (all gerunds, all infinitives, all noun phrases, etc.)?
- In a comparison or correlative construction ("not only/but also," "either/or"), do both halves attach to the sentence the same way?
- Have you read the sentence aloud to listen for a rhythmic "stumble" where the grammar shifts unexpectedly?
- Is the parallelism doing real work — organizing genuinely comparable ideas — rather than forcing unlike things into a false equivalence?
- Could this parallel structure be strengthened into antithesis or chiasmus, or is plain parallel form sufficient here?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 150-300 word passage describing a process, place, or set of values you care about, using parallel structure in at least one list, one comparison, and (if possible) one correlative construction (\"not only/but also,\" \"either/or,\" \"both/and\").",
        instructions:
          "Before submitting, check every list and comparison for grammatical consistency: same part of speech, same phrase type, same tense.",
        minWords: 150,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct Use of Parallelism",
            description:
              "Does the passage include at least one list or comparison where all coordinate elements share identical grammatical form?",
          },
          {
            order: 2,
            key: "clarity_of_relationship",
            label: "Clarity of Coordinate Relationship",
            description:
              "Does the parallel structure make the logical relationship between the coordinated ideas easier to follow, rather than forcing unrelated ideas into a false equivalence?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Natural Rhythm",
            description:
              "Does the parallelism read naturally when spoken aloud, without feeling mechanical or overused?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "periodic-and-loose-sentences",
    title: "Periodic and Loose Sentences",
    subtitle: "Choosing where a sentence puts its main clause — at the end, or up front",
    summary:
      "Two opposite sentence architectures — one that withholds meaning until a final climactic clause, and one that states its point immediately and then elaborates — that let a writer control suspense, emphasis, and pace at the sentence level.",
    order: 3,
    categorySlug: "balance",
    deviceSlugs: ["periodic-sentence", "loose-sentence"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "The Periodic Sentence: Suspense by Design",
        content: `A periodic sentence delays its main clause — the part that could stand alone as a complete grammatical thought — until the very end, stacking subordinate clauses, phrases, and modifiers in front of it. "When the last light had faded, when the guests had gone, when the house had finally gone quiet, she allowed herself to cry" is periodic: everything before the final comma is subordinate, and the sentence isn't grammatically complete until "she allowed herself to cry" arrives. The reader is held in suspension, accumulating information without resolution, until the sentence finally releases its point.

This delay is not just a stylistic flourish; it's a mechanism for controlling emphasis. Because English readers instinctively expect a sentence to resolve, a periodic sentence creates mounting pressure that is released exactly where the writer places the main clause — which means the main clause lands with more force than it would if it had simply appeared first. The technique works best when the subordinate material is itself building toward something (a list of conditions, a sequence of events, an escalating set of qualifications) so that the final clause feels earned rather than arbitrarily postponed.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "The Loose Sentence: The Shape of Ongoing Thought",
        content: `A loose (or cumulative) sentence does the opposite: it states its main clause first and then extends it with a trailing sequence of modifying phrases and clauses. "She allowed herself to cry, quietly at first, then without restraint, her shoulders shaking as the house settled into silence around her" is loose — the core statement is complete after "she allowed herself to cry," and everything after that is additive detail that could, in principle, be trimmed without destroying the sentence's basic grammatical completeness. Loose sentences read as though the writer's thought is unfolding in real time, discovering its own detail as it goes, which makes them feel more natural and less engineered than periodic ones.

The two forms aren't opposed in value — they're opposed in effect, and skilled prose alternates between them deliberately. A paragraph built entirely of periodic sentences feels overwrought, as though every thought is a withheld revelation; a paragraph built entirely of loose sentences can feel shapeless or rambling, since nothing is ever set up for a payoff. The usual pattern in strong expository or narrative prose is loose sentences as the default register, with an occasional periodic sentence reserved for the one moment per paragraph, or per passage, that the writer wants to land with real weight.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Charles Dickens, A Tale of Two Cities (1859)",
        content: `Dickens opens the novel with what is essentially a long chain of parallel, periodic-feeling clauses building toward resolution:

> "It was the best of times, it was the worst of times, it was the age of wisdom, it was the age of foolishness, it was the epoch of belief, it was the epoch of incredulity, it was the season of Light, it was the season of Darkness, it was the spring of hope, it was the winter of despair, we had everything before us, we had nothing before us, we were all going direct to Heaven, we were all going direct the other way — in short, the period was so far like the present period, that some of its noisiest authorities insisted on its being received, for good or for evil, in the superlative degree of comparison only."

The long accumulation of antithetical clauses functions like an extended periodic structure: the reader is held in a string of contradictions with no single resolving statement until Dickens finally supplies the summarizing judgment — "in short, the period was so far like the present period" — that gives the whole catalogue its point. Note the contrast with a plain loose alternative: "the period was one of extremes — of wisdom and foolishness, hope and despair, all at once" states the same idea immediately and then elaborates, which is clear but has none of the mounting, self-contradicting suspense of Dickens's original.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Periodic and Loose Sentences",
        content: `- For a periodic sentence, is the main clause genuinely withheld until the end, rather than merely delayed by a single introductory phrase?
- Does the subordinate material building up to the main clause escalate or accumulate, so the delay feels earned rather than arbitrary?
- For a loose sentence, could the sentence stop after the main clause and still be grammatically complete, with everything after it as genuine addition?
- Have you varied periodic and loose sentences within a paragraph, rather than defaulting to one form throughout?
- Is the periodic sentence reserved for a genuine moment of emphasis, rather than used so often that its suspense stops registering?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 150-350 word narrative or reflective passage that includes at least one clearly periodic sentence (main clause held until the end) and at least one clearly loose sentence (main clause first, followed by trailing detail).",
        instructions:
          "Label neither sentence type explicitly in your writing — the reader should be able to identify them from structure alone. Aim for the periodic sentence to land on a genuinely important idea.",
        minWords: 150,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct Use of Periodic and Loose Structure",
            description:
              "Does the passage include at least one sentence that clearly withholds its main clause until the end, and at least one that states its main clause first and extends it with trailing detail?",
          },
          {
            order: 2,
            key: "emphasis_placement",
            label: "Earned Emphasis",
            description:
              "Does the periodic sentence's main clause land on an idea substantial enough to justify the delay, rather than feeling like an arbitrary postponement?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Variation and Restraint",
            description:
              "Does the passage vary between periodic and loose sentences rather than overusing either form throughout?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "zeugma-and-syllepsis",
    title: "Zeugma and Syllepsis",
    subtitle: "One word doing double duty across mismatched meanings",
    summary:
      "A compression device in which a single governing word — usually a verb — applies to two or more parts of a sentence in grammatically parallel but semantically unrelated ways, producing wit through the mismatch.",
    order: 4,
    categorySlug: "balance",
    deviceSlugs: ["zeugma"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Zeugma: One Word, Two Meanings at Once",
        content: `Zeugma occurs when a single word — typically a verb, though it can be a preposition or adjective — governs two or more parts of a sentence, each of which uses that word in a different sense. "She broke his car and his heart" is the classic example: "broke" applies literally to the car (physical damage) and figuratively to the heart (emotional devastation), and the sentence gets its charge from forcing one verb to do both jobs simultaneously. The grammar is perfectly parallel — both are direct objects of the same verb — but the meanings pull in different directions, and that gap between grammatical unity and semantic split is where the effect lives.

The narrower term syllepsis is sometimes distinguished from zeugma by grammarians: strictly, syllepsis is when the single word is grammatically correct for both uses but shifts meaning between them (as in "broke," which is literally true of the car and figuratively true of the heart), while zeugma in the strictest sense can describe a word that is grammatically ill-fitting for one of its two uses ("she left in a hurry and a huff," where "in a hurry" and "in a huff" use the same preposition but only one describes manner naturally). In practice, most working writers and most rhetoric references use "zeugma" as the umbrella term for both, and that's the convention this lesson follows.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Why the Device Works: Compression and Surprise",
        content: `Zeugma's effect depends on economy: it says two things with one word that would ordinarily require two different words, and the reader has to do a small double-take to register that the verb has silently changed meaning between its first use and its second. That double-take is what produces the characteristic wit or bite of the device — it rewards attention rather than announcing itself. This is also why zeugma is so common in satire and epigrammatic writing: it lets a writer smuggle a serious or cutting observation (the emotional betrayal) inside a lighter, more literal one (the broken car), so the sting arrives a half-beat after the joke.

Because the device depends on surprise, it doesn't tolerate repetition well within a single passage — a paragraph with three or four zeugmas in a row stops surprising and starts feeling like a gimmick, a string of forced puns rather than a genuine compression of meaning. The best zeugmas also keep both senses of the shared word plausible on their own: if the literal meaning is nonsensical or the figurative meaning is too much of a stretch, the reader can't hold both readings at once, and the device collapses into mere wordplay rather than a genuine double meaning.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Alexander Pope, The Rape of the Lock (1712)",
        content: `Pope's mock-epic is one of the most frequently cited sources for zeugma in English poetry, in a couplet describing Queen Anne holding court:

> "Here thou, great Anna! whom three realms obey,
> Dost sometimes counsel take — and sometimes tea."

The verb "take" governs both "counsel" and "tea," and the parallel grammar (Dost...take counsel / Dost...take tea) forces the reader to hold a weighty, political sense of "take" (receiving advice of state) against a trivial, domestic one (drinking tea) in the very same breath. The joke is entirely structural: by making a monarch's grave duties and her afternoon refreshments grammatically equivalent objects of the same verb, Pope satirizes the way court life reduces matters of state to just one item on a list of routine occupations, no more consequential than beverage selection.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Zeugma",
        content: `- Does a single word (usually a verb) govern two or more parts of the sentence, with a different sense of that word applying to each?
- Are both senses of the shared word plausible on their own, so the reader can genuinely hold both meanings at once?
- Does the mismatch between the two meanings produce a real observation (surprise, wit, or a satirical point), rather than just a forced pun?
- Have you used the device sparingly — once, at most twice, in a given passage — so it retains its element of surprise?
- Read the sentence aloud: does the shared word create a natural, single grammatical structure, or does it require awkward rephrasing to make sense of both uses?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 150-300 word passage — comic, satirical, or simply observational — that includes at least one clear zeugma, in which a single verb governs two or more objects with genuinely different senses of that verb.",
        instructions:
          "Use no more than one or two zeugmas total. Make sure both senses of the shared word are independently plausible, so a reader can hold the literal and figurative (or two literal) meanings at once.",
        minWords: 150,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct Use of Zeugma",
            description:
              "Does the passage include at least one instance of a single word governing two or more sentence elements with genuinely different, independently plausible meanings?",
          },
          {
            order: 2,
            key: "wit_and_point",
            label: "Wit or Observational Point",
            description:
              "Does the mismatch between meanings produce a genuine observation, joke, or satirical point, rather than feeling like a forced or arbitrary pun?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Restraint",
            description:
              "Is the device used sparingly (once or twice) so that it retains its surprise, rather than being repeated until it feels mechanical?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "metaphor-and-simile",
    title: "Metaphor and Simile: Two Ways to Compare",
    subtitle: "When to collapse two things into one, and when to hold them side by side",
    summary:
      "How metaphor asserts identity between two unlike things while simile holds them at a measured distance — and why the choice between them changes how forcefully a comparison lands.",
    order: 1,
    categorySlug: "tropes",
    deviceSlugs: ["metaphor", "simile"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Two Kinds of Comparison, Two Kinds of Force",
        content: `Metaphor and simile both work by pairing something abstract or unfamiliar with something concrete or familiar, so the reader borrows understanding from the familiar term. The difference between them is not decorative — it is a difference in grammatical commitment. A simile says *this is like that*, preserving the seam between the two things being compared: "Her anger was like a struck match." A metaphor says *this is that*, erasing the seam entirely: "Her anger was a struck match." The simile leaves you aware you are watching a comparison happen. The metaphor asks you to accept, for the length of the sentence, that the two things have actually merged.

This difference in commitment produces a real difference in effect. Because simile keeps its "like" or "as" visible, it reads as more measured, more consciously crafted — the writer is asking you to notice the resemblance without confusing it for identity. Metaphor, by dropping the qualifier, reads as more urgent and more total. It doesn't ask for your agreement so much as assert a reality and dare you to argue. That is why metaphor tends to dominate in moments of high emotional or ideological stakes — declarations of war, elegies, sermons — while simile often appears where a writer wants precision and controlled distance, laying one image next to another for inspection rather than fusing them.

Neither device is intrinsically stronger; each is suited to different rhetorical work. A run of similes can build a cumulative, almost scientific case by comparison ("The city was like a hive, like a furnace, like a wound that would not close"), each one adding a distinct angle without insisting that any single one is literally true. A single well-placed metaphor can do in four words what a paragraph of literal description could not ("Time is a thief") because it forces two conceptual domains to collide and lets the reader do the work of reconciling them.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Where Comparisons Fail",
        content: `The most common failure with both devices is the mixed metaphor — stacking two incompatible comparisons in a single image, so the reader is asked to picture two different pictures at once: "We need to iron out the bottleneck before it snowballs." Irons, bottlenecks, and snowballs do not belong to the same visual field, and the sentence collapses into unintentional comedy instead of clarity. The fix is not to avoid figurative language but to follow one comparison through consistently, or to stop after a single clean image rather than reaching for a second.

A second failure is reaching for a comparison so familiar it has stopped doing any work — "busy as a bee," "brave as a lion," "time is money." Dead metaphors and dead similes were vivid once; overuse has worn the specificity off them, so the reader's mind slides past them without forming any image at all. The test for whether a comparison is alive or dead is simple: can you still picture it, or do you only recognize it as a phrase? If a reader cannot picture a bee being unusually busy, the comparison has stopped comparing anything.

The strongest comparisons, by contrast, pull the vehicle (the concrete thing) from a domain the reader wouldn't have expected, so the two halves illuminate each other freshly rather than confirming a cliché. This is why writers are often told to compare abstractions to unexpected, highly specific concrete things — not "grief was a heavy weight" (predictable, nearly dead) but "grief was a coat two sizes too small, worn every day" (specific, and doing real interpretive work about how grief constrains and chafes rather than simply pressing down).`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Shakespeare's As You Like It (c. 1599) and Sonnet 18",
        content: `Shakespeare gives us both devices at their most confident, often within the same body of work. In *As You Like It*, Jaques delivers one of the most famous extended metaphors in English:

> "All the world's a stage, and all the men and women merely players; they have their exits and their entrances, and one man in his time plays many parts."

Notice the grammar of commitment: the world *is* a stage, not *like* a stage. Jaques never hedges the comparison — he simply asserts the equivalence and then spends the rest of the speech working out its logic (the seven ages of man as seven roles), which is possible only because metaphor lets him treat the comparison as settled fact rather than an ongoing analogy.

Contrast that with Sonnet 18, where Shakespeare deliberately opens with a simile only to reject it:

> "Shall I compare thee to a summer's day? / Thou art more lovely and more temperate."

The poem sets up the explicit "like/as" structure of simile (comparing the beloved *to* a summer's day) precisely so it can argue the comparison is inadequate — summer fades, but the beloved's beauty, preserved in verse, will not. The simile's built-in distance between the two terms is the whole point: Shakespeare needs the reader to see the beloved and summer as two separate things being measured against each other, so that the beloved can be shown to exceed the standard rather than simply equal it.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Choosing Between Metaphor and Simile",
        content: `- Do you want total, urgent identification (metaphor) or measured, inspectable distance (simile)?
- Have you followed one comparison through consistently, rather than mixing two incompatible images?
- Is the comparison still visualizable, or has overuse worn it down into a dead phrase ("busy as a bee")?
- Have you pulled the concrete half of the comparison from an unexpected domain, so it does real interpretive work?
- Does the comparison earn its place, or could the sentence say the same thing more plainly without losing anything?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage describing a place, person, or emotion you know well, using at least one original metaphor and one original simile to characterize it.",
        instructions:
          "Avoid stock comparisons ('busy as a bee,' 'time is money'). Pull your comparisons from unexpected, specific domains, and make sure each one is visualizable rather than merely familiar. Do not mix incompatible images within a single comparison.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct and Distinct Use of Metaphor and Simile",
            description:
              "Does the passage include at least one clear metaphor (direct identification, no 'like/as') and one clear simile (explicit 'like/as' comparison), each used correctly?",
          },
          {
            order: 2,
            key: "vividness",
            label: "Specific, Visualizable Comparisons",
            description:
              "Are the comparisons drawn from concrete, specific, and somewhat unexpected domains rather than vague or generic ones, so the reader can actually picture them?",
          },
          {
            order: 3,
            key: "avoids_cliche",
            label: "Avoids Dead Metaphor and Mixed Imagery",
            description:
              "Does the writing avoid worn-out stock comparisons and avoid mixing incompatible images within the same comparison?",
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
    slug: "metonymy-and-synecdoche",
    title: "Metonymy and Synecdoche: Substitution and the Part-Whole Relation",
    subtitle: "Letting an association, a part, or a whole stand in for the thing you actually mean",
    summary:
      "How metonymy substitutes something closely associated with a thing for the thing itself, and how synecdoche lets a part represent a whole (or a whole represent a part) — and why both devices compress meaning by trusting the reader to fill in the rest.",
    order: 2,
    categorySlug: "tropes",
    deviceSlugs: ["metonymy", "synecdoche"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Substitution by Association vs. Substitution by Part and Whole",
        content: `Metonymy and synecdoche are cousins: both let one word stand in for another, but the logic of the substitution differs. Metonymy substitutes a term that is *associated* with a thing for the thing itself — "the crown" for the monarchy, "the White House" for the U.S. executive branch, "the pen is mightier than the sword" using writing implements to mean the practice of writing and the practice of warfare. The substituted term is not part of the original thing; it is simply linked to it by convention, proximity, or function.

Synecdoche, by contrast, substitutes a *part* for the *whole* it belongs to, or occasionally a whole for a part. "All hands on deck" uses "hands" (a part of a sailor's body) to mean the entire sailor. "Nice wheels" uses part of a car to mean the whole vehicle. The reverse direction also counts as synecdoche: using a larger category to name a smaller member of it, as when "the law" is used to mean a single police officer, or "society" is used to mean one particular social circle. The distinguishing test is containment — is the substituted term literally a piece of the thing (synecdoche), or merely something linked to it by association without being part of it (metonymy)?

Both devices do the same underlying rhetorical work: they compress a larger, more diffuse idea into a smaller, more concrete, more sayable unit, and they trust the reader to expand it back out. This compression is not just economical — it also shapes emphasis. Calling a government "Washington" foregrounds its seat of power and its bureaucratic character; calling it "the administration" foregrounds its personnel and their choices. The substituted term is never neutral — it selects which aspect of the whole the reader should have in mind.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Why Writers Reach for Substitution",
        content: `The practical payoff of both devices is concreteness. Abstract institutions and large collectives are hard to picture and hard to feel anything about; a single vivid part or a single associated object is easy to picture and easy to feel something about. "The Pentagon announced new policy" is more graspable than "the United States Department of Defense's leadership announced new policy," and "boots on the ground" makes the abstraction of military deployment suddenly physical — you can picture boots, and feel the weight of them, in a way you cannot picture "deployment of ground forces" as a phrase.

This same compression can be used to editorialize without seeming to. Choosing "suits" for executives, or "the badge" for police authority, or "Wall Street" for the finance industry, quietly frames how the reader should regard the whole by fixing attention on one revealing part or association. A writer describing striking factory workers as facing off against "Wall Street" is making an argument about the nature of the conflict (finance vs. labor) that the more neutral phrase "the company's shareholders" would not make as forcefully. Because the substitution feels like plain naming rather than argument, it can smuggle a perspective past a reader's guard — which is exactly why careful readers should notice when a writer's noun choices are actually a form of substitution doing rhetorical work.

The risk with both devices is the same: overuse turns vivid compression into cliché ("boots on the ground," "the suits upstairs," "all hands on deck" have each been used so often that they now register as stock phrases rather than fresh images), and imprecise use can blur whether the writer means the literal part/association or the whole, creating unintended ambiguity about scope.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Mark Antony's Funeral Oration, Shakespeare's Julius Caesar (c. 1599)",
        content: `Shakespeare's Antony opens his address to the Roman crowd with one of the most famous instances of metonymy in English:

> "Friends, Romans, countrymen, lend me your ears."

"Ears" stands in for the audience's attention — not literally the body part, but everything associated with listening: focus, patience, willingness to be persuaded. It is metonymy rather than synecdoche because ears are not "part of" the crowd's attention in a containment sense; they are the associated instrument through which attention operates. The line works because it makes an abstract request ("please pay attention to me") into something almost physically graspable — the crowd can picture handing something over, which primes them to actually do the more abstract thing Antony is really asking for.

Later in the same speech, Antony gestures toward Caesar's body and the crowd's reaction to it functions through synecdoche as well: contemporary and later descriptions of the scene often use "Caesar's wounds" to stand in for the whole of the assassination and its injustice — the visible, countable wounds (a part of the physical body) coming to represent the entire act of betrayal and its political consequences. This is a case where a small, viewable part (the wounds) is made to carry the emotional and political weight of an event too large and abstract to grasp all at once.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Metonymy and Synecdoche Well",
        content: `- Have you substituted a genuinely associated term (metonymy) or a genuine part/whole relation (synecdoche), rather than an unrelated or confusing stand-in?
- Does the substitution make an abstraction concrete and graspable, rather than adding needless indirection?
- Have you considered which aspect of the whole your chosen part or association foregrounds — and whether that framing is the one you intend?
- Is it clear from context whether you mean the literal part/association or the whole it represents?
- Have you avoided reaching for a substitution so common it now reads as cliché ("boots on the ground," "the suits")?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage — a short piece of political, sports, or workplace commentary — that uses at least one clear metonymy (an associated term standing in for a thing) and one clear synecdoche (a part standing for a whole, or a whole standing for a part).",
        instructions:
          "Choose substitutions that foreground a specific aspect of the thing you mean, and be able to explain why you chose that part or association over another. Avoid overused substitutions like 'boots on the ground' or 'suits.' Make sure the reader can tell what the substitution refers to from context.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct and Distinct Use of Metonymy and Synecdoche",
            description:
              "Does the passage include a clear metonymy (association-based substitution) and a clear synecdoche (part-for-whole or whole-for-part), each correctly formed and distinguishable from the other?",
          },
          {
            order: 2,
            key: "framing_choice",
            label: "Purposeful Selection of the Substituted Term",
            description:
              "Does the chosen part or association foreground a specific, purposeful aspect of the whole, rather than being an arbitrary or confusing stand-in?",
          },
          {
            order: 3,
            key: "avoids_cliche",
            label: "Avoids Stock Substitutions",
            description:
              "Does the writing avoid overused, cliché substitutions and instead choose fresh, specific ones suited to its subject?",
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
    slug: "hyperbole-and-litotes",
    title: "Hyperbole and Litotes: Overstatement and Understatement",
    subtitle: "Two opposite ways of exaggerating your point by not quite saying it plainly",
    summary:
      "How hyperbole persuades by inflating a claim past literal belief, and how litotes persuades by deflating a claim through ironic negation — and why both devices work by trusting the reader to correct back toward the truth.",
    order: 3,
    categorySlug: "tropes",
    deviceSlugs: ["hyperbole", "litotes"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Exaggeration in Two Directions",
        content: `Hyperbole and litotes look like opposites — one inflates, the other deflates — but they share a single underlying mechanism: both state something other than the literal truth, confident that the reader will silently correct the statement back toward what is actually meant, and that the *gap* between the statement and the correction is where the rhetorical force lives. Hyperbole overstates: "I've told you a million times" is obviously false as arithmetic, but the falseness itself communicates real, felt exasperation more effectively than an accurate count ever could. Litotes understates, typically by negating the contrary of what is meant: "not bad" for good, "no small feat" for a major accomplishment, "she was not unaware of the risk" for she was fully aware. The literal statement undersells the point, and the reader supplies the correction upward.

Both devices depend entirely on the reader recognizing them as figurative rather than literal. If a listener actually believed you had been told something a million times, hyperbole would just be a lie; if a listener took "not bad" as genuinely lukewarm praise rather than warm praise delivered with restraint, litotes would fail to land as praise at all. This is what separates both devices from simple inaccuracy: the exaggeration or understatement has to be *legible as such*, usually through context, tone, or a claim so extreme (or so pointedly modest) that no reasonable listener could take it as a literal, careful measurement.

The emotional registers the two devices produce are almost opposite. Hyperbole reads as heightened, urgent, sometimes comic or sometimes furious — it wears its intensity on its surface. Litotes reads as restrained, wry, sometimes dry or ironic, sometimes almost stoic — it wears its intensity underneath a flat surface, which is often what makes it land harder in contexts where overt emotional display would seem excessive or in poor taste.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "When Each Device Serves the Point — and When It Undercuts It",
        content: `Hyperbole is at its best when the literal claim is obviously, almost playfully impossible, so the exaggeration reads as a deliberate rhetorical move rather than a failed attempt at precision: "This bag weighs a ton," "I could eat a horse," "we waited an eternity." It fails when it starts to sound like the writer actually believes the inflated claim, or when it is used so often within a passage that every subsequent claim starts to seem inflated too — a phenomenon sometimes called hyperbole fatigue, where repeated overstatement makes a reader distrust even the writer's literal claims.

Litotes is at its best in contexts where understatement reads as confidence or restraint rather than genuine hedging — a war memoir describing a harrowing battle as "not the easiest day we had" gains force precisely because the understatement is so wildly disproportionate to what's being described, and the reader feels the disproportion. It fails when a reader cannot tell whether the writer means the understatement ironically or literally — "the surgery was not without complications" could read as wry British understatement about a near-fatal outcome, or could read as a genuinely modest, accurate description of a minor issue, and without enough contextual signal the reader has no way to know which is intended.

Both devices, in other words, require the writer to correctly gauge the reader's ability to detect the gap between the literal words and the intended meaning. Where that gap is unmistakable (a physically impossible claim, a comically understated description of a catastrophe), the device works efficiently. Where the gap is ambiguous, both devices risk being taken at face value — which either mutes the intended emphasis (in the case of litotes mistaken for literal modesty) or produces unintended absurdity (in the case of hyperbole mistaken for a literal, false claim).`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Lincoln's Gettysburg Address (1863) — Litotes — and Hyperbole in the Declaration of Independence Tradition",
        content: `Lincoln's Gettysburg Address contains one of the most famous instances of litotes in American oratory:

> "The world will little note, nor long remember, what we say here, but it can never forget what they did here."

This is understatement working precisely as designed: Lincoln predicts that his own words will *not* be long remembered — a modest, self-effacing claim from the man delivering perhaps the most memorized short speech in American history. The litotes ("will little note, nor long remember") makes the contrast with the soldiers' deeds ("can never forget") land with more force than a direct claim ("my words are unimportant compared to their sacrifice") would have, because the modesty is enacted rather than merely asserted — and the historical irony that his prediction turned out to be wrong only deepens how the line is remembered today.

For hyperbole, consider a related American tradition of oratory that leans on deliberate overstatement for emphasis — a common feature of eighteenth- and nineteenth-century political rhetoric was to describe grievances or commitments in maximal, absolute terms ("a long train of abuses," borrowed from the Declaration of Independence, or vows to resist "to the last drop of blood") — phrases meant to be understood as emphatic totalizing claims rather than literal, checkable inventories. Readers of the period understood such phrasing as a register of high political urgency, not a literal accounting, which is precisely how hyperbole is meant to function: the exaggeration itself communicates the depth of the commitment or grievance, not a literal fact to be verified.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Deploying Hyperbole and Litotes",
        content: `- Is your exaggeration (hyperbole) obviously impossible or implausible enough that a reader will recognize it as figurative rather than a false factual claim?
- Is your understatement (litotes) disproportionate enough to what it describes that a reader will recognize the irony, rather than taking it as genuinely modest?
- Have you avoided overusing either device to the point of "fatigue," where repetition dulls the reader's trust in your claims?
- Does the emotional register (heightened for hyperbole, restrained for litotes) match the effect you actually want the passage to produce?
- Could a reader plausibly mistake your statement for a literal, accurate claim? If so, add a contextual signal to make the figurative intent clear.`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word narrative or descriptive passage about an ordinary event (a commute, a meal, a chore, a minor inconvenience) that uses at least one clear hyperbole and one clear litotes.",
        instructions:
          "Make sure each device's figurative intent is unmistakable from context — the hyperbole should be obviously impossible, and the litotes should be obviously, ironically disproportionate to what it describes. Do not overuse either device to the point where the passage reads as uniformly inflated or uniformly deflated.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct and Distinct Use of Hyperbole and Litotes",
            description:
              "Does the passage include a clear hyperbole (obvious overstatement) and a clear litotes (understatement, typically via negation of the contrary), each functioning as intended?",
          },
          {
            order: 2,
            key: "legibility",
            label: "Figurative Intent Is Unmistakable",
            description:
              "Is it clear from context that each statement is figurative rather than a literal claim — is the exaggeration obviously impossible, and the understatement obviously disproportionate?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Restraint and Avoids Overuse",
            description:
              "Does the passage avoid overusing either device to the point of diminishing its effect, keeping each instance purposeful rather than habitual?",
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
    slug: "verbal-and-dramatic-irony",
    title: "Verbal and Dramatic Irony: The Gap Between Saying and Knowing",
    subtitle: "When a speaker means the opposite of their words, and when an audience knows what a character does not",
    summary:
      "How verbal irony creates meaning through a gap between what is said and what is meant, and how dramatic irony creates meaning through a gap between what the audience knows and what a character knows — and why both devices depend on someone being kept, deliberately, in the dark.",
    order: 4,
    categorySlug: "tropes",
    deviceSlugs: ["verbal-irony", "dramatic-irony"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Two Kinds of Gap",
        content: `Irony, in its many forms, is fundamentally about a gap between appearance and reality — but verbal irony and dramatic irony locate that gap in different places. Verbal irony is a gap *within a single speaker's utterance*: the speaker says one thing and means something else, usually the opposite, and trusts the listener to detect the mismatch through tone, context, or sheer implausibility. Saying "What a beautiful day" during a downpour is verbal irony because the literal content of the sentence and the speaker's actual assessment are in open, deliberate conflict, and the humor or bite of the remark depends entirely on the listener catching that conflict.

Dramatic irony, by contrast, is a gap *between the audience and a character*: the audience (readers or viewers) knows something important that a character on stage or on the page does not, and every line that character speaks is colored by the audience's superior knowledge. No single line needs to be ironic in isolation — a character can speak in complete sincerity and literal accuracy, and the irony still operates, because the audience's knowledge transforms a plain statement into something loaded, tragic, or darkly comic that the character cannot perceive.

The distinguishing feature, then, is where the withheld information lives. In verbal irony, the speaker withholds their true meaning from the listener on purpose, as a rhetorical choice, and both the speaker and a perceptive listener can be in on the joke simultaneously. In dramatic irony, the character withholds nothing on purpose — they simply don't know what the audience knows — and the irony exists independent of any character's intention. This is why dramatic irony is often called situational rather than verbal: it lives in the structure of who-knows-what, not in any particular clever phrase.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "What Each Kind of Irony Accomplishes",
        content: `Verbal irony is an efficient way to criticize, joke, or express frustration without stating a judgment directly — which is often why it reads as sharper or wittier than a flat statement of the same view. Calling a disastrous plan "brilliant" implies the critique more devastatingly than calling it "bad," because the listener has to actively notice the gap between the word and the reality, and that act of noticing does rhetorical work that a direct insult cannot: it makes the listener complicit in recognizing the failure rather than simply being told about it. The risk is that verbal irony can be missed entirely, especially in writing without vocal tone to signal it — flat, sincere-sounding irony can be read as a sincere, literal statement by a reader who isn't primed to look for the gap, which is why written verbal irony often needs a contextual cue (obvious overstatement, absurd contrast, established narrative voice) to be legible at all.

Dramatic irony accomplishes something different: it generates suspense, dread, or pathos not through what happens next but through the audience's helpless awareness of what a character cannot see coming. A character walking cheerfully toward a danger the audience already knows about creates tension precisely because the audience cannot warn them — the irony makes the audience complicit witnesses rather than passive observers. This is why dramatic irony is a favored engine of tragedy: the audience's foreknowledge of a character's doom (often established by a prophecy, a prologue, or simply the genre's conventions) turns ordinary scenes of hope or confidence into something the audience experiences as painfully poignant, because every hopeful line is read against the audience's knowledge of how it will actually turn out.

Both devices, ultimately, depend on maintaining an information asymmetry — between speaker and listener for verbal irony, and between audience and character for dramatic irony — and both lose their force entirely if that asymmetry collapses (if the listener already agrees literally with the "ironic" statement, or if the character comes to know what the audience knows, the irony resolves and the tension it created dissolves with it).`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Mark Antony's 'Honourable Men' (Verbal Irony) and Othello (Dramatic Irony)",
        content: `For verbal irony, Shakespeare's Julius Caesar again supplies a textbook case. In his funeral oration, Antony repeats a single phrase with escalating irony as he lists Brutus's justifications for killing Caesar:

> "But Brutus says he was ambitious; / And Brutus is an honourable man... / Yet Brutus says he was ambitious; / And Brutus is an honourable man."

Antony never directly says "Brutus is a liar and a murderer." Instead he repeats "honourable man" so many times, alongside mounting evidence that contradicts Brutus's justification, that the literal words come to mean their opposite in the crowd's ears — by the end of the speech, "honourable man" has been rhetorically inverted into an accusation, without Antony ever technically retracting his praise. This is verbal irony sustained and escalated across an entire speech, not confined to a single line.

For dramatic irony, Shakespeare's *Othello* is a canonical example, and it is worth describing the situational structure accurately rather than quoting a single "ironic" line, since dramatic irony lives in structure rather than in any one sentence. Iago tells the audience directly, in soliloquy, of his plan to convince Othello that his wife Desdemona has been unfaithful, using a handkerchief as false evidence. The audience therefore watches every subsequent scene knowing Desdemona is innocent and knowing exactly how Iago's scheme works — while Othello, still trusting Iago (whom he repeatedly calls "honest Iago"), grows convinced of his wife's guilt. Every expression of Othello's trust in Iago, and every plea of innocence from Desdemona, is transformed by the audience's superior knowledge into something painful to watch, because the audience can see the catastrophe assembling in real time while the characters on stage cannot.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Working with Verbal and Dramatic Irony",
        content: `- For verbal irony: is the gap between what is said and what is meant legible from context, tone, or contrast — or could a reader mistake it for a sincere, literal statement?
- For dramatic irony: have you clearly established what the audience knows that a character does not, and is that gap maintained consistently across the scene?
- Does the verbal irony do more work than a flat, direct statement would (sharper critique, implied judgment) rather than just being confusing?
- Does the dramatic irony generate real tension, dread, or pathos from the audience's foreknowledge, rather than being incidental to the scene?
- Have you avoided collapsing the information gap too early in either case, which would dissolve the irony's effect?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word scene or narrative passage that includes one clear instance of verbal irony (a line where a character means the opposite of, or something different from, what they literally say) and sets up one clear instance of dramatic irony (where the reader is given information a character in the scene does not have).",
        instructions:
          "Make the verbal irony legible through context or contrast, not just tone, since the reader cannot hear vocal inflection. For the dramatic irony, make sure the reader clearly knows something the character doesn't — establish that gap explicitly rather than leaving it ambiguous whether the character actually knows.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct and Distinct Use of Verbal and Dramatic Irony",
            description:
              "Does the passage include a clear instance of verbal irony (speaker meaning something other than the literal words) and a clearly established instance of dramatic irony (reader knows something a character does not)?",
          },
          {
            order: 2,
            key: "clarity_of_gap",
            label: "Information Gaps Are Clearly Established",
            description:
              "Is it unambiguous, from context, what the verbal irony actually means, and exactly what the reader knows that the character does not?",
          },
          {
            order: 3,
            key: "avoids_confusion",
            label: "Avoids Ambiguity Between Literal and Ironic Meaning",
            description:
              "Could a reader plausibly mistake the ironic line for a sincere literal statement, or fail to notice the dramatic irony's setup? The best answer is no — the irony should be effective without needing explicit narration to point it out.",
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
    slug: "syllogism-and-enthymeme",
    title: "Syllogism and Enthymeme: The Skeleton and the Compressed Form",
    subtitle: "From the formal three-step proof to the everyday argument that leaves a premise unsaid",
    summary:
      "How the classical syllogism's major premise, minor premise, and conclusion underlie even the compressed, incomplete arguments we make in speech — and how to recover the hidden premise to test whether an enthymeme actually holds up.",
    order: 1,
    categorySlug: "argumentation",
    deviceSlugs: ["syllogism", "enthymeme"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "The Three-Part Structure of a Syllogism",
        content: `A syllogism is the most basic unit of formal deductive reasoning: two premises and a conclusion, arranged so that if the premises are true and the form is valid, the conclusion cannot fail to be true. The **major premise** states a general claim ("All men are mortal"), the **minor premise** states a specific case that falls under it ("Socrates is a man"), and the **conclusion** draws the necessary consequence ("Therefore, Socrates is mortal"). This particular example is the standard textbook illustration of the form — it is not a literal quotation from Aristotle's own writing, though the structure it demonstrates is exactly the one Aristotle formalized in his logical works, the *Prior Analytics*.

Two things can go wrong with a syllogism, and they are easy to confuse. The form can be **invalid** — the conclusion doesn't actually follow from the premises, regardless of whether the premises are true. Or the form can be valid but **unsound** — the logic is airtight, but one of the premises is false, so the conclusion is worthless despite being "logically" derived. A rhetorically effective syllogism needs both: valid structure and premises an audience will actually grant.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "The Enthymeme: Syllogism in Everyday Speech",
        content: `Almost nobody talks in full syllogisms — it would sound stilted and pedantic. Real speech uses the **enthymeme**: a syllogism with one premise, usually the major premise, left unstated because the speaker assumes the audience already believes it. "Socrates is a man, so he's mortal" is an enthymeme; it skips "all men are mortal" because no listener needs it spelled out. The compression isn't a defect — it's what makes the reasoning feel natural, and it does real rhetorical work, since an audience that supplies the missing premise itself feels like a participant in the argument rather than a target of it.

The risk is that the unstated premise is exactly the place where a weak argument hides. If a speaker says "he's clearly guilty — he was at the scene," the suppressed major premise is something like "everyone at the scene is guilty," which is false and would be rejected instantly if stated aloud. The test for any enthymeme, your own or someone else's, is to reconstruct the missing premise explicitly and ask two questions: is this the premise the arguer actually needs, and would a reasonable audience grant it if asked directly? An enthymeme that fails this test isn't efficient — it's just a syllogism that couldn't survive being spoken in full.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Abraham Lincoln, \"House Divided\" Speech (1858)",
        content: `Accepting the Illinois Republican nomination for Senate, Lincoln built his argument as an enthymeme resting on a familiar biblical maxim as its unstated major premise:

> "A house divided against itself cannot stand. I believe this government cannot endure, permanently half slave and half free. I do not expect the Union to be dissolved — I do not expect the house to fall — but I do expect it will cease to be divided. It will become all one thing, or all the other."

Reconstructed as a full syllogism, the argument runs: *major premise* — a house (or nation) divided against itself cannot stand permanently; *minor premise* — the United States in 1858 is a house divided, half slave and half free; *conclusion* — the United States cannot remain permanently as it is. Lincoln states the major premise explicitly (quoting Mark 3:25, a source his audience would recognize instantly) but leaves the reader to draw the final conclusion from the minor premise he supplies — the compressed, enthymematic form of "it will become all one thing, or all the other." The full logical skeleton is there; only the last inferential step is left for the listener to complete.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Syllogism and Enthymeme",
        content: `- Can you state the argument's major premise, minor premise, and conclusion explicitly, even if your written version compresses one of them?
- If you're using an enthymeme, do you know exactly which premise you've left implicit — and is it one your audience will actually grant?
- Have you checked the form for validity: does the conclusion actually follow, or does it only sound like it follows?
- Would the argument survive having its hidden premise stated out loud, or does the compression exist to hide a weak link?
- Is the major premise genuinely general and true, not a disguised restatement of the conclusion you're trying to reach?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word persuasive passage that makes its central claim through at least one enthymeme — a compressed syllogism with one premise left implicit. Immediately after the passage, reconstruct the full three-part syllogism underlying your enthymeme, explicitly stating the premise you left unsaid.",
        instructions:
          "The reconstruction (major premise / minor premise / conclusion) does not count toward the word limit. Be honest about which premise you actually left implicit — don't reconstruct a different, more defensible argument after the fact.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Enthymeme Deployed Effectively",
            description:
              "Does the passage contain a genuine enthymeme — a compressed syllogism with a clearly identifiable, deliberately implicit premise — rather than just a brief assertive sentence?",
          },
          {
            order: 2,
            key: "logical_soundness",
            label: "Valid Underlying Syllogism",
            description:
              "When reconstructed, does the full syllogism actually follow in valid form, and is the premise supplied in the reconstruction the same one genuinely doing the work in the original passage?",
          },
          {
            order: 3,
            key: "honest_premise",
            label: "Honest Use of the Implicit Premise",
            description:
              "Is the unstated premise one a reasonable audience could accept if it were made explicit, rather than a claim that only works because it's hidden?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "hypophora-question-and-answer",
    title: "Hypophora: Asking the Question So You Control the Answer",
    subtitle: "Raising a question aloud and answering it yourself, rather than leaving it open",
    summary:
      "How posing a question and then immediately answering it lets a writer control the structure and framing of an argument — and why this is a fundamentally different move from a rhetorical question that expects silence.",
    order: 2,
    categorySlug: "argumentation",
    deviceSlugs: ["hypophora"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Hypophora vs. the Rhetorical Question",
        content: `Hypophora is often confused with the rhetorical question, but they work in opposite directions. A rhetorical question ("Isn't it obvious what we should do?") is asked precisely so that no one answers it — its persuasive force depends on the answer feeling too self-evident to need stating. Hypophora does the reverse: the speaker poses a real question and then explicitly answers it themselves, in their own voice, rather than trusting the audience to supply the response silently.

This distinction matters because hypophora requires actual content where a rhetorical question requires none. If you write "Why does this matter?" and then move on without answering, you've asked a rhetorical question, not used hypophora — and you've also skipped the work of actually explaining why it matters. Hypophora forces you to state the answer, which is exactly what makes it useful: it converts a moment that could be filler into a moment that has to carry real information.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Why It Works: Controlling the Frame",
        content: `The power of hypophora comes from who gets to set the terms of the discussion. By asking the question yourself, you choose exactly how the issue is framed — its scope, its emphasis, even its implied assumptions — before you supply the answer that resolves it. This is especially effective when the question you ask is one the audience was already forming on their own; anticipating it and answering it yourself signals command of the material and can preempt an objection before it's voiced aloud (a closely related move sometimes called procatalepsis).

Hypophora also functions as a structural hinge. A string of question-then-answer beats gives an argument forward momentum and makes its internal organization legible — each question announces what the next section will do, and each answer delivers it. The risk is treating the device as decoration: a question asked and answered with no real content, repeated until it becomes a verbal tic. Effective hypophora requires that the question be one worth asking and that the answer be substantive, not a restatement of the question in different words.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Frederick Douglass, \"What to the Slave Is the Fourth of July?\" (1852)",
        content: `Invited to address a Rochester audience celebrating American independence, Douglass built the emotional and logical center of his speech around a single posed and answered question:

> "What, to the American slave, is your 4th of July? I answer: a day that reveals to him, more than all other days in the year, the gross injustice and cruelty to which he is the constant victim."

The question is not rhetorical in the sense of expecting silence — Douglass's white, largely abolitionist-sympathetic audience likely assumed the holiday's meaning was self-evidently positive, and the whole force of the speech depends on Douglass refusing to let that assumption go unstated. By asking the question directly and then answering it himself, he denies the audience the option of supplying a comfortable answer on their own; he supplies the uncomfortable one instead, in his own words, and the rest of the speech unfolds from that answer rather than around an unspoken one.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Hypophora",
        content: `- Have you posed an actual question, and then actually answered it yourself, rather than leaving it hanging as a rhetorical flourish?
- Is the question one your audience might plausibly be asking already, or does it feel inserted only to create the Q&A structure?
- Does the answer do real work — introducing a new point, resolving a tension, or preempting an objection — rather than restating the question?
- Are you using hypophora to organize the argument's structure, not just to season individual sentences?
- If you removed the question and just stated the answer as a flat claim, would the passage lose something real, or only its dressing?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage on a topic of your choosing that uses hypophora at least twice — pose a genuine question and then answer it yourself — so that the questions structure the progression of your argument.",
        instructions:
          "Do not use rhetorical questions that go unanswered. Each question you raise must get a real, substantive answer in your own voice immediately after.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Hypophora",
            description:
              "Does the passage pose at least two real questions and explicitly answer each one itself, rather than leaving any as an unanswered rhetorical question?",
          },
          {
            order: 2,
            key: "structural_function",
            label: "Question Structures the Argument",
            description:
              "Does each question-and-answer pair do real structural work — introducing a new point, resolving a tension, or anticipating an objection — rather than functioning as decoration?",
          },
          {
            order: 3,
            key: "honest_answer",
            label: "Real Question, Honest Answer",
            description:
              "Is each question one a reader might plausibly be asking, and is each answer a genuine, substantive response rather than a restatement of the question?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "concession-and-refutation",
    title: "Concession and Refutation: Conceding Ground to Win the Argument",
    subtitle: "Granting a fair point before dismantling it, or the position it seems to support",
    summary:
      "How acknowledging the strongest version of an opposing point — before refuting it — builds credibility with a skeptical audience and makes the eventual refutation land harder than it would on its own.",
    order: 3,
    categorySlug: "argumentation",
    deviceSlugs: ["concession", "refutation"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Why Concede Anything?",
        content: `Concession is the deliberate acknowledgment that an opposing view contains something true or reasonable, made before you argue against it. It seems counterintuitive — why hand your opponent a point? — but a concession does real persuasive work: it signals to a skeptical audience that you have actually engaged with the other side rather than caricaturing it, which is exactly the credibility a purely combative argument lacks. Classical rhetorical handbooks treated the anticipation and handling of objections (*refutatio*) as a standard part of a well-built oration, not an optional add-on.

A concession only works if it's genuine. "I understand you might say X, but obviously that's wrong" is not a concession — it's a dismissal wearing a concession's clothes, and audiences generally notice the difference. A real concession grants something true and lets it stay true: yes, this cost is real; yes, that historical case cuts against me. The persuasive move isn't pretending the point doesn't exist — it's showing that even granting it fully, the larger conclusion still holds.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "The Refutation That Follows",
        content: `Refutation is what makes the concession pay off, and it can take several forms: distinguishing (the conceded point is true but doesn't imply what the opponent thinks it does), supplying counter-evidence, questioning a premise hidden in the opposing argument, or showing that the conceded point actually applies more strongly to your own position. What refutation should not do is quietly switch targets — conceding the opponent's strongest claim and then refuting a weaker, adjacent one, hoping the audience won't notice the substitution.

This points to the central discipline of the move: concede the strongest version of the opposing argument you can find, not the weakest. Refuting a strawman after a real concession actually costs you more credibility than not conceding at all, because the earlier acknowledgment made the audience expect a fair fight. The sequence — real concession, then refutation aimed at exactly what was conceded — is what separates this device from a debate trick.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Martin Luther King Jr., \"Letter from Birmingham Jail\" (1963)",
        content: `Responding to clergymen who criticized his willingness to break segregation laws, King conceded their underlying worry before drawing the distinction that refuted its force:

> "You express a great deal of anxiety over our willingness to break laws. This is certainly a legitimate concern."

Having granted that concern as legitimate rather than dismissing it, King goes on to draw a distinction — paraphrasing his own argument closely, since the surrounding passage is long: he explains that he does not oppose all law-breaking indiscriminately, but distinguishes between just and unjust laws, arguing (echoing Augustine) that an unjust law is not really a law at all and so carries no equivalent obligation. The concession is what earns him the room to make that distinction — because he first agreed the worry was reasonable, the refined answer that follows reads as a considered response to a fair question, not a dodge of it.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Concession and Refutation",
        content: `- Have you conceded something the opposing side actually holds, in its strongest form, rather than a weaker version that's easy to grant?
- Is your concession genuine — does the conceded point stay true after you've granted it, rather than being quietly walked back?
- Does your refutation address the exact point you conceded (or a claim directly connected to it), rather than switching to an easier target?
- Would someone who holds the opposing view recognize your description of their position as fair?
- Does the sequence — concession, then refutation — actually strengthen your conclusion, or does the concession undercut it?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 250-450 word argument for a position of your choosing. Explicitly concede at least one real, strong point held by someone who disagrees with you, and then refute either that specific point or a related claim it is commonly used to support.",
        instructions:
          "State the concession plainly, in language the opposing side would recognize as a fair summary of their view, before moving to your refutation.",
        minWords: 250,
        maxWords: 450,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Concession",
            description:
              "Is the concession a real acknowledgment of a substantive, strong point — not a strawman, and not a concession that's immediately undercut by qualifying language?",
          },
          {
            order: 2,
            key: "logical_soundness",
            label: "Refutation Actually Answers the Concession",
            description:
              "Does the refutation directly address the conceded point or a claim clearly connected to it, rather than shifting to a different, easier target?",
          },
          {
            order: 3,
            key: "fairness",
            label: "Fair to the Opposing View",
            description:
              "Is the opposing position represented in a form its holders would recognize as fair, rather than weakened or caricatured before being refuted?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
  {
    slug: "reductio-ad-absurdum",
    title: "Reductio ad Absurdum: Following a Premise to Its Breaking Point",
    subtitle: "Accepting an opponent's assumption long enough to show where it leads",
    summary:
      "How extending an opponent's own premise to its logical conclusion — rather than arguing against the premise directly — can expose an absurd or unacceptable result and leave the opponent nowhere to retreat.",
    order: 4,
    categorySlug: "argumentation",
    deviceSlugs: ["reductio-ad-absurdum"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Borrowing the Premise to Break It",
        content: `Reductio ad absurdum takes a different approach from ordinary refutation. Instead of disputing an opponent's premise, you temporarily grant it — fully and without objection — and then apply the same reasoning the opponent is already using to see where it leads. If following their logic consistently produces a conclusion that is self-contradictory, empirically false, or morally unacceptable even to the opponent themselves, the premise has been undermined without your ever having directly attacked it.

The device's strength is that it denies the opponent an easy retreat. You haven't asked them to accept anything they didn't already believe — you've only asked them to be consistent with it. That makes reductio harder to dismiss than a frontal assault on the premise, since the opponent's options are limited to accepting the absurd conclusion, or admitting the premise doesn't actually hold in the way they thought.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "The Risk of Overreach",
        content: `The most common way a reductio fails is by quietly distorting the premise on the way to the absurd conclusion — extending not what the opponent actually said, but an exaggerated version of it that's easier to break. When that happens, the "absurdity" doesn't really follow from the opponent's position at all; it follows from a strawman standing in for it, and an attentive opponent will simply point out that they never held the premise you extended. A reductio only works if every step from the granted premise to the absurd conclusion is as logically visible and defensible as an ordinary chain of reasoning — the same discipline that makes any logos argument hold together.

It also matters what counts as "absurd." The strongest reductio arrives at a conclusion the opponent must reject by their own lights — a contradiction, a violation of something they've already committed to, or a result flatly at odds with observable fact — rather than a conclusion that merely sounds unpleasant or extreme to you. An outcome that only you find absurd hasn't refuted anything; it's just restated your original disagreement in a louder register.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Jonathan Swift, \"A Modest Proposal\" (1729)",
        content: `Responding to contemporary economic arguments that treated the Irish poor primarily as a burden on resources and a problem of numbers, Swift's satirical pamphlet grants that framework entirely and then applies its logic without flinching:

> "I have been assured by a very knowing American of my acquaintance in London, that a young healthy child well nursed, is, at a year old, a most delicious, nourishing, and wholesome food, whether stewed, roasted, baked, or boiled; and I make no doubt that it will equally serve in a fricassee, or a ragout."

Swift does not argue directly against the era's cold cost-benefit treatments of poverty — he accepts their premise (that impoverished children are best understood as an economic liability to be managed for maximum efficiency) and extends it with total logical consistency to its literal conclusion: selling infants as food. The horror of the proposal is not an exaggeration layered on top of the original economic reasoning; it is that reasoning, followed exactly as far as it actually goes, which is precisely what exposes it as monstrous rather than merely unfeeling.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Reductio ad Absurdum",
        content: `- Have you granted the opponent's premise as stated, without quietly exaggerating or distorting it first?
- Does each step from the granted premise to your conclusion follow validly, the way any logos argument should?
- Is the resulting conclusion genuinely absurd by the opponent's own standards — a contradiction, a violated commitment, a plain factual failure — not just unpleasant to you?
- Would the opponent recognize the premise you extended as the one they actually hold?
- Have you stated clearly what, specifically, makes the conclusion absurd, rather than relying on the reader's gut reaction to do that work for you?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Take an argument or premise you disagree with (real or invented) and write a 250-450 word reductio ad absurdum response: grant the premise fully, then apply its own logic consistently to show that it leads to a conclusion that is absurd, self-contradictory, or unacceptable even to someone who holds the original premise.",
        instructions:
          "Do not argue against the premise directly at any point. State plainly, at the end, what specifically makes the resulting conclusion absurd.",
        minWords: 250,
        maxWords: 450,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Reductio Structure",
            description:
              "Does the passage grant the premise and extend its own logic to a further conclusion, rather than switching to a direct attack on the premise itself?",
          },
          {
            order: 2,
            key: "logical_soundness",
            label: "Valid Extension of the Premise",
            description:
              "Does the absurd conclusion follow validly (or with clearly stated probability) from the granted premise, rather than depending on a distortion of it?",
          },
          {
            order: 3,
            key: "fairness",
            label: "Fair to the Opposing View",
            description:
              "Is the opposing position represented in a form its holders would recognize as fair, rather than weakened or caricatured before being refuted?",
          },
          {
            order: 4,
            key: "writing_quality",
            label: "General Writing Quality",
            description: "Is the prose clear, well organized, and free of unnecessary filler?",
          },
        ],
      },
    ],
  },
];

async function main() {
  for (const category of categories) {
    await prisma.lessonCategory.upsert({
      where: { slug: category.slug },
      update: {
        name: category.name,
        description: category.description,
        order: category.order,
      },
      create: category,
    });
  }

  for (const device of devices) {
    await prisma.rhetoricalDevice.upsert({
      where: { slug: device.slug },
      update: { name: device.name, description: device.description },
      create: device,
    });
  }

  for (const lesson of lessons) {
    const { deviceSlugs, categorySlug, sections, prompts, ...lessonFields } = lesson;
    const category = await prisma.lessonCategory.findUniqueOrThrow({ where: { slug: categorySlug } });

    const existing = await prisma.lesson.findUnique({ where: { slug: lesson.slug } });

    const created = existing
      ? await prisma.lesson.update({
          where: { slug: lesson.slug },
          data: { ...lessonFields, categoryId: category.id },
        })
      : await prisma.lesson.create({
          data: {
            ...lessonFields,
            categoryId: category.id,
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
