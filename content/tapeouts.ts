export type TapeoutPublication = {
  title: string
  venue: string
  year: number
  authors: string
  credit: "First author" | "Equal-contribution authors"
  href: string
  related?: boolean
}

export type Tapeout = {
  id: string
  name: string
  area: string
  process: string
  summary: string
  // Coordinates in the original 1373 x 686 figure, not inferred tapeout dates.
  region: { x: number; y: number; width: number; height: number }
  projectLead?: string
  tapeoutYear?: number
  publications: TapeoutPublication[]
  links: { label: string; href: string }[]
}

export const tapeouts: Tapeout[] = [
  {
    id: "openfasoc-generators",
    name: "OpenFASoC temperature sensor & digital LDO",
    area: "Automated analog design",
    process: "130 nm",
    summary: "Open-source generators turn circuit specifications into physical designs. The temperature-sensor study explores 64 fabricated instances in SkyWater 130 nm; the LDO work extends autonomous generation to power regulation.",
    region: { x: 60, y: 61, width: 124, height: 91 },
    publications: [
      { title: "An Open-Source and Autonomous Temperature Sensor Generator Verified With 64 Instances in SkyWater 130 nm for Comprehensive Design Space Exploration", venue: "IEEE Solid-State Circuits Letters (SSCL)", year: 2022, authors: "Qirui Zhang & Wenbo Duan", credit: "Equal-contribution authors", href: "https://doi.org/10.1109/LSSC.2022.3188925" },
      { title: "An Open Source Compatible Framework to Fully Autonomous Digital LDO Generation", venue: "IEEE International Symposium on Circuits and Systems (ISCAS)", year: 2023, authors: "Yaswanth Kumar Cherivirala", credit: "First author", href: "https://doi.org/10.1109/ISCAS46773.2023.10181884" },
    ],
    links: [{ label: "OpenFASoC code", href: "https://github.com/idea-fasoc/OpenFASOC" }, { label: "Research overview", href: "/research/ai-powered-eda-and-circuit-exploration" }],
  },
  {
    id: "cryogenic-open-silicon",
    name: "Open-source silicon at cryogenic temperatures",
    area: "Quantum & cryogenic circuits",
    process: "180 / 130 nm lane",
    summary: "Open-source silicon test structures support device characterization and modeling at cryogenic temperatures, including measurements at 4 K.",
    region: { x: 222, y: 27, width: 204, height: 105 },
    publications: [
      { title: "Cryogenic Modeling for Open-Source Process Design Kit Technology", venue: "IEEE BiCMOS and Compound Semiconductor Integrated Circuits and Technology Symposium (BCICTS)", year: 2023, authors: "Akin Akturk", credit: "First author", href: "https://doi.org/10.1109/BCICTS54660.2023.10310944", related: true },
      { title: "Unlocking Circuits for Quantum With Open Source Silicon: A First Look at Measured Open Source Silicon Results at 4 K", venue: "IEEE Solid-State Circuits Magazine (SSCM)", year: 2024, authors: "Anhang Li", credit: "First author", href: "https://doi.org/10.1109/MSSC.2024.3385734", related: true },
    ],
    links: [{ label: "Research overview", href: "/research/quantum-and-cryogenic-circuits" }],
  },
  {
    id: "sscm-2024-open-silicon",
    name: "Open-source silicon · SSCM 2024",
    area: "Open-source circuits",
    process: "180 / 130 nm lane",
    summary: "This group of designs is labeled SSCM 2024 in the timeline. Individual chip names and publication records will be added once confirmed.",
    region: { x: 431, y: 25, width: 158, height: 98 },
    publications: [],
    links: [],
  },
  {
    id: "sscs-srp-2024",
    name: "SSCS SRP 2024 designs",
    area: "Open-source circuits",
    process: "180 / 130 nm lane",
    summary: "Circuit layouts and die photographs identified as SSCS SRP 2024 in the timeline. Further project details will be added as available.",
    region: { x: 607, y: 64, width: 192, height: 96 },
    publications: [],
    links: [],
  },
  {
    id: "dna-synthesis",
    name: "DNA synthesis & sequencing",
    area: "Molecular sensing",
    process: "180 / 130 nm lane",
    summary: "CMOS interfaces for molecular synthesis, sensing, and sequencing. Explore the research overview for the lab’s work on DNA probes and electrode-level biosensing.",
    region: { x: 803, y: 27, width: 130, height: 113 },
    publications: [],
    links: [{ label: "Research overview", href: "/research/molecular-synthesis-sensing-and-sequencing" }],
  },
  {
    id: "open-silicon-layout",
    name: "Additional 180 / 130 nm design",
    area: "Circuit design",
    process: "180 / 130 nm lane",
    summary: "An additional layout shown in the timeline. The project name and technical details have not yet been added to the public record.",
    region: { x: 1105, y: 37, width: 85, height: 108 },
    publications: [],
    links: [],
  },
  {
    id: "body-coupled-edge-ai",
    name: "Body-coupled communication & Edge AI",
    area: "Connected sensing",
    process: "65 nm",
    summary: "A chip combining body-coupled communication and edge computing, as labeled in the timeline. Publication and contributor details will be added once confirmed.",
    region: { x: 1009, y: 220, width: 144, height: 82 },
    publications: [],
    links: [{ label: "Biomedical sensing research", href: "/research/biomedical-sensing" }],
  },
  {
    id: "cryogenic-error-correction",
    name: "Cryogenic quantum error correction",
    area: "Quantum & cryogenic circuits",
    process: "22 nm FDSOI",
    summary: "Cryogenic circuitry for quantum error correction. The related CryoZip work studies syndrome compression in 22 nm FDSOI characterized at 4 K; its reported power, performance, and area results are analysis results, not measurements of this chip.",
    region: { x: 1080, y: 325, width: 77, height: 159 },
    publications: [{ title: "CryoZip: An Efficient Cryogenic Compressor for Quantum Error Correction Syndromes", venue: "ACM/IEEE Design Automation Conference (DAC)", year: 2026, authors: "Guanchen Tao", credit: "First author", href: "https://arxiv.org/abs/2606.30805", related: true }],
    links: [{ label: "Research overview", href: "/research/quantum-and-cryogenic-circuits" }],
  },
  {
    id: "edram",
    name: "Embedded DRAM",
    area: "Memory circuits",
    process: "22 nm FDSOI",
    summary: "Embedded dynamic random-access memory (eDRAM), identified in the 22 nm FDSOI lane. Publication and contributor details will be added once confirmed.",
    region: { x: 1158, y: 326, width: 83, height: 82 },
    publications: [],
    links: [],
  },
  {
    id: "cryogenic-dc-dc",
    name: "Automatically generated cryogenic DC–DC converter",
    area: "Power management",
    process: "12 nm FinFET",
    summary: "A fully integrated, automatically generated DC–DC converter maintaining more than 75% efficiency from 398 K down to 23 K across wide load ranges.",
    region: { x: 158, y: 529, width: 101, height: 101 },
    publications: [{ title: "A Fully Integrated, Automatically Generated DC–DC Converter Maintaining >75% Efficiency From 398 K Down to 23 K Across Wide Load Ranges in 12-nm FinFET", venue: "IEEE Solid-State Circuits Letters (SSCL)", year: 2024, authors: "Anhang Li", credit: "First author", href: "https://doi.org/10.1109/LSSC.2023.3349129" }],
    links: [{ label: "OpenFASoC code", href: "https://github.com/idea-fasoc/OpenFASOC" }, { label: "Research overview", href: "/research/quantum-and-cryogenic-circuits" }],
  },
  {
    id: "open-se-cura",
    name: "Open Se Cura",
    area: "Hardware security",
    process: "16 nm",
    summary: "An auditable and transparent hardware root-of-trust system built on OpenTitan, using open electronic design automation. The publication reports first silicon results.",
    region: { x: 514, y: 491, width: 122, height: 131 },
    publications: [{ title: "Open Se Cura: First Silicon Results of an Auditable and Transparent Hardware Root-of-Trust System Using Open Electronic Design Automation in 16 nm", venue: "IEEE Solid-State Circuits Magazine (SSCM)", year: 2024, authors: "Guanchen Tao", credit: "First author", href: "https://doi.org/10.1109/MSSC.2024.3382071" }],
    links: [{ label: "Research overview", href: "/research/hardware-security" }],
  },
  {
    id: "hbc-transceiver",
    name: "Human-body communication transceiver",
    area: "Biomedical sensing",
    process: "16 nm",
    summary: "A pulse-position-modulated resonance transceiver for multi-source body-area sensor networks, supporting 15 Mb/s communication through the human body.",
    region: { x: 730, y: 491, width: 55, height: 81 },
    publications: [{ title: "A 16nm 2.2pJ/b High Efficiency Pulse-Position Modulated Resonance Transceiver for 15Mbps Multi-Source High-Speed Body-Area Sensor Network", venue: "IEEE Custom Integrated Circuits Conference (CICC)", year: 2026, authors: "Anhang Li", credit: "First author", href: "/images/publications/papers/BCC-CICC-2026.pdf" }],
    links: [{ label: "Presentation slides (PDF)", href: "/images/publications/papers/BCC-slides.pdf" }, { label: "Research overview", href: "/research/biomedical-sensing" }],
  },
  {
    id: "edge-slm-decoder",
    name: "rDXE · Edge language-model accelerator",
    area: "Edge AI",
    process: "16 nm FinFET",
    summary: "A small-language-model decoder accelerator with scalable ring-based configuration for token-level pipelining. The paper reports measured energy efficiency of 5.26 TOPS/W.",
    region: { x: 785, y: 514, width: 119, height: 116 },
    publications: [{ title: "An 11.16 μJ/token Edge SLM Decoder Accelerator with Scalable Ring-based Configuration for Token-level Pipelining in 16nm FinFET", venue: "IEEE Custom Integrated Circuits Conference (CICC)", year: 2026, authors: "Guanchen Tao & Junyi Luo", credit: "Equal-contribution authors", href: "/images/publications/papers/DXE16nm-CICC-2026.pdf" }],
    links: [{ label: "Presentation slides (PDF)", href: "/images/publications/papers/DXE16nm-slides.pdf" }, { label: "Research overview", href: "/research/edge-ai-llm-systems-co-design" }],
  },
  {
    id: "additional-finfet-layout",
    name: "Additional 16 / 12 nm design",
    area: "Circuit design",
    process: "16 / 12 nm lane",
    summary: "An additional layout shown in the timeline. The project name and technical details have not yet been added to the public record.",
    region: { x: 966, y: 510, width: 115, height: 121 },
    publications: [],
    links: [],
  },
  {
    id: "probe-attack-detector",
    name: "Chip security probe-attack detector",
    area: "Hardware security",
    process: "16 / 12 nm lane",
    summary: "A circuit for detecting physical probe attacks on chips, as labeled in the timeline. Publication and contributor details will be added once confirmed.",
    region: { x: 1095, y: 505, width: 98, height: 125 },
    publications: [],
    links: [{ label: "Hardware security research", href: "/research/hardware-security" }],
  },
]

