import React from "react"
import { Route, Switch } from "react-router-dom";
import CreatePost from "../../components/post/CreatePost";
import PostDetail from "../../components/post/PostDetail"
export default () => (
    <Switch>
        <Route path="/post/new" component={CreatePost}/>
        <Route path="/post/:id" component={PostDetail}/>
    </Switch>
)