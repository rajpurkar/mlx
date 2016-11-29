---
title: Food for thought - Dialog Systems
subtitle: Learnings from a few papers
tags:
  - nlp
  - dialog
  - overview
  - summary
---
**(post in progress)**
In this post, I share some thoughts on a few papers on dialog systems.

# Why care about dialog systems?
As speech recognition gets better, we can expect to be having more conversations with our devices. Try asking your phone "what event is next on my calendar", and you can expect the dialog agent to respond after looking at your calendar. On my iPhone, I can continue the conversation, asking "What's after that?", and getting the next chronological event. I can even continue with "What's before that?", and get the correct answer!

It's very impressive for a dialog agent to be able to do this. To be able to answer my first question, the agent has to be able to, among other things, understand my query and execute it on my calendar. For the follow-up questions, it needs to keep track of our conversation to know what 'that' refers to, and what 'after' and 'before' are relative to.

Of course, dialog agents are not constrained to speech interactions (also called *spoken dialog*): text is a natural medium for conversational agents. On the Facebook Messenger platform for instance, use cases include personalized shopping assistance, curated news stories, and assisted food ordering!

We'll look at a mix of papers on dialog systems.

# Paper 1
The first paper we'll take a look at is *[Evaluating Prerequisite Qualities for Learning End-to-End Dialog Systems](https://arxiv.org/abs/1511.06931)* by Jesse Dodge, Andreea Gane, Xiang Zhang, Antoine Bordes, Sumit Chopra, Alexander Miller, Arthur Szlam, Jason Weston.

## At a glance
The authors argue that end-to-end dialog systems "lack pertinent goal-oriented frameworks to validate their performance". The paper proposes of a suite of four tasks for evaluation of dialog systems: QA, Recommendation, QA + Recommendation, and Reddit Discussion. Here are the four tasks, each with an example user-question and expected sample machine response (italicized).
- **Factoid QA (stand-alone questions):**
  "Can you name a film directed by Stuart Ortiz?"
  *"Grave Encounters"*

    - Tests ability to answer factoid questions, unspecific to user.

- **Personalized recommendation:**
  "Pulp Fiction, Schneider's List, and The Godfather are movies are movies I like. What else will I like?"
  *"The Hunt for Red October"*

    - Tests ability to answer recommendation questions, specific to user.

- **QA + Recommendation Dialog**: 
  "I loved X, Y, and Z. I'm looking for a Fantasy movie."
  *"School of Rock."*
  "What else is that about?
  *"Music, J, K, L..."*
  "I like rock and roll movies more. Do you know anything else?"
  *"Little Richard"*

    - 3 turns between user and system.
    - Tests ability to use short-term context. To answer the second question, a system would have to solve the coreference for 'that'.

- **Reddit Discussion**:
  "I think the Terminator movies really such, I mean the first one was kinda ok, but after that they got really cheesy...""
  *"C'mon the second one was still pretty cool... Arny was so badass..."*

    - Tests ability of a system to pick the most probable replies on reddit discussion comments.

In all of the tasks, for each question, the system is given a list of possible answer candidates, and has to rank them from most probable to least probable. If the right answer, or one of the right answers, is high up on the system's ranking (in the top k, where k is task specific), then the system is considered correct, and wrong otherwise. This is called the hits@k accuracy.

## Food for thought
- Evaluation that points to a system's strengths and weaknesses is informative of how much improvement remains, and where the improvement can come from. It's not immediately clear how one can evaluate a dialog system: what does it mean for the machine to do well at dialog? The paper distinguishes between goal-oriented dialog, where the success of the dialog is tied to the completion of some task, and *chit-chat*, tied to having a sensible conversation about some topic.
- The paper is motivated by that evaluation relies either on humans (hand-labelling / crowdsourcing) or use machine translation metrics like BLEU: the former is problematic because human-evaluation is costly and time-intensive, and the latter is problematic because such metrics "judge the quality of the generated language only" rather than "assess if end-to-end systems can conduct dialog to achieve pre-defined objectives". Thus the task in the paper is set up such that a model is supposed to rank answer candidates, rather than generating its own answers. The paper argues that this ranking setup focuses the evaluation on the quality of the response rather than on quality of language generation.
- The paper proposes that end-to-end dialog systems should do well on their proposed suite of tasks, "a necessary but not sufficient condition for a fully functional dialog agent". It thus seems like a good testbed for dialog agents that are supposed to perform a combination of tasks.
- Tasks 1, 2 and 4 are 1 turn (user asks and machine responds). These tasks are thus set up for evaluation of single turn interactions. Task 3 is three turns, and thus tests a system's ability to keep track of (very) short-term context. Dialog agents might need to keep track of longer term context for good performance on many tasks. As an example, consider a bot that's supposed to help you troubleshoot an error by asking you many questions in turn. Performance on this suite of tasks might not give a very good indication of how a system would do in a scenario where it's common to have more than three turn interactions.

