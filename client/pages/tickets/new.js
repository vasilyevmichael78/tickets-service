import React, { useState } from "react";
import useRequest from "../../hooks/use-request";
import Router from "next/router";

const NewTicket = (props) => {
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const { doRequest, errors } = useRequest({
    url: "/api/tickets",
    method: "post",
    body: {
      title,
      price,
    },
    onSuccess: async () => {
      await Router.push("/");
    },
  });
  const onSubmit = async (event) => {
    event.preventDefault();
    await doRequest();
  };
  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) return;
    setPrice(value.toFixed(2));
  };
  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            value={price}
            onBlur={onBlur}
            onChange={(e) => setPrice(e.target.value)}
            className="form-control"
          />
        </div>
        <button type="submit" className="btn btn-primary m-1">
          Submit
        </button>
        {errors}
      </form>
    </div>
  );
};

export default NewTicket;
