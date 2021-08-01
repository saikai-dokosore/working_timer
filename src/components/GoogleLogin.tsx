interface Window {
  onGoogleScriptLoad: any;
}
declare const window: Window;

export const loadGoogleScript = () => {
  (function () {
    const id = 'google-js';
    const src = 'https://apis.google.com/js/platform.js';

    const firstJs: any = document.getElementsByTagName('script')[0];

    if (document.getElementById(id)) {
      return;
    }
    const js = document.createElement('script');
    js.id = id;
    js.src = src;
    js.onload = window.onGoogleScriptLoad;
    firstJs.parentNode.insertBefore(js, firstJs);
  })();
};
