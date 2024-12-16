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
  {% assign projects = site.pages | where_exp: "item", "item.path contains 'projects/'" %}
  {% for event in projects %}
    <li class="event-post">
      <h3><a href="{{ event.url }}">{{ event.title }}</a></h3>
      {% if event.excerpt %}
        <p>{{ event.excerpt | markdownify }}</p>
      {% else %}
        <p>{{ event.content | split: '\n' | slice: 0, 3 | join: ' ' }}</p>
      {% endif %}
    </li>
  {% endfor %}
</ul>
