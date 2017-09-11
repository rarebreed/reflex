import React from "react";
import ReactDOM from "react-dom";
import { RegisterChoice } from "../components/register_choice.jsx"

const App = () => {
    return(
        <RegisterChoice name="Sean"/>
    );
}

ReactDOM.render(<App />, document.getElementById("container"));
