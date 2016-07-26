---
title: Identifying Musical Melodies with Deep Learning - A Tutorial
---

A few months back, one of my friends was wrestling with the problem 
of algorithmically identifying musical melodies. He had built a system that used
simple rules to identify single notes, but was disappointed by the performance
of his system in the presence of noise. He had started thinking about potential machine learning solutions to the problem, and wondered how they would fare in noisy
environments.

I was intrigued by the problem of identifying musical melodies, and also excited
to see how well deep learning would do. In what follows, I will attempt
to explain my investigation and thought process navigating a deep learning
solution (using [Keras](http://keras.io)) that ultimately performs with 98% accuracy on a test set of simple 8-note melodies played by a piano in the presence of background noise.

# The approach
At a high level, the approach is to first segment audio wave into small time chunks, then identify the presence of single notes in each chunk, and finally combine the identified notes to get the melody.

{% asset_img sliding_window.png The system takes sliding windows over the audio, and 
identifies the presence of individual notes in each of the windows. %}