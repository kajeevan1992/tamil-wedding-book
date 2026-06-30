const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const fileUpload = require('express-fileupload');
const dotenv = require("dotenv");
dotenv.config();
const proxy = require('html2canvas-proxy');

const setEnvironment = (app) => {
    app.use(express.static('uploads'));
    app.use(express.static('uploads_dummy'));
    app.use(express.static('downloads'));
    app.use(express.static('node_modules/bootstrap'));
    app.use(express.json())
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static(__dirname + "/public"));
    app.use('/', proxy()); // For html2Canvas

    if (process.env.NODE_ENV !== 'production') {
        setDevEnv(app);
    } else {
        setProdEvn(app);
    }
}

function setDevEnv(app) {
    app.use(morgan('dev'));
    app.use(cors('*'));
    app.use(fileUpload({
        limits: {
            fileSize: 5000000, // 5MB
        },
        abortOnLimit: true,
        createParentPath: true
    }));
}

function setProdEvn(app) {
    const corsOptions = {
        origin: ["http://localhost:3000", "https://tamilweddingbook.com"],
    }
    app.use(cors(corsOptions));

    app.use(fileUpload({
        limits: {
            fileSize: 5000000, // 5MB
        },
        abortOnLimit: true,
        createParentPath: true
    }));
}

module.exports = setEnvironment;