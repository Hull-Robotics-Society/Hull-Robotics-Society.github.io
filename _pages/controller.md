---
layout: collection
permalink: /projects/OSRC/
title: "Hull RS Open Source Robotics Controller Project"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the OSRC updates in one place!"
excerpt: "Browse through all of our ORSC updates."
collection: OSRC

feature_row:
  - image_path: 
    alt: "OSRC"
    title: "Project Repository"
    excerpt: "Explore the source code on GitHub."
    url: "https://github.com/Hull-Robotics-Society/ros-controller"
    btn_label: "View on GitHub"
    btn_class: "btn--primary"

  - image_path: 
    alt: "ORCS"
    title: "OSRC Schematic"
    excerpt: "Look through our collection of schematics."
    url: /projects/OSRC/schematics/
    btn_label: "View Schematics"
    btn_class: "btn--primary"

  - image_path: 
    alt: "ORCS Images"
    title: "Image Collection"
    excerpt: "View the ORSC in action with our image gallery."
    url: /gallery/ORSC/
    btn_label: "View Gallery"
    btn_class: "btn--primary"
---
{% include feature_row %}

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our OSRC updates!:

<ul class="OSRC">
  {% assign OSRC_projects = site.OSRC %}
  {% for project in sorted_projects %}
    <li class="OSRC-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
