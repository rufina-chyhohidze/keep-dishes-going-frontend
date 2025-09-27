import React from "react";
import {Link} from "react-router-dom";
import '../css/LandingPage.css';


const LandingPage: React.FC = () => {
    return (
        <div className="landing-container">
            <div className="landing-box">
                <h1>Welcome</h1>
                <p>Choose your role to get started:</p>
                <Link to="/restaurants">
                    <button>Continue as Customer</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;

