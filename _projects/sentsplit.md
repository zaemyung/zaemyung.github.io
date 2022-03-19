---
layout: page
title: sentsplit
description: A flexible sentence segmentation library using CRF model and regex rules
img: assets/img/sentsplit.jpg
importance: 1
category: current
---

<div class="github-card" data-user="zaemyung" data-repo="sentsplit" data-width="400" data-height="" data-theme="default"></div>
<script src="//cdn.jsdelivr.net/github-cards/latest/widget.js"></script>

Working in the field of natural language processing, I am often faced with the task of segmenting a text passage into multiple sentences.

[`sentsplit`](https://github.com/zaemyung/sentsplit) is a sentence segmentation library for Python with the following desiderata in mind:
- Be able to extend to new languages or "types" of sentences from the data alone.
- But also provide functionality to segment (or not to segment) lines based on regular expression rules.
- Be able to reconstruct the exact original text paragraphs from joining the segmented sentences.

The basic idea is to train and run a conditional random field model on the texts for the first pass; and apply regex rules for more control in the second pass, hopefully allowing for more flexibility.

Demo of this library is available [here](https://share.streamlit.io/zaemyung/sentsplit/main).