import express from "express";
import { dbconn } from "../dbconnects";
import { VoteModel } from "../MODEL/getpostputdelete";
import mysql from "mysql";

export const router = express.Router();

router.get("/selectVote", (req, res) =>{
    if (req.query){

        const sql = "select * from vote";
        dbconn.query(sql, (err, result) => {
            res.status(201).json(result);
        });
    } else {
        res.status(201).send("error!");
    }
});

router.post("/insertVote", (req, res) => {

    if (req.query){

        const vote: VoteModel = req.body;
        let sql = "INSERT INTO vote(uid, imid, status) VALUES (?,?,?)";
        sql = mysql.format(sql, [
            vote.uid,
            vote.imid,
            vote.status
        ]);
        dbconn.query(sql, (err, result) =>{
            if (err) throw err;
            res.status(201).json({
                affected_rows: result.affectedRows,
                last_idx: result.insertId
            });
        });
    } else {
        res.status(201).send("error!");
    }
});