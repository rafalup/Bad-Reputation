let conn;
const fs = require("fs");
const fastcsv = require("fast-csv");
const console = require("console");

(async () => {
  connect();
  await createTable();
  await insert();
  await showRows();
})();

function connect() {
  let { Client } = require('pg');
  conn = new Client({
    host: 'localhost',
    database: 'vintage',
    user: 'postgres',
    password: 'senha',
    port: 5432,
  });
  conn.connect();
}

async function createTable() {
  await conn.query(`
    create table if not exists people (
      id integer not null,
      name varchar,
      primary key (id)
    )
  `);
  console.log('Table created');
}

async function insert() {
    let stream = fs.createReadStream("arquivo.csv");
    let csvData = [];
    let csvStream = fastcsv
    .parse()
    .on("data", function(data) {
        csvData.push(data);
    })
    .on("end", function() {
        // remove the first line: header
        csvData.shift();


        const query =
        "INSERT INTO people (id, name) VALUES ($1, $2)";

        let i =1;
    
        csvData.forEach(row => {
        conn.query(query, row, (err, res) => {
            if (err) {
                console.log(err.stack);
            } else {
                console.log("inserted " + i + " row:", row);
                i= i + 1;
                //console.log(`Rows inserted: ${rows.length}`);
            }
            });
           
        });
        
    });
    stream.pipe(csvStream);
    
}

async function showRows() {
  let { rows } = await conn.query(`select * from people`);
  for (const row of rows) {
    console.log(row);
  }
} 