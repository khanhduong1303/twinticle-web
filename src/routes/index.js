
import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../components/Home"
import Post from "./post"
export default () => (
    <Switch>
        <Route exact path="/" component={Home} />
        <Post />
    </Switch>
)
