const form = document.querySelector('form');

function getRequestUrl(input) {
  return `https://api.pexels.com/v1/search?query=${input}&per_page=20&locale=fr-FR`;
}

function shuffle(photos) {
  let currentIndex = photos.length,
    temporaryValue,
    randomIndex;

  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = photos[currentIndex];
    photos[currentIndex] = photos[randomIndex];
    photos[randomIndex] = temporaryValue;
  }

  return photos;
}

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function show_picture(photos) {
  const mask = document.getElementById('mask');
  const body = document.getElementById('body');
  const section = document.getElementById('dream-section-wrapper');

  // const image = document.getElementById("eye");
  body.classList.add('hidden');
  section.classList.remove('translate-disable');
  section.classList.add('translate-active');
  mask.classList.add('devant');
  mask.classList.remove('derriere');

  setTimeout(async () => {
    // image.classList.add("blink-off");
    // image.classList.add("blink-on");
    photos = shuffle(photos);
    for (photo of photos) {
      document.getElementById('dream-picture').src = photo.src.large2x;
      await delay(300);
    }

    show_popin();
  }, 1000);
}

function show_popin() {
  const popin = document.getElementById('pop-in');
  popin.classList.remove('pop-in-out');
  popin.classList.add('pop-in-open');
}

function fermer() {
  const popin = document.getElementById('pop-in');
  popin.classList.remove('pop-in-open');
  popin.classList.add('pop-in-close');
}

async function getImages(e) {
  e.preventDefault();

  const inputs = [e.target['0'].value]; //.value, e.target['0'].value, e.target['1'].value, e.target['1'].value, e.target['2'].value];
  let photos = [];

  await Promise.all(
    inputs.map(async (input) => {
      const request = getRequestUrl(input);
      const data = await fetch(request, {
        method: 'GET',
        mode: 'cors',
        cache: 'default',
        headers: {
          Authorization:
            '563492ad6f9170000100000152f7754fd18b4e35949979f74ecebbe1',
        },
      });

      const response = await data.json();
      photos.push(...response.photos);
    })
  );

  photos = shuffle(photos);
  show_picture(photos);
}

form.addEventListener('submit', getImages);