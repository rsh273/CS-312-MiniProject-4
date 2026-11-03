const express = require("express");
const { Pool } = require("pg");
const session =require("express-session");
require("dotenv").config();
const app = express();
const port = 3000;

// connect to PostgreSQL
const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "BlogDB",
    password: process.env.DB_PASSWORD,
    port: 5432
});

// allow JSON data from React 
app.use(express.json());
app.use(express.urlencoded({ extended: true}));

// session setup for signed-in users
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

// get the currently signed-in user 
app.get("/api/user", (req, res) => {
    res.json({
        user: req.session.user || null
    });
});

// create a new user
app.post("/api/signup", async (req, res) => {
    const userId = req.body.user_id;
    const password = req.body.password;
    const name = req.body.name;

    try {
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE user_id = $1",
            [userId]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({
                error: "That user ID is already taken. Please choose another one."
            });
        }

        await pool.query(
            "INSERT INTO users (user_id, password, name) VALUES ($1, $2, $3)",
            [userId, password, name]
        );

        res.json({
            success: true
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "There was a problem creating your account."
        });
    }
});

// sign in an existing user
app.post("/api/signin", async (req, res) => {
    const userId = req.body.user_id;
    const password = req.body.password;

    try {
        const result = await pool.query(
            "SELECT * FROM users WHERE user_id = $1 AND password = $2",
            [userId, password]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Incorrect user ID or password. Please try again."
            });
        }

        const user = result.rows[0];

        req.session.user = {
            user_id: user.user_id,
            name: user.name
        };

        res.json({
            success: true,
            user: req.session.user
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "There was a problem signing in."
        });
    }
});

app.post("/api/signout", (req, res) => {
    req.session.destroy(() => {
        res.json({
            success: true
        });
    });
});

//home page - Load post from PostgreSQL
app.get("/api/blogs", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                blog_id AS id,
                creator_name AS name,
                creator_user_id,
                title,
                body AS blog,
                date_created AS date
            FROM blogs
            ORDER BY date_created DESC
        `);

        res.json(result.rows);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "There was a problem loading the blog posts."
        });
    }
});

// add a new blog post
app.post("/api/blogs", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: "You must sign in first."
        });
    }

    const title = req.body.title;
    const blog = req.body.blog;
    
    try {
        const result = await pool.query(
            `INSERT INTO blogs
            (creator_name, creator_user_id, title, body, date_created)
            VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
            RETURNING
                blog_id AS id,
                creator_name AS name,
                creator_user_id,
                title,
                body As blog,
                date_created AS date` ,
            [
                req.session.user.name,
                req.session.user.user_id,
                title,
                blog
            ]
        );

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);

        res.status(500).json({
           error: "There was a problem creating the post."
        });
    }
});

// update the blog post
app.put("/api/blogs/:id", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: "You must sign in first."
        });
    }

    const id = req.params.id;
    const title = req.body.title;
    const blog = req.body.blog;

    try {
        const result = await pool.query(
            `UPDATE blogs
            SET title = $1, body = $2
            WHERE blog_id = $3
            AND creator_user_id = $4
            RETURNING
                blog_id AS id,
                creator_name AS name,
                creator_user_id,
                title,
                body AS blog,
                date_created AS date`,
            [
                title,
                blog,
                id,
                req.session.user.user_id
            ]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({
                error: "You can only edit your own posts."
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "There was a problem updating the post."
        });
    }
});

// delete a blog post
app.delete("/api/blogs/:id", async (req, res) => {
    if (!req.session.user) {
        return res.status(401).json({
            error: "You must sign in first"
        });
    }

    const id = req.params.id;

    try {
        const result = await pool.query(
            `DELETE FROM blogs
            WHERE blog_id = $1
            AND creator_user_id = $2`,
            [
                id,
                req.session.user.user_id
            ]
        );

        if (result.rowCount === 0) {
            return res.status(403).json({
                error: "You can only delete your own post."
            });
        }

        res.json({
            success: true
        });

    } catch (error) {
        console.log(error);

        res.status(500).json({
            error: "There was a problem deleting the post."
        });
    }
});

app.listen(port, () => {
    console.log(`Blog API running on http://localhost:${port}`);
});