const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  database: 'ql_sdg'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
  add: (tableName, entity) => mysql_query(`insert into ${tableName} set ?`, entity),
  del: (tableName, condition) => mysql_query(`delete from ${tableName} where ?`, condition),
  patch: (tableName, entity, condition) => mysql_query(`update ${tableName} set ? where ?`, [entity, condition]),
}; 


// pool.getConnection(function(err, connection) {
//       if (err) throw err; // not connected!
     
//       // Use the connection
//       connection.query('SELECT * FROM category where id = 1', function (error, results, fields) {
//         // When done with the connection, release it.
//         connection.release();
     
//         console.log(results);
  
//         // Handle error after the release.
//         if (error) throw error;
     
//         // Don't use the connection here, it has been returned to the pool.
//   });
//   });