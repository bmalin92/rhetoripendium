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
  {
    slug: "decorum",
    name: "Decorum (Aptum)",
    description:
      "Fitting style, tone, and diction to the subject, audience, speaker, and occasion, rather than to a fixed standard of formality.",
  },
  {
    slug: "enargeia",
    name: "Enargeia",
    description:
      "Vivid, concrete sensory description that makes a scene feel witnessed and present, converting an abstract claim into felt experience.",
  },
  {
    slug: "anadiplosis",
    name: "Anadiplosis",
    description:
      "Repeating the last word or phrase of one clause at the start of the next, linking consecutive clauses into a chain.",
  },
  {
    slug: "climax",
    name: "Climax",
    description:
      "A chain of anadiplosis extended across three or more links, each escalating in weight past the last, toward a culminating final term — also called gradatio.",
  },
  {
    slug: "epizeuxis",
    name: "Epizeuxis",
    description:
      "Immediate repetition of a word or phrase with no intervening words, used to convey an intensity a single instance of the word can't carry.",
  },
  {
    slug: "diacope",
    name: "Diacope",
    description:
      "Repetition of a word or phrase broken by a brief interrupting word or phrase, so the interruption itself sharpens the emphasis.",
  },
  {
    slug: "isocolon",
    name: "Isocolon",
    description:
      "Two or more clauses or phrases matched not just in grammatical structure but in length, so the balance is felt rhythmically as well as seen structurally.",
  },
  {
    slug: "hendiadys",
    name: "Hendiadys",
    description:
      "Expressing a single complex idea through two nouns (or verbs) joined by 'and' instead of a noun and its modifier, fusing two coordinate terms into one heightened impression.",
  },
  {
    slug: "personification",
    name: "Personification",
    description: "Attributing human qualities, feelings, or actions to a non-human, non-living, or abstract subject.",
  },
  {
    slug: "prosopopoeia",
    name: "Prosopopoeia",
    description: "The extended form of personification in which an absent, dead, abstract, or non-human entity is given a first-person voice to speak for itself.",
  },
  {
    slug: "oxymoron",
    name: "Oxymoron",
    description: "A compressed, usually two-word figure that yokes two apparently contradictory terms into a single pointed phrase.",
  },
  {
    slug: "paradox",
    name: "Paradox",
    description: "A statement that appears self-contradictory or absurd on its surface but reveals a coherent, often deeper truth on examination.",
  },
  {
    slug: "erotema",
    name: "Erotema",
    description:
      "A question posed for rhetorical effect, with an answer so strongly implied that none is stated — distinct from hypophora, which answers its own question aloud.",
  },
  {
    slug: "argument-from-analogy",
    name: "Argument from Analogy",
    description:
      "An argument that two cases resembling each other in the properties that matter should be judged alike, transferring a conclusion true of one to the other.",
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
  {
    slug: "decorum-fitting-style-to-occasion",
    title: "Decorum: Fitting Style to Occasion",
    subtitle: "Why the same argument can read as tone-deaf in one register and exactly right in another",
    summary:
      "How classical decorum (aptum) governs the fit between style, subject, audience, and occasion — and why matching register is a rhetorical skill distinct from politeness or formality.",
    order: 5,
    categorySlug: "appeals",
    deviceSlugs: ["decorum"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Decorum Actually Is",
        content: `Classical rhetoricians called it decorum in Latin, to prepon in Greek, or aptum more technically: the principle that style, tone, and diction must fit the subject being discussed, the character of the speaker, the audience listening, and the occasion itself. It is tempting to hear "decorum" and think of manners — of politeness, formality, staying within the lines of what is proper to say. That is not what the term means here, and treating it that way is the single most common misreading of the concept. Decorum is not a code of etiquette; it is a judgment of fit. A eulogy can require decorum that is plain, halting, and understated. A protest speech can require decorum that is blunt, angry, even transgressive — if bluntness is what the subject and the moment actually demand. Politeness and decorum can point in entirely opposite directions.

What decorum actually governs is mismatch. Ornate, elevated language applied to a small private grief is a decorum failure, not because it is improper, but because it is the wrong tool for what the occasion needs. Casual, offhand phrasing applied to a matter of grave consequence is a decorum failure for the same reason: the register doesn't carry the weight the subject actually has. Classical teaching organized style into roughly three registers — a grand or high style suited to moving an audience on momentous matters, a plain style suited to teaching and clarifying, and a middle style suited to pleasing and elaborating — but decorum sits above the choice of any one of these. It is the prior judgment of which register belongs here, for this audience, on this subject, at this moment.

Decorum also has a hidden connection to ethos. A speaker who adopts a register their actual position doesn't entitle them to — grand, heroic language for a minor personal complaint; the confident authority of an expert from someone with no standing on the subject — breaches decorum even when the sentences are grammatically flawless, and the breach undercuts credibility precisely because the audience can feel the mismatch between who is speaking and how they've chosen to sound.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Techniques for Matching Style to Occasion",
        content: `Four checks let a writer test fit before committing to a register:

1. **Weigh the subject before choosing diction.** Match the gravity of your language to the actual stakes involved, not to how important the matter feels to you personally in the moment of writing.
2. **Calibrate formality to the audience's real relationship to you and to the material.** Vocabulary, sentence complexity, and distance should reflect what the audience already shares with you — a shared history, a shared vocabulary, a shared stake — not a generic default register you reach for out of habit.
3. **Let the occasion set the emotional volume.** Restraint is often correct where an audience is raw, grieving, or already overwhelmed; expansiveness may be earned where an audience is receptive and has appetite for build-up. Volume mismatched to audience state reads as either cold or overwrought regardless of the words chosen.
4. **Check whether your own position actually licenses the register you've picked.** Do not borrow the authority of a role, a relationship, or an experience you don't occupy — audiences detect borrowed authority quickly, and it costs more credibility than a plainer, more honestly-scaled register would have.

Consider a manager announcing layoffs. A weak version reaches for a breezy, minimizing register mismatched to the actual stakes: *"Hey everyone! Big changes coming to the team — an exciting shakeup, and unfortunately that means a few folks won't be sticking around. Wishing them the best on their next adventure!"* A stronger version matches plain, direct language to the true weight of what's being said: *"I have to tell you something difficult: eleven people on this team are losing their jobs this week, through no fault of their own. I want to explain why, and what we owe the people leaving, before I say anything else."* Both passages are competently written. The first fails not because its grammar is bad but because its register — casual, celebratory, euphemistic — is the wrong size for the subject it is carrying.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Lincoln's Second Inaugural Address (1865)",
        content: `Delivered on March 4, 1865, weeks before the Civil War's end and weeks before his own assassination, Lincoln closed his second inaugural address with this passage: "With malice toward none, with charity for all, with firmness in the right as God gives us to see the right, let us strive on to finish the work we are in, to bind up the nation's wounds, to care for him who shall have borne the battle and for his widow and his orphan, to do all which may achieve and cherish a just and lasting peace among ourselves and with all nations."

The occasion could easily have called for a triumphant register: the Union's victory was all but secured, and a lesser speech might have used the moment to celebrate vindication or assign blame. Lincoln's decorum lies precisely in his refusal of that register. The diction is plain and almost liturgical rather than martial or celebratory; the syntax builds through soft, care-oriented infinitives — "to bind up," "to care for," "to do all which may achieve and cherish" — rather than through declarations of triumph. This was the correct fit for an occasion that was not really about victory at all, but about the far harder work of reunifying a country that would have to live with itself afterward. A grander, more self-congratulatory style would have been rhetorically available to him and would have fit the military facts of the moment; it would also have alienated exactly the audience — a soon-to-be-reunified nation, including the defeated South — whose cooperation the speech needed to secure. The plainness is the argument: it enacts the humility and reconciliation it is asking the country to adopt, rather than merely describing them.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Testing Fit Before You Commit to a Register",
        content: `- Have you matched register — word choice, sentence complexity, formality — to the actual weight of the subject, rather than to how you personally feel about it?
- Have you considered what your audience's real relationship to you and to the material licenses, rather than defaulting to a habitual register?
- Is the emotional volume of your language calibrated to what your audience can actually absorb right now, rather than to what would feel satisfying to write?
- Does your own position — role, credibility, relationship to the subject — actually entitle the register you've chosen, or are you borrowing an authority you haven't earned?
- If you swapped this passage into a very different occasion, would the mismatch be immediately obvious — confirming that this fit was earned deliberately, not accidental?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Choose a single piece of real or invented news you need to deliver — a departure, a failure, a change in plans, a diagnosis, an award. Write two versions of the same announcement, each 120-200 words: one whose style, tone, and diction genuinely fit the subject, audience, and occasion, and one that is recognizably wrong for the occasion (too casual for something grave, too grand for something small, too clinical for something personal). Label which is which.",
        instructions:
          "Do not simply make the 'wrong' version bad writing — make it competent prose in the wrong register, so the contrast demonstrates a mismatch of fit rather than a difference in quality.",
        minWords: 240,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Register Mismatch Demonstrated",
            description:
              "Do the two passages differ specifically in how well style, tone, and diction fit the stated subject, audience, and occasion, rather than merely differing in topic or in quality of writing?",
          },
          {
            order: 2,
            key: "audience_and_stakes_fit",
            label: "Style Matches Actual Stakes and Audience",
            description:
              "Does the 'fitting' passage calibrate formality, gravity, and vocabulary to the real weight of the subject and the audience's relationship to it, rather than defaulting to a generic or habitual register?",
          },
          {
            order: 3,
            key: "earned_authority",
            label: "Register Matches Speaker's Position",
            description:
              "Does the fitting passage avoid borrowing a register (heroic, clinical, breezy) that the speaker's actual role or relationship to the subject doesn't license?",
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
    slug: "enargeia-vivid-presence",
    title: "Enargeia: Bringing the Scene Before the Eyes",
    subtitle: "Vivid detail that makes an argument feel witnessed, not asserted",
    summary:
      "How classical enargeia uses selective, concrete sensory detail to make an absent scene feel immediately present — turning an abstract claim into something a reader experiences rather than merely believes.",
    order: 6,
    categorySlug: "appeals",
    deviceSlugs: ["enargeia"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Enargeia Actually Is",
        content: `Enargeia is the classical term — Cicero and Quintilian both wrote about it, sometimes rendering it in Latin as evidentia or demonstratio — for vivid description so concrete that an audience seems to see the scene "before their own eyes" (the phrase ancient critics used was ante oculos) rather than simply hear it reported secondhand. The common misconception is that enargeia just means "more description" — that piling on adjectives, or describing every visible feature of a scene, is what makes writing vivid. It is usually the opposite. Exhaustive description tends to blur into wallpaper; a reader's attention slides off a paragraph that names everything. True enargeia works through selection: a small number of exact, concrete, sensory particulars, chosen precisely because they let the reader reconstruct the rest of the scene themselves. The device does less telling and more implying than it appears to.

Enargeia's importance to the rhetorical appeals is that ancient rhetoricians treated it as proof-adjacent, not merely decorative. By rendering a disputed fact or its consequence vividly present, a writer invites the audience to react as though they were witnessing it directly — and that reaction can carry more persuasive weight than the identical claim stated abstractly. "The policy will cause suffering" is a proposition an audience can accept or doubt at a comfortable distance; a single rendered scene of one particular person's suffering under that policy is much harder to hold at that same distance. This is also exactly why the device carries risk: because its force comes from specificity rather than from volume of feeling, it can be used to make a false or exaggerated claim feel real through sheer vividness. Genuine enargeia earns its immediacy through exact, verifiable particulars; counterfeit enargeia substitutes emotional excess — tears, adjectives, italics — for the concrete detail that would actually justify the feeling.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Techniques for Achieving Vividness",
        content: `Four moves separate genuine enargeia from generic description:

1. **Choose two or three exact, concrete sensory details rather than cataloguing the scene.** Specificity does the work that volume of detail cannot — one precise, unexpected particular does more than ten generic ones.
2. **Use immediate, staged syntax.** Short clauses, active verbs, and present-feeling pacing (even when narrating something in the past) put the reader inside the moment rather than being told a summary of what happened.
3. **Anchor the scene through a single controlling sensation or action** — a sound, a smell, a specific gesture — rather than a list of unconnected facts. The anchor gives the reader's attention somewhere to stand.
4. **Let the detail argue for you.** Resist appending an explicit moral or conclusion immediately after the vivid image. The strongest use of enargeia trusts the rendered scene to produce the reader's judgment on its own.

Compare a flat, asserted version of a claim about neglect with a rendered one. Weak: *"The conditions at the facility were poor, and residents suffered from inadequate care in an unsanitary environment."* Strong: *"The corridor smelled of bleach laid over something older. In room 14, an untouched water pitcher sat three inches past an old man's reach, a thin ring of dust already settled on its rim. When we asked how long, an aide shrugged without looking up from her clipboard."* The second passage never states that care was inadequate — it doesn't need to. The exact detail (three inches, a ring of dust, a shrug without eye contact) does the arguing that the adjective "poor" only asserts.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Frederick Douglass, Narrative of the Life of Frederick Douglass, an American Slave (1845)",
        content: `&gt; "I have often been awakened at the dawn of day by the most heart-rending shrieks of an own aunt of mine, whom he used to tie up to a joist, and whip upon her naked back till she was literally covered with blood. No words, no tears, no prayers, from his gory victim, seemed to move his iron heart from its bloody purpose. The louder she screamed, the harder he whipped; and where the blood ran fastest, there he whipped longest. He would whip her to make her scream, and whip her to make her hush; and not until overcome by fatigue, would he cease to swing the blood-clotted cowskin."

Douglass is not arguing, in this passage, that slavery is cruel as a general proposition — he is staging one specific early morning: an exact time (dawn), an exact relation (his own aunt), an exact instrument (a joist, a cowskin whip), an exact sound (shrieks that wake a sleeping child). The sentence "He would whip her to make her scream, and whip her to make her hush" renders the arbitrariness of the violence directly rather than describing it as arbitrary — the reader watches the logic collapse in real time rather than being told it makes no sense. The opening clause, "I have often been awakened... by the most heart-rending shrieks," places the reader in Douglass's own aural position at the moment of waking, so the scene is not observed from a safe narrative distance but entered through the same sense — hearing — that first delivered it to him as a child.

This is enargeia doing exactly the proof-adjacent work classical rhetoricians assigned it: converting a legal and political abstraction — the institution of slavery — into a single, witnessed, remembered event that a reader cannot hold at arm's length the way they could hold an abstract claim about the cruelty of the system. A summary sentence asserting that enslaved people were treated with sadistic cruelty could be nodded past; this scene is considerably harder to nod past.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Testing Whether a Passage Achieves Enargeia",
        content: `- Have you chosen a small number of exact, concrete sensory details, rather than piling on adjectives or cataloguing every feature of the scene?
- Does your description place the reader in a specific position — a sound they hear, a moment they're standing inside — rather than summarizing the scene from a distance?
- Have you let the vivid detail imply your claim, rather than tacking an explicit moral or conclusion onto the end of it?
- Is every detail in the passage load-bearing — would removing it lose something specific, or is it decorative padding?
- If a skeptical reader challenged the underlying claim, would this scene function as evidence — a witnessed particular — rather than merely as color?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Choose a real or invented situation involving some form of neglect, harm, injustice, or hardship that you want a reader to feel is real rather than merely believe is true (a workplace, an institution, a policy's effect on one person, and so on). Write a single vivid passage, 180-350 words, that renders one specific scene through concrete sensory detail — sound, sight, smell, a specific gesture, an exact object — so a reader feels they are witnessing the moment rather than being told about it. Do not state your underlying claim directly.",
        instructions:
          "Resist the urge to catalogue everything about the scene. Choose only the handful of details that do real work, and let the reader's own reconstruction of the scene carry the argument you want them to reach.",
        minWords: 180,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Sensory Immediacy",
            description:
              "Does the passage render a specific scene through concrete, particular sensory detail that places the reader as if witnessing it, rather than summarizing or asserting a general claim?",
          },
          {
            order: 2,
            key: "selective_detail",
            label: "Selection Over Accumulation",
            description:
              "Are the details selected sparingly and specifically so each one does real work, rather than forming an exhaustive or generic catalogue of features?",
          },
          {
            order: 3,
            key: "implicit_argument",
            label: "Claim Carried by the Scene",
            description:
              "Does the vivid scene itself carry the argumentative point without an explicit stated moral or conclusion tacked onto it?",
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
    slug: "anadiplosis-and-climax",
    title: "Anadiplosis and Climax: Building a Chain of Escalation",
    subtitle: "Repeating a clause's last word as the next clause's first, link by link, toward a climax",
    summary:
      "How repeating the final word of one clause at the start of the next (anadiplosis) can be chained across three or more links into climax, or gradatio — a rhetorical staircase that escalates toward a culminating idea.",
    order: 5,
    categorySlug: "repetition",
    deviceSlugs: ["anadiplosis", "climax"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Anadiplosis Actually Is",
        content: `Anadiplosis is not simply "repeating a word" — plenty of repetition devices do that. What defines anadiplosis specifically is *position*: the last word or phrase of one clause becomes the first word or phrase of the next. "The mission demands sacrifice. Sacrifice, in turn, demands courage" is anadiplosis, because "sacrifice" closes the first clause and opens the second. A sentence like "The mission demands sacrifice and courage" repeats no word at all and isn't anadiplosis; a sentence like "The mission is hard. The mission is worth it" repeats a word but at the *same* position in both clauses (the start), which makes it anaphora, not anadiplosis. The hinge position — last word becomes first word — is the whole device.

That hinge does specific work: it forces the reader to carry a term forward across a clause boundary they would otherwise treat as a full stop, so the two clauses read as linked rather than merely adjacent. Extend that hinge across three or more clauses, each one escalating in weight past the last, and you get climax (from the Greek *klimax*, "ladder"; also known by its Latin name, gradatio) — a chain of anadiplosis that doesn't just link clauses but climbs, so the final link lands as a culmination the earlier ones were quietly building toward.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Building a Chain That Climbs Instead of Loops",
        content: `A chain built on anadiplosis can fail in one specific way: it can repeat correctly at every hinge and still go nowhere, because the ideas being chained loop back on themselves instead of building. The mechanical requirement — carry the exact word forward — is easy to satisfy without doing the harder work of making each link matter more than the one before it.

Compare: *"Practice creates habit. Habit creates repetition. Repetition creates practice."* Every hinge is technically correct, but the chain closes in a circle — by the third clause we're back where we started, and the passage feels like a syllogism gone stale rather than an escalation. Now compare: *"Effort produces skill. Skill produces confidence. Confidence produces the willingness to take a real risk. And the willingness to take a real risk, more than any inherited talent, produces a life worth remembering."* Each link is measurably heavier than the last — skill matters more than effort, confidence enables more than skill alone, and risk-taking is reframed in the final clause as the actual source of a meaningful life. The final clause also breaks the exact hinge pattern slightly, restating a fuller phrase rather than a single word — a deliberate signal that this is the last rung, not another link, which is the same technique that lets a climax resolve instead of merely continuing indefinitely.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Paul's Epistle to the Romans (5:3-5, King James Version)",
        content: `&gt; "...we glory in tribulations also: knowing that tribulation worketh patience; And patience, experience; and experience, hope: And hope maketh not ashamed; because the love of God is shed abroad in our hearts by the Holy Ghost which is given unto us."

This passage is one of the oldest examples cited in rhetorical handbooks specifically because the chain is so exact: "tribulation" closes the first clause and opens the second ("tribulation worketh patience... And patience"), "patience" closes that clause and opens the third ("patience, experience; and experience"), and "experience" does the same into "hope." Four terms — tribulation, patience, experience, hope — are welded together across four clauses, with no term introduced that isn't first earned by the one before it.

The chain is also not circular: it moves from something painful (tribulation) to something increasingly abstract and valuable (patience, then experience, then hope), arriving finally at the claim that this hope will not disappoint, because it rests on God's love. The theological argument and the rhetorical structure are the same thing here — Paul isn't decorating an argument with a device, he's using the device to enact the very claim he's making: that one state of mind genuinely, necessarily gives rise to the next.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Building Anadiplosis and Climax",
        content: `- Does the last word or phrase of one clause become the first word or phrase of the next, exactly — not a synonym or paraphrase?
- If you've chained three or more links, does each one escalate in weight or consequence, rather than looping back to where the chain started?
- Could a reader name what's actually increasing across the chain (stakes, abstraction, intensity), or is the escalation only implied by tone?
- Does the final link break the pattern in some small way — fuller phrasing, a changed sentence shape — to mark it as the climax rather than just the next rung?
- Read the chain aloud: does removing a middle link collapse the argument, proving each one is doing real work rather than padding the sentence?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage built around a chain of anadiplosis: at least three consecutive clauses in which the last word or phrase of one clause becomes the first word or phrase of the next, escalating toward a genuine climax.",
        instructions:
          "Build a chain of at least three links (four clauses). Each link should raise the stakes, abstraction, or intensity of the one before it — avoid a chain that loops back to its starting idea. You may break the exact repetition pattern in the final clause to mark it as the climax.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Anadiplosis Correctly Formed",
            description:
              "Does at least one clause end on a word or phrase that is then repeated as the opening of the next clause, rather than merely restating an idea using different words?",
          },
          {
            order: 2,
            key: "escalation",
            label: "Chain Escalates Toward a Climax",
            description:
              "Does each successive link in the chain escalate in weight, stakes, or consequence — rather than looping back on itself or staying flat — culminating in a genuine climax (gradatio)?",
          },
          {
            order: 3,
            key: "chain_integrity",
            label: "Repetition Is Exact, Not Approximate",
            description:
              "Is the repeated word or phrase carried forward exactly (not swapped for a synonym) at each link, so the chain reads as a deliberate structural device rather than a coincidental echo?",
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
    slug: "epizeuxis-and-diacope",
    title: "Epizeuxis and Diacope: Repetition With No Room to Breathe",
    subtitle: "Repeating a word immediately, or breaking that repetition with a single interrupting phrase",
    summary:
      "Two closely related devices of immediate, emotionally charged repetition — epizeuxis (repeating a word back-to-back) and diacope (repeating it with a brief interruption) — and how to use them at a genuine peak of feeling rather than as a verbal tic.",
    order: 6,
    categorySlug: "repetition",
    deviceSlugs: ["epizeuxis", "diacope"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Epizeuxis and Diacope Actually Are",
        content: `Immediate word repetition is usually treated as a first-draft flaw to be edited out — "very very," "no no," the kind of accidental doubling a copyeditor strikes automatically. Epizeuxis is what that same repetition becomes when it's deliberate: a word or phrase repeated back-to-back, with nothing in between, because a single instance of the word can't carry the emotional weight the moment demands. "Horror" said once is a description; "horror, horror, horror" is closer to the sound someone actually makes when language is failing them in real time. The repetition isn't redundant — it's iconic, performing the very inarticulacy it names.

Diacope is the same impulse with one difference: a brief phrase interrupts the two instances of the repeated word instead of nothing at all. "Gone. Gone" is epizeuxis; "Gone — well and truly gone" is diacope, because the interrupting phrase sits between the two repetitions. That interruption isn't wasted space — it's usually where the writer sneaks in the detail that makes the repeated word specific rather than generic ("well and truly" tells you this isn't a temporary absence). The two devices sit on a continuum of the same technique: epizeuxis is repetition with zero gap, diacope is repetition with a gap small enough that the two instances still feel like one continuous outburst rather than two separate statements.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Where the Device Earns Its Place — and Where It's a Tic",
        content: `Both devices depend entirely on restraint. A word repeated at a real peak of shock, grief, or urgency reads as involuntary — as though the writer couldn't help it. The identical repetition used routinely, or used to inflate an ordinary moment ("very, very tired," "really, really wanted it"), reads as a verbal tic, because there's no actual spike in intensity to justify the doubling. The test is whether the sentence would feel like a slight anticlimax with only one instance of the word — if it wouldn't, the repetition isn't earning its keep.

Compare: *"She was very, very sad when she heard, and it was a really, really hard day."* Both repetitions here are filler intensifiers doing a job any single strong word could do alone — the sentence would lose nothing by cutting them. Now compare: *"Gone. Gone — not delayed, not misplaced, gone — was the only word that fit, and every attempt to soften it only made the truth louder."* The first "Gone. Gone" is epizeuxis at the sentence's opening, functioning almost like a held breath before the sentence continues; the second pairing is diacope, with the interrupting phrase ("not delayed, not misplaced") doing real work — ruling out the softer alternatives the word might otherwise imply — before the repeated word returns to close off any remaining doubt.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Shakespeare: Macbeth and Richard III",
        content: `Epizeuxis (Macduff, discovering the murdered king, *Macbeth*, Act 2, Scene 3):
&gt; "O horror, horror, horror! Tongue nor heart cannot conceive nor name thee!"

Diacope (Richard III, unhorsed on the battlefield, *Richard III*, Act 5, Scene 4):
&gt; "A horse! a horse! my kingdom for a horse!"

Macduff's line repeats "horror" three times with nothing between the instances — pure epizeuxis — and the next clause explains why: he immediately says that tongue and heart *cannot* name what he's seen, so the triple repetition is doing the naming that ordinary vocabulary has just failed to do. Richard's line starts the same way — "a horse! a horse!" repeats with no gap, epizeuxis exactly like Macduff's — but then the pattern shifts: instead of a third bare repetition, the phrase "my kingdom for" interrupts before "a horse" returns a third time. That interruption is the entire point of the line: it converts a cry of panic into a specific, staggering offer, naming the exact price — a kingdom — the desperate king is willing to pay. The line moves from epizeuxis into diacope in real time, and the shift tracks Richard's own shift from wordless panic to a concrete, ruinous bargain.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Epizeuxis and Diacope",
        content: `- Is the repeated word or phrase placed at a genuine peak of emotion or urgency, rather than used to inflate an ordinary moment?
- For epizeuxis, are the two (or more) instances truly adjacent, with nothing at all between them?
- For diacope, is the interrupting material brief, and does it add real information — rather than just delaying the repeat?
- Would the sentence feel like an anticlimax with only a single instance of the word, proof the repetition is earning its place?
- Have you reserved the device for one moment in the passage, rather than repeating the pattern until it reads as a tic?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-350 word passage — narrative or reflective — that includes one clear moment of epizeuxis (a word or phrase repeated immediately, with nothing between the instances) and one clear moment of diacope (a word or phrase repeated with a brief interrupting phrase between the two instances).",
        instructions:
          "Both moments should occur at genuine peaks of feeling or urgency in the passage — do not use either device as a routine intensifier (e.g., 'very, very'). The interrupting phrase in your diacope moment should add real information, not just delay the repeat.",
        minWords: 200,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Epizeuxis Correctly Formed",
            description:
              "Is there at least one moment where a word or phrase is repeated immediately, with no intervening words, at a genuine peak of emotional intensity rather than as filler?",
          },
          {
            order: 2,
            key: "diacope_used",
            label: "Diacope Correctly Formed",
            description:
              "Is there at least one moment where a word or phrase is repeated with a brief interrupting word or phrase between the two instances, where the interruption itself adds meaning rather than just delaying the repeat?",
          },
          {
            order: 3,
            key: "restraint",
            label: "Reserved for a Single Climactic Moment",
            description:
              "Are both devices used sparingly — reserved for one genuine peak in the passage — rather than scattered throughout until they read as a verbal tic?",
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
    slug: "isocolon-and-measured-phrasing",
    title: "Isocolon: Balance by Equal Measure",
    subtitle: "When clauses match not just in structure but in length",
    summary:
      "How isocolon tightens parallelism by requiring matched clauses to be roughly the same length as well as the same grammatical shape, producing a rhythmic 'click' of balance that looser parallel structures don't achieve.",
    order: 5,
    categorySlug: "balance",
    deviceSlugs: ["isocolon"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Isocolon: Equal Members, Not Just Matching Shapes",
        content: `Isocolon (from the Greek *isos*, "equal," and *kolon*, "limb" or "clause") is the pairing or sequencing of clauses that match not only in grammatical form but in length — roughly the same number of words or syllables, falling into the same rhythmic stride. This is the common misconception worth correcting: isocolon is often treated as a synonym for parallelism in general, but parallelism only requires that coordinate elements share grammatical structure ("she came, she saw, she left" is parallel even if you swap in a much longer third clause). Isocolon adds a second, stricter requirement — that the members also be roughly equal in weight, so the ear registers them as the same size, not just the same shape.

That second requirement is what produces the effect people actually notice: the felt symmetry of a well-built isocolon, the sense that a sentence has been machined rather than merely arranged. A pair or series can be grammatically parallel and still land unevenly if one clause runs twice as long as its neighbor. Isocolon is what happens when a writer goes back and trims or pads until the clauses are truly interchangeable in size, not just in form. It overlaps with tricolon (a series of exactly three matched units) and often co-occurs with antithesis or chiasmus, but it is defined independently of both — a two-part isocolon that expresses no contrast at all, and no reversal of word order, is still isocolon as long as its two halves are equal.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Trimming Until It Balances",
        content: `Building isocolon is mostly a revision skill: write the parallel clauses first, then measure them against each other and cut or expand until they sit at the same length. Filler words, hedges, and extra qualifiers are usually what's making one clause outrun its partner, and removing them tends to sharpen the sentence's meaning at the same time it equalizes its rhythm — the two edits reinforce each other.

Weak (parallel in structure, unequal in length): "The new manager listened carefully to every complaint the staff brought to her, and she made changes." Both halves are clauses joined by "and," so the sentence is technically parallel, but the first clause is long and specific while the second is short and vague, so the sentence tips over rather than balancing.

Strong (isocolon): "She heard every complaint; she fixed every problem." Now both clauses are four words, both open with "she," both close with a paired noun phrase, and both carry equal grammatical weight. The meaning hasn't been softened — if anything it's sharper — but the sentence now lands with a click instead of a shrug. Isocolon rewards this kind of ruthless trimming: the goal isn't to add ornamental symmetry but to find the shortest form in which the two ideas are already, in fact, equivalent.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Ecclesiastes 3:1-4, King James Version (1611)",
        content: `Few passages in English rely on isocolon as thoroughly as the "season" passage from Ecclesiastes:

&gt; "To every thing there is a season, and a time to every purpose under the heaven: A time to be born, and a time to die; a time to plant, and a time to pluck up that which is planted; A time to kill, and a time to heal; a time to break down, and a time to build up; A time to weep, and a time to laugh; a time to mourn, and a time to dance."

Each pair here — "a time to be born, and a time to die," "a time to kill, and a time to heal" — is built from two clauses of nearly identical length and identical shape ("a time to" plus a one-syllable or two-syllable verb), differing only in the single word that carries the opposition. Because the surrounding structure is so exactly equal, that one word is the only thing left for the ear to notice, so the contrast (birth against death, killing against healing) arrives with unusual force even though it is stated as flatly as possible.

The passage also shows how isocolon scales: it isn't limited to a single balanced pair but can be extended across many pairs in sequence, each one reinforcing the pattern the last one established. By the time the passage reaches "a time to weep, and a time to laugh," the reader has been trained by five prior pairs to expect exact equality, so any deviation from that template would now read as a deliberate break rather than mere variation.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Isocolon",
        content: `- Are the matched clauses not just the same grammatical shape, but roughly the same length — similar word count, similar syllable count?
- Does reading the passage aloud produce an even, matched rhythm, or does one clause noticeably outrun the other?
- Have you cut filler or hedging words from the longer clause rather than padding the shorter one, so the balance comes from precision rather than inflation?
- If the isocolon carries a contrast or comparison, is that contrast concentrated in as few words as possible, so the equal structure around it makes the difference stand out?
- Have you used the device only where the underlying ideas are genuinely equivalent in weight — not forced into false balance where one side actually matters more than the other?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 150-300 word passage — a piece of advice, a reflection, or a short argument — built around at least one isocolon: two or more clauses matched in both grammatical structure and length.",
        instructions:
          "Draft the parallel clauses first, then revise them so they are close to equal in word count and syllable count. At least one isocolon pair should carry a real contrast or comparison, not just decorative repetition.",
        minWords: 150,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct Use of Isocolon",
            description:
              "Does the passage include at least one instance of clauses matched in both grammatical structure and approximate length, not merely matched in structure alone?",
          },
          {
            order: 2,
            key: "balance_and_rhythm",
            label: "Rhythmic Balance",
            description:
              "Read aloud, do the matched clauses land with an even, equal-weighted rhythm rather than one clause noticeably outrunning the other?",
          },
          {
            order: 3,
            key: "meaningful_equivalence",
            label: "Genuine Equivalence",
            description:
              "Does the isocolon express ideas that are actually comparable in weight or significance, rather than forcing unequal ideas into artificial balance?",
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
    slug: "hendiadys-and-doubled-nouns",
    title: "Hendiadys: Splitting One Idea into Two Nouns",
    subtitle: "Why 'sound and fury' hits harder than 'furious sound'",
    summary:
      "How hendiadys expresses a single complex idea by coordinating two nouns with 'and' instead of using a noun and its modifier, and why the split creates weight and strangeness that a plain adjective-noun pairing can't.",
    order: 6,
    categorySlug: "balance",
    deviceSlugs: ["hendiadys"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Hendiadys: One Idea, Two Nouns",
        content: `Hendiadys (from the Greek *hen dia dyoin*, "one through two") takes an idea that would ordinarily be expressed as a modifier and a noun — "nice warmth," "furious sound" — and instead expresses it as two nouns joined by "and": "nice and warmth" (or, in its familiar colloquial form, "nice and warm"), "sound and fury." Grammatically the two nouns are coordinate, equal partners in an "and" construction. Conceptually they are not two separate things at all — they fuse into a single, heightened impression, with one noun doing the work a modifier would normally do.

The misconception worth correcting is that hendiadys is just redundancy — two words for one thing, padding dressed up as a device. Genuine hendiadys does the opposite of padding: it doesn't repeat a single meaning twice, it manufactures a meaning that neither noun quite has on its own. "Sound and fury" is not "sound" plus, separately, "fury" — it's a sound that is itself furious, an image stranger and more violent than "a furious sound" would produce, because the grammar refuses to subordinate one term to the other. It's also worth distinguishing hendiadys from an ordinary compound like "bread and butter" or "law and order," where the two nouns really are two distinct things sitting side by side. Hendiadys only occurs when the two nouns, despite their coordinate grammar, are functioning as a single idea.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Splitting the Modifier Off the Noun",
        content: `The mechanical move behind hendiadys is simple: take a noun phrase built from an adjective and a noun, and instead coordinate two nouns (or nominalize the adjective) joined by "and." The unusual grammar slows the reader down for a beat, and that beat is where the device's weight comes from — the two nouns don't collapse back into a single modified noun as quickly as the mind expects, so the image lingers and intensifies before it resolves.

Weak (ordinary adjective + noun): "They crossed the cold, dark night without a lantern." This is perfectly clear, but it moves past the description quickly — "cold" and "dark" are just qualities attached to "night," processed and discarded in an instant.

Strong (hendiadys): "They crossed the cold and the dark of that night without a lantern." Now "cold" and "the dark" are nouns in their own right, coordinated rather than subordinated, and the sentence asks the reader to hold both as substantial things being crossed — not adjectives describing the night, but almost co-equal terrains alongside it. The device tends to suit moments a writer wants to slow down and weight — a threat, a grief, a landscape — rather than routine description, since overusing it across a passage makes ordinary modifiers start to feel needlessly inflated.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "William Shakespeare, Macbeth (c. 1606)",
        content: `The most frequently cited hendiadys in English literature comes from Macbeth's final soliloquy, after learning of Lady Macbeth's death:

&gt; "It is a tale / Told by an idiot, full of sound and fury, / Signifying nothing."

"Sound and fury" coordinates two nouns that, read literally, name two different things — a noise, and an emotion. But Macbeth isn't describing a sound accompanied by a separate fury; he's describing a single quality of raging, meaningless noise, the kind an idiot's tale would be "full of." Rewritten as a plain modifier — "full of furious sound" — the phrase would be clearer but flatter, subordinating "furious" to "sound" the way ordinary grammar expects. By coordinating the two nouns instead, Shakespeare keeps both terms equally weighted and lets the reader fuse them, which is exactly what the line needs: it arrives at the climax of a speech arguing that life itself is empty noise dressed up as meaning, and the ungrammatical-feeling doubling of "sound and fury" enacts that excess and disorder at the level of the sentence, not just its content.

The line also demonstrates how hendiadys concentrates meaning at the point of maximum despair in the speech — it is the phrase readers remember from the entire soliloquy, disproportionate to its three words, because the device forces a small pause exactly where the idea is most bleak.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Hendiadys",
        content: `- Have you taken an ordinary adjective-and-noun phrase and split it into two coordinate nouns joined by "and"?
- Do the two nouns fuse into a single heightened idea, rather than naming two genuinely separate things (which would just be an ordinary compound, not hendiadys)?
- Does the doubled construction slow the sentence down at a moment that actually deserves the extra weight, rather than being applied to routine description?
- Would rewriting the phrase back into a plain modifier-and-noun form ("furious sound" instead of "sound and fury") noticeably flatten the effect — confirming the split is doing real work?
- Have you used the device sparingly, so its slight grammatical strangeness still registers rather than reading as a verbal tic?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 150-300 word passage — descriptive, reflective, or narrative — that includes at least one clear hendiadys: an ordinary adjective-and-noun idea expressed instead as two coordinate nouns joined by 'and.'",
        instructions:
          "Use no more than one or two instances of the device. Make sure each pair of nouns genuinely fuses into a single idea rather than naming two separate things, and place it at a moment in the passage that can bear the added weight.",
        minWords: 150,
        maxWords: 300,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct Use of Hendiadys",
            description:
              "Does the passage include at least one instance of two coordinate nouns joined by 'and' that function as a single fused idea, rather than an ordinary adjective-noun phrase or a genuine compound of two separate things?",
          },
          {
            order: 2,
            key: "conceptual_fusion",
            label: "Genuine Fusion, Not Redundancy",
            description:
              "Do the two coordinated nouns produce a meaning distinct from — and stronger than — simply restating the same quality twice?",
          },
          {
            order: 3,
            key: "placement_and_restraint",
            label: "Weighted Placement and Restraint",
            description:
              "Is the device placed at a moment in the passage that earns its added weight, and used sparingly enough that it still reads as deliberate rather than habitual?",
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
    slug: "personification-and-prosopopoeia",
    title: "Personification and Prosopopoeia: Lending a Human Face to the Non-Human",
    subtitle: "How attributing a feeling to a thing differs from giving that thing a voice to speak",
    summary:
      "How personification transfers human agency and interiority onto a non-human or abstract subject, how prosopopoeia goes further and lets that subject speak in its own first-person voice — and why the second device is a demanding, extended case of the first rather than a separate trick.",
    order: 5,
    categorySlug: "tropes",
    deviceSlugs: ["personification", "prosopopoeia"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Two Degrees of Humanizing the Non-Human",
        content: `Personification is often treated as pure decoration — a "poetic" habit of saying "the wind whispered" or "the sun smiled" to make description feel less flat. That undersells what the device actually does. Personification is a substitution trope: it transfers human agency, motive, or interiority onto something that literally possesses none, and that transfer changes how a reader assigns responsibility, sympathy, or blame. Saying "the market panicked" rather than "prices fell sharply as many people sold at once" doesn't just decorate a fact — it recasts a diffuse, leaderless process as a single anxious actor, which shapes how the reader thinks about cause and fault even when no one intends a lie.

Prosopopoeia is not a different device so much as personification taken to its logical extreme. Ordinary personification attributes a trait, an emotion, or an action to a non-human or abstract subject, usually briefly, within a sentence or two ("Opportunity knocks," "History will judge us"). Prosopopoeia commits further: it puts actual words into that subject's mouth, sustaining a first-person voice for an entity that cannot literally speak — an absent person, a dead ancestor, an abstraction like Justice or Death, an inanimate object. Every instance of prosopopoeia is personification, but not every personification goes as far as giving its subject a quoted voice.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Specificity Is What Makes It Work",
        content: `Weak personification borrows a single verb and stops there: "the wind howled," "time marches on," "the deadline was creeping closer." These phrases are so worn that a reader's mind slides past them without any real transfer of agency happening — they register as dead metaphor, not as a live rhetorical move. Strong personification commits to a specific, consistent set of human behaviors, so the non-human subject accumulates an implied psychology rather than borrowing one loose adjective. Compare: "The deadline was approaching fast, and it felt stressful" (weak — generic, tells the reader the feeling instead of producing it) against "The deadline had been circling the calendar for a week, tapping its foot at the top of every page, and by Thursday it had stopped waiting politely and started rattling the doorknob" (strong — a consistent, specific character: impatient, then rude, drawn out across several concrete actions).

Prosopopoeia asks for one further commitment: a moment where the subject stops being described and starts speaking. Extending the example above, a writer moving from personification into prosopopoeia might add: "If the deadline could talk, it would not have argued or threatened. It would only have said, evenly, 'I have already arrived. You are the one who is late.'" The shift has to be legible — through quotation marks, a clear framing clause, or both — so the reader knows a line is the subject's own voice rather than continued narration. Prosopopoeia that blurs this boundary reads as confusing rather than eerie or persuasive.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Dickinson's Death as Suitor (Personification) and Shelley's Speaking Ruin (Prosopopoeia)",
        content: `Emily Dickinson's "Because I could not stop for Death" opens with one of the most famous personifications in American poetry:

&gt; "Because I could not stop for Death – / He kindly stopped for me – / The Carriage held but just Ourselves – / And Immortality."

Death is not rendered as skeleton or reaper but as an unhurried, courteous gentleman caller who "kindly" interrupts the speaker's busy day for a carriage ride. The personification is sustained and specific — Death has manners, a vehicle, an unhurried pace — rather than borrowed from a single stock verb, and the incongruity between the genteel social scene and the subject's actual finality is exactly where the poem's quiet unease lives.

For prosopopoeia, Percy Bysshe Shelley's "Ozymandias" gives a shattered monument an actual first-person voice, reported secondhand by a traveler describing the ruined statue's pedestal:

&gt; "My name is Ozymandias, king of kings: / Look on my works, ye Mighty, and despair!"

The inscription lets a long-dead king address the reader directly, in his own words, across centuries — a textbook instance of prosopopoeia, since a voiceless object (a broken pedestal) is made to speak for an absent, now-silent figure. The device compounds the poem's central irony: the boast of permanence survives only as a fragment of speech carved on the very ruin that disproves it, so the "voice" Shelley grants the statue ends up testifying against its own claim.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Working with Personification and Prosopopoeia",
        content: `- Does your personified subject display a specific, consistent set of human behaviors, rather than one borrowed, cliché verb?
- If you use prosopopoeia, is the shift into the subject's own first-person voice clearly marked, so the reader isn't unsure whether a line is narration or quoted speech?
- Have you avoided switching the personified subject's implied personality partway through (patient, then panicked, then indifferent) without a reason?
- Does the personification or prosopopoeia change how the reader assigns responsibility, sympathy, or blame — or is it just decorative filler that could be cut without loss?
- Would a reader recognize the device as a deliberate figurative move, rather than mistaking it for a literal (and false) claim that the subject actually acted or spoke?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage (personal essay, descriptive scene, or short narrative) that includes at least one clear instance of personification — a non-human or abstract subject given specific, sustained human behavior, not just a single borrowed verb — and one clear instance of prosopopoeia, where that same subject (or a different one) is given actual first-person, quoted speech.",
        instructions:
          "Keep the personification specific and consistent: commit to one implied psychology for the subject rather than switching traits at random. When you shift into prosopopoeia, mark the change clearly, with quotation marks or a framing line, so the reader knows the subject is now speaking in its own voice rather than merely being described.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct, Distinct Use of Personification and Prosopopoeia",
            description:
              "Does the passage include a clear, sustained instance of personification (specific, consistent human behavior attributed to a non-human or abstract subject) and a clear instance of prosopopoeia (that subject, or another, given actual first-person speech)?",
          },
          {
            order: 2,
            key: "specificity",
            label: "Personification Is Specific, Not Generic",
            description:
              "Does the personified subject display a coherent, specific implied psychology — a consistent motive, habit, or attitude — rather than a single cliché verb attached without development?",
          },
          {
            order: 3,
            key: "voice_distinction",
            label: "Prosopopoeia's Voice Is Clearly Marked",
            description:
              "Is it unambiguous where description ends and the subject's own first-person voice begins, so the reader is never left wondering whether a line is narration or quoted speech?",
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
    slug: "oxymoron-and-paradox",
    title: "Oxymoron and Paradox: Contradiction as a Path to Truth",
    subtitle: "How a two-word contradiction and a whole-sentence one work by the same logic, at different scales",
    summary:
      "How oxymoron compresses a genuine contradiction into a single tight phrase and paradox extends the same structure across a full claim — why both devices work only when the surface contradiction resolves into a coherent point, rather than remaining pure nonsense.",
    order: 6,
    categorySlug: "tropes",
    deviceSlugs: ["oxymoron", "paradox"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "Contradiction at Two Scales",
        content: `Oxymoron and paradox are often filed under wordplay — a "clever error," good for a joke ("jumbo shrimp") but not for serious argument. That dismissal misses why the devices exist at all. Both work by placing two apparently contradictory terms next to each other and trusting the reader to find the level at which both are simultaneously true. Oxymoron compresses this into the smallest possible unit, usually a noun and a modifier that seem to cancel each other out ("cruel kindness," "loud silence," "bittersweet"). Paradox performs the identical maneuver at the scale of a full clause or sentence ("You have to be cruel to be kind," "The more you know, the more you realize you don't know"). The mechanism is the same; only the amount of contradictory material being compressed changes.

The common misconception treats the contradiction as the whole point — as if the device exists to be startling or funny and stops there. In serious use, the contradiction is a means, not an end: it exists because ordinary, non-contradictory vocabulary fails to name an experience that really does contain two opposed qualities at once. "Bittersweet" survives as a word not because it's a cute paradox but because plenty of real memories genuinely are both bitter and sweet simultaneously, and no single unmixed adjective captures that.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Making the Contradiction Resolve, Not Just Confuse",
        content: `An oxymoron works when both of its terms are genuinely, simultaneously true of the same subject — not merely two intensifiers slapped together for effect. It fails when the pairing is stale enough that the reader stops noticing there's a contradiction at all: "pretty ugly" or "awfully good" register as intensifiers, not as live figures, because overuse has worn the contradiction smooth. A paradox needs the same genuine double-truth, but because it operates at sentence length rather than two words, it usually also needs nearby context — an explanatory clause, a specific situation — to guide the reader toward the resolution; a bare contradiction with no supporting context reads as confusion rather than insight.

Compare a stale pair against an original one. Weak oxymoron: "It was a pretty ugly situation" — a dead intensifier, no real insight. Strong oxymoron: "Their goodbye was a cruel kindness — the mercy of finally saying, out loud, what both of them had known for months." Weak paradox: "You have to be cruel to be kind" — true, but so familiar it does no fresh work. Strong paradox: "The last honest thing he did was lie, so the truth would survive him." In the strong versions, the surrounding clause does the work of showing the reader exactly how the contradictory terms can both be true — which is what separates a resolved paradox from a phrase that merely sounds clever.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Romeo's Oxymorons of Lovesickness and Orwell's Paradoxes of Doublethink",
        content: `Before Romeo has even met Juliet, Shakespeare has him describe the disorienting feeling of infatuation entirely through a cluster of oxymorons, in *Romeo and Juliet*, Act 1, Scene 1:

&gt; "Why, then, O brawling love! O loving hate! / O any thing, of nothing first create! / O heavy lightness, serious vanity, / Misshapen chaos of well-seeming forms, / Feather of lead, bright smoke, cold fire, sick health, / Still-waking sleep, that is not what it is!"

Each pair — brawling love, loving hate, heavy lightness, cold fire — resolves the same way: love, as Romeo experiences it here, really does feel like two opposed sensations at once, and no single unmixed word captures that. The density of the cluster does further work beyond any one pairing: piling up contradiction after contradiction rhetorically enacts Romeo's emotional incoherence, so the form of the speech mirrors the confusion it describes.

Paradox can be used more critically, to characterize a way of thinking the author does not endorse rather than to state a truth the author holds. In George Orwell's *1984*, the ruling Party's three slogans, displayed on the face of the Ministry of Truth, are: "WAR IS PEACE. FREEDOM IS SLAVERY. IGNORANCE IS STRENGTH." Unlike Romeo's oxymorons, these paradoxes are not meant to resolve into a truth the reader accepts — they are presented so the reader recognizes doublethink, the Party's demand that citizens hold contradictory beliefs simultaneously as an act of political submission. Orwell uses paradox here to diagnose a technique of totalitarian control, which shows the device can characterize and critique a way of thinking just as effectively as it can state a genuine insight.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Working with Oxymoron and Paradox",
        content: `- Are both contradictory terms in your oxymoron genuinely, simultaneously true of the subject, rather than two intensifiers stacked for effect?
- Have you avoided reaching for a stale, worn oxymoron or paradox that no longer registers as a live contradiction?
- Does your paradox have enough surrounding context (an explanatory clause, a specific situation) for the reader to resolve it, rather than being left as an unexplained contradiction?
- Is your paradox meant to state a truth you hold, or to characterize a way of thinking you're critiquing — and is that distinction clear to the reader?
- Could a reader mistake your oxymoron or paradox for a simple error or careless phrasing, rather than a deliberate figure? If so, the surrounding sentence needs to signal intent more clearly.`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-400 word passage of persuasive or reflective prose that includes at least one original oxymoron (a compressed, two- or three-word phrase yoking genuinely contradictory terms) and one original paradox (a full-sentence or full-clause claim that appears self-contradictory but resolves into a coherent point given its surrounding context).",
        instructions:
          "Do not reuse well-worn oxymorons or paradoxes ('bittersweet,' 'you have to be cruel to be kind') — invent your own. Make sure the sentences around your paradox give the reader enough context to resolve it; a paradox with no supporting context reads as confusion rather than insight.",
        minWords: 200,
        maxWords: 400,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Correct, Original Use of Oxymoron and Paradox",
            description:
              "Does the passage include an original oxymoron (contradictory terms compressed into a single phrase) and an original paradox (a longer self-contradictory claim that resolves on reflection), each functioning as intended rather than as a lucky accident?",
          },
          {
            order: 2,
            key: "resolves_meaningfully",
            label: "Contradiction Resolves Into Insight",
            description:
              "Do both the oxymoron and the paradox genuinely resolve — is there a level at which both contradictory terms are true at once — rather than remaining pure nonsense or a superficial clash of adjectives?",
          },
          {
            order: 3,
            key: "context_support",
            label: "Surrounding Context Guides the Resolution",
            description:
              "Does the passage give the reader enough surrounding context (explanation, tone, situation) to resolve the paradox specifically, rather than leaving it as an isolated, unexplained contradiction?",
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
    slug: "rhetorical-question-erotema",
    title: "The Rhetorical Question: Asking Without Expecting an Answer",
    subtitle: "Posing a question so loaded that silence is the only answer it needs",
    summary:
      "How erotema uses a question to assert or deny something the audience is meant to answer only in their own mind — and how it differs from hypophora, which answers its own question aloud.",
    order: 5,
    categorySlug: "argumentation",
    deviceSlugs: ["erotema"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "What Erotema Actually Is",
        content: `Erotema — the traditional term for what's commonly called a rhetorical question — is a question posed not to gather information but to assert or deny a point so strongly that stating it directly would be redundant. The common misconception is that erotema is simply any question asked in the course of an argument, or that it's the same device as hypophora (the question a writer poses and then answers). Neither is true. A genuine information-seeking question invites an actual, possibly varied, answer. Erotema does the opposite: it's constructed so that only one answer is even conceivable, and the writer never states that answer — the question's phrasing does all the work of implying it.

This is also what separates erotema from hypophora, covered elsewhere in this course. Hypophora poses a question and then explicitly answers it in the writer's own voice, using the question mainly as a structural hinge to introduce content that follows. Erotema poses a question and stops — no answer follows, because none needs to. If a question is immediately followed by the writer supplying its answer, it has become hypophora, not erotema, and it does a different job: hypophora carries information forward; erotema converts an unstated conclusion into something the reader feels they arrived at themselves.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Earning the Implied Answer",
        content: `Erotema's persuasive power depends entirely on how obvious the implied answer genuinely is to the audience being addressed — which is exactly where writers most often overreach. It's tempting to reach for a rhetorical question to stand in for an argument you haven't actually made yet, hoping the question mark will supply the missing premises. It won't: if a reader could plausibly answer "well, actually, no," the question hasn't functioned as erotema at all — it has just exposed a gap where reasoning was supposed to be.

The device works when it caps material the writer has already built, rather than substituting for material never built. Compare:

Weak: "The board cut arts funding again this year. Isn't it time we finally took education seriously?"
This fails because the conclusion ("take education seriously") doesn't follow tightly from the single fact given — the connection between one funding cut and a sweeping indictment is asserted by the question's tone, not earned by anything preceding it. A skeptical reader can simply decline to supply the intended answer.

Strong: "The board has cut arts funding for the third year running, eliminated its counseling staff last spring, and is now proposing to cut the library budget too. At what point does 'temporary belt-tightening' stop describing a hardship and start describing the district's actual priorities?"
Here the implied answer ("at this point, now") is forced by an accumulation of three specific facts stated immediately before the question, not by the question's phrasing alone. The reader arrives at the conclusion because the evidence compels it — the question just declines to spell out what's already obvious.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: 'William Shakespeare, "The Merchant of Venice" (c. 1596–1598)',
        content: `In Act III, Scene I, Shylock answers his tormentors' contempt not with a direct claim ("I am as human as you") but with a chain of rhetorical questions built from concrete, undeniable particulars:

&gt; "Hath not a Jew eyes? hath not a Jew hands, organs, dimensions, senses, affections, passions? fed with the same food, hurt with the same weapons, subject to the same diseases, healed by the same means, warmed and cooled by the same winter and summer as a Christian is? If you prick us, do we not bleed? if you tickle us, do we not laugh? if you poison us, do we not die? and if you wrong us, shall we not revenge?"

Each question up through "do we not die?" has exactly one conceivable answer — yes — and Shakespeare never lets Shylock state it, because stating it would be weaker than forcing the Christian characters onstage, and the audience watching, to supply it themselves.

Note the structural risk this passage also demonstrates: the final question, "and if you wrong us, shall we not revenge?", is not nearly as self-evident as the ones before it — revenge doesn't follow from shared humanity as automatically as bleeding does. Shylock is counting on the momentum of five unimpeachable questions to carry a sixth, far more contestable one past an audience no longer pausing to check each step. That's erotema's central danger as well as its central power: stacked skillfully, undeniable questions can smuggle in a less certain one riding their momentum.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Using Erotema",
        content: `- Is the answer your question implies actually obvious to this audience, given what you've established — or are you hoping the question mark alone will make it seem obvious?
- Could a fair-minded reader honestly answer differently than you intend? If so, this isn't functioning as a rhetorical question yet.
- Have you built the necessary context immediately before the question, rather than asking it in place of building that context?
- Are you using the device sparingly enough that each instance still lands, rather than turning routine claims into questions out of habit?
- If a less certain claim is riding on the momentum of more obvious ones, would it still hold up if you slowed down and asked it on its own?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Write a 200-350 word persuasive passage on a topic of your choosing that uses at least two genuine rhetorical questions (erotema) — questions whose implied answer you never state directly, because the material immediately before each question has already made that answer unavoidable.",
        instructions:
          "Do not answer any of your questions in your own voice — the moment you do, the device becomes hypophora rather than erotema. Each question should follow specific, concrete material that makes its implied answer feel forced rather than merely asserted.",
        minWords: 200,
        maxWords: 350,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Rhetorical Questions",
            description:
              "Does the passage pose at least two questions with a single, unmistakable implied answer, left unstated rather than answered explicitly by the writer?",
          },
          {
            order: 2,
            key: "earned_implication",
            label: "Answer Actually Earned",
            description:
              "Is each question's implied answer forced by specific material established immediately beforehand, rather than merely asserted by the question's tone?",
          },
          {
            order: 3,
            key: "distinct_from_hypophora",
            label: "Left Unanswered, Used Sparingly",
            description:
              "Does the writer avoid explicitly answering any of the questions (which would make it hypophora), and are the questions used selectively rather than as a substitute for ordinary argument?",
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
    slug: "argument-from-analogy",
    title: "Argument from Analogy: Reasoning from What Alike Cases Share",
    subtitle: "Transferring a conclusion from a settled case to a disputed one by showing they match in the ways that matter",
    summary:
      "How analogical argument claims that two cases resembling each other in relevant respects should be judged alike — and how to test whether an analogy actually holds or merely looks alike on the surface.",
    order: 6,
    categorySlug: "argumentation",
    deviceSlugs: ["argument-from-analogy"],
    sections: [
      {
        order: 1,
        kind: SectionKind.EXPLANATION,
        heading: "More Than a Comparison",
        content: `Argument from analogy is often mistaken for a decorative comparison — the kind of vivid parallel a metaphor or simile draws to make an abstract idea easier to picture. It is not the same move. A metaphor doesn't need to be literally defensible; nobody expects "time is a thief" to survive scrutiny of whether time actually steals anything. Argument from analogy makes an actual truth claim: it asserts that because two cases share the properties that matter, whatever conclusion is true of the well-established case should also be true of the disputed one. That claim can be logically strong or weak, and — unlike a metaphor — it can be directly attacked.

The structure is straightforward: case A has properties that generate conclusion C; case B shares those same properties; therefore C likely holds for case B too. The entire argument turns on one word: relevant. Two cases can resemble each other in countless incidental ways while differing in the one property that actually produced the conclusion in the first place. An analogy that trades on incidental resemblance while ignoring a difference in the load-bearing property is not a weaker version of the argument — it is a different, invalid argument wearing the same shape.`,
      },
      {
        order: 2,
        kind: SectionKind.EXPLANATION,
        heading: "Testing Whether an Analogy Holds",
        content: `To build or evaluate an analogical argument, first isolate exactly which property of the source case is doing the logical work — the one that, if absent, would change the conclusion. Then check whether the target case actually shares that specific property, rather than a merely superficial resemblance. The strongest attack on an analogy is a disanalogy: a specific, relevant difference between the two cases that the arguer's parallel glossed over.

Weak: "Banning violent video games is like banning violent novels — both are just fiction, so if novels are protected, games should be too."
This asserts the analogy without defending it against the most obvious disanalogy: games are interactive in a way novels are not, and the argument never explains why that difference doesn't matter to the conclusion. It simply declares the cases alike and moves on.

Strong: "Like novels, violent video games are fictional depictions, consumed voluntarily, with no actual victim — and those are precisely the properties courts have relied on to extend protection to violent novels, not the medium's format. Interactivity changes how a work of fiction is experienced; it doesn't convert a depicted killing into an actual one, which is the distinction the novel cases were drawn on."
This version names the specific property that did the logical work in the source case (fictional depiction, voluntary consumption, no actual victim), confirms the target shares exactly that property, and directly addresses the obvious disanalogy (interactivity) instead of hoping no one raises it.`,
      },
      {
        order: 3,
        kind: SectionKind.CLASSICAL_EXAMPLE,
        heading: "Justice Oliver Wendell Holmes, Schenck v. United States (1919)",
        content: `Writing for a unanimous Supreme Court upholding the conviction of a man who had mailed anti-draft pamphlets during World War I, Holmes needed to explain why speech ordinarily protected by the First Amendment could be punished in this instance. He reached for an analogy rather than a rule:

&gt; "The most stringent protection of free speech would not protect a man in falsely shouting fire in a theatre and causing a panic."

The analogy claims that Schenck's pamphlets and a false shout of "fire" share the property that matters: both are speech acts whose danger comes from the circumstances of their utterance rather than the truth or value of their content, and free-speech protection has never extended to that category.

The line became one of the most quoted sentences in American law, but it has also been one of the most contested analogies, including by Holmes himself, who narrowed his own reasoning only months later in his dissent in *Abrams v. United States*. Critics have pointed to exactly the disanalogy the earlier weak example illustrates: a false shout of fire causes immediate physical panic with no intervening choice by anyone else, while a pamphlet urging resistance to the draft only leads to harm, if at all, through the independent, deliberative choices of its readers — a much longer and more breakable causal chain. Whether the analogy holds turns entirely on whether that difference is relevant to the conclusion, which is exactly the question any argument from analogy has to survive.`,
      },
      {
        order: 4,
        kind: SectionKind.SUMMARY,
        heading: "Checklist: Argument from Analogy",
        content: `- Have you identified the specific property of the source case that actually generates its conclusion, rather than just gesturing at a general resemblance?
- Does the target case genuinely share that property, or only a superficial similarity to it?
- Have you anticipated the most obvious disanalogy a skeptical reader would raise, and addressed it directly?
- Would your argument survive being restated as "A and B are alike in respect X, and X is what matters here" — or does it quietly rely on unrelated similarities?
- If someone pointed out a difference between your two cases, is your answer to why that difference doesn't matter, or do you not have one yet?`,
      },
    ],
    prompts: [
      {
        order: 1,
        prompt:
          "Choose a settled case (a law, precedent, policy, or widely accepted judgment) and a disputed case you want to argue should be treated the same way. Write a 250-450 word argument from analogy that identifies the specific property the settled case's conclusion depends on, shows your disputed case shares that property, and directly addresses the most obvious way the two cases differ.",
        instructions:
          "Name the load-bearing property explicitly rather than leaving the resemblance implicit, and address at least one real disanalogy instead of ignoring it.",
        minWords: 250,
        maxWords: 450,
        criteria: [
          {
            order: 1,
            key: "device_usage",
            label: "Genuine Argument from Analogy",
            description:
              "Does the passage explicitly identify a property shared between the two cases and argue that this shared property, not mere surface resemblance, transfers the conclusion from one to the other?",
          },
          {
            order: 2,
            key: "relevant_similarity",
            label: "Relevant Rather Than Superficial Similarity",
            description:
              "Is the identified shared property actually the one that generates the conclusion in the settled case, rather than an incidental or superficial point of resemblance?",
          },
          {
            order: 3,
            key: "addresses_disanalogy",
            label: "Confronts the Obvious Disanalogy",
            description:
              "Does the passage acknowledge and directly address the most obvious way the two cases differ, rather than ignoring it or hoping the reader won't notice?",
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
