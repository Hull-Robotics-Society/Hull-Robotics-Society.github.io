---
layout: collection
permalink: /projects/dalek/
title: "Hull RS Dalek Project"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "All of the dalek updates in one place!"
excerpt: "Browse through all of our dalek updates."
collection: dalek
# entries_layout: grid
# classes: wide
---

<!-- Button to go back to main projects page -->
<a href="/projects/" class="back-to-projects-btn">Back to projects →</a>

Here is all of our dalek updates!:

<ul class="dalek">
  {% assign dalek_posts = site.pages | where_exp: "item", "item.path contains '_dalek/'" %}
  {% for post in dalek_posts %}
    <li class="dalek-post">
      <h3><a href="{{ post.url }}">{{ post.title }}</a></h3>
      <p>{{ post.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>