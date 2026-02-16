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
  - image_path: images/dalek.jpeg
    alt: "Dalek"
    title: "Hull RS Dalek <br /><br />"
    excerpt: ""
    url: /projects/dalek
    btn_label: "Learn More"
    btn_class: "btn--primary"

  - image_path: images/OSRC.png
    alt: "Open Source Robotics Controller"
    title: "OS Robotics Controller"
    excerpt: ""
    url: /projects/OSRC/
    btn_label: "Learn More"
    btn_class: "btn--primary"

  - image_path: images/pepper.jpeg
    alt: "Pepper"
    title: "Pepper Projects <br /><br />"
    excerpt: ""
    url: /projects/pepper
    btn_label: "Learn More"
    btn_class: "btn--primary"

  - image_path: images/baxter.jpeg
    alt: "Baxter"
    title: "Baxter Projects <br /><br />"
    excerpt: ""
    url: /projects/baxter
    btn_label: "Learn More"
    btn_class: "btn--primary"
---
<!-- {% include feature_row id="intro" type="center" %} -->
{% include feature_row %}

## Latest projects

{% assign projects = site.pages | where_exp: "item", "item.path contains 'projects/'" | sort: "date" | reverse | slice: 0, 6 %}

<ul class="all-projects">
  {% assign dalek_projects = site.dalek %}
  {% assign OSRC_projects = site.OSRC %}
  {% assign pepper_projects = site.pepper %}
  {% assign baxter_projects = site.baxter %}
  {% assign project_pages = site.pages | where_exp: "item", "item.path contains 'projects/'" %}
  
  {%- assign all_projects = dalek_projects | concat: OSRC_projects | concat: pepper_projects | concat: baxter_projects | concat: project_pages -%}
  {%- assign sorted_projects = all_projects | sort: 'date' | reverse -%}

  {% for project in sorted_projects %}
    <li class="project-post">
      <h3><a href="{{ project.url }}">{{ project.title }}</a></h3>
      <p>{{ project.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>



[View all projects](/projects/all-projects/)