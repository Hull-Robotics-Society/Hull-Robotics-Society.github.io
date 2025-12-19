---
layout: splash
permalink: /events/film-nights/
title: "Film Nights"
header:
  overlay_image: images/film-night-banner.jpg
  overlay_image_class: "fixed-width-header"
  caption: "All Hull Robotics Society film nights and screenings"
collection: films
---

{% include feature_row %}

<a href="/events/" class="back-to-events-btn">Back to events →</a>

## 🎬 Film Night Screenings

Here is a list of all our film nights and screenings:

<ul class="films">
  {% assign film_posts = site.films | sort: "date" | reverse %}
  {% for film in film_posts %}
    <li class="film-post">
      <h3>
        <a href="{{ film.url }}">{{ film.title }}</a>
      </h3>

      <p>
        {{ film.excerpt | default: "No synopsis available." }}
      </p>

      {% if film.date %}
        <p class="film-date">
          <strong>Screening date:</strong>
          {{ film.date | date: "%d %B %Y" }}
        </p>
      {% endif %}
    </li>
  {% endfor %}
</ul>
