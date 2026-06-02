// suggestion à corriger et adapter
//
// gamearea variable de la zone de jeux
let i = 0;
//console.log("i",i)

let  numPonies = document.getElementsByClassName('pony').length;
//console.log(numPonies)

const gameArea = document.getElementById('game-area');

  //console.log("i:", i)
  // Initialiser les cercles existants
  document.querySelectorAll('.pony').forEach(makeDraggable); 



    
  // building the makeDraggable 
  function makeDraggable(pony) {
    // La propriété draggable de l'interface HTMLElement 
    // permet d'obtenir ou de définir une valeur primitive 
    // Boolean indiquant si l'élément est déplaçable.
    pony.addEventListener('dragstart', dragStart);
  }

  function dragStart(e) {
    // L'évènement dragstart de l'interface HTMLElement 
    // est déclenché lorsque l'utilisateur·ice commence 
    // à déplacer un élément ou une sélection de texte.
    // Stocker l'ID ou une référence de l'élément traîné
    e.dataTransfer.setData('text/plain', null); // Nécessaire pour Firefox
    window.draggedElement = e.target;
    //console.log('drag commence')
    //console.log(window.draggedElement)
  }

  gameArea.addEventListener('dragover', (e) => {
      e.preventDefault(); // Autoriser le dépôt
      
      //console.log("dragover", e.target)
  });

  gameArea.addEventListener('drop', (e) => {
    e.preventDefault();
    
    let target = e.target; // le cercle sur lequel je dépose = parent B
    const dragged = window.draggedElement; // le cercle que je dépose = parent A
    //console.log("droped on :", target)
    
    
    // Vérifier si on a lâché sur un autre cercle
    // si c'est un pony et que ce n'est pas le pony que l'on tient

    // Problème 2 => gestion des couleurs optimisées
    if (target.parentElement.classList.contains('pony')){
        //console.log("parent ?", target.parentElement)
        //console.log("target", target)
        target = target.parentNode;
        //console.log('target:',  target)


      if (target.classList.contains('pony') && target !== dragged) {
        // si la cible est un enfant de pony, changer target par la div parent
       
        // Trouver l'espèces des parents
        // retirer .pony
        const parentAClasses = target.className;
        const parentASpecies = parentAClasses.replace("pony ", "");

        const parentBClasses = dragged.className;
        const parentBSpecies = parentBClasses.replace("pony ", "");

        const parentsSpecies = [parentASpecies, parentASpecies]
        console.log(parentASpecies)

        // --- LOGIQUE DE MULTIPLICATION ---
        // 1. Créer un nouveau cercle
        //console.log("1 . multiplication")
        numPonies++
        const basePony = document.getElementById('pony1');
        const newPony = basePony.cloneNode(true);
      
        //console.log("new pony id:", numPonies)
        newPony.id = "pony" + numPonies;
        //  newPony.classList.add('pony');
        newPony.setAttribute('draggable', 'true');
      
        // 2. Positionner le nouveau cercle près de la cible
        //const rect = target.getBoundingClientRect();
        //const areaRect = gameArea.getBoundingClientRect();
        //newPony.style.left = (rect.left - areaRect.left + 70) + 'px';
        //newPony.style.top = (rect.top - areaRect.top) + 'px';
        


        // Mixing color function
        function convertRgb(rgb) {
        // This will choose the correct separator, if there is a "," in your value it will use a comma, otherwise, a separator will not be used.
        var separator = rgb.indexOf(",") > -1 ? "," : " ";
      
      
        // This will convert "rgb(r,g,b)" into [r,g,b] so we can use the "+" to convert them back to numbers before using toString 
        rgb = rgb.substr(4).split(")")[0].split(separator);
      
        // Here we will convert the decimal values to hexadecimal using toString(16)
        var r = (+rgb[0]).toString(16),
          g = (+rgb[1]).toString(16),
          b = (+rgb[2]).toString(16);
      
        if (r.length == 1)
          r = "0" + r;
        if (g.length == 1)
          g = "0" + g;
        if (b.length == 1)
          b = "0" + b;
      
        // The return value is a concatenation of "#" plus the rgb values which will give you your hex
        return "#" + r + g + b;
        }

        function hex2dec(hex) {
          return hex.replace('#', '').match(/.{2}/g).map(n => parseInt(n, 16));
        }
        
        function rgb2hex(r, g, b) {
          r = Math.round(r);
          g = Math.round(g);
          b = Math.round(b);
          r = Math.min(r, 255);
          g = Math.min(g, 255);
          b = Math.min(b, 255);
          return '#' + [r, g, b].map(c => c.toString(16).padStart(2, '0')).join('');
        }
        
        function rgb2cmyk(r, g, b) {
          let c = 1 - (r / 255);
          let m = 1 - (g / 255);
          let y = 1 - (b / 255);
          let k = Math.min(c, m, y);
          c = (c - k) / (1 - k);
          m = (m - k) / (1 - k);
          y = (y - k) / (1 - k);
          return [c, m, y, k];
        }
        
        function cmyk2rgb(c, m, y, k) {
          let r = c * (1 - k) + k;
          let g = m * (1 - k) + k;
          let b = y * (1 - k) + k;
          r = (1 - r) * 255 + .5;
          g = (1 - g) * 255 + .5;
          b = (1 - b) * 255 + .5;
          return [r, g, b];
        }
    
        function mix_cmyks(...cmyks) {
          let c = cmyks.map(cmyk => cmyk[0]).reduce((a, b) => a + b, 0) / cmyks.length;
          let m = cmyks.map(cmyk => cmyk[1]).reduce((a, b) => a + b, 0) / cmyks.length;
          let y = cmyks.map(cmyk => cmyk[2]).reduce((a, b) => a + b, 0) / cmyks.length;
          let k = cmyks.map(cmyk => cmyk[3]).reduce((a, b) => a + b, 0) / cmyks.length;
          return [c, m, y, k];
        }
        
        function mix_hexes(...hexes) {
          let rgbs = hexes.map(hex => hex2dec(hex)); 
          let cmyks = rgbs.map(rgb => rgb2cmyk(...rgb));
          let mixture_cmyk = mix_cmyks(...cmyks);
          let mixture_rgb = cmyk2rgb(...mixture_cmyk);
          let mixture_hex = rgb2hex(...mixture_rgb);
          return mixture_hex;
        }

        // 3. Couleur aléatoire pour le nouveau
        // get colors from parents
        // parentBskin = [mane, eye, ect...]

        // Créer une fonction pour générer les couleurs
        // SKIN PARENT B
        
        // parent = target or dragged
        const parents = [target, dragged]
        
        //console.log(parents[0])
        //console.log(parents[1])

            
        //    for (let x = 0; x < parents.options.length; x++) {
        //      function getParentSkin(x){
        //        var eye = convertRgb(parents[x].getElementsByClassName('eye')[0].style.backgroundColor)
        //        var mouth = convertRgb(parents[x].getElementsByClassName('mouth')[0].style.backgroundColor)
        //        var skinParent = [eye, mouth]
        //      }
        //      return skinParent
        //    }
        //     console.log(getParentSkin())
        
        function mix50(){
          let eyeMix50 = mix_hexes(skinParentB[0], skinParentA[0])
          let mouthMix50 = mix_hexes(skinParentB[1], skinParentA[1])
        }


        // SKIN PARENT B
        //
        var eyeB = convertRgb(target.getElementsByClassName('eye')[0].style.backgroundColor)
        var coatB = convertRgb(target.getElementsByClassName('head')[0].style.backgroundColor)
        var hornB = convertRgb(target.getElementsByClassName('corne')[0].style.backgroundColor)
        var bellyB = convertRgb(target.getElementsByClassName('ventre')[0].style.backgroundColor)
        var maneB = convertRgb(target.getElementsByClassName('queue')[0].style.backgroundColor)
        
        var skinParentB = [eyeB, coatB, hornB, bellyB, maneB]


        // SKIN PARENT A
        //
        var eyeA = convertRgb(dragged.getElementsByClassName('eye')[0].style.backgroundColor)
        var coatA = convertRgb(dragged.getElementsByClassName('head')[0].style.backgroundColor)
        var hornA = convertRgb(dragged.getElementsByClassName('corne')[0].style.backgroundColor)
        var bellyA = convertRgb(dragged.getElementsByClassName('ventre')[0].style.backgroundColor)
        var maneA = convertRgb(dragged.getElementsByClassName('queue')[0].style.backgroundColor)
        
        var skinParentA = [eyeA, coatA, hornA, bellyA, maneA]

        
        var eyeMix50 = mix_hexes(skinParentB[0], skinParentA[0])
        var coatMix50 = mix_hexes(skinParentB[1], skinParentA[1]) 
        var hornMix50 = mix_hexes(skinParentB[2], skinParentA[2])
        var bellyMix50 = mix_hexes(skinParentB[3], skinParentA[3])
        var maneMix50 = mix_hexes(skinParentB[4], skinParentA[4])


        var eyePossibilities = [skinParentA[0], skinParentB[0], eyeMix50]
        var coatPossibilities = [skinParentA[1], skinParentB[1], coatMix50]
        var hornPossibilities = [skinParentA[2], skinParentB[2], hornMix50]
        var bellyPossibilities = [skinParentA[3], skinParentB[3], bellyMix50]
        var manePossibilities = [skinParentA[4], skinParentB[4], maneMix50]

       
        var parentBcolor = convertRgb(target.style.backgroundColor)
        var parentAcolor = convertRgb(dragged.style.backgroundColor)
        var babyColorMix50 = mix_hexes(parentAcolor, parentBcolor)
        var possibilities = [parentAcolor, parentBcolor, babyColorMix50]
       let babyColor = possibilities[Math.floor(Math.random() * possibilities.length)];


        var eyeBabyColor = eyePossibilities[Math.floor(Math.random() * eyePossibilities.length)];
        var coatBabyColor = coatPossibilities[Math.floor(Math.random() * coatPossibilities.length)];
        var hornBabyColor = hornPossibilities[Math.floor(Math.random() * hornPossibilities.length)];
        var bellyBabyColor = bellyPossibilities[Math.floor(Math.random() * bellyPossibilities.length)];
        var maneBabyColor = manePossibilities[Math.floor(Math.random() * manePossibilities.length)];

        let babySpecies = parentsSpecies[Math.floor(Math.random() * parentsSpecies.length)];

        // ------------------
        //      COLORING 
        //
        //newPony.style.backgroundColor = babyColor

        // Coloring eyes
        newPony.getElementsByClassName('eye')[0].style.backgroundColor = eyeBabyColor;

        // Coloring body
        let body = newPony.querySelectorAll('.head, .head1, .encolure, .oreille, .leg1, .leg2, .leg3, .leg4, .corps');
        for(let i = 0; i < body.length; i++){
          body[i].style.backgroundColor = coatBabyColor;
        }

        // Coloring hair
        let hair = newPony.querySelectorAll('.criniere1, .criniere2, .criniere3, .queue, .queue1');
        for(let i = 0; i < hair.length; i++){
          hair[i].style.backgroundColor = maneBabyColor;
        }

        // Coloring belly
        newPony.getElementsByClassName('ventre')[0].style.backgroundColor = bellyBabyColor;
        
        // Coloring horn
        let horn = newPony.querySelectorAll('.corne, .corne1');
        for(let i = 0; i < horn.length; i++){
          horn[i].style.backgroundColor = hornBabyColor;
        }

        // Adding random genetic species
        newPony.classList.remove('licorne');
        
        newPony.classList.add(babySpecies);


        // 4. Ajouter les événements drag au nouveau cercle
        makeDraggable(newPony);
        
        // 5. Ajouter au DOM dans la zone de jeu
        gameArea.appendChild(newPony);
      } //End if --> drop
    }
  });