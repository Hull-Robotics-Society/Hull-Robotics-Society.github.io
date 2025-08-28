---
layout: collection
permalink: /research/neuro/
title: "Neuroscience in Robotics"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "Deep dive into neuroscience in robotics"
excerpt: "Browse through our neuroscience research."
collection: neuro
---

<!-- Button to go back to main research page -->
<a href="/research/" class="back-to-research-btn">Back to research →</a>

Here is all of our neuroscience updates!:

<ul class="neuro">
  {% assign neuro_research = site.neuro %}
  {% for post in sorted_neuro %}
    <li class="neuro-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
