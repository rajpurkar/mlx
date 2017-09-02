---
title: Machine Learning for Risk Stratification
tags:
  - mlhc
  - summary
  - healthcare
subtitle: Learnings from a few papers
---

With rapid adoption of electronic health records, we have increased the quantity of clinical data that are available electronically -- how can we use this data to improve care? In this post, we're going to be looking at 3 papers on ML for risk stratification. 

# In a nutshell
The first paper we'll take a look at is *[Big Data In Health Care: Using Analytics To Identify And Manage High-Risk And High-Cost Patients (2014)](http://content.healthaffairs.org/content/33/7/1123.full)*.

The paper addresses the problem of high costs of healthcare, identifying opportunities to reduce costs through the use of predictive systems: "software tools that allow the stratification of risk to predict an outcome". The paper looks at six opportunities whether clinical analytics is likely beneficial:
- High-cost patients: Management will be much more cost-effective if interventions can be precisely tailored to a patient’s specific problems. If high-risk and low-risk patients can be identified, a better reallocation of resources can follow.
- Readmissions: Healthcare orgs should use algorithms to "predict who is likely to be readmitted to the hospital", and patient-specific monitoring once they're discharged to intervene if necessary.
- Triage (assigning degrees of urgency to patients): Use patient data to anticipate risk, and combine with routinely collected physiological measurements to make accurate assesements.
- Decompensation (worsenining of patient condition): Continuous monitoring of multiple data streams (is the patient moving, ECG, oxygen) combined with real-time alert systems.
- Adverse events: Similar to decompensation; applications to renal failure, infection, and adverse drug events.
- Diseases Affecting Multiple Organ Systems: Clinical data networks and access to longitudinal records (history of patient visits) can improve patient care.

The second paper we'll cover is *[Population-Level Prediction of Type 2 Diabetes From Claims Data and Analysis of Risk Factors (2015)](http://online.liebertpub.com/doi/pdf/10.1089/big.2015.0020)*.

Like the first paper, this paper looks at the use of predictive analytics for a risk assessment task. Specifically, the work develops a population-level risk prediction model for type 2 diabetes, built using health insurance claims and other readily available clinical and utilization data.
- The outcome of interest is the confirmed diagnosis of type 2 diabetes (using ICD codes and use of diabetes medication).
- A parsimonous (baseline) model is built that uses "risk factors derived from seven landmark studies of risk prediction models for predicting incident diabetes", using direct or surrogate measurements.
- An enhanced model is then built, that uses variables such as demographics, medical conditions (using ICD-9 codes), procedures, visits, etc. for a total of ~42,000 variables.
- The task was to predict "whether subjects were to develop type 2 diabetes within a 2-year prediction window." The models were developed using L1 regularized, logistic regression, which is a "computationally efficient alternative to commonly used variable selection methods, such as forward selection and backward elimination, and eliminates both variable ordering bias and the need to adjust for the p-value inflation coming from multiple comparison tests on the same dataset."
- The enhanced model performs better: for immediate prediction of diabetes, the enhanced model had an AUC of 0.80 compared with an AUC of 0.75 for the baseline parsimonious model, and additionally identifies novel (surrogate) risk factors for type 2 diabetes, such as chronic liver disease, high alanine aminotransferase, esophageal reflux, and history of acute bronchitis.

*The previous 2 papers are part of the reading list for the MIT course on ML for healthcare taught by Professor David Sontag.*

The final paper we'll take a look at is *[Intelligible Models for HealthCare: Predicting Pneumonia Risk and Hospital 30-day Readmission (2015)](http://people.dbmi.columbia.edu/noemie/papers/15kdd.pdf)*.
