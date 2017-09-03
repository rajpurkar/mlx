---
title: Survival Analysis
tags:
  - healthcare
subtitle: Learnings from a few papers
author: 'Pranav Rajpurkar'
---

Survival analysis is "a set of methods for analyzing data where the outcome variable is the time until the occurrence of an event of interest". In healthcare, the events of interest include acute adverse events and death. Unlike in the {% post_link risk-stratification Risk Stratification %} papers we looked at (where the focus was classification into risk buckets), the focus of survival analysis is on the time at which the event of interest occurs. We'll look at a few papers on survival analysis.

The first paper we'll take a look at is [A targeted real-time early warning score (TREWScore) for septic shock](http://stm.sciencemag.org/content/7/299/299ra122).

- This paper identifies sepsis (the presence in tissues of harmful bacteria and their toxins) and septic shock (low blood pressure due to sepsis) as important to identify and treat early. Their goal is to build a prediction model that uses EHR data to "predict septic shock with high sensitivity and specificity many hours before onset" for patients identified as having sepsis.
- The authors point out that predictive methods need to account for the censoring effects of clinical intervention on patient outcomes: if a patient would have developed septic shock, but was treated beforehand, the patient would be treated as a negative case. Therefore, "methods that assume that these patients are negative [cases] ... can yield scores that underestimate the probability of a positive outcome." If a patient with severe sepsis received treatment for septic shock but never developed shock, they are refered to as **right-censored after treatment**; if they experienced septic shock after receiving treatment for septic shock, they're called **interval-censored**.
- The work develops a TREWScore, "obtained by training a model that estimates the time to an adverse event using supervised learning." For each individual, the risk of septic shock is calculated at each time point to get a risk trajectory; an individual is "identified as being at high risk of septic shock if his or her risk trajectory ever rose above the detection threshold before the onset of septic shock."
- A Cox proportional hazards model, one of the most popular models for survival analysis, is used, with "the time until the onset of septic shock as the supervisory signal" with lasso regularization to "automatically select a sparse subset of features that are most predictive of the labeled; interval censoring is handled using a [multiple imputation approach](<https://en.wikipedia.org/wiki/Imputation_(statistics)#Multiple_imputation>).
- The model identified patients before the onset of septic shock with an AUC of 0.83, at a median of 28.2 hours before onse, outperforming a baseline metric used to identify medical patients (AUC of 0.73).
