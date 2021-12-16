let conn;

(async () => {
    connect();
    await createTable();
    await insert();
   /*  await showRows(); */
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
    let { rows } = await conn.query(
        `insert into people (id, name) values (12, 'mario bross'), (21, 'luiza mel') returning *`
    );
    console.log(`Rows inserted: ${rows.length}`);
    
}

/* async function showRows() {
    let { rows } = await conn.query(`select * from people`);
    for (const row of rows) {
        console.log(row);
    }
} */