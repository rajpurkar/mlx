---
title: Transcribing Musical Melodies With Neural Networks
subtitle:
author: Pranav Rajpurkar
---

A few months back, one of my friends was wrestling with the problem of algorithmically transcribing musical melodies. He had attempted to build a rule based solution, but was disappointed by the performance of his system in the presence of noise. He had started thinking about potential machine learning solutions to the problem, and wondered how they would fare in noisy environments.

I was intrigued by the problem of transcribing musical melodies, and also excited to see how well machine learning would do. In what follows, I will attempt to explain my investigation and thought process navigating a [solution](https://github.com/rajpurkar/seqmodels).

The melody below consists of 8 notes played in sequence in a noisy environment -- can you identify any of them? Our system at completion gets all of them right.


[//]: # ({% soundcloud https://soundcloud.com/pranav-rajpurkar/sample-musical-melody  default %})


# Exploring Approaches to Melody Transcription
To transcribe a melody is to recognize the sequence of notes that constitute it. We seek to develop a system which can listen to an audio file and transcribe the melody. An example transcription of a four-note melody is $[A, C, E, G]$. If we have sheet music for an audio file, we know exactly when each note is played, and for how long. In this case, the input audio and labellings are said to *have alignment*, and the data is said to be *strongly labelled*. The harder case is when we have the sequence of notes that constitute the melody, but no information on when each note is played. In this case, input data and labellings are said to have *unknown alignment*, the data is said to be *weakly labelled*, and the task is called *temporal classification*. We often encounter temporal classification in speech recognition, where we may know from an audio transcription that a person says "hello world", but we don't know the precise moments when each of the words (or phonemes/graphemes) is uttered.


## Without Alignment Information
When the alignment between audio data and melodies is not given, a model must map an input sequence of audio data to an output sequence of discrete notes that constitute the melody -- a temporal classification task.

In the early 2000s, graphical models such as Hidden Markov Models (HMMs) and Conditional Random Fields (CRFs) were the reigning kings for temporal classification. At that time, Recurrent Neural Networks (RNNs), although able to provide a powerful mechanism for time series modelling, were not directly applicable to temporal classification. RNNs had an API constraint: they required target outputs for each point in the training sequence. Temporal classification with a single neural network was a feat yet unachieved.

In 2006, [Alex Graves et al.](http://www.cs.toronto.edu/~graves/icml_2006.pdf) introduced *Connectionist Temporal Classification (CTC)*, a way to label sequence data with neural networks without need for either alignment data or post-processing. CTC (also called CTC-RNN to make clear that the choice of network is recurrent) defines a differentiable loss function that calculates the probability of a melody conditioned on the input as a sum over all possible alignments of the audio input with the notes in the melody. The CTC network has since evolved, and is used in state-of-the-art speech recognitions systems (see [DeepSpeech2](http://arxiv.org/pdf/1512.02595v1.pdf)) today.

## With Alignment Information
One simple way to use alignment information between audio and notes is to split the audio data into segments such that each audio segment corresponds to one output class (note). A model can then learn to map from an audio segment to a single note, as opposed to a sequence of notes. Rather than transcribe the melody all at once from the entire audio sequence, we can thus recognize each note that constitutes it one audio-segment at a time. This idea is more generally called the sliding window approach, is commonly used in pedestrian detection and photo OCR (see [Coursera video by Andrew Ng on sliding windows](https://www.coursera.org/learn/machine-learning/lecture/bQhq3/sliding-windows).

A major drawback of having models work on segments, rather than on the entire sequence is that context information is lost. Just as certain sequences of words make much more sense than others in accordance with the rules of syntax and grammar, certain sequences of notes are more likely than others in terms of musicality. Any model that operates at the level of segments (or words) rather than melodies (or sentences) signs off any benefit that it may have acquired from context. A popular workaround is to hybridize segment-level models, responsible for making local predictions, with HMMs, responsible for modelling global behaviors of data.

Models can also learn to transcribe the entire melody from the audio sequence without any segmentations. In recent years, working with sequential inputs and outputs for neural networks has become extraordinarily effective, and has led to the popularization of the *sequence-to-sequence learning* paradigm.

# A System for Melody Transcription

While the CTC / sequence-to-sequence class of approaches to the problem of melody transcription seemed promising, their implementations (at time of writing) were hard to get to work well. Nevertheless, I think this is a promising direction for future work, given their results in speech recognition.

We turn instead to the pre-CTC era approach of sliding windows, where a model detects individual notes in an audio segment (window) that slides through the audio sequence; the notes outputted are then preprocessed to get the melody. We'll see that sliding windows can work incredibly well with the right choice of segment-level model.

Let's start understanding what the system we will implement will do. We can think of the system as having three sequential components:
- **Preprocessing**: Segment the audio sequence by sliding a small window across time.
- **Model**: Recognize the note that constitutes each segment.
- **Postprocessing**: Combine the note outputs over all of the windows to get the melody.

{% asset_img sliding_window.png Taking sliding time windows over the audio, a model identifies the presence of single notes in each of the segments, the outputs of which are postprocessed to get the melody.%}

A critical component of this system is the model responsible for recognizing the note that constitutes each segment. We will begin by describing this model, deferring the details of the pre- and post- processing components until later.

## A Model for Recognizing Notes in Audio Segments
Our model will take a segment of audio as input and determine which note, if any, was played in that segment. One way to formulate this task is as a multiclass classification problem with $ n + 1 $ classes, where the extra note class denotes silence or background noise. An alternative, often seen in character recognition, is to break the task into detection and recognition steps such that a detector decides whether or not a segment contains a note and a recognizer then classifying the positive detected note into one of $n$ classes. In my experiments, I found that posing the task as an $ n + 1 $ class classification worked better.

We haven't yet defined what an audio segment is. We can think of an audio segment as a sequence of samples $[s_1, s_2, ... s_t]$, where each sample is a two-dimensional real-valued vector $[ v_l , v_r ]$. Here, the values represent the instantaneous amplitude of the audio signal in the left and right audio channels. For the purposes of our example, let's use the following length-3 sample input: $x = [ [1.0, 4.0] , [2.0, 5.0], [3.0, 3.0] ] $. Our model maps this input to a probability distribution over all the possible notes. If the possible outputs were A, B, C (and the noise class), then a sample output might look like $ y = [noise: 0.1, A: 0.2, B: 0.6, C: 0.1]$.

### Recurrent Neural Networks to Model Temporal Dependencies
The temporal properties of audio make it inherently sequential. Recurrent Neural Networks (RNNs) are a special class of neural networks that can exploit this sequential structure, using information from the past to guide decision making in the present.

{% asset_img rnn-musical.png The recurrent network takes in a sample at each time step as input (red), and at the last time step, produces a probability distribution over the possible notes as output (blue). In the hidden (green) layer, the network is propagating information through timesteps. %}

(See [Alex Graves' thesis](https://www.cs.toronto.edu/~graves/preprint.pdf) and [Andrej Karpathy's post](http://karpathy.github.io/2015/05/21/rnn-effectiveness/) for some really cool RNN work)

### Postprocessing Sliding Window Outputs To Label Sequences
The model described above outputs a probability distribution over the possible classes for each segment of the sliding window. We seek to combine the outputs of each of these segments to get the melody.

{% asset_img rnn-probabilities.png Sliding window outputs over time show changing probabilities of classes across time. %}
{% asset_img post-nms.png Non-Maximum Suppression keeps the local maxima, which can be used to recover the underlying melody [Note A, Note B] %}

To recover the underlying melody from sliding window outputs, we are going to use a variant of Non-Maximum Suppression (NMS). The basic idea of NMS is to look at each point in the sequence, and suppress neighbouring points that are smaller to zero. At the end of the NMS run, only the local maxima remain. Maxima separated by the silence / noise class can then be read off as the notes constituting the melody.

