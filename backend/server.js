// Imports

const express = require("express");
const cors = require("cors");
const path = require("path");
const axios = require("axios");
const { createClient } = require("@supabase/supabase-js");

require("dotenv").config({
    path: path.resolve(__dirname, "../.env")
});

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json()); 

// Supabase

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_KEY
);


// Root
app.get("/", (req, res) => {
    res.json({ message: "F1 Dashboard API running" });
});


// Get drivers from drivers file

app.get("/api/drivers", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("drivers")
            .select("*");

        if (error) {
            console.error("DRIVERS ERROR:", error);
            return res.status(500).json({ error: error.message });
        }

        res.json(data);

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Server failed" });
    }
});


// Favortie drivers 

app.post("/api/favorites", async (req, res) => {
    try {

        console.log("FAVORITES POST HIT");
        console.log("BODY:", req.body);

        let { driver_name } = req.body;

        if (!driver_name) {
            return res.status(400).json({
                error: "driver_name is required"
            });
        }

        // Normalize the driver names
        driver_name = driver_name.trim().toLowerCase();

        const { data, error } = await supabase
            .from("favorites")
            .insert([{ driver_name }])
            .select();

        console.log("INSERT RESULT:", data);
        console.log("INSERT ERROR:", error);

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.json({
            message: "Favorite saved successfully",
            data
        });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Server failed" });
    }
});


// Get favorites from supabase

app.get("/api/favorites", async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("favorites")
            .select("*");

        if (error) {
            console.error("FAVORITES ERROR:", error);
            return res.status(500).json({ error: error.message });
        }

        res.json(data);

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Server failed" });
    }
});


// Delete favorites from supabase table

app.delete("/api/favorites", async (req, res) => {
    try {

        console.log("🗑 DELETE FAVORITE HIT");
        console.log("BODY:", req.body);

        let { driver_name } = req.body;

        if (!driver_name) {
            return res.status(400).json({
                error: "driver_name is required"
            });
        }

        // Normalize driver information
        driver_name = driver_name.trim().toLowerCase();

        const { data, error } = await supabase
            .from("favorites")
            .delete()
            .eq("driver_name", driver_name)
            .select();

        console.log("DELETE RESULT:", data);
        console.log("DELETE ERROR:", error);

        if (error) {
            return res.status(500).json({
                error: error.message
            });
        }

        res.json({
            message: "Favorite removed successfully",
            deleted: data
        });

    } catch (err) {
        console.error("SERVER ERROR:", err);
        res.status(500).json({ error: "Server failed" });
    }
});


// F1 driver information from API

app.get("/api/f1-drivers", async (req, res) => {
    try {
        const response = await axios.get(
            "https://api.openf1.org/v1/drivers?session_key=latest"
        );

        res.json(response.data);

    } catch (err) {
        console.error("F1 DRIVERS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch drivers" });
    }
});

// F1 standings

app.get("/api/f1-standings", async (req, res) => {
    try {
        const response = await fetch(
            "https://api.jolpi.ca/ergast/f1/current/driverStandings.json"
        );

        const raw = await response.json();

        const standings =
            raw?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];

        const formatted = standings.map(item => ({
            position: item.position,
            points: item.points,
            driver_name: item.Driver.givenName + " " + item.Driver.familyName,
            team_name: item.Constructors?.[0]?.name || "Unknown"
        }));

        res.json(formatted);

    } catch (err) {
        console.error("F1 STANDINGS ERROR:", err);
        res.status(500).json({ error: "Failed to fetch standings" });
    }
});


// Start the server

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});