// Public project pages require a documented publication record. Unidentified
// designs remain visible in the original timeline until their records are ready.
export const featuredTapeoutIds = ["hbc-transceiver", "edge-slm-decoder", "cryogenic-dc-dc"]

export const publishedTapeouts = tapeouts
  .filter((project) => project.publications.length > 0)
  .sort((a, b) => Math.max(...b.publications.map((paper) => paper.year)) - Math.max(...a.publications.map((paper) => paper.year)))

export const tapeoutPresentation: Record<string, { purpose: string; image?: string }> = {
  "hbc-transceiver": { purpose: "Connecting wearable sensors through the body.", image: "/images/gds/bcc.png" },
  "edge-slm-decoder": { purpose: "Efficient language-model decoding at the edge.", image: "/images/gds/edgellm.png" },
  "cryogenic-dc-dc": { purpose: "Automatically generated cryogenic power delivery.", image: "/images/gds/sscl2024.png" },
  "open-se-cura": { purpose: "An auditable, open-source hardware root of trust.", image: "/images/gds/sscm2024.png" },
  "openfasoc-generators": { purpose: "Turning circuit specifications into open-source silicon." },
  "cryogenic-open-silicon": { purpose: "Characterizing open-source silicon at cryogenic temperatures." },
  "cryogenic-error-correction": { purpose: "Cryogenic circuitry for quantum error correction." },
}
