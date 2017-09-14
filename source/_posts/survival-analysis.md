---
title: Survival Analysis
tags:
  - healthcare
subtitle: Learnings from a few papers
author: Pranav Rajpurkar
date: 2017-09-03 23:57:11
---


Survival analysis concerns itself with predicting the time until the occurrence of an event, such as death, or onset of a disease. We'll look at a few papers on survival analysis.

The first paper we'll take a look at is [A targeted real-time early warning score (TREWScore) for septic shock](http://stm.sciencemag.org/content/7/299/299ra122).

- This paper identifies sepsis (the presence in tissues of harmful bacteria and their toxins) and septic shock (low blood pressure due to sepsis) as important to identify and treat early. Their goal is to build a prediction model that uses EHR data to "predict septic shock with high sensitivity and specificity many hours before onset" for patients identified as having sepsis.
- The authors point out that predictive methods need to account for the censoring effects of clinical intervention on patient outcomes: if a patient would have developed septic shock, but was treated beforehand, the patient would be treated as a negative case. Therefore, "methods that assume that these patients are negative [cases] ... can yield scores that underestimate the probability of a positive outcome." If a patient with severe sepsis received treatment for septic shock but never developed shock, they are referred to as **right-censored after treatment**; if they experienced septic shock after receiving treatment for septic shock, they're called **interval-censored**.
- The work develops a TREWScore, "obtained by training a model that estimates the time to an adverse event using supervised learning." For each individual, the risk of septic shock is calculated at each time point to get a risk trajectory; an individual is "identified as being at high risk of septic shock if his or her risk trajectory ever rose above the detection threshold before the onset of septic shock."
- A Cox proportional hazards model, one of the most popular models for survival analysis, is used, with "the time until the onset of septic shock as the supervisory signal" with lasso regularization to "automatically select a sparse subset of features that are most predictive of the labeled; interval censoring is handled using a <a href="https://en.wikipedia.org/wiki/Imputation_(statistics)#Multiple_imputation">multiple imputation approach</a>.
- The model identified patients before the onset of septic shock with an AUC of 0.83, at a median of 28.2 hours before onset, outperforming a baseline metric used to identify medical patients (AUC of 0.73).


The next paper we'll look at is [Deep Survival Analysis](http://proceedings.mlr.press/v56/Ranganath16.pdf).

- This paper identifies 2 limitations of traditional approaches to survival analysis: (1) they cannot handle missing covariates (variable that is predictive of the outcome), and (2) they require aligning patients by a starting event such as the onset of condition.
- The works introduces a "joint model for both the covariates and the survival times, where the covariates and survival times are specified conditioned on a latent process" that is based on deep exponential families. Their model, called "Deep Survival Analysis" has the advantage that: (1) it models "covariates and survival time in a Bayesian framework", thus making it easier to work with the characteristically sparse and censored EHR data and (2) "observations are aligned by their failure time" rather than enforcing an artificial start alignment for patients.
- The algorithm is compared against the Framingham CHD risk score, which estimates the 10-year coronary heart disease risk of an individual based on age, sex, LDL cholesterol, HDL cholesterol, blood pressure, diabetes, and smoking.
- Because the data has censorship (information is incomplete), loss functions like mean-squared-error cannot be used, and a measure like concordance index, also known as the c-index, needs to be used. The concordance measure evaluates the accuracy of the ordering of predicted time.
- On the task of "stratifying patients according to the risk of developing coronary heart disease (CHD)", the Baseline Framingham Risk Score got a concordance of 65.57%, while Deep Survival Analysis yielded a 73.11% concordance. 

The last paper we'll look at is [Predicting long-term mortality with first-week post-operative data after Coronary Artery Bypass using Machine Learning models](http://mucmd.org/CameraReadySubmissions/13%5CCameraReadySubmission%5CSubmission%2013%20-%20Forte%20et%20al..pdf)

- This paper compares ML methods to predict 5-year mortality in patients who underwent Coronary Artery Bypass Graft.
- Cox regression is used as a baseline for comparison against a Gradient Boosting Machine (GBM), Random Forest (RF), SVM, weighted-KNN, and linear regression.
- The relative importance of the most important variables for the best RF and GBM models is obtained by excluding that variable and measuring how much accuracy decreases.
- The GBM algorithm is found to be the most accurate (AUC 0.767) followed by RF (AUC 0.760). Cox regression, fitted with a lasso penalty, was the least accurate (AUC 0.644).

*The first two papers were part of the reading list for the MIT course on ML for healthcare (2017) taught by Professor David Sontag. The last paper was part of the Machine Learning For Healthcare Conference (2017).*