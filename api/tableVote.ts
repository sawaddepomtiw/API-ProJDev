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
        let sql = "INSERT INTO vote(uid, imid, status, score) VALUES (?,?,?,?)";
        sql = mysql.format(sql, [
            vote.uid,
            vote.imid,
            vote.status,
            vote.score
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
router.post("/insertVote/noID", (req, res) => {

    if (req.query){

        const vote: VoteModel = req.body;
        let sql = "INSERT INTO vote( imid, status, score) VALUES (?,?,?)";
        sql = mysql.format(sql, [
            vote.imid,
            vote.status,
            vote.score
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

router.get("/staticVote", (req, res) =>{
    if (req.query){

        const sql = "select * from vote";
        dbconn.query(sql, (err, result) => {
            res.status(201).json(result);
        });
    } else {
        res.status(201).send("error!");
    }
});
router.get("/lastTimeVote/:id", (req, res) =>{
    const userId = req.params.id;
    const sql = `
    SELECT imid,
    timestamp AS last_time
    FROM vote
    WHERE uid = 13
        AND DATE(timestamp) = CURRENT_DATE
        and imid = 60
    `;
    dbconn.query(sql, [userId], (err, result) => {
        if (err) {
            res.status(500).json({ error: "Internal Server Error" });
            return;
        }
        // Check if any result is returned
        if (result.length > 0) {
            res.status(200).json(result[0]); // Return the first (and only) row
        } else {
            res.status(404).json({ error: "User not found or no votes found for the user" });
        }
    });
    
});