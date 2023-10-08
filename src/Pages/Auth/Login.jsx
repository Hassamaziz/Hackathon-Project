import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";



import {
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth } from "../../Config/Firebase"
import { useAuthContext } from "../../Contexts/AuthContext";
const initialState = { email: "", password: "" };
export default function Login() {
  const [state, setState] = useState(initialState);
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const { setIsAuthenticated } = useAuthContext();
  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/auth.user
        const uid = user.uid;
        console.log("user : ", user);
        setUser(user);
        // ...
      } else {
        // User is signed out
        // ...
      }
    });
  }, []);

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  const Navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    console.log(state);

    const { email, password } = state;
    console.log("email : ", email, "password : ", password);

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Signed in
        const user = userCredential.user;
        window.toastify("User logged in successfuly!!", "success");
        setIsAuthenticated(true);
        Navigate("/");
        // ...
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        window.toastify(errorMessage, "error");
      })
      .finally(() => {
        setState(initialState);
        setIsLoading(false);
      });
  };

  


  return (
    <main style={{marginTop:"7rem"}}>
      <div className="py-5 w-100">
        <div className="container">
        
          {user.email ? (
            <div className="row">
              <div className="col text-center">
                <h2 className="text-white">User Email: {user.email}</h2>
                <h2 className="text-white">User UID: {user.uid}</h2>
                <h2 className="text-dark">
                  User Display Name: {user.displayName}
                </h2>
                
                <br />
              </div>
            </div>
          ) : (
            <div className="row">
              <div className="col-12 col-md-8 offset-md-2 col-lg-6 offset-lg-3">
                <div className="card p-2 p-md-4 p-lg-5 section-title">
                  <h2 className="text-center mb-4">Admin Login</h2>
                  <form onSubmit={handleSubmit}>
                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          name="email"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col">
                        <input
                          type="password"
                          className="form-control"
                          placeholder="Password"
                          name="password"
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                    <div className="row">
                      <div className="col text-center">
                        <button className="btn btn-outline-success w-50">
                          {!isLoading ? (
                            <span>Login</span>
                          ) : (
                            <div className="spinner spinner-grow spinner-grow-sm"></div>
                          )}
                        </button>
                        
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}