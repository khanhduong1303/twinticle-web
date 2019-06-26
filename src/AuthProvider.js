import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import { InMemoryCache } from "apollo-cache-inmemory";
import ApolloClient from "apollo-client";
import { HttpLink } from "apollo-link-http";

const provider = new firebase.auth.GoogleAuthProvider();

// Find these options in your Firebase console
firebase.initializeApp({
  apiKey: "AIzaSyBTos9RlRS2DBfhStpw7slrJNY1CkDd0c0",
  authDomain: "hasura-liemlhd.firebaseapp.com",
  databaseURL: "https://hasura-liemlhd.firebaseio.com",
  projectId: "hasura-liemlhd",
  storageBucket: "hasura-liemlhd.appspot.com",
  messagingSenderId: "729756904910",
  appId: "1:729756904910:web:fed2a6ec15aeb5e8"
});

const AUTH_PERSIST_KEY = "firebase-auth"

class Auth {
  constructor() {
    let oldState = JSON.parse(localStorage.getItem(AUTH_PERSIST_KEY) || '{}');
    this.token = oldState.token;
    this.status = oldState.status ? oldState.status : "loading";
  }
}

function persistAuth({ token, status }) {
  let localState = { token, status };
  console.log("Do persist: ", localState)
  localStorage.setItem(AUTH_PERSIST_KEY, JSON.stringify(localState))
}

export function currentAuthState() {
  let auth = new Auth()
  auth.user = firebase.auth().currentUser || {};
  return auth;
}

export async function signIn() {
  console.log("Do signin");
  try {
    await firebase.auth().signInWithPopup(provider);
  } catch (error) {
    console.log(error);
  }
}

export async function signOut() {
  console.log("Do signout");
  try {
    await firebase.auth().signOut();
  } catch (error) {
    console.log(error);
  }
}

export function registerFirebaseAuth(callback = function () { }) {
  console.log("registerFirebaseAuth ")
  firebase.auth().onAuthStateChanged(async user => {
    console.log("Auth state changed")
    if (user) {
      const token = await user.getIdToken();
      const idTokenResult = await user.getIdTokenResult();
      console.log("idToken: ", idTokenResult)
      const hasuraClaim =
        idTokenResult.claims["https://hasura.io/jwt/claims"];
      if (hasuraClaim) {
        persistAuth({ status: "in", token })
        let newAuthState = new Auth()
        console.log("newAuthState: ", newAuthState)
        callback(newAuthState)
      } else {
        // Check if refresh is required.
        const metadataRef = firebase
          .database()
          .ref("metadata/" + user.uid + "/refreshTime");
        metadataRef.on("value", async () => {
          // Force refresh to pick up the latest custom claims changes.
          const token = await user.getIdToken(true);
          persistAuth({ status: "in", token })
        });
        callback(new Auth())
      }
    } else {
      persistAuth({
        status: "out",
        user: null,
        token: null
      })
      callback(new Auth())
    }
  })
}

export function createApolloClient(authState = {}) {
  console.log("createApolloClient: ", authState)
  const isLoggedIn = authState.status === "in";
  let graphqlUri = "https://liemlhd-hasura.herokuapp.com/v1/graphql";
  let headers = isLoggedIn ? { Authorization: `Bearer ${authState.token}` } : {};;
  let link = new HttpLink({
    uri: graphqlUri,
    headers
  });
  const client = new ApolloClient({
    link: link,
    cache: new InMemoryCache()
  });
  return client;
}

