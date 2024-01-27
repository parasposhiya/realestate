import React from 'react';
import LoginImg from '../assets/login.webp';
import API from '../apilist.js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export default function Login() {

    const navigate = useNavigate();
    const [username, SetUsername] = React.useState("");
    const [password, SetPassword] = React.useState("");

    localStorage.clear();

    const HandleLogin = async (e) => {

        if (username !== "" && password !== "") {
            e.preventDefault();
            await axios(API.loginurl, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                data: JSON.stringify({
                    username: username,
                    password: password
                })
            })
                .then((response) => {

                    console.log('response =>', response);

                    if (response && response.data && !response.data.message) {
                        let authorization = response.data.accesstoken ? response.data.accesstoken : "";
                        let user = response.data.user ? response.data.user : "";

                        localStorage.setItem('authorization', authorization);
                        localStorage.setItem('user', JSON.stringify(user));
                        navigate("/dashboard");
                    } else {
                        window.alert("The user name or password is incorrect");
                    }



                })
                .catch((error) => {
                    console.log('HandleLogin Error =>', error);
                })
        }

    }

    return (
        <>
            <section className="vh-100" style={{ height: '100vh', width: '100vw' }}>
                <div className="container-fluid h-custom">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-md-9 col-lg-6 col-xl-5">
                            <img src={LoginImg}
                                className="img-fluid" alt="Login" />
                        </div>
                        <div className="col-md-8 col-lg-6 col-xl-4 offset-xl-1">
                            <form onClick={HandleLogin}>
                                <div className="form-outline mb-4">
                                    <label className="form-label" htmlFor="form3Example3">Email address</label>
                                    <input type="text" id="form3Example3" className="form-control form-control-lg"
                                        value={username}
                                        onChange={(e) => { SetUsername(e.target.value) }}
                                        placeholder="Enter a valid email address" />
                                </div>

                                <div className="form-outline mb-3">
                                    <label className="form-label" htmlFor="form3Example4">Password</label>
                                    <input type="password" id="form3Example4" className="form-control form-control-lg"
                                        value={password}
                                        onChange={(e) => { SetPassword(e.target.value) }}
                                        placeholder="Enter password" />
                                </div>

                                {/* <div className="d-flex justify-content-between align-items-center">
                                    <div className="form-check mb-0">
                                        <input className="form-check-input me-2" type="checkbox" value="" id="form2Example3" />
                                        <label className="form-check-label" htmlFor="form2Example3">
                                            Remember me
                                        </label>
                                    </div>
                                    <a href="#!" className="text-body">Forgot password?</a>
                                </div> */}

                                <div className="text-center text-lg-start mt-4 pt-2">

                                    <button type="submit" className="btn btn-primary btn-lg"
                                        style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}>
                                        Login
                                    </button>
                                    {/* <p className="small fw-bold mt-2 pt-1 mb-0">
                                        Don't have an account?
                                        <a href="#!" className="link-danger">
                                            Register
                                        </a>
                                    </p> */}
                                </div>

                            </form>
                        </div>
                    </div>
                </div>
                <div
                    className="d-flex flex-column flex-md-row text-center text-md-start justify-content-between py-4 px-4 px-xl-5 bg-primary">
                    <div className="text-white mb-3 mb-md-0">
                        Copyright © 2023. All rights reserved.
                    </div>

                    <div>
                        <a href="#!" className="text-white me-4">
                            <i className="fab fa-facebook-f"></i>
                        </a>
                        <a href="#!" className="text-white me-4">
                            <i className="fab fa-twitter"></i>
                        </a>
                        <a href="#!" className="text-white me-4">
                            <i className="fab fa-google"></i>
                        </a>
                        <a href="#!" className="text-white">
                            <i className="fab fa-linkedin-in"></i>
                        </a>
                    </div>
                </div>
            </section>
        </>
    );
}
