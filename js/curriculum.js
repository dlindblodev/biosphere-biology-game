// curriculum.js
// The educational backbone of BIOSPHERE.
//
// Curriculum outline adapted from OpenStax "Concepts of Biology" (CC BY 4.0).
// Chapter sequence and learning objectives mirror the textbook; all narrative
// prose, characters, quizzes and the BIOSPHERE storyline are original work
// written for this game. Source attribution: OpenStax, Concepts of Biology,
// https://openstax.org/details/books/concepts-biology  (CC BY 4.0).

export const UNITS = [
  { n: 1, name: "The Cellular Foundation of Life", color: 0x35d0a5 },
  { n: 2, name: "Cell Division & Genetics",        color: 0x4aa3ff },
  { n: 3, name: "Molecular Biology & Biotech",     color: 0xb98cff },
  { n: 4, name: "Evolution & the Diversity of Life",color: 0xffb347 },
  { n: 5, name: "Animal Structure & Function",     color: 0xff6f91 },
  { n: 6, name: "Ecology",                          color: 0x7ed957 },
];

export const CHAPTERS = [
  // ───────────────────────── UNIT 1 ─────────────────────────
  {
    n: 1, unit: 1, visual: "intro_life", color: 0x35d0a5,
    title: "Introduction to Biology",
    room: "The Atrium of Living Things",
    objectives: [
      "Identify the shared properties of all living organisms",
      "Order the levels of biological organization, atom to biosphere",
      "Describe how the scientific method tests ideas about life",
    ],
    intro:
      "The doors seal behind you with a soft pneumatic sigh. HELIX, the station's "+
      "intelligence, flickers to life in pale green light. \"Cadet. The Biosphere is "+
      "failing — life itself is unravelling, level by level. To stop it you must "+
      "re-learn what life *is*. Start here, in the Atrium, where everything alive "+
      "is gathered.\"",
    concepts: [
      { t: "What makes something alive?",
        b: "Living things are not defined by any single trait but by a bundle of them, "+
           "all present at once. Every organism is built of one or more cells, uses "+
           "energy, grows and develops, responds to its environment, maintains a steady "+
           "internal state (homeostasis), reproduces, and — across generations — evolves. "+
           "A crystal grows; a flame uses energy; but only life does all of these together." },
      { t: "Levels of organization",
        b: "Life is organized like nested boxes. Atoms bond into molecules; molecules "+
           "assemble into organelles; organelles form cells; cells of one type form tissues; "+
           "tissues form organs; organs form an organism. Above the organism: populations, "+
           "communities, ecosystems, and finally the biosphere — every living thing on Earth. "+
           "The Withering is climbing *down* this ladder, and we must climb back up." },
      { t: "The scientific method",
        b: "Biology is a way of asking questions, not a list of facts. You observe, form a "+
           "hypothesis (a testable explanation), predict what should happen if it's true, then "+
           "experiment with controls to isolate one variable. Results that survive repeated, "+
           "honest testing become theories — the strongest thing science offers." },
    ],
    quiz: [
      { q: "Which is NOT a property shared by all living organisms?",
        a: ["Made of cells","Uses energy","Made of metal","Reproduces"], c: 2,
        e: "All known life is cellular, uses energy and reproduces. Being metallic is not a property of life." },
      { q: "Order from smallest to largest:",
        a: ["Cell → Atom → Tissue","Atom → Cell → Tissue → Organ","Organ → Tissue → Atom","Biosphere → Cell → Atom"], c: 1,
        e: "Atoms build molecules and cells; cells build tissues, which build organs." },
      { q: "A good scientific hypothesis must be:",
        a: ["Impossible to test","Testable and falsifiable","Always correct","A proven fact"], c: 1,
        e: "A hypothesis must make predictions that an experiment could potentially prove wrong." },
    ],
    clue: "HELIX whispers: \"The first shard is restored. Life is *organized energy*. Remember that phrase — it is the key to everything.\"",
  },
  {
    n: 2, unit: 1, visual: "chemistry", color: 0x35d0a5,
    title: "Chemistry of Life",
    room: "The Molecular Forge",
    objectives: [
      "Describe atoms, elements, and how chemical bonds form",
      "Explain why water's properties make life possible",
      "Identify the four classes of biological macromolecules",
    ],
    intro:
      "The Forge hums with drifting spheres of light — atoms, HELIX explains, the "+
      "smallest pieces of ordinary matter. \"Before cells, before life, there was "+
      "chemistry. Master the bonds, Cadet, and you will understand what the Withering "+
      "is breaking.\"",
    concepts: [
      { t: "Atoms and bonds",
        b: "An atom has a nucleus of protons and neutrons orbited by electrons. Atoms bond "+
           "to fill their outer electron shells. In a covalent bond they *share* electrons "+
           "(strong, stable). In an ionic bond one atom donates an electron to another, and "+
           "the resulting opposite charges attract. These bonds store the energy life runs on." },
      { t: "The magic of water",
        b: "Water is polar: oxygen hogs the shared electrons, giving it a slightly negative "+
           "end and two slightly positive hydrogens. Polar water molecules cling to each other "+
           "with hydrogen bonds. This cohesion lets water climb plant stems, moderate temperature, "+
           "and dissolve the molecules of life. Without water's quirks, no living chemistry works." },
      { t: "The four macromolecules",
        b: "Life builds four giant molecules from small repeating units: carbohydrates (sugars "+
           "for quick energy and structure), lipids (fats and membranes that don't mix with water), "+
           "proteins (chains of amino acids that do nearly all the work of the cell), and nucleic "+
           "acids (DNA and RNA, which store and carry information)." },
    ],
    quiz: [
      { q: "A bond where atoms SHARE electrons is:",
        a: ["Ionic","Covalent","Magnetic","Nuclear"], c: 1,
        e: "Covalent bonds share electrons; ionic bonds transfer them." },
      { q: "Water can dissolve so many substances because it is:",
        a: ["Nonpolar","Polar","Acidic always","Metallic"], c: 1,
        e: "Water's polarity lets it surround and separate charged and polar molecules." },
      { q: "Proteins are built from monomers called:",
        a: ["Nucleotides","Amino acids","Glucose units","Fatty acids"], c: 1,
        e: "Amino acids link in chains that fold into functional proteins." },
    ],
    clue: "A shard reforms. \"Water carries a memory of structure,\" HELIX notes. \"The Withering dries it out — order collapses into noise.\"",
  },
  {
    n: 3, unit: 1, visual: "cell", color: 0x35d0a5,
    title: "Cell Structure & Function",
    room: "The Grand Cell",
    objectives: [
      "State the three points of the cell theory",
      "Compare prokaryotic and eukaryotic cells",
      "Match major organelles to their functions",
    ],
    intro:
      "You step *inside* a cell the size of a cathedral. Organelles drift past like "+
      "machinery in a flooded factory. \"Every living thing is made of these,\" HELIX "+
      "says. \"The cell is the smallest unit that is truly alive.\"",
    concepts: [
      { t: "The cell theory",
        b: "Three ideas, hard-won over centuries: (1) all living things are made of cells, "+
           "(2) the cell is the basic unit of life, and (3) all cells come from pre-existing "+
           "cells. Nothing alive escapes these rules." },
      { t: "Prokaryotes vs eukaryotes",
        b: "Prokaryotic cells (bacteria and archaea) are small and have no nucleus — their DNA "+
           "floats free. Eukaryotic cells (plants, animals, fungi, protists) are larger and pack "+
           "their DNA inside a membrane-bound nucleus, alongside many specialized organelles." },
      { t: "The organelle crew",
        b: "The nucleus stores DNA. Mitochondria release energy. Ribosomes build proteins. The "+
           "endoplasmic reticulum and Golgi apparatus fold, tag and ship those proteins. Lysosomes "+
           "recycle waste. Plant cells add a rigid cell wall and chloroplasts for photosynthesis. "+
           "Each organelle is a room with a job — like the rooms of this station." },
    ],
    quiz: [
      { q: "Which cell type has NO nucleus?",
        a: ["Eukaryotic","Prokaryotic","Plant","Animal"], c: 1,
        e: "Prokaryotes (bacteria/archaea) lack a membrane-bound nucleus." },
      { q: "The organelle that releases usable energy is the:",
        a: ["Ribosome","Mitochondrion","Golgi apparatus","Lysosome"], c: 1,
        e: "Mitochondria perform cellular respiration to produce ATP." },
      { q: "Proteins are assembled by:",
        a: ["Lysosomes","Ribosomes","The cell wall","Vacuoles"], c: 1,
        e: "Ribosomes read genetic instructions and link amino acids into proteins." },
    ],
    clue: "\"Three shards now,\" HELIX says. \"Notice — every cell comes from another cell. Cut that chain, and life cannot rebuild itself. *That* is the Withering's weapon.\"",
  },
  {
    n: 4, unit: 1, visual: "energy", color: 0x35d0a5,
    title: "How Cells Obtain Energy",
    room: "The Powerhouse",
    objectives: [
      "Explain how ATP stores and releases energy",
      "Summarize glycolysis, the Krebs cycle, and the electron transport chain",
      "Contrast aerobic respiration with fermentation",
    ],
    intro:
      "Heat rolls off the walls. Vast bean-shaped engines — mitochondria — pulse with "+
      "light. \"Cells need a currency to spend on work,\" HELIX says. \"They mint it here.\"",
    concepts: [
      { t: "ATP: the energy currency",
        b: "ATP (adenosine triphosphate) is a molecule with three phosphate groups held by "+
           "high-energy bonds. Snap off the last phosphate and energy is released to power the "+
           "cell's work; add it back later. Cells recharge ATP millions of times a day." },
      { t: "Cellular respiration",
        b: "To recharge ATP, cells break down glucose in three stages. Glycolysis splits glucose "+
           "in the cytoplasm. The Krebs (citric acid) cycle harvests its carbons inside the "+
           "mitochondrion. The electron transport chain then uses oxygen to capture the most "+
           "energy of all, producing the bulk of the cell's ATP." },
      { t: "When oxygen runs out",
        b: "Without oxygen, cells fall back on fermentation — far less efficient, but it keeps "+
           "glycolysis going. In your muscles this makes lactic acid (the burn of hard exercise); "+
           "in yeast it makes alcohol and the carbon dioxide that raises bread." },
    ],
    quiz: [
      { q: "The cell's main energy-carrying molecule is:",
        a: ["DNA","ATP","Glucose","Oxygen"], c: 1,
        e: "ATP stores energy in its phosphate bonds and is spent on cellular work." },
      { q: "Which stage produces the MOST ATP?",
        a: ["Glycolysis","Fermentation","Electron transport chain","None"], c: 2,
        e: "The oxygen-using electron transport chain yields the most ATP." },
      { q: "Fermentation occurs when there is no:",
        a: ["Glucose","Oxygen","Water","DNA"], c: 1,
        e: "Fermentation lets glycolysis continue without oxygen, at low efficiency." },
    ],
    clue: "The mitochondria flare bright. \"Energy must flow, or order decays. The Withering is *entropy* let loose — and you just pushed it back.\"",
  },
  {
    n: 5, unit: 1, visual: "photosynthesis", color: 0x35d0a5,
    title: "Photosynthesis",
    room: "The Solarium",
    objectives: [
      "Describe how chloroplasts capture light energy",
      "Distinguish the light reactions from the Calvin cycle",
      "Explain why photosynthesis underpins nearly all food chains",
    ],
    intro:
      "Light pours through a crystalline dome onto fields of green. \"Almost every "+
      "scrap of energy in the Biosphere began as sunlight,\" HELIX says. \"Plants are "+
      "the doorway between the sun and life.\"",
    concepts: [
      { t: "Capturing light",
        b: "Inside chloroplasts, the green pigment chlorophyll absorbs sunlight. The light "+
           "reactions, on stacked membranes called thylakoids, use that energy to split water "+
           "(releasing the oxygen you breathe) and to charge up energy carriers ATP and NADPH." },
      { t: "The Calvin cycle",
        b: "In the chloroplast's fluid stroma, the Calvin cycle spends that ATP and NADPH to "+
           "pull carbon dioxide from the air and build sugar — turning thin gas and light into "+
           "solid food. This is 'carbon fixation': lifeless CO₂ becoming the stuff of life." },
      { t: "Why it matters to everything",
        b: "Photosynthesis is the base of nearly every food chain. Plants feed herbivores, who "+
           "feed carnivores. And respiration (Chapter 4) runs photosynthesis in reverse — the two "+
           "form a great loop of carbon and oxygen that keeps the whole Biosphere breathing." },
    ],
    quiz: [
      { q: "The green pigment that captures light is:",
        a: ["Hemoglobin","Chlorophyll","Keratin","Melanin"], c: 1,
        e: "Chlorophyll in chloroplasts absorbs sunlight for photosynthesis." },
      { q: "The oxygen released by photosynthesis comes from splitting:",
        a: ["Carbon dioxide","Glucose","Water","Nitrogen"], c: 2,
        e: "The light reactions split water (H₂O), releasing O₂." },
      { q: "The Calvin cycle builds sugar from:",
        a: ["Oxygen","Carbon dioxide","Sunlight directly","Protein"], c: 1,
        e: "The Calvin cycle fixes CO₂ into sugar using ATP and NADPH." },
    ],
    clue: "Sunlight floods the shard whole. \"Unit One restored,\" HELIX breathes. \"You have rebuilt the cellular foundation. But the Withering is reaching the *next* level — how life copies itself.\"",
  },

  // ───────────────────────── UNIT 2 ─────────────────────────
  {
    n: 6, unit: 2, visual: "mitosis", color: 0x4aa3ff,
    title: "Reproduction at the Cellular Level",
    room: "The Division Chamber",
    objectives: [
      "Describe the structure of chromosomes and the cell cycle",
      "Order the phases of mitosis",
      "Explain how mitosis produces identical daughter cells",
    ],
    intro:
      "A single luminous cell hangs in the chamber. As you watch, its contents "+
      "duplicate and it begins, impossibly, to pull itself into two. \"This,\" HELIX "+
      "says, \"is how a cut heals and a body grows.\"",
    concepts: [
      { t: "Chromosomes & the cell cycle",
        b: "A cell's DNA is packaged into chromosomes. Most of a cell's life is interphase — "+
           "it grows and copies every chromosome so there are two identical sister copies. Only "+
           "then does it divide." },
      { t: "The dance of mitosis",
        b: "Mitosis splits the duplicated chromosomes into two nuclei in four acts: Prophase "+
           "(chromosomes condense), Metaphase (they line up at the middle), Anaphase (sisters "+
           "are pulled apart), Telophase (two new nuclei form). Then the cell pinches in two." },
      { t: "Identical copies",
        b: "Because each daughter gets one of every sister chromosome, mitosis makes two cells "+
           "genetically identical to the parent. This is how you grow, heal, and replace worn-out "+
           "cells — and how the Withering's victims *fail* to, when the copying breaks." },
    ],
    quiz: [
      { q: "During which phase do chromosomes line up in the middle of the cell?",
        a: ["Prophase","Metaphase","Anaphase","Telophase"], c: 1,
        e: "In metaphase, chromosomes align along the cell's equator." },
      { q: "Mitosis produces daughter cells that are:",
        a: ["Genetically identical","All different","Half-sized forever","Non-living"], c: 0,
        e: "Mitosis yields two cells genetically identical to the parent cell." },
      { q: "DNA is copied during:",
        a: ["Interphase","Anaphase","Telophase","Never"], c: 0,
        e: "Chromosomes are duplicated during interphase, before mitosis begins." },
    ],
    clue: "\"Good. The copy is clean,\" HELIX says. \"But identical copies alone cannot adapt. For that, life needs *variety* — which is the next chamber's secret.\"",
  },
  {
    n: 7, unit: 2, visual: "meiosis", color: 0x4aa3ff,
    title: "The Cellular Basis of Inheritance",
    room: "The Shuffle Vault",
    objectives: [
      "Explain how meiosis halves the chromosome number",
      "Describe crossing over and independent assortment",
      "Connect meiosis to genetic variation in offspring",
    ],
    intro:
      "Pairs of chromosomes swirl, swap colored segments, and split into four "+
      "unique cells. \"Sexual reproduction needs cells with *half* the DNA,\" HELIX "+
      "explains. \"Meiosis makes them — and shuffles the deck every time.\"",
    concepts: [
      { t: "Why halve the chromosomes?",
        b: "Body cells carry two sets of chromosomes (diploid) — one from each parent. If sex "+
           "cells kept both sets, every generation would double its DNA. Meiosis solves this by "+
           "making gametes (eggs, sperm) with a single set (haploid), so fertilization restores "+
           "the diploid number." },
      { t: "Crossing over",
        b: "Early in meiosis, matching chromosomes pair up and physically swap segments — "+
           "crossing over. This reshuffles the parents' genes into new combinations, so a "+
           "chromosome you pass on is a patchwork of your mother's and father's." },
      { t: "Independent assortment",
        b: "When chromosome pairs line up, each pair orients randomly, independently of the "+
           "others. With 23 pairs in humans, that's over eight million combinations — before "+
           "crossing over even adds more. This is why siblings differ." },
    ],
    quiz: [
      { q: "Meiosis produces cells with how many chromosome sets?",
        a: ["Two (diploid)","One (haploid)","Four","Zero"], c: 1,
        e: "Meiosis halves the chromosome number, producing haploid gametes." },
      { q: "The swapping of segments between paired chromosomes is:",
        a: ["Mitosis","Crossing over","Cloning","Fermentation"], c: 1,
        e: "Crossing over recombines genes, creating new combinations." },
      { q: "Meiosis is important because it creates:",
        a: ["Identical clones","Genetic variation","Larger cells","More chromosomes"], c: 1,
        e: "Shuffling and halving generate the variation evolution acts on." },
    ],
    clue: "Four unique cells drift free. \"Variation,\" HELIX says with something like hope. \"The Withering cannot erase what it cannot predict. Now — how do these traits *pass on*?\"",
  },
  {
    n: 8, unit: 2, visual: "genetics", color: 0x4aa3ff,
    title: "Patterns of Inheritance",
    room: "Mendel's Greenhouse",
    objectives: [
      "Apply Mendel's laws of segregation and dominance",
      "Use a Punnett square to predict offspring ratios",
      "Distinguish genotype from phenotype",
    ],
    intro:
      "Rows of pea plants climb toward a glass roof — some tall, some short, flowers "+
      "purple and white. \"A monk named Mendel cracked the code of heredity here, "+
      "with plants like these,\" HELIX says. \"Let's reconstruct his work.\"",
    concepts: [
      { t: "Alleles, dominant and recessive",
        b: "A gene can come in different versions called alleles. You inherit one allele from "+
           "each parent. A dominant allele masks a recessive one: if 'purple' (P) is dominant over "+
           "'white' (p), then PP and Pp plants are purple, and only pp is white." },
      { t: "Genotype vs phenotype",
        b: "Genotype is the genetic makeup (PP, Pp, or pp). Phenotype is the visible trait "+
           "(purple or white). Two plants can look identical (both purple) yet carry different "+
           "genotypes (PP vs Pp) — a hidden recessive allele waiting to reappear." },
      { t: "The Punnett square",
        b: "Cross two Pp parents and a 2×2 grid predicts the offspring: 1 PP : 2 Pp : 1 pp — a "+
           "3:1 ratio of purple to white. Mendel saw these ratios in thousands of plants and "+
           "deduced that traits are passed as discrete units. He was right decades before anyone "+
           "saw a gene." },
    ],
    quiz: [
      { q: "Crossing two Pp plants gives what phenotype ratio (P dominant)?",
        a: ["1:1","3:1","All purple","All white"], c: 1,
        e: "Pp × Pp yields 3 purple : 1 white (genotypes 1 PP : 2 Pp : 1 pp)." },
      { q: "An organism's visible traits are its:",
        a: ["Genotype","Phenotype","Allele","Gamete"], c: 1,
        e: "Phenotype is the observable trait; genotype is the underlying genes." },
      { q: "A recessive trait appears only when an organism has:",
        a: ["One recessive allele","Two recessive alleles","One dominant allele","No alleles"], c: 1,
        e: "Recessive phenotypes require two recessive alleles (e.g., pp)." },
    ],
    clue: "The shard clicks home. \"Unit Two complete — life copies, shuffles, and inherits. But *what* exactly is being copied? Time to read the molecule itself.\"",
  },

  // ───────────────────────── UNIT 3 ─────────────────────────
  {
    n: 9, unit: 3, visual: "dna", color: 0xb98cff,
    title: "Molecular Biology",
    room: "The Helix Archive",
    objectives: [
      "Describe the double-helix structure of DNA",
      "Explain DNA replication and base pairing",
      "Trace the flow of information: DNA → RNA → protein",
    ],
    intro:
      "A DNA double helix three storeys tall rotates slowly at the room's heart, "+
      "its rungs glowing in four colors. \"Here it is,\" HELIX says quietly. \"The "+
      "molecule that the Withering is trying to silence. Learn to read it.\"",
    concepts: [
      { t: "The double helix",
        b: "DNA is two strands twisted into a helix, like a spiral ladder. The rungs are pairs "+
           "of bases: adenine always pairs with thymine (A–T), and cytosine with guanine (C–G). "+
           "This strict pairing means each strand is a template for the other." },
      { t: "Replication",
        b: "To copy DNA, the helix unzips and each strand templates a new partner by the pairing "+
           "rules. The result is two identical double helices — one for each daughter cell in "+
           "mitosis. The order of bases is a four-letter code that spells out genes." },
      { t: "The central dogma",
        b: "Information flows DNA → RNA → protein. Transcription copies a gene into messenger RNA. "+
           "Translation reads that RNA three letters (a codon) at a time, and ribosomes string "+
           "together the matching amino acids into a protein. Genes are recipes; proteins do the work." },
    ],
    quiz: [
      { q: "In DNA, adenine (A) always pairs with:",
        a: ["Guanine","Cytosine","Thymine","Uracil"], c: 2,
        e: "Base pairing rules: A–T and C–G." },
      { q: "The process of copying DNA into messenger RNA is:",
        a: ["Replication","Transcription","Translation","Mutation"], c: 1,
        e: "Transcription makes an RNA copy of a gene; translation builds the protein." },
      { q: "The flow of genetic information is:",
        a: ["Protein → RNA → DNA","DNA → RNA → Protein","RNA → DNA → Protein","DNA → Protein → RNA"], c: 1,
        e: "The central dogma: DNA is transcribed to RNA, then translated to protein." },
    ],
    clue: "The helix blazes gold. \"You can read the code now,\" HELIX says. \"Which means you can also *write* it. That power has a name: biotechnology.\"",
  },
  {
    n: 10, unit: 3, visual: "biotech", color: 0xb98cff,
    title: "Biotechnology",
    room: "The Gene Lab",
    objectives: [
      "Explain how DNA can be cut, copied, and inserted",
      "Describe PCR and gel electrophoresis",
      "Discuss applications and ethics of genetic engineering",
    ],
    intro:
      "Benches of glowing equipment line the lab. A band of fluorescent DNA migrates "+
      "across a gel. \"If genes are text,\" HELIX says, \"these are the tools to edit "+
      "it. Used wisely, they might even heal the Withering.\"",
    concepts: [
      { t: "Cutting and pasting genes",
        b: "Restriction enzymes act like molecular scissors, cutting DNA at specific sequences. "+
           "Scientists splice a chosen gene into a small loop of bacterial DNA (a plasmid), put it "+
           "back into bacteria, and let the bacteria mass-produce the gene's protein — this is how "+
           "we make human insulin." },
      { t: "Copying and sorting DNA",
        b: "PCR (polymerase chain reaction) copies a tiny DNA sample into millions of copies "+
           "through heating and cooling cycles. Gel electrophoresis then sorts DNA fragments by "+
           "size using an electric field — the basis of DNA fingerprinting and genetic testing." },
      { t: "Power and responsibility",
        b: "Biotechnology gives us disease-resistant crops, gene therapies, and tools like "+
           "CRISPR that edit DNA precisely. But editing life raises hard questions about safety, "+
           "consent, and fairness. Knowing *how* is not the same as knowing *whether we should*." },
    ],
    quiz: [
      { q: "Restriction enzymes are used to:",
        a: ["Copy whole cells","Cut DNA at specific sequences","Make ATP","Translate RNA"], c: 1,
        e: "Restriction enzymes cut DNA at specific recognition sequences." },
      { q: "PCR is a technique to:",
        a: ["Sort cells by color","Make many copies of DNA","Destroy DNA","Build proteins"], c: 1,
        e: "PCR amplifies a DNA sample into millions of copies." },
      { q: "Gel electrophoresis sorts DNA fragments by:",
        a: ["Color","Size","Smell","Temperature"], c: 1,
        e: "An electric field pulls fragments through a gel; smaller pieces travel farther." },
    ],
    clue: "\"Unit Three sealed,\" HELIX says. \"You hold the molecular keys to life. But to *cure* the Withering, you must understand the force that shaped every living thing: evolution.\"",
  },

  // ───────────────────────── UNIT 4 ─────────────────────────
  {
    n: 11, unit: 4, visual: "evolution", color: 0xffb347,
    title: "Evolution & Its Processes",
    room: "The Selection Gallery",
    objectives: [
      "Explain natural selection and descent with modification",
      "Identify evidence for evolution",
      "Describe how new species arise (speciation)",
    ],
    intro:
      "Models of finches with subtly different beaks hover in a long gallery, an "+
      "island scene behind them. \"Darwin saw it on islands like these,\" HELIX says. "+
      "\"Life is not fixed. It *changes* — and that is its greatest defense.\"",
    concepts: [
      { t: "Natural selection",
        b: "Individuals vary, and more are born than can survive. Those with traits better "+
           "suited to their environment tend to survive and reproduce, passing those traits on. "+
           "Over generations the population shifts — 'descent with modification.' No individual "+
           "evolves; populations do." },
      { t: "Evidence all around",
        b: "Evolution is supported by fossils showing change over time, by shared anatomy (your "+
           "arm, a whale's flipper, and a bat's wing share the same bones), by embryos that "+
           "resemble one another, and most powerfully by DNA — the more closely related two "+
           "species are, the more similar their genes." },
      { t: "How species split",
        b: "When a population is divided — by a mountain, an ocean, a behavior — the two groups "+
           "accumulate different changes. Given enough time they can no longer interbreed: a new "+
           "species is born. This branching, repeated billions of times, is the tree of life." },
    ],
    quiz: [
      { q: "Natural selection acts on individuals' differences in:",
        a: ["Survival and reproduction","Height only","Random luck alone","Diet color"], c: 0,
        e: "Traits that improve survival and reproduction become more common over generations." },
      { q: "Which is strong evidence for common ancestry?",
        a: ["Similar DNA between species","Different planets","Weather patterns","Star positions"], c: 0,
        e: "Shared DNA, anatomy, and fossils all point to common ancestry." },
      { q: "A new species forms when populations can no longer:",
        a: ["Eat","Interbreed","Move","Breathe"], c: 1,
        e: "Reproductive isolation defines the formation of a new species." },
    ],
    clue: "The finches sing. \"This is it, Cadet — life *answers* threats by changing. The Withering is just the harshest selection pressure of all. Survive it, and the Biosphere evolves past it.\"",
  },
  {
    n: 12, unit: 4, visual: "tree", color: 0xffb347,
    title: "Diversity of Life",
    room: "The Tree of Life Hall",
    objectives: [
      "Explain how organisms are classified and named",
      "Describe the three domains of life",
      "Read an evolutionary tree (phylogeny)",
    ],
    intro:
      "A colossal branching tree of light fills the hall, every twig a living kind. "+
      "\"To save life, you must know its shape,\" HELIX says. \"This is the family "+
      "tree of everything alive.\"",
    concepts: [
      { t: "Naming and classifying",
        b: "Biologists sort life into nested groups — domain, kingdom, phylum, class, order, "+
           "family, genus, species — by shared traits and ancestry. Each species gets a two-part "+
           "Latin name (like Homo sapiens), a universal label any scientist can recognize." },
      { t: "The three domains",
        b: "At the broadest level, life splits into three domains: Bacteria and Archaea (both "+
           "single-celled prokaryotes, but very different in their chemistry) and Eukarya "+
           "(everything with nucleated cells — protists, fungi, plants, and animals)." },
      { t: "Reading the tree",
        b: "A phylogenetic tree maps evolutionary relationships. Branch points are shared "+
           "ancestors; the closer two tips are, the more recently they diverged. The tree isn't "+
           "a ladder from 'lower' to 'higher' life — every living thing is equally modern, just "+
           "on a different branch." },
    ],
    quiz: [
      { q: "The three domains of life are Bacteria, Archaea, and:",
        a: ["Animalia","Eukarya","Plantae","Fungi"], c: 1,
        e: "The three domains are Bacteria, Archaea, and Eukarya." },
      { q: "A species' scientific name has how many parts?",
        a: ["One","Two","Three","Five"], c: 1,
        e: "Binomial nomenclature uses genus + species (e.g., Homo sapiens)." },
      { q: "On a phylogenetic tree, a branch point represents a:",
        a: ["Extinction","Shared ancestor","Mutation rate","Habitat"], c: 1,
        e: "Branch points mark common ancestors from which lineages diverged." },
    ],
    clue: "\"Now we tour the branches,\" HELIX says, \"to see which forms of life are fading fastest. Start small — with the microbes that run the world.\"",
  },
  {
    n: 13, unit: 4, visual: "microbes", color: 0xffb347,
    title: "Diversity of Microbes, Fungi & Protists",
    room: "The Microcosm",
    objectives: [
      "Describe the diversity and roles of prokaryotes",
      "Explain the ecological importance of fungi",
      "Identify the varied forms of protists",
    ],
    intro:
      "The room teems with magnified life — coiling bacteria, branching fungi, "+
      "drifting protists. \"The smallest organisms do the biggest jobs,\" HELIX "+
      "says. \"Lose them, and the whole Biosphere starves.\"",
    concepts: [
      { t: "Prokaryotes everywhere",
        b: "Bacteria and archaea are the most abundant organisms on Earth, living in soil, "+
           "oceans, boiling springs, and your gut. They recycle nutrients, fix nitrogen for "+
           "plants, and ferment our food. A few cause disease, but most are essential allies." },
      { t: "Fungi: nature's recyclers",
        b: "Fungi (molds, yeasts, mushrooms) aren't plants — they don't photosynthesize. They "+
           "absorb nutrients by digesting dead matter, breaking it down and returning it to the "+
           "soil. Without fungal decomposition, the world would drown in dead material." },
      { t: "Protists: the catch-all",
        b: "Protists are mostly single-celled eukaryotes that don't fit the plant, animal, or "+
           "fungus mold — like amoebas, algae, and the malaria parasite. Photosynthetic protists "+
           "(phytoplankton) produce a huge share of Earth's oxygen." },
    ],
    quiz: [
      { q: "Which group is the most abundant on Earth?",
        a: ["Mammals","Prokaryotes","Trees","Fungi"], c: 1,
        e: "Bacteria and archaea (prokaryotes) vastly outnumber all other organisms." },
      { q: "Fungi obtain nutrients mainly by:",
        a: ["Photosynthesis","Absorbing/decomposing matter","Hunting prey","Drinking sunlight"], c: 1,
        e: "Fungi are decomposers that absorb nutrients from organic matter." },
      { q: "Much of Earth's oxygen is produced by:",
        a: ["Mushrooms","Photosynthetic protists (phytoplankton)","Bacteria only","Insects"], c: 1,
        e: "Marine phytoplankton — many of them protists — produce a large share of O₂." },
    ],
    clue: "\"The recyclers hold,\" HELIX says, relieved. \"Now to the organisms that greened the land: the plants.\"",
  },
  {
    n: 14, unit: 4, visual: "plants", color: 0xffb347,
    title: "Diversity of Plants",
    room: "The Conservatory",
    objectives: [
      "Trace the evolution of plants from water to land",
      "Describe vascular tissue, seeds, and flowers as adaptations",
      "Explain the role of plants in ecosystems",
    ],
    intro:
      "From a carpet of moss to towering trees and bright blossoms, the Conservatory "+
      "traces 500 million years of green ambition. \"Plants conquered the land,\" "+
      "HELIX says, \"and made it livable for everything else.\"",
    concepts: [
      { t: "Out of the water",
        b: "Plants evolved from green algae. Early land plants like mosses stayed low and damp, "+
           "lacking tissues to move water. The breakthrough was vascular tissue — internal "+
           "plumbing (xylem and phloem) that carries water up and food down, letting plants grow "+
           "tall." },
      { t: "Seeds and flowers",
        b: "Seeds package a plant embryo with food and a protective coat, able to wait out hard "+
           "times. Flowers, the latest innovation, attract animal pollinators and produce fruit "+
           "to disperse seeds. Flowering plants (angiosperms) now dominate the land." },
      { t: "Why plants matter",
        b: "Plants are primary producers: they capture sunlight and feed nearly every land food "+
           "chain. They build soil, store carbon, release oxygen, and create habitat. A withering "+
           "of plants cascades up to every animal that depends on them." },
    ],
    quiz: [
      { q: "The tissue that lets plants grow tall by transporting water is:",
        a: ["Vascular tissue","Skin","Bark only","Chlorophyll"], c: 0,
        e: "Vascular tissue (xylem and phloem) transports water and nutrients." },
      { q: "Plants evolved from:",
        a: ["Fungi","Green algae","Bacteria","Animals"], c: 1,
        e: "Land plants share ancestry with green algae." },
      { q: "Flowers primarily help plants by:",
        a: ["Making oxygen","Attracting pollinators","Storing water","Producing ATP"], c: 1,
        e: "Flowers attract pollinators to aid reproduction and seed dispersal." },
    ],
    clue: "\"The green holds the line,\" HELIX says. \"Now — the branch you know best, because you are on it. The animals.\"",
  },
  {
    n: 15, unit: 4, visual: "animals", color: 0xffb347,
    title: "Diversity of Animals",
    room: "The Menagerie",
    objectives: [
      "Describe key features that define animals",
      "Compare invertebrate and vertebrate body plans",
      "Trace major innovations like symmetry and a backbone",
    ],
    intro:
      "Silhouettes of creatures — sponge, worm, insect, fish, bird — drift through "+
      "the Menagerie in evolutionary order. \"Animals are latecomers,\" HELIX says, "+
      "\"but oh, what variety we made.\"",
    concepts: [
      { t: "What makes an animal",
        b: "Animals are multicellular eukaryotes that eat other organisms (no photosynthesis), "+
           "lack cell walls, and most can move. They develop from an embryo and have specialized "+
           "tissues — nerve and muscle being uniquely animal inventions." },
      { t: "Body plans and symmetry",
        b: "Early animals like sponges have no symmetry. Jellyfish have radial symmetry (a "+
           "wheel-like body). Most animals — including you — have bilateral symmetry: a left and "+
           "right mirror image, a front and back. This came with a head, where senses and brain "+
           "concentrate." },
      { t: "Invertebrates and vertebrates",
        b: "The vast majority of animals are invertebrates — worms, mollusks, and the wildly "+
           "successful arthropods (insects, spiders, crustaceans). Vertebrates, with an internal "+
           "backbone and skeleton, include fish, amphibians, reptiles, birds, and mammals — like "+
           "you, Cadet." },
    ],
    quiz: [
      { q: "Unlike plants, animals cannot:",
        a: ["Move","Photosynthesize","Reproduce","Grow"], c: 1,
        e: "Animals must eat other organisms; they don't make food from sunlight." },
      { q: "Humans have which body symmetry?",
        a: ["Radial","Bilateral","None","Spherical"], c: 1,
        e: "Humans are bilaterally symmetric — mirror-image left and right halves." },
      { q: "The most species-rich animal group is the:",
        a: ["Mammals","Arthropods","Fish","Birds"], c: 1,
        e: "Arthropods (insects, etc.) are by far the most diverse animal group." },
    ],
    clue: "\"Unit Four complete,\" HELIX says. \"You have walked the whole tree of life. Now we go *inside* an animal — to see how a body keeps itself alive.\"",
  },

  // ───────────────────────── UNIT 5 ─────────────────────────
  {
    n: 16, unit: 5, visual: "body", color: 0xff6f91,
    title: "The Body's Systems",
    room: "The Anatomy Theater",
    objectives: [
      "Identify the major organ systems and their functions",
      "Explain how systems cooperate to maintain homeostasis",
      "Describe negative feedback as a control mechanism",
    ],
    intro:
      "A translucent human figure rotates in the theater, its systems lighting up "+
      "one by one — skeleton, heart and vessels, lungs, gut, nerves. \"A body is a "+
      "society of organs,\" HELIX says. \"Each depends on the rest.\"",
    concepts: [
      { t: "A team of systems",
        b: "The body runs on cooperating organ systems: the circulatory system pumps blood, the "+
           "respiratory system exchanges gases, the digestive system extracts nutrients, the "+
           "nervous and endocrine systems coordinate, the musculoskeletal system moves, and "+
           "others defend, filter, and reproduce. None works alone." },
      { t: "Homeostasis",
        b: "Despite a changing world, your body holds its internal conditions steady — "+
           "temperature, blood sugar, pH, water balance. This stability, called homeostasis, is "+
           "what keeps your cells alive. Losing it is, quite literally, the body Withering." },
      { t: "Negative feedback",
        b: "Homeostasis is maintained by negative feedback loops: a sensor detects a change, and "+
           "the body responds to reverse it. Too hot? You sweat. Too cold? You shiver. Blood "+
           "sugar high? Insulin lowers it. The system constantly nudges itself back to its set point." },
    ],
    quiz: [
      { q: "Maintaining a stable internal environment is called:",
        a: ["Evolution","Homeostasis","Mitosis","Digestion"], c: 1,
        e: "Homeostasis is the maintenance of steady internal conditions." },
      { q: "Sweating when hot is an example of:",
        a: ["Positive feedback","Negative feedback","Mutation","Fermentation"], c: 1,
        e: "Negative feedback reverses a change to restore the set point." },
      { q: "Which system transports oxygen and nutrients through the body?",
        a: ["Circulatory","Skeletal","Nervous","Integumentary"], c: 0,
        e: "The circulatory system carries blood, delivering oxygen and nutrients." },
    ],
    clue: "\"The body holds its balance,\" HELIX says. \"But balance is besieged. Next: the system that fights invaders — and disease.\"",
  },
  {
    n: 17, unit: 5, visual: "immune", color: 0xff6f91,
    title: "The Immune System & Disease",
    room: "The Defense Grid",
    objectives: [
      "Distinguish innate from adaptive immunity",
      "Explain how antibodies and memory cells work",
      "Describe how vaccines train the immune system",
    ],
    intro:
      "Alarms pulse red. A pathogen has breached the grid, and swarms of defender "+
      "cells converge. \"This,\" HELIX says, \"is the closest thing in biology to a "+
      "war against the Withering — and it can *learn*.\"",
    concepts: [
      { t: "Two lines of defense",
        b: "Innate immunity is fast and general: skin, stomach acid, and patrol cells that "+
           "attack anything foreign. If invaders break through, adaptive immunity responds — "+
           "slower, but precisely targeted to the specific pathogen, and it remembers." },
      { t: "Antibodies and memory",
        b: "Adaptive immunity makes antibodies — proteins that lock onto a specific pathogen and "+
           "flag it for destruction. After an infection, memory cells linger for years. If the "+
           "same pathogen returns, the response is so fast you may never feel sick. That's immunity." },
      { t: "How vaccines work",
        b: "A vaccine shows the immune system a harmless piece or weakened form of a pathogen. "+
           "The body builds antibodies and memory cells without the danger of real disease — so "+
           "if the true pathogen ever arrives, the defenders are already trained and waiting." },
    ],
    quiz: [
      { q: "Which immunity is fast and general?",
        a: ["Adaptive","Innate","Acquired","Memory"], c: 1,
        e: "Innate immunity is the fast, non-specific first line of defense." },
      { q: "Proteins that bind specifically to pathogens are:",
        a: ["Antibodies","Enzymes","Hormones","Lipids"], c: 0,
        e: "Antibodies target specific pathogens for destruction." },
      { q: "Vaccines protect by creating:",
        a: ["New organs","Memory cells and antibodies","More red blood cells","Stronger bones"], c: 1,
        e: "Vaccines prime memory cells so future infections are quickly defeated." },
    ],
    clue: "The grid stabilizes. \"It *learned* the threat,\" HELIX marvels. \"Memory is the Withering's true enemy. One system left before the cure — how life makes the next generation.\"",
  },
  {
    n: 18, unit: 5, visual: "development", color: 0xff6f91,
    title: "Animal Reproduction & Development",
    room: "The Genesis Chamber",
    objectives: [
      "Compare asexual and sexual reproduction",
      "Describe fertilization and early embryonic development",
      "Outline the stages from zygote to organism",
    ],
    intro:
      "A single fertilized cell hangs in the chamber, then divides — two, four, "+
      "eight — folding into the first shape of a body. \"From one cell, a whole "+
      "animal,\" HELIX says softly. \"This is how life refuses to end.\"",
    concepts: [
      { t: "Two ways to reproduce",
        b: "Asexual reproduction makes genetically identical offspring from one parent — fast, "+
           "but with no new variation. Sexual reproduction combines genes from two parents via "+
           "egg and sperm (recall meiosis, Chapter 7), producing varied offspring better able to "+
           "face changing conditions." },
      { t: "Fertilization",
        b: "Fertilization is the fusion of a haploid egg and a haploid sperm into a single "+
           "diploid cell, the zygote — restoring the full chromosome set with a brand-new "+
           "combination of genes. That one cell carries the complete instructions for an entire "+
           "organism." },
      { t: "From zygote to body",
        b: "The zygote divides repeatedly (cleavage) into a ball of cells, which folds and "+
           "rearranges (gastrulation) into layers that become tissues and organs. Step by step, "+
           "guided by the genes switching on and off, a featureless cell becomes a complex animal." },
    ],
    quiz: [
      { q: "The cell formed when egg and sperm fuse is the:",
        a: ["Gamete","Zygote","Embryo","Clone"], c: 1,
        e: "Fertilization produces a diploid zygote." },
      { q: "An advantage of sexual reproduction is:",
        a: ["Speed","Genetic variation","Identical clones","No mates needed"], c: 1,
        e: "Sexual reproduction generates variation that aids adaptation." },
      { q: "Repeated division of the zygote into a ball of cells is:",
        a: ["Cleavage","Fertilization","Respiration","Mutation"], c: 0,
        e: "Cleavage is the early series of cell divisions after fertilization." },
    ],
    clue: "\"Unit Five complete,\" HELIX says. \"You understand the individual body. But no organism lives alone. The final unit — and the Withering's true scale — is *ecology*.\"",
  },

  // ───────────────────────── UNIT 6 ─────────────────────────
  {
    n: 19, unit: 6, visual: "population", color: 0x7ed957,
    title: "Population & Community Ecology",
    room: "The Field Station",
    objectives: [
      "Describe how populations grow and what limits them",
      "Explain carrying capacity and limiting factors",
      "Identify species interactions in a community",
    ],
    intro:
      "The Field Station opens onto a simulated wilderness, herds and predators "+
      "moving across it as a graph of their numbers rises and falls overhead. "+
      "\"Now we zoom out,\" HELIX says. \"From bodies to whole populations.\"",
    concepts: [
      { t: "How populations grow",
        b: "With unlimited resources a population grows exponentially — faster and faster, a "+
           "J-shaped curve. But resources are never unlimited. As a population grows, competition, "+
           "predators, and disease slow it down, bending the curve into an S shape." },
      { t: "Carrying capacity",
        b: "Every environment can support only so many individuals — its carrying capacity. As a "+
           "population nears it, limiting factors (food, space, water, predators) push back until "+
           "births and deaths balance. Overshoot it, and the population crashes." },
      { t: "Living together",
        b: "Species interact in communities: competition (both lose), predation (one eats "+
           "another), and symbiosis — mutualism (both gain, like bees and flowers), commensalism "+
           "(one gains, the other unaffected), and parasitism (one gains at the other's cost). "+
           "These webs of interaction hold ecosystems together." },
    ],
    quiz: [
      { q: "The maximum population an environment can sustain is its:",
        a: ["Carrying capacity","Biomass","Niche","Density"], c: 0,
        e: "Carrying capacity is the population size the environment can support long-term." },
      { q: "Unlimited-resource growth produces which curve?",
        a: ["S-shaped","J-shaped (exponential)","Flat","Declining"], c: 1,
        e: "Exponential growth is J-shaped; logistic (limited) growth is S-shaped." },
      { q: "Bees pollinating flowers while getting nectar is:",
        a: ["Predation","Mutualism","Competition","Parasitism"], c: 1,
        e: "Mutualism benefits both species involved." },
    ],
    clue: "\"The populations balance,\" HELIX says. \"But populations are only threads. Next you see the whole fabric — energy and matter flowing through an ecosystem.\"",
  },
  {
    n: 20, unit: 6, visual: "ecosystem", color: 0x7ed957,
    title: "Ecosystems & the Biosphere",
    room: "The Biosphere Core",
    objectives: [
      "Trace energy flow through trophic levels",
      "Explain why energy pyramids narrow toward the top",
      "Describe how matter cycles through ecosystems",
    ],
    intro:
      "You stand at the station's heart: a vast sphere where sunlight, plants, "+
      "grazers, hunters, and decomposers turn in a single living wheel. \"This is "+
      "the whole machine,\" HELIX says. \"Energy in, matter around and around.\"",
    concepts: [
      { t: "Energy flows one way",
        b: "Energy enters as sunlight, captured by producers (plants). It passes to primary "+
           "consumers (herbivores), then to predators — each a trophic level. But energy flows "+
           "one way and is lost as heat at every step; it never cycles back. The sun must keep "+
           "shining." },
      { t: "The energy pyramid",
        b: "Only about 10% of the energy at one trophic level reaches the next — the rest is "+
           "spent on living and lost as heat. That's why there are many plants, fewer herbivores, "+
           "and only a few top predators: an energy pyramid. It's also why long food chains are rare." },
      { t: "Matter cycles around",
        b: "Unlike energy, matter is recycled. Carbon, nitrogen, water, and phosphorus cycle "+
           "endlessly between living things and the environment. Decomposers are crucial: they "+
           "break down the dead and release nutrients back to producers, closing the loop." },
    ],
    quiz: [
      { q: "Roughly how much energy passes to the next trophic level?",
        a: ["10%","50%","90%","100%"], c: 0,
        e: "About 10% transfers; the rest is lost as heat and life processes." },
      { q: "In an ecosystem, energy is ___ and matter is ___:",
        a: ["recycled / lost","one-way / recycled","both lost","both recycled"], c: 1,
        e: "Energy flows one way and is lost as heat; matter cycles and is reused." },
      { q: "Organisms that release nutrients back to producers are:",
        a: ["Predators","Decomposers","Herbivores","Pollinators"], c: 1,
        e: "Decomposers recycle nutrients from dead matter back into the ecosystem." },
    ],
    clue: "The great wheel turns smoothly. \"You see it now,\" HELIX says. \"The Biosphere is energy flowing through cycling matter — exactly what the very first shard told you. One room remains.\"",
  },
  {
    n: 21, unit: 6, visual: "conservation", color: 0x7ed957,
    title: "Conservation & Biodiversity",
    room: "The Vault of Life",
    objectives: [
      "Explain the value of biodiversity",
      "Identify major threats to biodiversity",
      "Describe strategies to conserve life on Earth",
    ],
    intro:
      "The final room is a living vault — a globe of biomes, every species you've "+
      "met glowing within it. \"This is everything you fought for,\" HELIX says. "+
      "\"Learn to protect it, and the Withering ends here.\"",
    concepts: [
      { t: "Why biodiversity matters",
        b: "Biodiversity — the variety of life — keeps ecosystems resilient. Diverse systems "+
           "recover from shocks, provide clean water, pollinate crops, and hold a library of "+
           "genes and medicines. Each species lost is a thread pulled from a net we all depend on." },
      { t: "The threats",
        b: "Biodiversity is shrinking from habitat loss, climate change, pollution, overharvesting, "+
           "and invasive species — most driven by human activity. Extinction is natural, but today's "+
           "rate is hundreds of times faster than normal: a true Withering, and a real one." },
      { t: "What we can do",
        b: "Conservation protects habitats, restores damaged ecosystems, manages resources "+
           "sustainably, and preserves genes in seed banks and reserves. It works best when it "+
           "values both wild nature and the people who live alongside it. Knowledge — the kind you "+
           "just earned — is where it starts." },
    ],
    quiz: [
      { q: "The greatest cause of biodiversity loss today is:",
        a: ["Habitat destruction","Sunspots","Too much rain","Volcanoes"], c: 0,
        e: "Habitat loss is the leading driver of the current extinction crisis." },
      { q: "High biodiversity makes ecosystems more:",
        a: ["Fragile","Resilient","Empty","Toxic"], c: 1,
        e: "Diverse ecosystems are more stable and recover better from disturbance." },
      { q: "A way to conserve genetic diversity is:",
        a: ["Seed banks and reserves","Paving habitats","Removing all predators","Draining wetlands"], c: 0,
        e: "Seed banks and protected reserves safeguard species and their genes." },
    ],
    clue: "The Vault blazes with the light of every restored shard. \"It's done, Cadet. The Biosphere lives — because *you* understand it now. Life is organized energy, defended by knowledge. You were the cure all along.\"",
  },
];

export function chapterByNumber(n) {
  return CHAPTERS.find((c) => c.n === n);
}
export function unitOf(n) {
  const ch = chapterByNumber(n);
  return UNITS.find((u) => u.n === ch.unit);
}
