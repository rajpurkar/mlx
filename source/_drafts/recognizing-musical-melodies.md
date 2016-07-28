---
title: Recognizing Musical Melodies with Deep Learning And Sliding Windows
---

A few months back, one of my friends was wrestling with the problem of algorithmically recognizing musical melodies. He had attempted to build a rule based solution, but was disappointed by the performance of his system in the presence of noise. He had started thinking about potential machine learning solutions to the problem, and wondered how they would fare in noisy environments.

I was intrigued by the problem of recognizing musical melodies, and also excited to see how well machine learning would do. In what follows, I will attempt to explain my investigation and thought process navigating a solution that uses deep learning and sliding windows.

# The approach
To tackle the problem of musical melody recognition, we will:
1. Segment the audio wave by sliding a small window across time.
2. Recognize the presence of single notes in each segment.
3. Combine the recognize notes over all of the windows to get the melody.

{% asset_img sliding_window.png The system takes sliding time windows over the audio, and identifies the presence of individual notes in each of the windows. The box with the yellow light bulb is a neural network responsible for the recognition task. %}

(See [Coursera video by Andrew Ng](https://www.coursera.org/learn/machine-learning/lecture/bQhq3/sliding-windows) to get a better understanding of sliding windows. This approach is commonly found in pedestrian detection and photo OCR.)

# A sliding window
A melody is a linear successions of musical notes. To recognize the melody, we need to recognize the sequences of notes that constitute it. Our choice of solution depends on the kind of training data we have at our disposal. Let's consider a few scenarios:

- The easiest case is that along with the audio, we have sheet music for the melody so that we know exactly when each note is played, and for how long.

- A slightly harder case is that we have the notes 

Of course, we can try to recognize all of the sequence at once. Sequence-to-sequence neural models make this possible.

# Neural Network For Musical Note Recognition

{% blockquote %}
Given an audio segment as input, the network is responsible for classify it into one of $ n + 1 $ notes, where the extra note class denotes silence or background noise.
{% endblockquote %}

Note that this is a multiclass classification problem with $ n + 1 $ classes. An alternative, often seen in character recognition, is to separate the detection and recognition steps so that a detector decides whether or not a segment contains a note and a recognizer then classifying the positive detected note into one of $n$ classes. However, in my experiments, I found that this was not neccessary for this application and posing the task as an $ n + 1 $ class classification worked better.

We haven't yet defined what an audio segment is. We can think of an audio segment as a sequence of samples $[s_1, s_2, ... s_t]$, where each sample is a two-dimensional real-valued vector $[ v_l , v_r ]$. Here, the values represent the instantaneous amplitude of the audio signal in the left and right audio channels.

Let's try to understand the inputs and outputs of our network. Recall that the network receives a sequence of samples. For the purposes of our example, let's take a length-3 sample input: $x = [ [1.0, 4.0] , [2.0, 5.0], [3.0, 3.0] ] $. The network will take this input, perform some computations, and outputs a probability distribution over all the possible notes. If the possible notes were A, B, C (and the noise class), then a sample output might look like $ y = [noise: 0.1, A: 0.2, B: 0.6, C: 0.1]$.

## A Recurrent Neural Network
The temporal properties of audio make it inherently sequential. Recurrent Neural Networks (RNNs) can exploit this sequential structure, able to use information from the past to guide decision making in the present. Let us see how an RNN would make a prediction on our sample input output pair.

{% asset_img rnn-musical.png The recurrent network takes in a sample at each time step as input (red), and at the last time step, produces a probability distribution over the possible notes as output (blue). In the hidden (green) layer, the network is propagating information through timesteps. %}

(See [Alex Graves' thesis](https://www.cs.toronto.edu/~graves/preprint.pdf) and [Andrej Karpathy's post](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) for some really cool RNN work)

# Combining Window Outputs
We have a network capable of classifying audio segments into one of $ n + 1 $ notes. But we haven't discussed how to use these outputs to go from notes to melodies. 