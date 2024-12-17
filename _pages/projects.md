---
layout: collection
permalink: /projects/
title: " "
header:
  overlay_image: images/hullrs-web-banner.jpg
  overlay_image_class: "fixed-width-header"
#   overlay_filter: 0.3 # Optional: Adjust the overlay opacity
  caption: "The society is full of projects, click to find out more!"

feature_row:
  - image_path: images//dalek/dalek50years.jpeg
    alt: "Dalek"
    title: "Dalek"
    excerpt: ""
    url: /projects/dalek
    btn_label: "Learn More"
    btn_class: "btn--primary"

  # - image_path: images/os-controller.png
  #   alt: "Open Source Controller"
  #   title: "Open Source Controller"
  #   excerpt: ""
  #   url: /projects/os-controller/
  #   btn_label: "Learn More"
  #   btn_class: "btn--primary"
---
<!-- {% include feature_row id="intro" type="center" %} -->
{% include feature_row %}

## Latest projects

{% assign projects = site.pages | where_exp: "item", "item.path contains 'projects/'" | sort: "modified_time" | slice: 0, 6 %}

<ul class="all-projects">
  {% assign dalek_projects = site.dalek %}
  {% assign project_pages = site.pages | where_exp: "item", "item.path contains 'projects/'" %}
  
  {% assign all_projects = dalek_projects | concat: project_pages %}
  {% assign sorted_projects = all_projects | sort: 'date' | reverse %}

  {% for project in sorted_projects %}
    <li class="project-post">
      <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
      <p>{{ project.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>


[View all projects](/projects/all-projects/)