---
layout: collection
permalink: /projects/baxter/
title: "Hull RS Baxter Projects"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the baxter updates in one place!"
excerpt: "Browse through all of our baxter updates."
collection: baxter

feature_row:
  - image_path: 
    alt: "baxter"
    title: "Project Repository"
    excerpt: "Explore the source code on GitHub."
    url: "https://github.com/Hull-Robotics-Society/baxter"
    btn_label: "View on GitHub"
    btn_class: "btn--primary"

  - image_path: 
    alt: "Baxter Images"
    title: "Image Collection"
    excerpt: "View the baxter in action with our image gallery."
    url: /gallery/baxter/
    btn_label: "View Gallery"
    btn_class: "btn--primary"
---
{% include feature_row %}

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our baxter updates!:

<ul class="baxter">
  {% assign baxter_projects = site.baxter %}
  {% for project in sorted_projects %}
    <li class="baxter-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
