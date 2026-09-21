import { Response } from 'express';
import { db } from './db';

interface Client {
  id: string;
  res: Response;
}

class SyncManager {
  private clients: Client[] = [];

  constructor() {
    // Keep alive heartbeat every 25 seconds
    setInterval(() => {
      this.sendHeartbeat();
    }, 25000);
  }

  public addClient(res: Response): string {
    const id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    this.clients.push({ id, res });

    // Send initial version handshake
    res.write(`event: init\ndata: ${JSON.stringify({ version: db.getVersion(), timestamp: new Date().toISOString() })}\n\n`);

    return id;
  }

  public removeClient(id: string) {
    this.clients = this.clients.filter(c => c.id !== id);
  }

  public broadcast(event: string, payload: any) {
    const data = JSON.stringify({
      version: db.getVersion(),
      timestamp: new Date().toISOString(),
      ...payload
    });

    for (const client of this.clients) {
      try {
        client.res.write(`event: ${event}\ndata: ${data}\n\n`);
      } catch (err) {
        // Handled on close
      }
    }
  }

  private sendHeartbeat() {
    for (const client of this.clients) {
      try {
        client.res.write(`: heartbeat\n\n`);
      } catch (_) {}
    }
  }

  public getClientCount(): number {
    return this.clients.length;
  }
}

export const syncManager = new SyncManager();
