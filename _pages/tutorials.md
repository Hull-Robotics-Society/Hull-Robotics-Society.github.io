---
layout: collection
permalink: /tutorials/
title: " "
header:
  overlay_image: images/hullrs-web-banner.jpg
  overlay_image_class: "fixed-width-header"
  caption: "Filled with tutorials and workshops"

feature_row:
  - image_path: /images/keychain.png
    alt: "Keychain Tutorial"
    title: "Keychain TinkerCAD & KiCAD Tutorial"
    excerpt: ""
    url: /tutorials/keychain/
    btn_label: "View Tutorial"
    btn_class: "btn--primary"

---
{% include feature_row %}

## Latest Tutorials

{% assign tutorial_articles = site.pages | where_exp: "item", "item.path contains 'tutorials/'" | sort: "date" | reverse | slice: 0, 6 %}


<ul class="all-tutorials">
  {% assign tutorials = site.tutorials %}
  {% assign tutorials_pages = site.pages | where_exp: "item", "item.path contains 'tutorials/'" %}
  
  {%- assign all_tutorials = tutorials | concat: tutorials_pages -%}
  {%- assign sorted_tutorials = all_tutorials | sort: 'date' | reverse -%}

  {% for tutorials in sorted_tutorials %}
    <li class="tutorials-post">
      <h3><a href="{{ tutorials.url }}">{{ tutorials.title }}</a></h3>
      <p>{{ tutorials.excerpt | default: "No synopsis available." }}</p>
    </li>
  {% endfor %}
</ul>

[View all tutorials](/tutorials/all-tutorials/)