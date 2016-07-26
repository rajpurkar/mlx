---
title: Recognizing Musical Melodies with Deep Learning
---

A few months back, one of my friends was wrestling with the problem of algorithmically recognizing musical melodies. He had attempted to build a rule based solution, but was disappointed by the performance of his system in the presence of noise. He had started thinking about potential machine learning solutions to the problem, and wondered how they would fare in noisy environments.

I was intrigued by the problem of recognizing musical melodies, and also excited to see how well deep learning would do. In what follows, I will attempt to explain my investigation and thought process navigating a deep learning solution (using [Keras](http://keras.io)) that ultimately performs with 98% accuracy on a test set of simple 8-note piano melodies in the presence of background noise.

# The approach
At a high level, the approach is to first segment audio wave into small time chunks, then recognize the presence of single notes in each chunk, and finally combine the recognize notes to get the melody.

{% asset_img sliding_window.png The system takes sliding windows over the audio, and identifies the presence of individual notes in each of the windows. The box with the yellow light bulb is a neural network responsible for the recognition task. %}

A neural network is responsible for the recognition process. It's task can be defined as follows:

{% blockquote %}
Given a small segment of audio as input, classify it into one of (n_pitches + 1) pitches, where the extra pitch class denotes silence or background noise.
{% endblockquote %}

Having formulated the learning task as a multiclass classification problem, let's think about the input that the learning algorithm will receive. One way to think of (stereo) audio is as a sequence of samples, where each sample is a two-dimensional real-valued vector $[ v_l , v_r ]$. Here, the values represent the instantaneous amplitude of the audio signal in the left and right channels.

## Enter Recurrent Neural Networks
Imagine being asked to guess a song from a single note -- the task would be next to impossible! However, if you were played the whole melody, you may be able to venture a good guess. We use information from the past to guide decision making in the present. Although a gross oversimplification, this is also what a Recurrent Neural Network (RNN) does.

Let's try to understand how we will feed in our audio input into the RNN. Recall that the network receives a sequence of samples. For the purposes of our example, let's say our sample input is $x = [ [1.0, 4.0] , [2.0, 5.0], [3.0, 3.0] ]$.
