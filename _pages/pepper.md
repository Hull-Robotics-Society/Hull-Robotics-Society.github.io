---
layout: collection
permalink: /projects/pepper/
title: "Hull RS Pepper Projects"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the pepper updates in one place!"
excerpt: "Browse through all of our pepper updates."
collection: pepper

feature_row:
  - image_path: 
    alt: "Pepper"
    title: "Project Repository"
    excerpt: "Explore the source code on GitHub."
    url: "https://github.com/Hull-Robotics-Society/pepper"
    btn_label: "View on GitHub"
    btn_class: "btn--primary"

  - image_path: 
    alt: "Pepper Images"
    title: "Image Collection"
    excerpt: "View the pepper in action with our image gallery."
    url: /gallery/pepper/
    btn_label: "View Gallery"
    btn_class: "btn--primary"
---
{% include feature_row %}

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our pepper updates!:

<ul class="pepper">
  {% assign pepper_projects = site.pepper %}
  {% for project in sorted_projects %}
    <li class="pepper-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
