import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import marked from "marked";

import { loadGoogleScript } from "./GoogleLogin";
const googleClientId =
  "910124176690-go4g2s66msipo9bfdmr8gr4232v9e78i.apps.googleusercontent.com";

const Home = () => {
  const [memo, setMemo] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const CLIENT_ID =
    "910124176690-go4g2s66msipo9bfdmr8gr4232v9e78i.apps.googleusercontent.com";
  const API_KEY = "AIzaSyDeOz1nvw1M6om8N9xcoVJaXq2B8oDfgO0";
  const scriptId = "1mVWj2_ScthdTtdrunyoGSZcfop9JyddBMmpLJUUU1P2F0A4MK7EgL5NF";
  const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

  const [gapi, setGapi] = useState();
  const [googleAuth, setGoogleAuth] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [imageUrl, setImageUrl] = useState();

  const onSuccess = (googleUser) => {
    // (Ref. 7)
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
    setEmail(profile.getEmail());
    setImageUrl(profile.getImageUrl());
  };

  const onFailure = () => {
    setIsLoggedIn(false);
  };

  const logOut = () => {
    // (Ref. 8)
    (async () => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };

  const renderSigninButton = (_gapi) => {
    // (Ref. 6)
    _gapi.signin2.render("google-signin", {
      scope: "profile email",
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };

  useEffect(() => {
    // Window.gapi is available at this point
    window.onGoogleScriptLoad = () => {
      // (Ref. 1)

      const _gapi = window.gapi; // (Ref. 2)
      setGapi(_gapi);

      _gapi.load("auth2", () => {
        // (Ref. 3)
        (async () => {
          const _googleAuth = await _gapi.auth2.init({
            // (Ref. 4)
            client_id: googleClientId,
          });
          setGoogleAuth(_googleAuth); // (Ref. 5)
          renderSigninButton(_gapi); // (Ref. 6)
        })();
      });
    };

    // Ensure everything is set before loading the script
    loadGoogleScript(); // (Ref. 9)
  }, []);

  const saveMemo = (m) => {
    setMemo(m);
  };

  return (
    <div className="homeItems">
      {!isLoggedIn && <div id="google-signin"></div>}

      {isLoggedIn && (
        <div>
          <div>
            <img src={imageUrl} />
          </div>
          <div>{name}</div>
          <div>{email}</div>
          <button className="btn-primary" onClick={logOut}>
            Log Out
          </button>
        </div>
      )}
      <div className="homeMemo">
        <div className="homeMemoBoxEdit">
          <SimpleMDE value={memo} onChange={(e) => saveMemo(e)} />
        </div>
        <div className="homeMemoBoxView">
          <span dangerouslySetInnerHTML={{ __html: marked(memo) }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
