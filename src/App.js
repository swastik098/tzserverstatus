import React, { useState, useEffect } from "react";
import "./App.css";
import { servers } from "./servers";

function App() {
  const [serverStatus, setServerStatus] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServerStatus = async () => {
    setLoading(true);

    const statusResults = [];
    for (let server of servers) {
      try {
        const response = await fetch(server.adr);
        statusResults.push({ url: server.adr, status: response.status });
      } catch (error) {
        statusResults.push({ url: server.adr, error: error.message });
      }
    }

    const updatedServers = servers.map((server, index) => ({
      ...server,
      status: statusResults[index].status === 200,
    }));

    setServerStatus(updatedServers);
    setLoading(false);
  };

  useEffect(() => {
    fetchServerStatus();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      const digitalClock = document.getElementById("digitalClock");
      if (digitalClock) {
        digitalClock.textContent = `${hours}:${minutes}:${seconds}`;
      }
    };

    updateClock();
    const clockInterval = setInterval(updateClock, 1000);
    return () => clearInterval(clockInterval);
  }, []);

  const getDomain = (url) => {
    const hostname = new URL(url).hostname;
    return hostname;
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>Thinkzone Server Status</h1>
          <div className="clock-refresh">
            <div id="digitalClock" className="digital-clock"></div>
            <button onClick={fetchServerStatus} className="refresh-button">
              <i className="fa fa-refresh"></i> Refresh
            </button>
          </div>
        </div>
      </header>
      {loading ? (
        <div className="loader-container">
          <div className="loader"></div>
        </div>
      ) : (
        <div id="serverList" className="server-list">
          {serverStatus.map((server) => (
            <div
              key={server.adr}
              className={`server ${server.status ? "" : "has-failed"}`}
            >
              <span className="server-icon">
                <i className={server.icon}></i>
              </span>
              <ul className="server-details">
                <li>
                  <span className="data">{server.name}</span>
                </li>
                <li>
                  <span className="data signal">
                    {server.status ? "ONLINE" : "OFFLINE"}
                  </span>
                </li>
                <li>
                  <span className="data">{getDomain(server.adr)}</span>
                </li>
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
