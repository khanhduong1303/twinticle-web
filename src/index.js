import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as auth from './AuthProvider';
import * as serviceWorker from './serviceWorker';
import { BrowserRouter as Router } from "react-router-dom";
import App from './App';
import { ApolloProvider } from 'react-apollo';

class Application extends React.Component {
    constructor(props) {
        super(props)
        let {token} = auth.currentAuthState()
        this.state = {
            token, status: "loading"
        }
        this.setState = this.setState.bind(this)
        auth.registerFirebaseAuth(this.setState)
    }

    render() {
        let loading = this.state.status === "loading";
        return loading ? <p>loading...</p> : <Router>
            <ApolloProvider client={auth.createApolloClient(this.state)}>
                <App />
            </ApolloProvider>
        </Router>
    }
}


ReactDOM.render(<Application />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
