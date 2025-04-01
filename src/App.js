import React, { useState, useEffect } from "react";
import { servers } from "./servers";

function App() {
  const [serverStatus, setServerStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServerStatus = async () => {
    setLoading(true);
    const statusResults = await Promise.all(
      servers.map(async (server) => {
        try {
          const response = await fetch(server.adr);
          return { ...server, status: response.status === 200 };
        } catch (error) {
          return { ...server, status: false };
        }
      })
    );
    setServerStatus(statusResults);
    setLoading(false);
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date().toLocaleTimeString();
      const digitalClock = document.getElementById("digitalClock");
      if (digitalClock) digitalClock.textContent = now;
    };
    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const getDomain = (url) => new URL(url).hostname;

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f4f4f9",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <header
        style={{
          backgroundColor: "#282c34",
          padding: "20px",
          color: "white",
          borderRadius: "10px",
          marginBottom: "20px",
        }}
      >
        <h1>Thinkzone Server's Status</h1>
        <div>
          <span
            id="digitalClock"
            style={{ fontSize: "20px", marginRight: "10px" }}
          ></span>
          <button
            onClick={fetchServerStatus}
            style={{
              padding: "10px 20px",
              backgroundColor: "#61dafb",
              border: "none",
              cursor: "pointer",
              borderRadius: "5px",
              fontSize: "16px",
              transition: "0.3s ease-in-out",
              boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
            }}
          >
            Refresh
          </button>
        </div>
      </header>
      {loading ? (
        <div
          style={{
            padding: "50px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
          }}
        >
          Loading...
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "20px",
            padding: "20px",
          }}
        >
          {serverStatus.map((server) => (
            <div
              key={server.adr}
              style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "20px",
                textAlign: "center",
                backgroundColor: server.status ? "#d4edda" : "#f8d7da",
                transition: "0.3s ease-in-out",
                boxShadow: "2px 2px 10px rgba(0,0,0,0.2)",
              }}
            >
              <div>
                <i
                  className={server.icon}
                  style={{ fontSize: "28px", marginBottom: "10px" }}
                ></i>
              </div>
              <h3 style={{ marginBottom: "5px" }}>{server.name}</h3>
              <p
                style={{
                  fontWeight: "bold",
                  fontSize: "18px",
                  color: server.status ? "green" : "red",
                  marginBottom: "5px",
                }}
              >
                {server.status ? "ONLINE" : "OFFLINE"}
              </p>
              <p style={{ fontSize: "14px", color: "#555" }}>
                {getDomain(server.adr)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
