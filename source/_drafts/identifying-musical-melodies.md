---
title: Identifying Musical Melodies with Deep Learning - A Tutorial
---

A few months back, one of my friends was wrestling with the problem 
of algorithmically identifying musical melodies. He had built a system that used
simple rules to identify single notes, but was disappointed by the performance
of his system in the presence of noise. He had started thinking about potential machine learning solutions to the problem, and wondered how well emerging deep learning methods would do.

I was intrigued by the problem of identifying musical melodies, and excited
to see how well deep learning would do. In what follows, I will attempt
to explain my investigation and the thought process that led me to build a
deep learning solution, using deep learning library Keras, that ends up getting an accuracy of about 99% on the task.
