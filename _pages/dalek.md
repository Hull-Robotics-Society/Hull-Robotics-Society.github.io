---
layout: collection
permalink: /projects/dalek/
title: "Hull RS Dalek Project"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the dalek updates in one place!"
excerpt: "Browse through all of our dalek updates."
collection: dalek

feature_row:
  - image_path: 
    alt: "Dalek"
    title: "Project Repository"
    excerpt: "Explore the source code on GitHub."
    url: "https://github.com/Hull-Robotics-Society/dalek"
    btn_label: "View on GitHub"
    btn_class: "btn--primary"

  - image_path: 
    alt: "Dalek"
    title: "Dalek Schematic"
    excerpt: "Look through our collection of schematics."
    url: /projects/dalek/schematics/
    btn_label: "View Schematics"
    btn_class: "btn--primary"

  - image_path: 
    alt: "Dalek Images"
    title: "Image Collection"
    excerpt: "View the Dalek in action with our image gallery."
    url: /gallery/dalek/
    btn_label: "View Gallery"
    btn_class: "btn--primary"
---
{% include feature_row %}

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our dalek updates!:

<ul class="dalek">
  {% assign dalek_projects = site.dalek %}
  {% for project in sorted_projects %}
    <li class="dalek-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
