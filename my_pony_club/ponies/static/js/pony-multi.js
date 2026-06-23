/********************************/
/** 1    Initialisation         */

let numPonies = document.getElementsByClassName('pony').length;
const gameArea = document.getElementById('game-area');
const basePony = document.getElementById('pony1');
const basePonyLabel = document.getElementById('label-pony-1');




/********************************/
/** 2    Exécution              */
document.querySelectorAll('.pony').forEach(makeDraggable);

gameArea.addEventListener('dragover', (e) => {
  e.preventDefault();
});

gameArea.addEventListener('drop', (e) => {
  e.preventDefault();

  let target = e.target;
  const dragged = window.draggedElement;

  // Remonter au parent .pony si on a cliqué sur un enfant
  if (target.classList.contains('pony') === false && target.closest('.pony')) {
    target = target.closest('.pony');
  }

  if (target.classList.contains('pony') && target !== dragged) {
    const babyColors = mixingBabyPonyColor(target, dragged);
    const babySpecies = choosingSpecies(target, dragged);
    createPonyBuild(babyColors, babySpecies);
  }
});




/********************************/
/** 3     Fonctions             */

/** Drag & Drop */
function makeDraggable(pony) {
  pony.addEventListener('dragstart', dragStart);
}

function dragStart(e) {
  e.dataTransfer.setData('text/plain', null); // Nécessaire pour Firefox
  window.draggedElement = e.currentTarget; // currentTarget = le .pony, pas un enfant
}


/** Conversion de couleurs */
function convertRgb(rgb) {
  if (!rgb || !rgb.startsWith('rgb')) return '#000000';
  let separator = rgb.indexOf(',') > -1 ? ',' : ' ';
  rgb = rgb.substr(4).split(')')[0].split(separator);
  let r = (+rgb[0]).toString(16).padStart(2, '0');
  let g = (+rgb[1]).toString(16).padStart(2, '0');
  let b = (+rgb[2]).toString(16).padStart(2, '0');
  return '#' + r + g + b;
}

function hex2dec(hex) {
  return hex.replace('#', '').match(/.{2}/g).map(n => parseInt(n, 16));
}

function rgb2hex(r, g, b) {
  r = Math.min(Math.round(r), 255);
  g = Math.min(Math.round(g), 255);
  b = Math.min(Math.round(b), 255);
  return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
}

function rgb2cmyk(r, g, b) {
  let c = 1 - r / 255;
  let m = 1 - g / 255;
  let y = 1 - b / 255;
  let k = Math.min(c, m, y);
  if (k === 1) return [0, 0, 0, 1]; // éviter division par zéro (couleur noire)
  c = (c - k) / (1 - k);
  m = (m - k) / (1 - k);
  y = (y - k) / (1 - k);
  return [c, m, y, k];
}

function cmyk2rgb(c, m, y, k) {
  let r = (1 - (c * (1 - k) + k)) * 255;
  let g = (1 - (m * (1 - k) + k)) * 255;
  let b = (1 - (y * (1 - k) + k)) * 255;
  return [r, g, b];
}

function mix_cmyks(...cmyks) {
  return [0, 1, 2, 3].map(i =>
    cmyks.reduce((sum, cmyk) => sum + cmyk[i], 0) / cmyks.length
  );
}

function mix_hexes(...hexes) {
  const rgbs = hexes.map(hex => hex2dec(hex));
  const cmyks = rgbs.map(rgb => rgb2cmyk(...rgb));
  const mixedCmyk = mix_cmyks(...cmyks);
  const mixedRgb = cmyk2rgb(...mixedCmyk);
  return rgb2hex(...mixedRgb);
}

/** Espèce du bébé (FIX : recevait pas target/dragged en paramètres) */
function choosingSpecies(target, dragged) {
  // On extrait la classe d'espèce en ignorant "pony"
  const speciesA = [...dragged.classList].find(c => c !== 'pony');
  const speciesB = [...target.classList].find(c => c !== 'pony');
  const parents = [speciesA, speciesB].filter(Boolean);
  return parents[Math.floor(Math.random() * parents.length)] ?? 'pony';
}

/** Couleurs du poney (FIX : utilisait target au lieu du paramètre pony) */
function getSkin(pony) {
  const get = (cls) => {
    const el = pony.getElementsByClassName(cls)[0];
    return el ? convertRgb(el.style.backgroundColor) : '#000000';
  };
  return {
    eye:   get('eye'),
    coat:  get('head'),
    horn:  get('corne'),
    belly: get('ventre'),
    mane:  get('queue'),
  };
}


/** Mélange des couleurs (FIX : retournait sans valeur) */
function mixingBabyPonyColor(target, dragged) {
  const skinA = getSkin(dragged);
  const skinB = getSkin(target);
  return {
    eye:   mix_hexes(skinA.eye,   skinB.eye),
    coat:  mix_hexes(skinA.coat,  skinB.coat),
    horn:  mix_hexes(skinA.horn,  skinB.horn),
    belly: mix_hexes(skinA.belly, skinB.belly),
    mane:  mix_hexes(skinA.mane,  skinB.mane),
  };
}


/** Application des couleurs sur le bébé (FIX : variables non définies) */
function coloringBabyPony(pony, colors) {
  // Yeux
  const eye = pony.getElementsByClassName('eye')[0];
  if (eye) eye.style.backgroundColor = colors.eye;

  // Corps
  pony.querySelectorAll('.head, .head1, .encolure, .oreille, .leg1, .leg2, .leg3, .leg4, .corps')
    .forEach(el => el.style.backgroundColor = colors.coat);

  // Crinière / queue
  pony.querySelectorAll('.criniere1, .criniere2, .criniere3, .queue, .queue1')
    .forEach(el => el.style.backgroundColor = colors.mane);

  // Ventre
  const ventre = pony.getElementsByClassName('ventre')[0];
  if (ventre) ventre.style.backgroundColor = colors.belly;

  // Corne
  pony.querySelectorAll('.corne, .corne1')
    .forEach(el => el.style.backgroundColor = colors.horn);
}


/** Création du bébé poney (FIX : clone global → clone local, ordre DOM corrigé) */
function createPonyBuild(babyColors, babySpecies) {
  numPonies++;

  // Cloner à chaque naissance (et non une seule fois au chargement)
  const newPony = basePony.cloneNode(true);
  const newPonyLabel = basePonyLabel.cloneNode(true);

  // 1. IDs uniques
  newPonyLabel.id = 'label-pony-' + numPonies;
  newPony.id = 'pony' + numPonies;

  // 2. Draggable
  newPony.setAttribute('draggable', 'true');

  // 3. Espèce
  newPony.classList.remove('licorne');
  if (babySpecies) newPony.classList.add(babySpecies);

  // 4. Couleurs
  coloringBabyPony(newPony, babyColors);

  // 5. Créer le wrapper AVANT d'insérer dans le DOM
  const wrapper = document.createElement('div');
  wrapper.classList.add('pony-build');
  wrapper.appendChild(newPonyLabel);
  wrapper.appendChild(newPony);

  // 6. Ajouter au DOM
  gameArea.appendChild(wrapper);

  // 7. Activer le drag
  makeDraggable(newPony);
}
