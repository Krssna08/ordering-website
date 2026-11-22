IMAGES FOLDER
-------------
placeholder.svg  - shown automatically if a food photo cannot load.
favicon.svg      - the small icon in the browser tab.

By default the food photos are loaded from the internet (Unsplash).
To use your own photos instead (works offline, recommended for submission):

 1. Save your photos in this folder, e.g. images/margherita.jpg
 2. Open js/script.js and find the PRODUCTS list.
 3. Change the img value of a dish, for example:
        img: 'images/margherita.jpg'
 4. For the home and about pages, change the <img src="..."> in the
    HTML files (index.html and about.html).
