## EdgeLLM Transformer Accelerator [[1]](#ref-1)

Large language models (LLMs) have permeated many aspects of our lives. Edge deployment has attracted strong industry interest because of its potential benefits for privacy, reliability, and cost. However, it presents three main challenges.

* EMA-Limited Prefill and Decode Efficiency
* Bottlenecks in Multi-Request Inference
* Underutilization from Non-MAC Operations

We design a rDXE (ring-based Decoder eXecution Engine) system to tackle these challenges.

<img src="/images/research/circuit4ai/rDXE.png" alt="Architecture of the ring-based decoder execution engine" style="display:block; margin: 0 auto; width:60%; max-width:720px;" />

We fabricated the accelerator in Intel 16 nm technology.

<img src="/images/research/circuit4ai/edgellm_chip.png" alt="Die photograph of the 16 nm EdgeLLM accelerator" style="display:block; margin: 0 auto; width:60%; max-width:720px;" />

## Transformer SW-HW Co-Exploration

We co-explore edge Transformer architectures and a custom systolic-array accelerator to balance accuracy, time-to-first-token, energy, and area. For each candidate design, we map model parameters onto hardware configurations and evaluate performance, timing, power, and area with an analytic loop and OpenROAD. The resulting design space highlights trade-offs between speed, efficiency, and area to guide practical choices.

<img src="/images/research/circuit4ai/sw_hw_coop.png" alt="Software-hardware co-exploration flow for edge Transformer architectures" style="display:block; margin: 0 auto; width:100%; max-width:720px;" />

<a id="ref-1"></a>
[1] G. Tao, J. Luo, S. Liu, A. Li, G. Kielian, K. Lei, Q. Zhang, D. Sylvester, M. Saligane, "A 11.16μJ/token Edge LLM Accelerator with Scalable Ring-based Configuration for Token-wise Pipelining in 16nm FinFET," IEEE Custom Integrated Circuits Conference (CICC) 2026.
