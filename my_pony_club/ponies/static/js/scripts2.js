/* 
    // 
    //
    // Récupère le token CSRF depuis le cookie Django
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(";").shift();
    }

    const csrfToken = getCookie("csrftoken");

    async function saveAction(data) {
        try {
            const response = await fetch("/api/save-action/", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-CSRFToken": csrfToken,  // 🔑 Token CSRF
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error("Erreur serveur");

            const result = await response.json();
            console.log("Sauvegardé :", result);
        } catch (error) {
            console.error("Erreur :", error);
        }
    }

    // Exemple d'utilisation sur un clic
    document.getElementById("mon-bouton").addEventListener("click", () => {
        saveAction({ 
            name: "Random_creation",
            eye: "#{{number_c}}",
            coat: "#{{number_a}}", 
            horn: "#{{number_d}}", 
            belly: "#{{number_b}}", 
            mane: "#{{number}}",
            species:"{{species_number}}",
            champ1: "test1", 
            champ2: "test2", 
        });
    });    




    
    var i = 5; // Nombre de poney de bases à récupérer en variable
    document.getElementById("factorybutton").onclick = function(){
        i++
        var basepony = document.getElementById('pony_space1')
        var babypony = basepony.cloneNode(true)
        babypony.id = "pony_space" + i
        babypony.className = "pony_space"
        document.getElementById('ponies_list').appendChild(babypony);
    }
 */