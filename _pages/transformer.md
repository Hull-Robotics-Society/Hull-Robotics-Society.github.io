---
layout: collection
permalink: /projects/transformer/
title: "Hull RS Transformer Projects"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the transformer updates in one place!"
excerpt: "Browse through all of our transformer updates."
collection: transformer

feature_row:
  - image_path: 
    alt: "transformer"
    title: "Project Repository"
    excerpt: "Explore the source code on GitHub."
    url: "https://github.com/Hull-Robotics-Society/transformer"
    btn_label: "View on GitHub"
    btn_class: "btn--primary"

  - image_path: 
    alt: "Transformer Images"
    title: "Image Collection"
    excerpt: "View the transformer in action with our image gallery."
    url: /gallery/transformer/
    btn_label: "View Gallery"
    btn_class: "btn--primary"
---
{% include feature_row %}

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our transformer updates!:

<ul class="transformer">
  {% assign transformer_projects = site.transformer %}
  {% for project in sorted_projects %}
    <li class="transformer-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
