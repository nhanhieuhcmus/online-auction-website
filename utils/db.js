const mysql = require('mysql');
const util = require('util');

const pool = mysql.createPool({
  connectionLimit: 50,
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'ql_sdg'
});

const mysql_query = util.promisify(pool.query).bind(pool);

module.exports = {
  load: sql => mysql_query(sql),
};  

// pool.getConnection(function(err, connection) {
//     if (err) throw err; // not connected!
   
//     // Use the connection
//     connection.query('SELECT * FROM category where flag = 1', function (error, results, fields) {
//       // When done with the connection, release it.
//       connection.release();
   
//       console.log(results);

//       // Handle error after the release.
//       if (error) throw error;
   
//       // Don't use the connection here, it has been returned to the pool.
// });
// });