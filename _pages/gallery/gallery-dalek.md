---
layout: gallery
title: "Dalek Image Collection"
permalink: /gallery/dalek/
entries_layout: grid
header:
  overlay_image: /images/dalek-gallery-banner.jpg
  caption: "Explore our Dalek project images"
excerpt: "A gallery showcasing the Dalek project in action."
columns: 3  # Define the number of columns here (2 or 3)
---


## Dalek Project Images

<div class="gallery-grid">
  {% assign images = site.static_files %}
  {% for image in images %}
    {% if image.path contains '/images/' and image.name contains 'dalek' %}
      <div class="gallery-item">
        <img src="{{ image.path | relative_url }}" alt="{{ image.name }}">
        <!-- <p>{{ image.name }}</p> -->
      </div>
    {% endif %}
  {% endfor %}
</div>
