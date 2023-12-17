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
  server: 'DESKTOP-CH4KD7A\\SQLEXPRESS',
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
  res.header("Acces-Control-Allow-Origin", "*");
  res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
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

app.listen(8800, ()=>{
  console.log("connected to backend")
})



