---
layout: posts
permalink: /events/all-events/
title: "All Events"
header:
  # overlay_image: images/hullrs-web-banner.svg
  caption: "Browse all robotics events and workshops!"
excerpt: "Browse through all upcoming robotics events and workshops at Hull Robotics Society."
---

Here is a list of all our events:

<ul class="all-events">
  {% assign events = site.pages | where_exp: "item", "item.path contains 'events/'" %}
  {% for event in events %}
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
