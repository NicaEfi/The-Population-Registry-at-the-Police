/*function cautaCetateni() {
    // Obține valorile selectate din formular
    var oras = document.getElementById("oras").value;
    var tipDocument = document.getElementById("tipDocument").value;
    var infractiuni = document.getElementById("infractiuni").value;

    // Trimite cererea către server pentru a obține datele
    fetchDataFromDatabase(oras, tipDocument, infractiuni);
}

function fetchDataFromDatabase(oras, tipDocument, infractiuni) {
    // Creează un obiect FormData pentru a trimite datele către server
    var formData = new FormData();
    formData.append('oras', oras);
    formData.append('tipDocument', tipDocument);
    formData.append('infractiuni', infractiuni);

    // Trimite cererea HTTP POST către server (în acest exemplu presupunem că server-ul rulează pe localhost:3000)
    fetch('http://localhost:8800/search', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(result => {
        // Afisează rezultatele într-un div cu id-ul "rezultate"
        var resultDiv = document.getElementById("rezultate");
        resultDiv.innerHTML = "<h2>Rezultatele Căutării</h2>" + generateTable(result);
    })
    .catch(error => {
        console.error('Eroare:', error);
    });
}

function generateTable(data) {
    // Generează un tabel HTML pe baza datelor primite de la server
    var tableHTML = "<table border='1'><tr><th>Nume</th><th>Prenume</th><th>Data Nasterii</th></tr>";

    data.forEach(row => {
        tableHTML += "<tr><td>" + row.Nume + "</td><td>" + row.Prenume + "</td><td>" + row.DataNasterii + "</td></tr>";
    });

    tableHTML += "</table>";

    return tableHTML;
}*/

