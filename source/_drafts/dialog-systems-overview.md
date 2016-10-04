---
title: Overview - Dialog Systems
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

Of course, dialog agents are not constrained to speech interactions: chat is a natural medium for dialog agents. On the Facebook Messenger platform for instance, use cases include personalized shopping assistance, curated news stories, and assisted food ordering!

We'll look at a mix of papers on dialog systems.

## Evaluating Dialog Systems
The first paper we'll take a look at is *[Evaluating Prerequisite Qualities for Learning End-to-End Dialog Systems](https://arxiv.org/abs/1511.06931)* by Jesse Dodge, Andreea Gane, Xiang Zhang, Antoine Bordes, Sumit Chopra, Alexander Miller, Arthur Szlam, Jason Weston.

### What problem does this paper tackle?
The authors argue that end-to-end dialog systems "lack pertinent goal-oriented frameworks to validate their performance". Evaluation of methods either relies on humans (hand-labelling / crowdsourcing) or use machine translation metrics like BLEU: the former is problematic because human-evaluation is costly and time-intensive, and the latter is problematic because such metrics "judge the quality of the generated language only" rather than "assess if end-to-end systems can conduct dialog to achieve pre-defined objectives".

### Why is the problem important?
Evaluation that points to a system's strengths and weaknesses is informative of how much improvement remains, and where the improvement can come from. It's not immediately clear how one can evaluate a dialog system: what does it mean for the machine to do well at dialog? The paper distinguishes between goal-oriented dialog, where the success of the dialog is tied to the completion of some task, and *chit-chat*, tied to having a sensible conversation about some topic.

### What solution does the paper propose?
The paper proposes of a suite of four tasks for evaluation of dialog systems: QA, Recommendation, QA + Recommendation, and Reddit Discussion. Here are the four tasks, each with an example user-question and expected sample machine response (italicized).
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

    - 3 interactions between user and system.
    - Tests ability to use context. To answer the second question, a system
      would have to solve the coreference for 'that'.
    - It's not clear to me (at least from the examples in the paper) that this is a robust test for context-specific dialog. Notice in this example, the second interaction seems to have no relevance to the third one.

- **Reddit Discussion**:
  "I think the Terminator movies really such, I mean the first one was kinda ok, but after that they got really cheesy...""
  *"C'mon the second one was still pretty cool... Arny was so badass..."*

    - tests the ability of a system to pick the most probable replies on reddit discussion comments.

In all of the tasks, for each question, the system is given a list of possible answer candidates, and has to rank them from most probable to least probable. If the right answer, or one of the right answers, is high up on the system's ranking (in the top k, where k is task specific), then the system is considered correct, and wrong otherwise. This is called the hits@k accuracy. 

[A Neural Conversational Model](https://arxiv.org/abs/1506.05869) by Oriol Vinyals, Quoc Le
[Neural Responding Machine for Short-Text Conversation](https://arxiv.org/abs/1503.02364) by Lifeng Shang, Zhengdong Lu, Hang Li
[The Ubuntu Dialogue Corpus: A Large Dataset for Research in Unstructured Multi-Turn Dialogue Systems](https://arxiv.org/abs/1506.08909) by Ryan Lowe, Nissan Pow, Iulian Serban, Joelle Pineau