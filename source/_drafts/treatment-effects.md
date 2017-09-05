---
title: Treatment Effects
tags:
  - healthcare
subtitle: Learnings from a few papers
author: Pranav Rajpurkar
---

Will a drug have a positive effect on a patient? For a patient $i$, the **treatment effect** (${τ_i}$) is the difference in potential outcomes if the patient receives a drug $(Y_i^{(1)})$ vs. if they don't $(Y_i^{(0)})$.

$$τ_i = Y_i^{(1)} - Y_i^{(0)}$$

We look at work that deals with binary outcomes, where 0 corresponds to a bad outcome (example: death by Cardiovascular Disease), and 1 corresponds to a good outcome. The goal is to estimate the conditional average treatment effect (CATE), given by:
    $$τ{(x)} = \mathrm{E}[Y_i^{(1)} - Y_i^{(0)} | X_i = x]$$

We seek to learn $τ$, but note the difficulty that we can only ever observe one of $(Y_i^{(0)})$ and $(Y_i^{(1)})$ in practice (we can't treat and not treat the same patient simultaneously). It's therefore challenging to directly train machine learning algorithms on differences of the form $Y_i^{(1)} - Y_i^{(0)}$! To understand how treatment effects can be predicted, we look at a few papers.

One weakness of nearest neighbor approaches in general, and random forests in particular, is that they can fill the valleys and flatten the peaks of the true τ (x) function.

[2]
we observe the unit
with the treatment, or without the treatment, but not both
at the same time, which is what [14] calls the “fundamental
problem of causal inference.”

Our data consist of the triple (Y
obs
i
, Wi, Xi), for i = 1, . . . , N,
which are regarded as an i.i.d sample drawn from an infinite
superpopulation. Expectations and probabilities will refer to
the distribution induced by the random sampling, or by the
(conditional) random assignment of the treatment.
Throughout the paper, we maintain the assumption of randomization
conditional on the covariates, or “unconfoundedness”
([23]), formalized as follows:

Subgroup identification from
randomized clinical trial data
https://deepblue.lib.umich.edu/bitstream/handle/2027.42/87004/sim4322.pdf?sequence=1


http://www.bmj.com/content/342/bmj.d549.long