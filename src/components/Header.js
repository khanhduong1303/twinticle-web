import React from "react";
import { Navbar, NavDropdown, Button, Nav } from "react-bootstrap";
import * as auth from "../AuthProvider";
import { Link } from "react-router-dom";
export default () => {
    let authState = auth.currentAuthState()
    console.log("authState: ", authState)
    let loggedIn = auth.currentAuthState().status === 'in';
    return <Navbar bg="light" expand="lg" fixed="top">
        <Navbar.Brand><Link to="/">Twinticle</Link></Navbar.Brand>
        <Navbar.Collapse id="basic-navbar-nav">
        </Navbar.Collapse>
        <Navbar.Toggle />
        <Navbar.Collapse className="justify-content-end">
            {
                loggedIn ? (<>
                    <Nav.Item><Link to="/post/new">Create Post</Link></Nav.Item>
                    <NavDropdown title={authState.user.displayName}>
                        <NavDropdown.Item onClick={auth.signOut}>Log Out</NavDropdown.Item>
                    </NavDropdown>
                </>)
                    : (<Button onClick={auth.signIn}> Log In Or Register </Button>)
            }
        </Navbar.Collapse>
    </Navbar>
}
