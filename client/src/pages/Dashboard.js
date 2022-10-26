import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

function Dashboard() {
  const [quote, setQuote] = React.useState("");
  const [tempQuote, setTempQuote] = React.useState("");

  async function populateQuotes() {
    const dataQ = await fetch("http://localhost:5000/api/populateQuotes", {
      headers: {
        "x-access-token": localStorage.getItem("token"),
      },
    }).then((res) => res.json());
    console.log(dataQ);
    if (dataQ.status === "ok") {
      setQuote(dataQ.quotes);
    } else {
      alert("Error Quotes");
    }
  }
  async function addQuotes(event) {
    event.preventDefault();
    const dataQ = await fetch("http://localhost:5000/api/addQuotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-access-token": localStorage.getItem("token"),
      },
      body: JSON.stringify({
        quote: tempQuote,
      }),
    }).then((res) => res.json());
    console.log(dataQ);
    if (dataQ.status === "ok") {
      setQuote(dataQ.quotes);
      setTempQuote(dataQ.quotes);
    } else {
      alert("Error Quotes");
    }
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = JSON.parse(atob(token.split(".")[1]));
      console.log(user, token);
      if (user) {
        populateQuotes(user);
      } else {
        //window.location.href = "/login";
        localStorage.removeItem("token");
        Navigate("/login");
      }
    }
  }, []);
  return (
    <div>
      <h1>Your quote is: {quote || "Quote not found"}</h1>
      <form onSubmit={addQuotes}>
        <input
          type="text"
          placeholder="Quote"
          value={tempQuote}
          onChange={(e) => setTempQuote(e.target.value)}
        />
        <button type="submit">Add Quote</button>
      </form>
    </div>
  );
}
export default Dashboard;
