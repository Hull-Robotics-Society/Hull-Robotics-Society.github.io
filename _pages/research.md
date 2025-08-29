---
layout: collection
permalink: /research/
title: " "
header:
  overlay_image: images/hullrs-web-banner.jpg
  overlay_image_class: "fixed-width-header"
  caption: "Join us for exciting robotics research and workshops!"

feature_row:
  - image_path: /images/neuro/brain.jpg #
    alt: "Neuro Robotics Research"
    title: "Neuro Robotics Research"
    excerpt: ""
    url: /research/neuro/
    btn_label: "Learn More"
    btn_class: "btn--primary"

---
{% include feature_row %}

## Latest Research

{% assign research_articles = site.pages | where_exp: "item", "item.path contains 'research/'" | sort: "date" | reverse | slice: 0, 6 %}

<ul class="all-research">
  {% assign neuro_research = site.neuro %}
  {% assign research_pages = site.pages | where_exp: "item", "item.path contains 'research/'" %}
  
  {%- assign all_research = neuro_research | concat: research_pages -%}
  {%- assign sorted_research = all_research | sort: 'date' | reverse -%}

  {% for research in sorted_research %}
    <li class="research-post">
      <h3><a href="{{ research.url }}">{{ research.title }}</a></h3>
      <p>{{ research.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>

[View all research](/research/all-research/)