---
title: Risk Stratification For Patient Care
tags:
  - mlhc
  - summary
  - healthcare
subtitle: Learnings from a few papers
---

With rapid adoption of electronic health records, we have increased the quantity of clinical data that are available electronically -- how can we use this data to improve care? In this post, we're going to be looking at a few papers on ML for risk stratification. 

The first paper we'll take a look at is *[Big Data In Health Care: Using Analytics To Identify And Manage High-Risk And High-Cost Patients (2014)](http://content.healthaffairs.org/content/33/7/1123.full)*.

The paper addresses the problem of high costs of healthcare, identifying opportunities to reduce costs through the use of predictive systems: "software tools that allow the stratification of risk to predict an outcome". The paper looks at six opportunities whether clinical analytics is likely beneficial:
- High-cost patients: Management will be much more cost-effective if interventions can be precisely tailored to a patient’s specific problems. If high-risk and low-risk patients can be identified, a better reallocation of resources can follow.
- Readmissions: Healthcare orgs should use algorithms to predict who is likely to be readmitted to the hospital, and patient-specific monitoring once they're discharged to intervene if necessary.
- Triage (assigning degrees of urgency to patients): Use patient data to anticipate risk, and combine with routinely collected physiological measurements to make accurate assesements.
- Decompensation (worsenining of patient condition): Continuous monitoring of multiple data streams (is the patient moving, ECG, oxygen) combined with real-time alert systems.
- Adverse events: Similar to decompensation; applications to renal failure, infection, and adverse drug events.
- Diseases Affecting Multiple Organ Systems: Clinical data networks and access to longitudinal records (history of patient visits) can improve patient care.

We'll look at work that tackles a few of these verticals.

The second paper we'll cover is *[Population-Level Prediction of Type 2 Diabetes From Claims Data and Analysis of Risk Factors (2015)](http://online.liebertpub.com/doi/pdf/10.1089/big.2015.0020)*.

Like the first paper, this paper looks at the use of predictive analytics for a risk assessment task. Specifically, the work develops a population-level risk prediction model for type 2 diabetes, built using health insurance claims and other readily available clinical and utilization data.
- The outcome of interest is the confirmed diagnosis of type 2 diabetes (using ICD codes and use of diabetes medication).
- A parsimonous (baseline) model is built that uses "risk factors derived from seven landmark studies of risk prediction models for predicting incident diabetes", using direct or surrogate measurements.
- An enhanced model is then built, that uses variables such as demographics, medical conditions (using ICD-9 codes), procedures, visits, etc. for a total of ~42,000 variables.
- The task was to predict "whether subjects were to develop type 2 diabetes within a 2-year prediction window." The models were developed using L1 regularized, logistic regression, which is a "computationally efficient alternative to commonly used variable selection methods, such as forward selection and backward elimination, and eliminates both variable ordering bias and the need to adjust for the p-value inflation coming from multiple comparison tests on the same dataset."
- The enhanced model performs better: for immediate prediction of diabetes, the enhanced model had an AUC of 0.80 compared with an AUC of 0.75 for the baseline parsimonious model, and additionally identifies novel (surrogate) risk factors for type 2 diabetes, such as chronic liver disease, high alanine aminotransferase, esophageal reflux, and history of acute bronchitis.

*The previous 2 papers were part of the reading list for the MIT course on ML for healthcare (2017) taught by Professor David Sontag. The next 2 papers we look at were accepted as part of the Machine Learning For Healthcare Conference (2017).*

The next paper we'll take a look at is *[Intelligible Models for HealthCare: Predicting Pneumonia Risk and Hospital 30-day Readmission (2015)](http://people.dbmi.columbia.edu/noemie/papers/15kdd.pdf)*.

This paper highlights the tradeoff between the accuracy and intelligibility (interpretable by humans) of models: NNs / random forests are sometimes more accurate, but could they be learning rules that could put patients at risk, here in the task of predicting 30-day hospital readmission? 

- The authors augmenting Generalized Additive Models (GAMs), which look at single features, with pairwise interactions to get (GA2Ms). GAMs and GA2Ms have the advantage that they are intelligible: their model returns a risk score that is added to the patient’s aggregate predicted risk. Because the expected value of each term is 0, terms with risk scores above zero increase risk; terms with scores below zero decrease risk. This risk score can be added to baseline risk, and converted to a probability.
- They show that GA2Ms do not lose out on accuracy to other models, with Pneumonia risk results that show "logistic regression achieves AUC = 0.843, Random Forests achieves 0.846, LogitBoost 0.849, GAM 0.854, and GA2M is best with AUC = 0.857.4."

Our final paper is *[Classifying Lung Cancer Severity with Ensemble Machine Learning in Health Care Claims Data (2017)](http://mucmd.org/CameraReadySubmissions/9%5CCameraReadySubmission%5CCLC_camera_ready.pdf)*.

- This paper looks at the binary classification task of determining whether a lung cancer patient receiving
chemotherapy has early stage (stages I-III) or late stage (stage IV) cancer, with the goal of achieving "sensitivity and specificity in the full sample above 80% simultaneously."
- The baseline is a clinical tree algorithm, which is a decision tree that uses a small target set of clinical variables, based on clinical guidelines.
- The authors develop an ensemble of classifiers, that include a random forest, a GAM (like we saw in the previous paper), lasso, and svm, using clinical variables used by the clinical tree algorithm, along with demographic, claim, treatment, and comorbidity variables, and 13 lung cancer type and secondary malignancy diagnosis codes. Their ensemble yields "full sample performance of 93% sensitivity, 92% specificity, and 93% accuracy"