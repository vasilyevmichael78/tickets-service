import { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/users/signin",
    body: { email, password },
    method: "post",
    onSuccess: () => Router.push("/"),
  });
  const onSubmit = async (e) => {
    e.preventDefault();

    await doRequest();

    setPassword("");
    setEmail("");
  };

  return (
    <div className="container container-sm">
      <form onSubmit={onSubmit}>
        <h1>Sign In</h1>
        <div className="form-group">
          <label>Email Address</label>
          <input
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            type="text"
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type="password"
            className="form-control"
          />
        </div>
        {errors}

        <button className="btn btn-primary p-2 m-2">Sign In</button>
      </form>
    </div>
  );
};
export default SignIn;
