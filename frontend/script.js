  
   

function cautaDupaGen() {
    var gender = document.getElementById("gender").value;

    fetch(`http://localhost:8800/cautaDupaGen/${gender}`)
        .then(response => response.json())
        .then(data => {
            // Construiește un tabel HTML cu datele primite
            var tableHTML = "<table border='1'><tr><th>Nume</th><th>Prenume</th><th>TipModificare</th><th>Stergere</th></tr>";

            data.forEach(row => {
                tableHTML += `<tr><td>${row.Nume}</td><td>${row.Prenume}</td><td>${row.TipModificare}</td><td> <i class="fas fa-trash" style="cursor: pointer;" onclick="stergeCetatean(${row.CetateanID})"></i>`;
            });

            tableHTML += "</table>";

            // Adaugă tabelul în div-ul cu id-ul "rezultateDupaGen"
            document.getElementById("rezultateDupaGen").innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Eroare:', error);
        });
}

function afiseazaInfractiuniSiCetateni() {
    fetch('http://localhost:8800/afiseazaInfractiuniSiCetateni')
        .then(response => response.json())
        .then(data => {
            // Construiește un tabel HTML cu datele primite
            var tableHTML = "<table border='1'><tr><th>Nume Infractiune</th><th>Descriere Infractiune</th><th>Nume Cetatean</th><th>Prenume Cetatean</th></tr>";

            data.forEach(row => {
                tableHTML += `<tr><td>${row.NumeInfractiune}</td><td>${row.Descriere}</td><td>${row.Nume}</td><td>${row.Prenume}</td>`;
            });

            tableHTML += "</table>";

            // Adaugă tabelul în div-ul cu id-ul "rezultateInfractiuniCetateni"
            document.getElementById("rezultateInfractiuniCetateni").innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Eroare:', error);
        });
}


    function afiseazaInformatiiDocumenteSectii() {
        fetch('http://localhost:8800/afiseazaInformatiiDocumenteSectii')
            .then(response => response.json())
            .then(data => {
                // Construiește un tabel HTML cu datele primite
                var tableHTML = "<table border='1'><tr><th>Nume Sectie</th><th>Numar Document</th><th>Data Eliberarii</th></tr>";

                data.forEach(row => {
                    tableHTML += `<tr><td>${row.NumeSectie}</td><td>${row.Numar}</td><td>${row.DataEliberarii}</td>`;
                });

                tableHTML += "</table>";

                // Adaugă tabelul în div-ul cu id-ul "rezultateInformatiiDocumenteSectii"
                document.getElementById("rezultateInformatiiDocumenteSectii").innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }


    

    
     // Adaugă o funcție pentru căutarea cetățenilor cu un anumit document
     async function cautaCetateniCuDocument() {
        const documentType = document.getElementById("documentType").value;

        // Realizează o cerere către server pentru a obține cetățenii cu documentul specificat
        const response = await fetch(`http://localhost:8800/cautaCetateniCuDocument/${documentType}`);
        const data = await response.json();

        // Construiește un tabel HTML cu rezultatele căutării
        var tableHTML = "<table border='1'><tr><th>Nume</th><th>Prenume</th><th>CNP</th><th>Telefon</th><th>Email</th><th>DataNasterii</th><th>Stergere</th></tr>";

        data.forEach(row => {
            tableHTML += `<tr><td>${row.Nume}</td><td>${row.Prenume}</td><td>${row.CNP}</td><td>${row.Telefon}</td><td>${row.Email}</td><td>${row.DataNasterii}</td><td> <i class="fas fa-trash" style="cursor: pointer;" onclick="stergeCetatean(${row.CetateanID})"></i>`;
        });

        tableHTML += "</table>";

        // Adaugă tabelul în div-ul cu id-ul "rezultateCetateniCuDocument"
        document.getElementById("rezultateCetateniCuDocument").innerHTML = tableHTML;
    }


    function afiseazaCetateniInfractori() {
        // Preia valoarea introdusă în input
        var numarInfractiuni = document.getElementById("numarInfractiuni").value;
        
        // Face apel către server pentru a obține datele filtrate
        fetch(`http://localhost:8800/cetateniInfractori?numarInfractiuni=${numarInfractiuni}`)
            .then(response => response.json())
            .then(data => {
                // Construiește un tabel HTML cu datele primite
                var tableHTML = "<table border='1'><tr><th>Oras</th><th>Numar infractiuni</th></tr>";
    
                data.forEach(row => {
                    tableHTML += `<tr><td>${row.Oras}</td><td>${row.NumarCetateniInfractori}</td>`;
                });
    
                tableHTML += "</table>";
    
                // Adaugă tabelul în div-ul cu id-ul "rezultate"
                document.getElementById("rezultateInfractori").innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    

    function afiseazaInfractiuni() {
        // Faceți o cerere către server pentru a obține rezultatele interogării
        fetch('http://localhost:8800/afiseazaInfractiuni')
            .then(response => response.json())
            .then(data => {
                // Construiți un tabel HTML cu rezultatele primite
                var tableHTML = "<table border='1'><tr><th>Nume</th><th>Prenume</th><th>Descriere</th><th>Pedeapsa Prevăzută</th></tr>";
    
                data.forEach(row => {
                    tableHTML += `<tr><td>${row.Nume}</td><td>${row.Prenume}</td><td>${row.Descriere}</td><td>${row.PedeapsaPrevazuta}</td></tr>`;
                });
    
                tableHTML += "</table>";
    
                // Adăugați tabelul în div-ul cu id-ul "rezultateInfractiuni"
                document.getElementById("rezultateInfractiuni").innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    

    function afiseazaDocumente() {
        // Face apel către server pentru a obține datele despre documente
        fetch('http://localhost:8800/afiseazaDocumente')
            .then(response => response.json())
            .then(data => {
                // Construiește un tabel HTML cu datele primite
                var tableHTML = "<table border='1'><tr><th>Tip Document</th><th>Numar Documente</th></tr>";
    
                data.forEach(row => {
                    tableHTML += `<tr><td>${row.DocumentTip}</td><td>${row.NumarDocumente}</td>`;
                });
    
                tableHTML += "</table>";
    
                // Adaugă tabelul în div-ul cu id-ul "rezultateDocumente"
                document.getElementById("rezultateDocumente").innerHTML = tableHTML;
                
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    

    function afiseazaModificariIdentitate() {
        // Preia valoarea introdusă în input pentru anul de naștere
        var anNastere = document.getElementById("anNastere").value;
    
        // Face apel către server pentru a obține datele filtrate
        fetch(`http://localhost:8800/modificariIdentitate?anNastere=${anNastere}`)
            .then(response => response.json())
            .then(data => {
                // Construiește un tabel HTML cu datele primite
                var tableHTML = "<table border='1'><tr><th>Nume</th><th>Prenume</th><th>Element Nou</th><th>Motiv Modificare</th></tr>";
    
                data.forEach(row => {
                    tableHTML += `<tr><td>${row.Nume}</td><td>${row.Prenume}</td><td>${row.ElementNou}</td><td>${row.MotivModificare}</td>`;
                });
    
                tableHTML += "</table>";
    
                // Adaugă tabelul în div-ul cu id-ul "rezultateModificari"
                document.getElementById("rezultateModificari").innerHTML = tableHTML;
            })
            .catch(error => {
                console.error('Eroare:', error);
            });
    }
    
    // Folosește JavaScript pentru a efectua o cerere către server și a afișa datele în HTML
    fetch('http://localhost:8800/afiseazaDocumenteGenerale')
        .then(response => response.json())
        .then(data => {
            // Construiește un tabel HTML cu datele primite
            var tableHTML = "<table border='1'><tr></th><th>Nume</th><th>Prenume</th><th>DocumentTip</th><th>Numar</th><th>Emitent</th><th>DataEliberarii</th><th>Editare/Stergere</th></tr>";

            data.forEach(row => {
                tableHTML += `<tr><td>${row.Nume}</td><td>${row.Prenume}</td><td>${row.DocumentTip}</td><td>${row.Numar}</td><td>${row.Emitent}</td><td>${row.DataEliberarii}</td><td>  <i class="fas fa-edit" style="cursor: pointer;" onclick="editeazaCetatean(${row.DocumentID})"></i><i class="fas fa-trash" style="cursor: pointer;" onclick="stergeDocument(${row.DocumentID})"></i>`;
            });

            tableHTML += "</table>";

            // Adaugă tabelul în div-ul cu id-ul "rezultate"
            document.getElementById("rezultateDocumenteGenerale").innerHTML = tableHTML;
        })
        .catch(error => {
            console.error('Eroare:', error);
        });

    // Funcția pentru a șterge un document cu confirmare
    function stergeDocument(DocumentID) {
        // Afișează un mesaj de confirmare către utilizator
        var confirmare = confirm('Sunteți sigur că doriți să ștergeți acest document?');

        // Dacă utilizatorul confirmă, trimite o cerere către server pentru ștergerea documentului
        if (confirmare) {
            fetch(`http://localhost:8800/stergeDocument/${DocumentID}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    // Dacă ștergerea a fost reușită, reîncarcă datele pentru a actualiza tabelul
                    if (data.success) {
                        location.reload();
                    } else {
                        console.error('Eroare la ștergere:', data.message);
                    }
                })
                .catch(error => {
                    console.error('Eroare la ștergere:', error);
                });
        }
    }


    // async function editeazaCetatean(CetateanID) {
    //     try {
    //         // Obține datele cetățeanului pentru editare
    //         const response = await fetch(`http://localhost:8800/getCetatean/${CetateanID}`);
    //         const data = await response.json();

    //         // Umple un formular de editare cu datele obținute
            

    //         // După editare, trimite datele actualizate către server
    //         const updatedData = {
    //             Nume: document.getElementById('numeInput').value,
    //             Prenume: document.getElementById('prenumeInput').value,
    //             CNP: document.getElementById('cnpInput').value,
    //             Telefon: document.getElementById('telefonInput').value,
    //             Email: document.getElementById('emailInput').value,
    //             DataNasterii: document.getElementById('dataNasteriiInput').value,
    //         };

    //         const updateResponse = await fetch(`http://localhost:8800/updateCetatean/${CetateanID}`, {
    //             method: 'PUT',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //             body: JSON.stringify(updatedData),
    //         });

    //         const updateData = await updateResponse.json();

    //         // Dacă actualizarea a fost reușită, reîncarcă datele pentru a actualiza tabelul
    //         if (updateData.success) {
    //             location.reload();
    //         } else {
    //             console.error('Eroare la actualizare:', updateData.message);
    //         }
    //     } catch (error) {
    //         console.error('Eroare la editare:', error);
    //     }
    // }
 