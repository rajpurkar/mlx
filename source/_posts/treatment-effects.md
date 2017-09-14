---
title: Treatment Effects with Decision Trees
tags:
  - healthcare
subtitle: Learnings from a few papers
author: Pranav Rajpurkar
date: 2017-09-06 03:36:06
---


Will a drug have a positive effect on a patient? For a patient $i$, the **treatment effect** (${τ_i}$) is the difference in potential outcomes if the patient receives a drug $(Y_i^{(1)})$ vs. if they don't $(Y_i^{(0)})$.

$$τ_i = Y_i^{(1)} - Y_i^{(0)}$$

We look at work that deals with binary outcomes, where 0 corresponds to a good outcome, and 1 corresponds to a bad outcome (example: death by Cardiovascular Disease). One task is to estimate the population average treatment effect, given by:

$$τ\,^p = \mathbb{E}[Y_i^{(1)} - Y_i^{(0)}]$$

Sometimes the population average effect of the drug is not positive, but that the drug can be effective for particular categories of patients. We might be interested in understanding how effective the treatment would be for a particular individual or subpopulation $x$; this is referred to as heterogeneous treatment effect or Conditional Average Treatment Effect (CATE):

$$τ\left(x\right) = \mathbb{E}[Y_i^{(1)} - Y_i^{(0)} | X_i = x]$$

We seek to learn $τ$, but note the difficulty that we can only ever observe one of $(Y_i^{(0)})$ and $(Y_i^{(1)})$ in practice, because we can't treat and not treat the same patient simultaneously: this is called the *fundamental problem of causal inference*. It is therefore challenging to directly train machine learning algorithms on differences of the form $Y_i^{(1)} - Y_i^{(0)}$.

So how do we estimate such treatment effects? In this post, we look at a couple of papers to get some insights:

The first paper we look at is [Estimation and inference of heterogeneous treatment effects using random forests (2017)](http://www.tandfonline.com/doi/abs/10.1080/01621459.2017.1319839).

This paper extends the [random forest algorithm](https://en.wikipedia.org/wiki/Random_forest#Algorithm) to a causal forest for estimating heterogeneous treatment effects:
- One assumption made is that of *unconfoundedness*: that the decision of whether or not a patient gets treated $W_i \in \lbrace  0, 1 \rbrace$ is independent of the potential outcomes $(Y_i^{(0)}, Y_i^{(1)})$ when conditioned on $X_i$. The implication of this assumption is that nearby observations in the x-space can be treated as "having come from a randomized experiment."
- Trees can be thought of as nearest neighbor methods with an adaptive neighborhood metric, with the closest points to $x$ being in the same leaf that it is. Let's assume that we can build a classification tree by some method by observing independent samples $(X_i, Y_i)$, then a new $x$ can be classified by:
    - Identify the leaf containing $x$
    - In that leaf, take the mean of the $Y_i$s in that leaf.
- In a causal tree, we make use of the assignment labels $W_i$ in the examples. To make the prediction $τ\left(x\right)$:
    - Identify the leaf containing $x$
    - In that leaf, compute the mean of the $Y_i$s where $W_i = 0$, and subtract that from the mean of the $Y_i$s where $W_i = 1$.
- Given a procedure for generating one tree, a causal forest can generate an ensemble of such trees, and then take the mean of the resulting $τ\left(x\right)$s.
- The causal forest is compared to non-adaptive nearest neighbors method (k-NN matching baseline) which estimates treatment effect for any $x$:
    - Compute the mean of the $Y_i$s of the $k$ closest examples (L2 distance to $X_i$s) where $W_i = 0$, and subtract that from the mean of $Y_i$s of the $k$ closest examples where $W_i = 1$.
- Causal forests outperform the k-NN matching baseline, performing an order of magnitude better in mean-squared-error.

The next paper we'll look at is [Machine Learning Methods for Estimating Heterogeneous Causal Effects (2015)](https://pdfs.semanticscholar.org/86ce/004214845a1683d59b64c4363a067d342cac.pdf); this work inspires the causal tree approach we saw in the first paper. 

- The paper discusses methods for estimating heterogeneous treatment effects, starting with two conventional baseline algorithms. In addition, two novel algorithms are developed.
- The first algorithm, called the Single Tree (ST) algorithm estimates the expectation of the outcome conditioned on both the treatment and $X_i$ as features:
$$ µ(w, x) = \mathbb{E}[Y_i^{obs} | W_i = w, X_i = x]$$
- The Conditional Average Treatment Effect can then be estimated as:
$$ \hat{τ}\left(x\right)  = µ(w, 1)  - µ(w, 0)$$
- The second algorithm, called the Two Tree (TT) algorithm, modifies the first algorithm to split the problem of estimating $ \hat{τ}\left(x\right)$ into two separate problems, so that one model is responsible for the conditional expectation $ µ_1(x) $ with samples where $ W_i = 1 $, and another $ µ_0(x) $ with samples where $ W_i = 0 $.
- The Conditional Average Treatment Effect can then be estimated as:
$$ \hat{τ}\left(x\right)  = µ_1(w)  - µ_0(w)$$
- The third algorithm is called the Transformed Outcome Tree (TOT) method. The paper looks at a more general version of the transformation, but we'll focus on the case of complete randomization, with equal probability of whether or not a patient is given treatment. The idea of this method is to transform the output variable $ Y_i^{obs} $ to $ Y_i^{\star} $, where $ Y_i^{\star} = 2 \cdot Y_i^{obs} $ when $ W_i = 1 $, and $ Y_i^{\star} = -2 \cdot Y_i^{obs} $ when $ W_i = 0 $.
- With the above method, we now directly estimate the effect, without estimating the $µ$s for both the treatment and control. We can do so because it is proved that $\mathbb{E}[Y_i^{\star} | X_i = x] = τ\left(x\right)$. All that's important to understand here is that we can transform the observed $Y_i$s to $Y_i^{\star}$, and train a model to directly predict $Y_i^{\star}$.
- We estimate the treatment effect on a new $x$ by:
    - Identify the leaf containing $x$
    - In that leaf, take the mean of the $Y_i^{\star}$s in that leaf.
- The authors show that the above method is however, biased: if the proportion of patients assigned treatment within a leaf is different from the proportion of patients assigned treatment in the entire population, then naively taking the mean will bias the prediction.
- The fourth algorithm, called the Causal Tree (CT) method, improves upon the TOT approach, "unbiased within each candidate leaf upon which it is calculated." The algorithm is identical to the causal tree algorithm we saw in Paper 1 in the case of randomized assignments.
- Note the challenge of evaluating these algorithms on a test set:  the “ground truth” for a causal effect is not observed for any individual unit. On a simulation study, the authors compare their algorithms by simulating both potential outcomes in evaluating the performance of the algorithms.

*To learn more about causal inference, check out these [notes](https://mlhc17mit.github.io/slides/lecture3.pdf) from MIT's course on ML for healthcare (2017) taught by David Sontag, or these [slides](http://www.nasonline.org/programs/sackler-colloquia/documents/athey.pdf) by Susan Athey, and Guido Imbens.*