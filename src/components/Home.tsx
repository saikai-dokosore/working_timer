import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { loadGoogleScript } from './GoogleLogin';

import { Tool } from 'react-feather';
import { XCircle } from 'react-feather';
import { ArrowDownCircle } from 'react-feather';
import { ArrowUpCircle } from 'react-feather';

const googleClientId =
  '910124176690-go4g2s66msipo9bfdmr8gr4232v9e78i.apps.googleusercontent.com';
const memoApiUrl =
  'https://script.googleapis.com/v1/scripts/AKfycbwCXY7YKm7S1VJv5xGItcsOJuT0JLuvM7wyrm8rrY6H9lcPZ99hGiU3MrRlwV6CKqXV7Q:run';
const OAUTH_API_KEY = process.env.OAUTH_API_KEY;
const scope = 'https://www.googleapis.com/auth/spreadsheets';

interface Window {
  onGoogleScriptLoad: any;
  gapi: any;
}
declare const window: Window;

interface Props {
  children?: React.ReactNode;
}

const Home: React.FC<Props> = () => {
  const [memo, setMemo] = useState('# memo');
  const [gapi, setGapi] = useState<any>();
  const [googleAuth, setGoogleAuth] = useState<any>();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  const onSuccess = (googleUser: any): void => {
    setIsLoggedIn(true);
    const profile = googleUser.getBasicProfile();
    console.log(profile.getName() + ' : ' + profile.getEmail());
    setAccessToken(googleUser.Zb.access_token);
  };

  const onFailure = (): void => {
    setIsLoggedIn(false);
  };

  const renderSigninButton = (_gapi: any): void => {
    _gapi.signin2.render('google-signin', {
      scope: scope,
      width: 240,
      height: 50,
      longtitle: true,
      theme: 'light',
      onsuccess: onSuccess,
      onfailure: onFailure,
    });
  };
  const logOut = (): void => {
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

      _gapi.load('auth2', () => {
        (async () => {
          const _googleAuth = await _gapi.auth2.init({
            apiKey: OAUTH_API_KEY,
            client_id: googleClientId,
            scope: scope,
          });
          setGoogleAuth(_googleAuth);
          renderSigninButton(_gapi);
        })();
      });
    };

    loadGoogleScript();

    const localMemo: string | null = localStorage.getItem('memo');
    if (localMemo) {
      setMemo(localMemo);
    }
  }, []);

  const addMemo = (): void => {
    axios({
      method: 'post',
      url: memoApiUrl,
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      data: {
        function: 'addMemo',
        parameters: [memo.toString()],
      },
    })
      .then((res) => {
        console.log('上書きテキスト：' + memo);
        console.log(res);
        editing(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const readMemo = (): void => {
    axios({
      method: 'post',
      url: memoApiUrl,
      headers: {
        Authorization: 'Bearer ' + accessToken,
        'Content-Type': 'application/json',
      },
      data: {
        function: 'readMemo',
        parameters: [],
      },
    })
      .then((res) => {
        console.log(res.data.response.result.toString());
        setMemo(res.data.response.result.toString());
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const saveMemo = (m: string): void => {
    setMemo(m);
    localStorage.setItem('memo', memo);
    editing(true);
  };

  const modal: HTMLInputElement = document.getElementById(
    'homeSettingModal'
  ) as HTMLInputElement;

  const openSettingModal = (): void => {
    modal.style.display = 'flex';
  };
  const closeSettingModal = (): void => {
    modal.style.display = 'none';
  };

  const uploadBtn: HTMLInputElement = document.getElementById(
    'homeHeaderUpload'
  ) as HTMLInputElement;

  const editing = (b: boolean): void => {
    if (b) {
      uploadBtn.style.color = '#61C6FF';
    } else {
      uploadBtn.style.color = '#9c9c9c';
    }
  };

  return (
    <div className="homeItems">
      <div className="homeHeader">
        <div className="homeHeaderTitle">
          <h1>Working</h1>
        </div>
        <div className="homeHeaderBtnBox">
          <button className="homeHeaderDownload" onClick={() => readMemo()}>
            <ArrowDownCircle size="30px" />
          </button>
          <button
            id="homeHeaderUpload"
            className="homeHeaderUpload"
            onClick={() => addMemo()}>
            <ArrowUpCircle size="30px" />
          </button>
          <button
            className="homeHeaderSetting"
            onClick={() => {
              openSettingModal();
            }}>
            <Tool />
          </button>
        </div>
      </div>
      <div className="homeSettingModal" id="homeSettingModal">
        <button
          className="homeSettingModalLogout"
          onClick={() => {
            logOut();
            closeSettingModal();
          }}>
          Logout
        </button>
        <button
          className="homeSettingModalClose"
          onClick={() => {
            closeSettingModal();
          }}>
          <XCircle />
        </button>
      </div>
      {!isLoggedIn && <div id="google-signin"></div>}
      <div className="homeMemo">
        <div className="timer">this is timer</div>
        <div className="homeMemoBoxEdit">
          <SimpleMDE value={memo} onChange={(e) => saveMemo(e)} />
        </div>
      </div>
    </div>
  );
};

export default Home;
