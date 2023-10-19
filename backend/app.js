const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const routes = require("./routes");
const { environment } = require("./config");
const isProduction = environment === "production";
console.log(`\n>>>   >>>   >>> \nENVIRONMENT: ${environment}\n<<<   <<<   <<<\n`);


const app = express();

app.use(morgan("dev"));

app.use(cookieParser());
app.use(express.json());

// security midware
if (!isProduction) {
    // cors only in dev
    app.use(cors());
}

// helmet helps set headers for security
app.use(
    helmet.crossOriginResourcePolicy({
        policy: "cross-origin",
    })
);

// set csrf token and create req.csrfToken method
app.use(
    csurf({
        cookie: {
            secure: isProduction,
            sameSite: isProduction && "Lax",
            httpOnly: true,
        },
    })
);

app.use(routes);

module.exports = app;
