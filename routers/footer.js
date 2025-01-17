const express = require("express");
const router = express.Router({mergeParams: true});

router.get("/listing/about", (req, res) => {
    res.send("About us page");
})