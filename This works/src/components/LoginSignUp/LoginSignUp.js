import React, { useState, Fragment } from "react";
import classes from "./LoginSignUp.module.css";
import { useHistory } from "react-router-dom";
import axios from "axios";
import useAxios from "../../hooks/useAxios.js";

//--------------------------------------------------FIREBASE
// import {
//   useAuthState
// } from "react-firebase-hooks/auth";
// import firebase from "firebase/app";
// import "firebase/auth";
// // import "firebase/database";

// const firebaseApp = firebase.initializeApp({
//   apiKey: "AIzaSyBdKd9j8Z04yVrhQ1I-YGxgYLQplTs0eZU",
//   authDomain: "react-project-server.firebaseapp.com",
//   databaseURL: "https://react-project-server.firebaseio.com",
//   projectId: "react-project-server",
//   storageBucket: "react-project-server.appspot.com",
// });
let url = "";
let errorMessage = "";

// console.log(firebase)
const LoginSignUp = (props) => {
  // const [
  //   createUserWithEmailAndPassword,
  //   createdUser,
  //   createdLoading,
  //   createdError,
  // ] = useCreateUserWithEmailAndPassword(firebase.auth());

  // const [signInWithEmailAndPassword, signedUser, signedLoading, signedError] =
  //   useSignInWithEmailAndPassword(firebase.auth());
  // console.log(firebaseApp.firebase_.auth())

  const history = useHistory();
  const [isLogin, setIsLogin] = useState(true);

  const [emaiValue, setEmailValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");

  if (isLogin) {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBdKd9j8Z04yVrhQ1I-YGxgYLQplTs0eZU";
  } else {
    url =
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBdKd9j8Z04yVrhQ1I-YGxgYLQplTs0eZU";
  }

  const postFunction = (error) => {
    errorMessage = error.response.data.error.errors[0].message;
  };

  const applyData = (dataObj) => {
    props.setLoggedIn(true);
    props.setToken(dataObj.data.idToken);
    localStorage.setItem("user", dataObj.data.email);
    localStorage.setItem("token", dataObj.data.idToken);
    props.setUser(emaiValue);
    history.replace("/");
  };

  const {
    loading,
    // error,
    sendRequest: postData,
  } = useAxios(
    {
      url: url,
      func: axios.post,
      body: {
        email: emaiValue,
        password: passwordValue,
        returnSecureToken: true,
      },
    },
    applyData,
    postFunction
  );

  const onChangeEmailHandler = (e) => {
    setEmailValue(e.target.value);
    errorMessage = "";
  };
  const onChangePasswordHandler = (e) => {
    setPasswordValue(e.target.value);
    errorMessage = "";
  };

  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };

  const submitHandler = (event) => {
    event.preventDefault();

    // if (isLogin) {
    //   signInWithEmailAndPassword(emaiValue, passwordValue);
    // } else {
    //   createUserWithEmailAndPassword(emaiValue, passwordValue);

    // }

    postData();
    setEmailValue("");
    setPasswordValue("");
  };

  return (
    <Fragment>
      <section className={classes.Auth}>
        <h1>{isLogin ? "Login" : "Sign Up"}</h1>
        {/* <form onSubmit={props.submitHandler}> */}
        <form onSubmit={submitHandler}>
          <div className={classes.Control}>
            <label htmlFor="email">Your Email</label>
            <input
              type="email"
              id="email"
              required
              onChange={onChangeEmailHandler}
              value={emaiValue}
            />
          </div>
          <div className={classes.Control}>
            <label htmlFor="password">Your Password</label>
            <input
              type="password"
              id="password"
              required
              value={passwordValue}
              onChange={onChangePasswordHandler}
            />
          </div>
          <div className={classes.Actions}>
            {!loading && (
              <button>{isLogin ? "Login" : "Create Account"}</button>
            )}
            {loading && <p>Sending request...</p>}
            <button
              type="button"
              className={classes.Toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? "Create new account" : "Login with existing account"}
            </button>
          </div>
        </form>
        {errorMessage && <p className={classes.ErrorMessage}>{errorMessage}</p>}
      </section>
    </Fragment>
  );
};

export default LoginSignUp;
