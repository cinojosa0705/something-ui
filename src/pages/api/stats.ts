import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path';

const API_KEY = "yoyo-nono-yolo-nolo-ahhh-7777";

interface ErrorWithMessage extends Error {
  message: string;
}

interface dataBlock {
  apiKey: string;
  userId: string;
  userName: string;
  serverId: string;
  serverName: string;
  amount: string;
  side: string;
}

async function saveData(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      res?.status(405).json({ message: "Method not allowed" });
      return;
    }

    const data: dataBlock = req.body as dataBlock;

    if (data.apiKey !== API_KEY) {
      res.status(403).json({ message: "Invalid API key" });
      return;
    }

    const db = await open({
      filename: path.join("/tmp", "stats.db"),
      driver: sqlite3.Database,
    });

    await db.exec(`
            CREATE TABLE IF NOT EXISTS stats (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id TEXT,
            user_name TEXT,
            server_id TEXT,
            server_name TEXT,
            amount REAL,
            side TEXT
            )
        `);

    const result = await db.run(
      `
            INSERT INTO stats (user_id, user_name, server_id, server_name, amount, side)
            VALUES (?, ?, ?, ?, ?, ?)
        `,
      [
        data.userId,
        data.userName,
        data.serverId,
        data.serverName,
        data.amount,
        data.side,
      ]
    );

    res.status(200).json({ message: "Data saved successfully", result });
  } catch (error) {
    const typedError: ErrorWithMessage = error as ErrorWithMessage;
    console.error("Error in saveData API: ", typedError);
    res
      .status(500)
      .json({ message: "Internal Server Error", error: typedError.message });
  }
}

export default saveData;
