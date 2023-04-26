import { NextApiRequest, NextApiResponse } from 'next';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

const API_KEY = 'yoyo-nono-yolo-nolo-ahhh-7777';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method not allowed' });
    return;
  }

  const { apiKey, userId, userName, serverId, serverName, amount, side } = req.body;

  if (apiKey !== API_KEY) {
    res.status(403).json({ message: 'Invalid API key' });
    return;
  }

  const db = await open({
    filename: 'stats.db',
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
      side TEXT,
    )
  `);

  const result = await db.run(`
    INSERT INTO stats (user_id, user_name, server_id, server_name, amount, side)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `, [userId, userName, serverId, serverName, amount, side]);

  res.status(200).json({ message: 'Data saved successfully', result });
};
