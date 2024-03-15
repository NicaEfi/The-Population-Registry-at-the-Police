// import express, { request } from "express"
// import mssql from "mssql"

const express = require("express")
const sql = require('mssql/msnodesqlv8');
const cors = require("cors");
//const bodyParser = require('body-parser');
//let someUniqueId=14;
const app = express();
app.use(express.json());
app.use(cors());
//app.use(bodyParser.json()); //adaugare cetatean

// Configure database connection
const config = {
  server: 'DESKTOP-E5PS5I1',
  database: 'evidenta-populatie',
  options: {
    trustedConnection: true, // For SQL Database
  },
  driver: 'msnodesqlv8'
};

// sql.connect(config, (err) => {
//   if (err) {
//     console.error('Error connecting to the database:', err);
//     return;
//   }

//   // Query eample
//   const request = new sql.Request();
//   request.query('SELECT * FROM Cetateni', (err, result) => {
//     if (err) {
//       console.error('Error executing query:', err);
//       sql.close();
//       return;
//     }

//     console.log('Query result:', result.recordset);
//     sql.close();
//   });
// });


app.get("/", (req,res)=>{
  sql.connect(config, (err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
  
    // Query eample
    const request = new sql.Request();
    request.query('SELECT * FROM Cetateni', (err, result) => {
      if (err) {
        console.error('Error executing query:', err);
        sql.close();
        return;
      }
  
      console.log('Query result:', result.recordset);
      return res.json(result.recordset);
      sql.close();
    });
  });
})

// app.get("/", (req,res) =>{
//   res.json("gfdsgh");
// })

app.use((req,res,next)=> {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
})

