---
title: Transcribing Musical Melodies With Neural Networks for Secure Audio Pairing
subtitle:
author: Pranav Rajpurkar and Brad Girardeau
---

Most of us have used Bluetooth at some point in our lives. We are familiar with the routine of "pairing" two devices, like a phone and car, which finishes with entering a PIN or comparing some numbers. The goal of this last step, of course, is _security_. You don't want someone next to you to be able to eavesdrop on you or trick you into connecting to them to steal your data. However this security step is often annoying (typing a PIN) or easily skippable (comparing numbers). This problem promises to become increasingly common as new applications like smart cars and connected homes continue linking things in the physical world together.

We set out to create a better way of securing device pairing in the physical world. Instead of typing a PIN or comparing numbers, a simple audio melody is played and automatically recognized. An attacker would only be able to subvert the pairing by playing their own melody, which would be easily noticed. Otherwise we do not need to do anything.

So how does this work? How can entering a PIN, comparing numbers, or recognizing an audio sequence make things secure? Let's first learn about secure device pairing in general, before delving into the details of how we use audio to improve the process.

# Secure Device Pairing
Like many secure communication discussions, we start with our characters [Alice and Bob](https://en.wikipedia.org/wiki/Alice_and_Bob). In this case, Alice has a device she would like to pair with a device of Bob's that she hasn't connected to before. At the end of the pairing, the goal is for Alice's device and Bob's device to share a secret key that only they know, even if there are attackers who listen or interfere. The devices would then be securely paired because they can use the secret key to encrypt all of their communication so that no one else will be able to eavesdrop on or tamper with them.

There are two types of attackers that Alice and Bob need to be concerned with: a passive attacker we'll call Eve and an active attacker Mallory. Eve, as a passive attacker, can only eavesdrop on, not tamper with the communication nor send messages herself. If Alice and Bob only need to defend against Eve, they can use the [Diffie-Hellman protocol](https://en.wikipedia.org/wiki/Diffie%E2%80%93Hellman_key_exchange) to safely create a shared secret key. The challenge is when Mallory, an active attacker, is involved. While Mallory can't subvert the Diffie-Hellman key exchange directly, Mallory can insert herself between Alice's device and Bob's device, tricking Alice's device and Bob's device into separately pairing with Mallory's device. Both Alice and Bob will now think they share a secret key with each other, while in reality Alice and Mallory share one key, while Bob and Mallory share a different key. This allows Mallory to eavesdrop on or impersonate Alice and Bob.

To prevent Mallory's attack, we need to add some way for Alice and Bob to be sure they are connecting to each other, not an attacker, for the Diffie-Hellman key exchange. There are several ways to do this using a third party that Alice and Bob both trust to verify each other's identity. However, for devices and protocols like Bluetooth, finding a single third party everyone will trust is impractical. This is where [Short Authenticated Strings](https://www.iacr.org/archive/crypto2005/36210303/36210303.pdf) can help.

## Short Authenticated Strings (SAS)

A short authenticated string uses the idea that certain channels are naturally "authenticated" even if they are not secret. This means we know we are communicating with another party because an attacker can't tamper with messages across this channel or will be detected if they do. For example, if Alice and Bob have a face to face conversation, they know they are communicating to the right person and could tell (and ignore) if Mallory tried to shout a different message at them. Even over the phone, Alice and Bob might be able to recognize each other's voice, so they can "authenticate" information exchanged during the conversation.

Going back to the Bluetooth pairing example at the beginning, entering a PIN and comparing numbers also form authenticated channels. Alice sees the PIN on Bob's device and types it into her device or compares it with a PIN on her device; an attacker presumably cannot tamper with Alice's vision, so these channels allow short strings like the PIN to be authenticated.

Once we have an authenticated channel, we can use it to authenticate Alice and Bob's Diffie-Hellman key exchange. All they need to do is ensure that they have agreed on the same key, since Mallory's attacks will cause them to have different keys. One way to do this is by sending a hash, or summary, of the key over the authenticated channel. However, the hash in this case is too long for this to be practical; no one will compare or type 100 characters just to pair their phone with a car or computer. We need _short_ authenticated strings, and it turns out there is a protocol (linked above) that lets us authenticate a message using much shorter authenticated strings.

However typing a PIN or comparing numbers still require a lot of active human intervention. Instead, we can use audio as a authenticated channel and automate the process. If we encode the short authenticated string as melodic notes, Alice's device can simply the play the sound and Bob's device can recognize it. If an attacker tries to interfere with the audio channel, Alice or Bob will hear it, so the audio channel is naturally authenticated.

Putting the steps together, two users can pair devices securely by doing a standard key exchange over a normal communications channel like Bluetooth, then authenticate the shared key for the connection with a Short Authenticated String protocol. The Short Authenticated String protocol involves each device playing a short audio sequence, which the other device must recognize. No intervention beyond passively listening is required by the users, as the only attack they need to detect is if they hear a third unexpected device playing audio. From the user's perspective, this is an easy and seamless process.

# Using Audio

In order to make this system work, we needed to be able to reliably recognize short sequences of audio notes in the real world. In other words, the problem of algorithmically transcribing musical melodies. We first attempted to build a rule based solution, but were disappointed by its performance in the presence of noise. We instead started thinking about potential machine learning solutions to the problem and wondered how they would fare in noisy environments.

In what follows, we will attempt to explain the investigation and thought process of navigating to a [solution](https://github.com/rajpurkar/seqmodels).

Listen to the melody below, which consists of 8 notes played in sequence in a noisy environment -- can you identify any of them? Our system at completion gets all of them right.


{% soundcloud https://soundcloud.com/pranav-rajpurkar/sample-musical-melody  default %}


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