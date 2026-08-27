## glayout: Analog Layout Automation Framework [[1]](#ref-1)

<img
  src="/images/research/ai4circuit/glayout.png"
  alt="glayout"
  style="display:block; margin: 0 auto; width:90%; max-width:720px;"
/>

gLayout is a Python-based, programmatic analog layout framework that enables highly parameterized physical design generation with integrated design rule validation. By abstracting process design kits (PDKs) into portable, rule-aware primitives, gLayout supports scalable and technology-agnostic layout synthesis.
The framework establishes a foundation for agentic analog layout automation. In our prior work, we demonstrated reinforcement-learning–driven operational amplifier synthesis, where thousands of DRC-clean, performance-optimized layout instances were automatically generated in a single training run. These results illustrate a viable path toward closed-loop, learning-based analog physical design.

## OpenFASoC: An Open Source Framework for Fully Automated Mixed-Signal SoC Generation (IC Design Automation)

<img
  src="/images/research/ai4circuit/Openfasoc.png"
  alt="OpenFASoC"
  style="display:block; margin: 0 auto; width:60%; max-width:720px;"
/>

<!-- * Human Language to Analog Layout Using GLayout Layout Automation Framework. [MLCAD’24.](https://dl.acm.org/doi/10.1145/3670474.3685971) -->
* Disrupting Conventional Chip Design through the Open Source EDA Ecosystem. [EDTM’24.](https://doi.org/10.1109/EDTM58488.2024.10511336)
* Openfasoc: An open platform towards analog and mixed-signal automation and acceleration of chip design. [ISDCS’23.](https://doi.org/10.1109/ISDCS58735.2023.10153547)
* An open source compatible framework to fully autonomous digital LDO generation. [ISCAS’23.](https://doi.org/10.1109/ISCAS46773.2023.10181884)
* An open-source and autonomous temperature sensor in SkyWater 130 nm for comprehensive design space exploration. [SSC-L’22.](https://doi.org/10.1109/LSSC.2022.3188925)
* The missing pieces of open design enablement: A recent history of Google efforts. [ICCAD’20.](https://dl.acm.org/doi/10.1145/3400302.3415736)
Bridging academic open-source EDA to real-world usability. ICCAD’20.

## Genetic Alogorithm for Unconventional Circuit Synthesis

We use genetic algorithms to explore unconventional circuit designs across multiple topics, including approximate computing and transistor-level synthesis. By evolving candidate circuits with fitness functions that capture power, accuracy, and area, we can discover non-obvious topologies that traditional flows often miss. This approach lets us search large design spaces quickly while keeping targets and constraints explicit. 

Here shows framework for using genetic algorithm to search for approximate compute circuits.

<img src="/images/research/ai4circuit/circuitDNA_diagram.png" alt="Alt text" style="display:block; margin: 0 auto; width:60%; max-width:720px;" />

<a id="ref-1"></a>
[1] A. Hammoud et al., Human Language to Analog Layout Using GLayout Layout Automation Framework. [MLCAD’24.](https://dl.acm.org/doi/10.1145/3670474.3685971)



