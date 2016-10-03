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

We'll look at goal-oriented dialog -- where the bot is said to do well if it helps you complete some task -- and chit-chat, where the bot's success is tied to the its ability to engage in sensible (kudos for interesting) dialog.

## Evaluating Prerequisite Qualities for Learning End-to-End Dialog Systems
The first paper we'll discuss is *[Evaluating Prerequisite Qualities for Learning End-to-End Dialog Systems](https://arxiv.org/abs/1511.06931)* by Jesse Dodge, Andreea Gane, Xiang Zhang, Antoine Bordes, Sumit Chopra, Alexander Miller, Arthur Szlam, Jason Weston. The paper is centered around a proposal of a suite of four tasks for evaluation of dialog systems. Here are the four tasks, each with an example question and answer.
- **Factoid QA (stand-alone questions):**
  "Can you name a film directed by Stuart Ortiz?"
  *"Grave Encounters"*

- **Personalized recommendation:**
  "Pulp Fiction, Schneider's List, and The Godfather are movies are movies I like. What else will I like?"
  *"The Hunt for Red October"*

- **QA + Recommendation Dialog**: 
  "I loved X, Y, and Z. I'm looking for a Fantasy movie."
  *"School of Rock."*
  "What else is that about?
  *"Music, J, K, L..."*
  "I like rock and roll movies more. Do you know anything else?"
  *"Little Richard"*

- **Reddit Discussion**:
  "I think the Terminator movies really such, I mean the first one was kinda ok, but after that they got really cheesy...""
  *"C'mon the second one was still pretty cool... Arny was so badass..."*


[A Neural Conversational Model](https://arxiv.org/abs/1506.05869) by Oriol Vinyals, Quoc Le
[Neural Responding Machine for Short-Text Conversation](https://arxiv.org/abs/1503.02364) by Lifeng Shang, Zhengdong Lu, Hang Li
[The Ubuntu Dialogue Corpus: A Large Dataset for Research in Unstructured Multi-Turn Dialogue Systems](https://arxiv.org/abs/1506.08909) by Ryan Lowe, Nissan Pow, Iulian Serban, Joelle Pineau