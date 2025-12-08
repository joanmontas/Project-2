import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "./other/Button";
import Navbar from "./Navbar";
import {auth} from  "../firebase.js"
import './About.css';
import firebase from "firebase/compat/app";

function About() {



    return (
        <>

            <Navbar isLoggedIn={auth.currentUser === null}/>

            <div>
                <h1 className="about-header">About BibTex Generator</h1>
                <p className="about-paragraph">
                    BibTex Generator is an online reasource, 
                    made to assist in the formatting of bibliography 
                    on webpages.
                </p>
                
            
            
            </div>


        </>
    )
}

export default About;