In the next paper, we'll look at a paper that introduces a large dataset for evaluating multi-turn dialog systems.

# Paper 2
The second paper we'll look at is [The Ubuntu Dialogue Corpus: A Large Dataset for Research in Unstructured Multi-Turn Dialogue Systems](https://arxiv.org/abs/1506.08909) by Ryan Lowe, Nissan Pow, Iulian Serban, Joelle Pineau.

## At a glance
The authors hypothesize that progress in dialog system is bottlenecked "due to the lack of sufficiently large datasets" for multi-turn conversation. The paper proposes to overcome the data bottleneck by providing "a new large corpus for research in multi-turn conversation". The corpus, called the Ubuntu Dialogue Corpus, consists of chat log interactions from Ubuntu-related chat rooms. Here are a few properties of the dataset:
- Two-way conversations.
  - Extracted using heuristic rules from a multi-participant setting.
- Large number of conversations (100k to a million).
  - 7 million utterances, 100 million words. An utterance is a message in a conversation.
- Many conversations with several turns.
  - An average of 8 turns, a minimum of 3 turns.
- Task-specific domain.
  - Rather than chit-chat. 

## Food for thought
- Unlike Paper 1, which focused on short interactions (max of three), this one is focused on longer interactions, with multiple turns between the conversational agents (minimum of three).
- Like Paper 1, this also considers the task of best response selection, where a system is evaluated on its ability to rank candidate responses, rather than generate a response. The paper argues that (i) current systems are "not yet able to generate good results for this task", thus make hill-climbing on the response generation hard, and (ii) we don't have a suitable metric for evaluating generated responses with ground truths (BLEU scores are problematic in their penalization of word-reordering and synonymous words, while human evaluation is expensive). Thus, the paper argues that response selection is a useful metric for the time being, and one that "will eventually lead to improvements on the generation task".

In the next two papers, we will see adoption of the response generation approach, and see how they solve the aforementioned drawbacks. Hint: human evaluation. We'll transition from datasets to models, looking at a neural modelling approach for dialog systems.


# Paper 3
The next paper we'll take a look at is *[Neural Responding Machine for Short-Text Conversation](https://arxiv.org/abs/1503.02364)* by Lifeng Shang, Zhengdong Lu, and Hang Li.

## At a glance
The paper tackles the problem of Short Text Conversation, which is characterized one round of conversation, with an input from a user and a response from the machine dialog system. The paper proposes that existing retrieval-based methods (which are supposed to rank candidate answers) are unsuitable because they require a pre-existing list of candidates that cover a large space of answers and are not straightforward to tune in style or attitude. The paper also argues that statistical machine translation (SMT) based methods, which treat the response generation as a translation problem, are unsuitable because equally sensible responses are not semantically equivalent as they are usually in the case of translation. Thus to solve the problem, the paper proposes the Neural Responding Machine (NRM), a neural encoder-decoder for this task.

The NRM proposed is the canonical sequence-to-sequence model seen in neural machine translation: the encoder *encodes* the user post (source) in a vector representation, and then feeds it to the decoder, which generates the response (target), word by word, conditioned on the encoded representation and the previously generated words. The paper also extends this scheme to use an attention mechanism, which (dynamically) weights the input sequence to determine which parts should be used to generate the next word in a response.

The NRM is trained on a Chinese corpus of around 4.4 million pairs of conversations on Weibo, a microblogging service.

## Food for thought
- Like paper 1, this paper focuses on short text conversation, more specifically on 1-turn interactions.
- Unlike paper 1 and paper 2, this paper chooses response generation instead of response selection for conversation. For evaluation, human labelers "judge whether a response (generated or retrieved) is appropriate and natural to an input post". The paper observes that while retrieval-based methods have inconsistent details that render the response unsuitable, NRM models tend to make general responses. In addition, the top-k decoded NRM responses to the same prompt can be very different in flavor.

# Paper 4
Paper 4 of 4 is *[A Neural Conversational Model](https://arxiv.org/abs/1506.05869)* by Oriol Vinyals, and Quoc Le.

(coming soon...)

