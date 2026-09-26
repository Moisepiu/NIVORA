const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/risk", (req, res) => {
  const balance = Number(req.body.balance);
  const entry = Number(req.body.entry);
  const stop = Number(req.body.stop);

  if (![balance, entry, stop].every(Number.isFinite) || balance <= 0 || entry <= 0 || stop <= 0) {
    return res.status(400).json({ error: "Inserisci valori validi." });
  }

  const riskMoney = balance * 0.01;
  const riskPerUnit = Math.abs(entry - stop);

  if (riskPerUnit === 0) {
    return res.status(400).json({ error: "Entry e stop loss non possono coincidere." });
  }

  const quantity = riskMoney / riskPerUnit;
  res.json({ riskMoney, riskPerUnit, quantity });
});

app.get("/health", (_req, res) => res.json({ status: "ok", mode: "paper/backtest" }));

app.listen(PORT, () => {
  console.log(`NIVORA Trade server listening on port ${PORT}`);
});
