import type { NextApiRequest, NextApiResponse } from "next";
import sqlite3 from "sqlite3";
import { open } from "sqlite";
import path from 'path';

interface Stat {
  serverName: string;
  userName: string;
  amount: number;
  side: string;
}

async function getStats(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    res?.status(405).json({ message: "Method not allowed" });
    return;
  }

  const db = await open({
    filename: path.join("/tmp", "stats.db"),
    driver: sqlite3.Database,
  });

  const stats: Stat[] = await db.all(
    `
    SELECT server_name as serverName, user_name as userName, amount, side
    FROM stats
  `
  );

  res.status(200).json(stats);
}

export default getStats;