app.get('/afiseazaDate', async (req, res) => {
  try {
      // Realizează conexiunea la baza de date
      await sql.connect(config);

      // Execută comanda SELECT
      const result = await sql.query('SELECT * FROM Cetateni');

      // Închide conexiunea la baza de date
      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.delete('/stergeCetatean/:CetateanID', async (req, res) => {
  try {
    const { CetateanID } = req.params;

    await sql.connect(config);

    // Delete the citizen from the database
    const deleteQuery = `DELETE FROM Cetateni WHERE CetateanID = ${CetateanID}`;
    await sql.query(deleteQuery);

    // Return success response to the client
    res.json({ success: true });
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ success: false, message: 'Error deleting citizen from the database.' });
  } finally {
    await sql.close();
  }
});

/*function generateUniqueCetateanID() {
  // Your logic to generate a unique CetateanID goes here
   return someUniqueId++;
}*/
//${generateUniqueCetateanID()},
app.post(`/addPerson`, async (req, res) => {
  console.log("Received request with data:", req.body);
  try {
      // console.log(req);
      await sql.connect(config);
      console.log("Received request with data 12783782763267237247824:", req.body);
      const result = await sql.query`
          INSERT INTO Cetateni ( Nume, Prenume, CNP, Sex, Telefon, Email, StareCivila, DataNasterii)
          VALUES (
              
              ${req.body.Nume},
              ${req.body?.Prenume},
              ${req.body?.CNP},
              ${req.body?.Sex},
              ${req.body?.Telefon},
              ${req.body?.Email},
              ${req.body?.StareCivila},
              ${req.body?.DataNasterii}
          );
          SELECT SCOPE_IDENTITY() AS CetateanID ;
      `;
    /*  if (!req.body) {
        console.error('Error: Request body is undefined');
        return res.status(400).send('Bad Request');
    }*/
      // Respond with the inserted person's data
      res.json({
          cetateanID: result.recordset[0].CetateanId,
          ...req.body
      });
  } catch (error) {
      console.error("Error:", error);
      res.status(500).send("Internal Server Error");
  } finally {
      sql.close();
  }
});




// Modifică serverul pentru a gestiona cererile de căutare după tipul de document
app.get('/cautaCetateniCuDocument/:documentType', async (req, res) => {
  try {
      const { documentType } = req.params;

      await sql.connect(config);

      // Execută comanda SELECT cu JOIN între cele două tabele
      const result = await sql.query`
          SELECT Cetateni.*, Documente.* 
          FROM Cetateni
          INNER JOIN Documente ON Cetateni.CetateanID = Documente.CetateanID
          WHERE Documente.DocumentTip = ${documentType}
      `;

      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/searchSections/:selectedStreet', async (req, res) => {
  try {
      const { selectedStreet } = req.params;

      await sql.connect(config);

      // Execute the SQL query to fetch sections based on the selected street
      const result = await sql.query`
          SELECT Sectii.*
          FROM Sectii
          WHERE Oras IN (
              SELECT Oras
              FROM Adrese
              WHERE Strada = ${selectedStreet}
          )
      `;

      await sql.close();

      // Return the results to the client
      res.json(result.recordset);
  } catch (err) {
      console.error('Error:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Update the server-side route to handle the minimum number of members
app.get('/searchAddresses', async (req, res) => {
  try {
      const { minMembers } = req.query;

      await sql.connect(config);

      // Execută comanda SELECT cu JOIN între cele două tabele și condiția pentru numărul minim de membrii
      const result = await sql.query`
          SELECT AdresaTip, Strada, Numar, Oras, Judet
          FROM Adrese
          WHERE AdresaID IN (
              SELECT AdresaID
              FROM LocatieComuna
              WHERE NumarMembrii > ${minMembers}
          );
      `;

      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});


app.get('/cautaDupaGen/:gender', async (req, res) => {
  try {
      const { gender } = req.params;

      await sql.connect(config);

      const result = await sql.query`
          SELECT C.Nume, C.Prenume, M.TipModificare 
          FROM Cetateni C
          JOIN ModificariIdentitate M ON C.CetateanID = M.CetateanID
           WHERE Sex = ${gender};
      `;

      await sql.close();

      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/afiseazaInfractiuniSiCetateni', async (req, res) => {
  try {
      await sql.connect(config);

      const result = await sql.query`
          SELECT I.NumeInfractiune, I.Descriere, C.Nume, C.Prenume
          FROM Infractiuni I
          JOIN Cetateni C ON I.CetateanID = C.CetateanID;
      `;

      await sql.close();

      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/afiseazaInformatiiDocumenteSectii', async (req, res) => {
  try {
      await sql.connect(config);

      const result = await sql.query`
          SELECT S.NumeSectie, D.Numar, D.DataEliberarii
          FROM Sectii S
          JOIN Documente D ON S.SectieID = D.SectieID;
      `;

      await sql.close();

      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

// Adaugă rută pentru filtrarea cetățenilor infractori după numărul de infracțiuni
app.get('/cetateniInfractori', async (req, res) => {
  try {
    //console.log(req);
      const { numarInfractiuni } = req.query;
      //console.log(numarInfractiuni);
      // Realizează conexiunea la baza de date
      await sql.connect(config);

      // Construiește comanda SQL pentru filtrare
      const query = `
          SELECT A.Oras, COUNT(C.CetateanID) AS NumarCetateniInfractori
          FROM Cetateni AS C
          JOIN LocatieComuna AS LC ON C.CetateanID = LC.CetateanID
          JOIN Adrese AS A ON LC.AdresaID = A.AdresaID
          WHERE C.CetateanID IN (
              SELECT CetateanID
              FROM Infractiuni
          )
          GROUP BY A.Oras
          HAVING COUNT(C.CetateanID) >= ${numarInfractiuni};
      `;
      // Execută comanda SELECT
      const result = await sql.query(query);
      //console.log(result);
    
      // Închide conexiunea la baza de date
      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/afiseazaInfractiuni', async (req, res) => {
  try {
      // Realizează conexiunea la baza de date
      await sql.connect(config);

      // Execută comanda SELECT pentru a obține rezultatele interogării
      const result = await sql.query(`
          SELECT Cet.Nume, Cet.Prenume, I.Descriere, I.PedeapsaPrevazuta
          FROM Cetateni Cet
          JOIN Infractiuni I ON Cet.CetateanID = I.CetateanID
          WHERE (
              (CAST(SUBSTRING(I.PedeapsaPrevazuta, 1, CHARINDEX('-', I.PedeapsaPrevazuta) - 1) AS INT) + 
              CAST(SUBSTRING(I.PedeapsaPrevazuta, CHARINDEX('-', I.PedeapsaPrevazuta) + 1, CHARINDEX(' ', I.PedeapsaPrevazuta, CHARINDEX('-', I.PedeapsaPrevazuta)) - CHARINDEX('-', I.PedeapsaPrevazuta) - 1) AS INT)) / 2.0
          ) > (
              SELECT AVG(
                  (CAST(SUBSTRING(I2.PedeapsaPrevazuta, 1, CHARINDEX('-', I2.PedeapsaPrevazuta) - 1) AS INT) + 
                  CAST(SUBSTRING(I2.PedeapsaPrevazuta, CHARINDEX('-', I2.PedeapsaPrevazuta) + 1, CHARINDEX(' ', I2.PedeapsaPrevazuta, CHARINDEX('-', I2.PedeapsaPrevazuta)) - CHARINDEX('-', I2.PedeapsaPrevazuta) - 1) AS INT)) / 2.0
              )
              FROM Infractiuni I2
          )
      `);

      // Închide conexiunea la baza de date
      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/afiseazaDocumente', async (req, res) => {
  try {
      // Realizează conexiunea la baza de date
      await sql.connect(config);

      // Execută comanda SELECT pentru a obține informațiile despre documente
      const result = await sql.query(`
          SELECT D.DocumentTip, COUNT(D.Numar) AS NumarDocumente
          FROM Documente D
          GROUP BY D.DocumentTip
          ORDER BY COUNT(D.Numar) DESC
      `);
       
      // Închide conexiunea la baza de date
      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/modificariIdentitate', async (req, res) => {
  try {
      const { anNastere } = req.query;

      // Realizează conexiunea la baza de date
      await sql.connect(config);

      // Execută comanda SELECT cu filtrul pe anul de naștere
      const result = await sql.query`
          SELECT C.Nume, C.Prenume, MI.ElementNou, MI.MotivModificare
          FROM Cetateni C
          JOIN ModificariIdentitate MI ON C.CetateanID = MI.CetateanID
          WHERE YEAR(C.DataNasterii) > ${anNastere} AND MI.DataModificare IS NOT NULL;
      `;

      // Închide conexiunea la baza de date
      await sql.close();

      // Returnează rezultatele către client (browser)
      res.json(result.recordset);
  } catch (err) {
      console.error('Eroare:', err);
      res.status(500).json({ error: 'Eroare de server' });
  }
});

app.get('/afiseazaDocumenteGenerale', async (req, res) => {
  try {
      // Creează o nouă conexiune către baza de date
      const pool = await sql.connect(config);

      // Execută interogarea
      const result = await pool.request().query('SELECT C.Nume, C.Prenume, D.DocumentTip, D.Numar, D.Emitent, D.DataEliberarii FROM Documente D JOIN Cetateni C ON D.CetateanID = C.CetateanID');

      // Trimite rezultatul către client
      res.json(result.recordset);
  } catch (error) {
      console.error('Eroare la afișarea documentelor:', error);
      res.status(500).json({ success: false, message: 'Eroare la afișarea documentelor' });
  }
});




// Endpoint pentru ștergerea unui document
app.delete('/stergeDocument/:DocumentID', async (req, res) => {
  try {
      const DocumentID = req.params.DocumentID;

      // Creează o nouă conexiune către baza de date
      const pool = await sql.connect(config);

      // Execută interogarea pentru ștergere
      await pool.request().query(`DELETE FROM Documente WHERE DocumentID = ${DocumentID}`);

      // Trimite răspuns de succes către client
      res.json({ success: true, message: 'Documentul a fost șters cu succes' });
  } catch (error) {
      console.error('Eroare la ștergerea documentului:', error);
      res.status(500).json({ success: false, message: 'Eroare la ștergerea documentului' });
  }
});

// Endpoint pentru a obține lista de cetățeni
app.get('/getCetateni', async (req, res) => {
  try {
      // Creează o nouă conexiune către baza de date
      const pool = await sql.connect(config);

      // Execută interogarea pentru a obține lista de cetățeni
      const result = await pool.request().query('SELECT CetateanID, Nume, Prenume FROM Cetateni');

      // Trimite rezultatul către client
      res.json(result.recordset);
  } catch (error) {
      console.error('Eroare la obținerea listei de cetățeni:', error);
      res.status(500).json({ success: false, message: 'Eroare la obținerea listei de cetățeni' });
  }
});

// Endpoint pentru a obține lista de sectii
app.get('/getSectii', async (req, res) => {
  try {
      // Creează o nouă conexiune către baza de date
      const pool = await sql.connect(config);

      // Execută interogarea pentru a obține lista de sectii
      const result = await pool.request().query('SELECT SectieID, NumeSectie FROM Sectii');

      // Trimite rezultatul către client
      res.json(result.recordset);
  } catch (error) {
      console.error('Eroare la obținerea listei de sectii:', error);
      res.status(500).json({ success: false, message: 'Eroare la obținerea listei de sectii' });
  }
});

// Endpoint pentru adăugarea unui document
app.post('/addDocument', async (req, res) => {
  try {
      const documentData = req.body;

      // Creează o nouă conexiune către baza de date
      const pool = await sql.connect(config);

      // Execută interogarea pentru a adăuga documentul
      const result = await pool.request()
          .input('DocumentTip', sql.NVarChar, documentData.DocumentTip)
          .input('Numar', sql.NVarChar, documentData.Numar)
          .input('DataEliberarii', sql.Date, documentData.DataEliberarii)
          .input('CetateanID', sql.Int, documentData.CetateanID)
          .input('SectieID', sql.Int, documentData.SectieID)
          .query('INSERT INTO Documente (DocumentTip, Numar, DataEliberarii, CetateanID, SectieID) VALUES (@DocumentTip, @Numar, @DataEliberarii, @CetateanID, @SectieID); SELECT SCOPE_IDENTITY() as DocumentID');

      // Trimite răspunsul cu ID-ul documentului adăugat
      res.json({ success: true, message: 'Documentul a fost adăugat cu succes', DocumentID: result.recordset[0].DocumentID });
  } catch (error) {
      console.error('Eroare la adăugarea documentului:', error);
      res.status(500).json({ success: false, message: 'Eroare la adăugarea documentului' });
  }
});



app.listen(8800, ()=>{
  console.log("connected to backend")
})


// // Rută pentru obținerea datelor unui cetățean specific pentru editare
// app.get('/getCetatean/:id', async (req, res) => {
//   try {
//     const { id } = req.params;

//     // Realizează conexiunea la baza de date
//     await sql.connect(config);

//     // Execută comanda SELECT pentru un cetățean specific
//     const result = await sql.query(`SELECT * FROM Cetateni WHERE CetateanID = ${id}`);

//     // Închide conexiunea la baza de date
//     await sql.close();

//     // Returnează rezultatele către client (browser)
//     res.json(result.recordset);
//   } catch (err) {
//     console.error('Eroare:', err);
//     res.status(500).json({ error: 'Eroare de server' });
//   }
// });

// // Rută pentru actualizarea datelor unui cetățean
// app.put('/updateCetatean/:id', async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { Nume, Prenume, CNP, Telefon, Email, DataNasterii } = req.body;

//     // Realizează conexiunea la baza de date
//     await sql.connect(config);

//     // Execută comanda UPDATE pentru actualizarea datelor unui cetățean specific
//     await sql.query(`
//       UPDATE Cetateni
//       SET Nume = '${Nume}', Prenume = '${Prenume}', CNP = '${CNP}', Telefon = '${Telefon}', Email = '${Email}', DataNasterii = '${DataNasterii}'
//       WHERE CetateanID = ${id}
//     `);

//     // Închide conexiunea la baza de date
//     await sql.close();

//     // Returnează un răspuns către client (browser)
//     res.json({ success: true, message: 'Datele au fost actualizate cu succes.' });
//   } catch (err) {
//     console.error('Eroare:', err);
//     res.status(500).json({ success: false, message: 'Eroare de server' });
//   }
// });
