import mysql from "mysql";
import util from "util";

export const dbconn = mysql.createPool({
    connectionLimit: 10,
    host: "202.28.34.197",
    user: "web66_65011212172",
    password: "65011212172@csmsu",
    database: "web66_65011212172"
});

export const queryPromise = util.promisify(dbconn.query).bind(dbconn);