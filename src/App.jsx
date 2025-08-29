import React, { useState, useRef } from "react";

export default function App() {
  const [waitingForClick, setWaitingForClick] = useState(false);
  const clickCount = useRef(0);
  const timer = useRef(null);

  async function sendCoordinates(x, y, task) {
    try {
      const res = await fetch("http://localhost:5000/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ x, y, task })
      });

      const data = await res.json();
      console.log("Response from Python:", data);
    } catch (error) {
      console.error("Error sending coordinates:", error);
    }
  }

  function handleClick(e) {
    const x = e.screenX;
    const y = e.screenY;
    const task = "moveTo";

    clickCount.current += 1;
    sendCoordinates(x, y, task);

    if (clickCount.current === 1) {
      timer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      clearTimeout(timer.current);
      clickCount.current = 0;
      setWaitingForClick(false);
      console.log("Double click detected, executing tasks...");

      // שולח בקשה לשרת להפעיל את doList()
      (async () => {
        try {
          const res = await fetch("http://localhost:5000/execute", { method: "POST" });
          const data = await res.json();
          console.log("Execute response:", data);
        } catch (err) {
          console.error("Error calling /execute:", err);
        }
      })();
    }
  }

  return (
    <>
      <h1>hi</h1>
      <button onClick={() => setWaitingForClick(true)}>הזזה</button>

      {waitingForClick && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.2)",
            cursor: "crosshair"
          }}
          onClick={handleClick}
        />
      )}
    </>
  );
}
