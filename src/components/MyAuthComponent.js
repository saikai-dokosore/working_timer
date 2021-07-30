import { useGoogleApi } from "react-gapi";

export function MyAuthComponent() {
  const gapi = useGoogleApi({
    scopes: ["spreadsheets"],
  });

  const auth = gapi?.auth2.getAuthInstance();
  console.log(auth);

  return (
    <div>
      {!auth ? (
        <span>Loading...</span>
      ) : auth?.isSignedIn.get() ? (
        `Logged in as "${auth.currentUser.get().getBasicProfile().getName()}"`
      ) : (
        <button onClick={() => auth.signIn()}>Login</button>
      )}
    </div>
  );
}
