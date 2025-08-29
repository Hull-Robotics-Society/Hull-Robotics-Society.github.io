---
layout: posts
permalink: /research/all-research/
title: "All research"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "Browse all robotics research articles and workshops!"
excerpt: "Browse through all upcoming robotics research articles and workshops at Hull Robotics Society."
---

<!-- Button to go back to main research page -->
<a href="/research/" class="back-to-research-btn">Back to research →</a>

Here is a list of all our research articles:

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
