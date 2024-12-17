---
layout: splash
permalink: /events/
title: " "
header:
  overlay_image: images/hullrs-web-banner.jpg
  overlay_image_class: "fixed-width-header"
#   overlay_filter: 0.3 # Optional: Adjust the overlay opacity
  caption: "Join us for exciting robotics events and workshops!"
# excerpt: <br />

feature_row:
  - image_path: images/projects.png
    alt: "Weekly Robotics Meetup"
    title: "Weekly Robotics Meetup"
    excerpt: "**Date:** Monday every week<br>**Time:** 5:00 PM – 7:00 PM<br>**Location:** Robotics Lab, University of Hull<br>"
    url: /events/weekly-meetup/
    btn_label: "Learn More"
    btn_class: "btn--primary"

  - image_path: images/klaus.jpg
    alt: "Klaus Christmas Showing"
    title: "Klaus Christmas Showing"
    excerpt: "**Date:** 11/12/2024<br>**Time:** 4:00 PM – 7:00 PM<br>**Location:** HIVE, University of Hull<br>"
    url: /events/klaus-screening/
    btn_label: "Learn More"
    btn_class: "btn--primary"

---
<!-- {% include feature_row id="intro" type="center" %} -->
{% include feature_row %}

## Latest Events

{% assign events = site.pages | where_exp: "item", "item.path contains 'events/'" | sort: "modified_time" | slice: 0, 6 %}

<ul class="recent-events">
  {% for event in events %}
  <li class="event-post">
    <h3><a href="{{ event.url }}">{{ event.title }}</a></h3>
    <p>{{ event.excerpt | markdownify }}</p>
  </li>
  {% endfor %}
</ul>

[View all events](/events/all-events/)