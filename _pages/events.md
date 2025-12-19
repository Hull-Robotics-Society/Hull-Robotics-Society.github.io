---
layout: splash
permalink: /events/
title: " "
header:
  overlay_image: image/hullrs-web-banner.jpg
  overlay_image_class: "fixed-width-header"
  caption: "Join us for exciting robotics events and workshops!"
# excerpt: <br />

feature_row:
  - image_path: images/film-night-banner.jpg
    alt: "Film Nights collection"
    title: "Film Nights"
    excerpt: "**Discover all film nights** — click to see upcoming and past screenings curated by Hull Robotics Society."
    url: /events/film-nights/
    btn_label: "View Film Nights"
    btn_class: "btn--primary"
    
  - image_path: images/dalek-100-leaders.jpg
    alt: "East Riding Top 100 Leaders"
    title: "East Riding Top 100 Leaders"
    excerpt: "**Date:** 15/05/2025<br>**Time:** 2:00 PM – 4:00 PM<br>**Location:** Beverley Leisure Centre , Beverly<br>"
    url: /events/daleks-day-out/
    btn_label: "Learn More"
    btn_class: "btn--primary"

  - image_path: images/projects.png
    alt: "Weekly Robotics Meetup"
    title: "Weekly Robotics Meetup"
    excerpt: "**Date:** Monday every week<br>**Time:** 5:00 PM – 7:00 PM<br>**Location:** Robotics Lab, University of Hull<br>"
    url: /events/weekly-meetup/
    btn_label: "Learn More"
    btn_class: "btn--primary"
---

<!-- {% include feature_row id="intro" type="center" %} -->
{% include feature_row %}

## Latest Events

{% assign events = site.pages | where_exp: "item", "item.path contains 'events/'" | sort: "date" | reverse | slice: 0, 6 %}

<ul class="recent-events">
  {% for event in events %}
  <li class="event-post">
    <h3><a href="{{ event.url }}">{{ event.title }}</a></h3>
    <p>{{ event.excerpt | markdownify }}</p>
  </li>
  {% endfor %}
</ul>

[View all events](/events/all-events/)