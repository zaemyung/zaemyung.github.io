---
layout: page
permalink: /publications/
title: publications
description:

years: [2022, 2021, 2020]
nav: true
---
Below is a list of my recent publications. Asterisks ("*") denote equal contribution. <br>
Please refer to <a href="https://scholar.google.co.kr/citations?hl=en&user=WIpsTa4AAAAJ" target="https://scholar.google.co.kr/citations?hl=en&user=WIpsTa4AAAAJ">my Google scholar page</a> for the full list.
<!-- _pages/publications.md -->
<div class="publications">

{%- for y in page.years %}
  <h2 class="year">{{y}}</h2>
  {% bibliography -f papers -q @*[year={{y}}]* %}
{% endfor %}

</div>
