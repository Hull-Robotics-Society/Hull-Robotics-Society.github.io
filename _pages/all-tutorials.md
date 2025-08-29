---
layout: posts
permalink: /tutorials/all-tutorials/
title: "All tutorials"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "Browse all robotics tutorials and workshops!"
excerpt: "Browse through all our  tutorials and upcoming robotics workshops at Hull Robotics Society."
---

<!-- Button to go back to main tutorials page -->
<a href="/tutorials/" class="back-to-tutorials-btn">Back to tutorials →</a>

Here is a list of all our tutorials articles:

<ul class="all-tutorials">
  {% assign tutorials_pages = site.pages | where_exp: "item", "item.path contains 'tutorials/'" %}
  
  {%- assign all_tutorials = tutorials_pages -%}
  {%- assign sorted_tutorials = all_tutorials | sort: 'date' | reverse -%}

  {% for tutorials in sorted_tutorials %}
    <li class="tutorials-post">
      <h3><a href="{{ tutorials.url }}">{{ tutorials.title }}</a></h3>
      <p>{{ tutorials.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>
