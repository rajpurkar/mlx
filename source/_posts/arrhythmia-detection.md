---
title: Arrhythmia Detection
tags:
  - healthcare
author: Pranav Rajpurkar
subtitle: Background and Challenges
date: 2017-09-13 16:09:24
---

Recently, my collaborators and I did some work demonstrating that we can use deep learning to detect arrhythmias at the level of individual cardiologists ([website](https://stanfordmlgroup.github.io/projects/ecg/), [paper](https://arxiv.org/abs/1707.01836)). In this post, I share some background to the work, motivating the problem of arrhythmia detection and explaining the need for its automation.

An arrhythmia is an abnormal heart rhythm. Arrhythmias affect millions of people every year and cost a lot of money to treat. *Atrial Fibrillation, the most common serious arrhythmia, alone affects ~33.5 people in the world.* Arrhythmias can produce a variety of symptoms, including a fluttering in the chest, a racing heartbeat, a slow heartbeat, chest pain etc. Sometimes there are no symptoms, but a doctor might diagnose an arrhythmia during a routine examination.

*How does a doctor diagnose arrhythmias?* The doctor uses an electrocardiogram (ECG or EKG) test to check for problems. An ECG shows the heart's electrical activity over time. During the test, the patient lies on a bed, and several electrodes are attached to the skin on each arm and leg and on the chest. These are hooked to a machine that traces the heart activity onto a paper. The ECG is a safe test: no electricity passes through the body from the machine, and there is no danger of electrical shock.

Sometimes the ECG may look normal even when you have heart disease, and may only show up on the ECG during exercise or when you have symptoms. To check for these, an ambulatory ECG is used. Ambulatory means that you're able to walk around, carrying on with daily activities. Traditionally, this has been done with Holter monitors. The Holter monitor is a device you can wear on a strap over the shoulder, connected by wires to small patches taped to your chest. One disadvantage of the Holter monitor is that it can only be worn for a limited time (upto 48 hours), and thus may not capture all of a patient's arrhythmias. Recent ambulatory devices, such as the Zio Patch by iRhythm, are designed to continuously monitor the ECG, able to capture data for up to 14 days and help doctors arrive at a diagnosis after a single monitoring period.

Over the 14 day period, the heart beats ~1.6 million times. Comparing this with the ~100 heart beats that the traditional ECG test captures, note that it's infeasible for a doctor to go through all of the data manually. This motivates the need for automatic detection of arrhythmias.

One of the challenges associated with the automatic detection of arrhythmias in the ambulatory setting is that there's less signal to work with. In the hospital, we find the 12-lead ECG, where 10 ten electrodes are placed on a patient's chest and limbs, and the heart's electrical activity is measured from 12 different angles ("leads"). Having multiple leads is like having multiple 2D camera perspectives into the 3D electrical activity of the heart. Ambulatory devices typically use fewer leads (so that they can be portable), that may not capture all of the angles, making it impossible to make some differential diagnoses.

The diagnosis of arrhythmias depends on many rules. A heartbeat contains waveform components labeled P, Q, R, S, and T: loosely, the P wave indicates the contraction of the upper chambers of the heart, the QRS waves represent the contraction of the lower chambers of the heart, and the T wave corresponds to the expansion phase. To identify an arrhythmia, a doctor would typically start by looking at heart rate, followed by features of the wave components such as the width of the QRS, the height of the P wave etc.

But attempting to code these rules into a computer program is futile. There is far too much individual variation, making it challenging to define a set of rules that can capture this variety, especially in the presence of noise. 

Machine learning allows us to build systems which learn automatically from data. Traditionally, machine learning approaches to arrhythmia detection have used feature engineering: rather than using the raw ECG signal, feature engineering approaches have used transformations (such as wavelet transformations) of the signal and then trained shallow models on the transformed features. In our [work]((https://stanfordmlgroup.github.io/projects/ecg/), we showed how a deep learning algorithm, coupled with a large dataset, could diagnose a wide range of arrhythmias from a single-lead ECG using the raw features directly.

Automating the detection of arrhythmias opens up an array of possibilities. With 300 million ECGs recorded annually, high accuracy automatic diagnosis can save doctors considerable time. Coupled with low-cost ECG devices, automated detection can provide diagnostic tools in parts of the world where access to skilled doctors is limited.

*Read more about automated arrhythmia detection in our paper [
Cardiologist-Level Arrhythmia Detection with Convolutional Neural Networks](https://arxiv.org/pdf/1707.01836.pdf).*