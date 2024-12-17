---
layout: posts
permalink: /projects/all-projects/
title: "All projects"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "Browse all robotics projects and workshops!"
excerpt: "Browse through all upcoming robotics projects and workshops at Hull Robotics Society."
---

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is a list of all our projects:

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