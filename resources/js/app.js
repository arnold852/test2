require("./bootstrap");

import React from "react";
import { render } from "react-dom";
import Routes from "./components/routes";
// import config from "config";

render(<Routes />, document.getElementById("app"));
