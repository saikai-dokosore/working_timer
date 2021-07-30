import React, { useState, useEffect } from "react";
import axios from "axios";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import marked from "marked";

import { loadGoogleScript } from "./GoogleLogin";
const googleClientId =
  "910124176690-go4g2s66msipo9bfdmr8gr4232v9e78i.apps.googleusercontent.com";
const memoApiUrl =
  "https://script.googleapis.com/v1/scripts/AKfycbwCXY7YKm7S1VJv5xGItcsOJuT0JLuvM7wyrm8rrY6H9lcPZ99hGiU3MrRlwV6CKqXV7Q:run";
const API_KEY = "AIzaSyDeOz1nvw1M6om8N9xcoVJaXq2B8oDfgO0";
const scope = "https://www.googleapis.com/auth/spreadsheets";

const Home = () => {
  const [memo, setMemo] = useState("# メモ \n```\n初めまして、私は\n```");

  const [gapi, setGapi] = useState();
  const [googleAuth, setGoogleAuth] = useState();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState("");
  const [name, setName] = useState("name");
  const [email, setEmail] = useState("email");

  const onSuccess = (googleUser) => {
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    setName(profile.getName());
    setEmail(profile.getEmail());
    console.log(profile.getName() + " : " + profile.getEmail());
    setAccessToken(googleUser.Zb.access_token);
  };

  const onFailure = () => {
    setIsLoggedIn(false);
  };

  const renderSigninButton = (_gapi) => {
    _gapi.signin2.render("google-signin", {
      scope: scope,
      width: 240,
      height: 50,
      longtitle: true,
      theme: "dark",
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };
  const logOut = () => {
    (async () => {
      await googleAuth.signOut();
      setIsLoggedIn(false);
      renderSigninButton(gapi);
    })();
  };

  useEffect(() => {
    window.onGoogleScriptLoad = () => {
      const _gapi = window.gapi;
      setGapi(_gapi);

      _gapi.load("auth2", () => {
        (async () => {
          const _googleAuth = await _gapi.auth2.init({
            apiKey: API_KEY,
            client_id: googleClientId,
            scope: scope,
          });
          setGoogleAuth(_googleAuth);
          renderSigninButton(_gapi);
        })();
      });
    };

    loadGoogleScript();
  }, []);

  const saveMemo = () => {
    axios({
      method: "post",
      url: memoApiUrl,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: {
        function: "addMemo",
        parameters: [memo],
      },
    })
      .then((res) => {
        console.log("上書きテキスト：" + memo);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const readMemo = () => {
    axios({
      method: "post",
      url: memoApiUrl,
      headers: {
        Authorization: "Bearer " + accessToken,
        "Content-Type": "application/json",
      },
      data: {
        function: "readMemo",
        parameters: [],
      },
    })
      .then((res) => {
        console.log(res.data.error);
        //setMemo(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="homeItems">
      {!isLoggedIn && <div id="google-signin"></div>}
      <div className="homeMemo">
        <div className="homeMemoBoxEdit">
          <SimpleMDE value={memo} onChange={(e) => setMemo(e)} />
          <button
            onClick={() => {
              readMemo();
            }}
          >
            同期
          </button>
          <button
            onClick={() => {
              saveMemo();
            }}
          >
            上書き
          </button>
          <button
            onClick={() => {
              logOut();
            }}
          >
            Logout
          </button>
        </div>
        <div className="homeMemoBoxView">
          <span dangerouslySetInnerHTML={{ __html: marked(memo) }} />
        </div>
      </div>
    </div>
  );
};

export default Home;
