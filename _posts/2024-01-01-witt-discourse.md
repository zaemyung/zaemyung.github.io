---
layout: post
title: Toward Wittgensteinian Discourse
date: 2024-01-01 00:00:00
description: Motivation for developing next gen. discourse parsers using LLMs.
tags: discourse parsing
categories: NLP
chart:
  vega_lite: true
---
{% include figure.liquid loading="eager" path="assets/img/wittgenstein_discourse.png" class="img-fluid rounded z-depth-1" zoomable=true %}

In his later work, *“Philosophical Investigations,”* Ludwig Wittgenstein laid out his theory on the philosophy of language. In his view, the meaning of language is not fixed, but rather it is determined by the way it is used in a specific context or *“language game.”* To put it another way, words only have meaning within the specific rules and practices of the language game being played (*“meaning as use”*). He also introduced the notion of the *“function”* of language in contrast to its *“use.”* While the use of language refers to how words or sentences are employed, the function of language refers to what they accomplish. In other words, language is not just a matter of conveying information, but it also has a social function. For Wittgenstein, understanding the function of language involves understanding the social practices and activities in which language is used.

The notion that words are used to do things sounds a lot like Austin’s speech act theory. As a matter of fact, it is considered that Wittgenstein’s theory of language was a major influence on Austin and his colleagues in postwar Oxford [Harris and Unnsteinsson, 2018]. A key difference, however, is that while Austin was keen on developing a taxonomy of speech acts, Wittgenstein thought there was no use for them as language games are forms of life, and there is an infinite variety of them [Wittgenstein, 1982].

Let us take an example to illustrate the kinds of language games people play in conversations and how they can go awry when the participants play “different” language games. If one’s partner says, “You never help me - you’re so unreliable,” one might be inclined to hear it as a *“stating-the-facts game”* and respond accordingly, for example: “What are you talking about? I did the groceries and just took out the trash today.” However, it could be likely that the partner was playing a *“help-and-reassurance game”* and wanted to hear a more empathetic response. In other words, what the partner is conveying (or performing an indirect speech act) is, “I want you to be more nurturing.” [The School of Life]

We can easily speculate that the diversity of speech genres is boundless as it is closely tied to our activities and, in turn, our forms of life. It is at this particular point that I feel the current frameworks of discourse in linguistics are limited. They are limited because they mostly look at relations that are too general, such as elaboration, causation, contrast, etc. Granted, it is possible to specialize discourse relations to fit a particular situation, for example, a conversation between interviewer and interviewee, but of course, the hand-crafting of this nature is difficult to scale to the infinitude.

It strikes me that the Wittgensteinian view of language, specifically, the meaning-as-use and the multiplicity of language games, closely resembles how language models (LMs) train and learn from data. In the training of LMs, the “meaning” of a word (or rather its representation) is learned by countless examples of its usage in different contexts. And with the recent technique in instruction-tuning the LMs with human preferences, the models can now engage in a wide variety of language games in ways that closely match our social expectations and conventions.

To put it differently, it seems to me that the instruction-tuned LMs nowadays have a firm grasp of different language games people engage in. It should be possible to use a well-trained LM to parse any given conversation, noting its specific topic and its appropriate intended discourse relations. This may require further instruction tuning (coupled with approaches in hierarchical generation), but it could then be used to expand the discourse framework to virtually any topic in our usage of language and subsequently, our forms of life.

#### References
- Wittgenstein, L. (2009) [1953]. Philosophical Investigations.
- Austin, J.L. (1962). How to do Things with Words, 2nd edition, J.O. Urmson and M. Sbisá (eds.), Cambridge, MA: Harvard University Press.
- Daniel W. Harris & Elmar Unnsteinsson (2018) Wittgenstein’s influence on Austin’s philosophy of language, British Journal for the History of Philosophy, 26:2, 371-395, DOI: 10.1080/09608788.2017.1396958
- Wittgenstein, L. (1982). Culture and Value. Critica 14 (41):93-96.
- The School of Life, PHILOSOPHY - Ludwig Wittgenstein, https://www.youtube.com/watch?v=pQ33gAyhg2c
