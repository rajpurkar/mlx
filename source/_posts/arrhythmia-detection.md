---
title: Arrhythmia Detection
tags:
  - healthcare
author: Pranav Rajpurkar
subtitle: Background and Challenges
date: 2017-09-13 16:09:24
---

In this post, I'm going to share some of my work at the intersection of artificial intelligence and healthcare. We'll look at using machine learning (ML) for automatic detection of arrhyhthmias. I'm choosing to focus on motivating both the problem and the ML solution, defering the details of the methods to [this website](https://stanfordmlgroup.github.io/projects/ecg/) or [this paper](https://arxiv.org/abs/1707.01836).

An arrhythmia is an abnormal heart rhythm. Arrhythmias affect millions of people every year, and cost a lot of money to treat. They can produce a variety of symptoms, including a fluttering in the chest, a racing heartbeat, a slow heartbeat, chest pain etc. Sometimes there are no symptoms, but a doctor might diagnose an arrhyhthmia during a routine examination.

*How does a doctor diagnose arrhyhthmias?* The doctor uses an electrocardiogram (ECG or EKG) test to check for problems. An ECG shows the heart's electrical activity over time. During the test, you lie on a bed, and several electrodes are attached to the skin on each arm and leg and on your chest. These are hooked to a machine that traces your heart activity onto a paper. The ECG is a safe test: no electricity passes through your body from the machine, and there is no danger of electrical shock.

Sometimes your ECG may look normal even when you have heart disease, and may only show up on the ECG during exercise or when you have symptoms. To check for these, an ambulatory ECG is used. Ambulatory means that you're able to walk around, carrying on with your daily activities. Traditionally, this has been done with holter monitors. The Holter Monitor is a device you can wear on a strap over your shoulder, connected by wires to small patches taped to your chest. You can wear it upto 48 hours, but sometimes you might get unlucky and not have arrhyhthmias exhibit themselves in those 48 hours. More recent ambulatory devices, such as the Zio Patch by iRhythm, are designed to continuously monitor the ECG, able to capture data for up to 14 days so you can arrive at a diagnosis after a single monitoring period.

Over the 14 day period, the heart beats ~1.6 million times. Comparing this with the ~100 heart beats that the traditional ECG test captures, note that it's infeasible for a doctor to go through all of the data manually. This motivates the need for automatic detection of arrhythmias.

One of the challenges associated with the automatic detection of arrhythmias in the ambulatory setting is that there's less signal to work with. In the hospital, you'll find the 12-lead ECG, where 10 ten electrodes are placed on a patient's chest and limbs, and the heart's electrical activity is measured from 12 different angles ("leads"). Having multiple leads is like having multiple 2D camera perspectives into the 3D electrical activity of the heart. Ambulatory devices typically use fewer leads (so that they can be portable), that may not capture all of the angles, making it impossible to make some differential diagnoses.

The diagnosis of arrhythmias depends on many rules. A doctor would typically start by looking at heart rate, and then features of the rhythm including regularity, the width of wave components.

 Machine learning is the science of getting computers to act without being explicitly programmed
