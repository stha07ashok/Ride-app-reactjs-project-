import type { Ride } from "../types/types";

type Handler = (payload: any) => void;

class Realtime {
  private bc: BroadcastChannel | null = null;
  private handlers: Map<string, Set<Handler>> = new Map();

  constructor(channel = "namlo-rides") {
    if (typeof window !== "undefined" && "BroadcastChannel" in window) {
      this.bc = new BroadcastChannel(channel);
      this.bc.onmessage = (ev) => this.handleMessage(ev.data);
    }
  }

  private handleMessage(data: any) {
    try {
      const { type, payload } = data;
      const set = this.handlers.get(type);
      set?.forEach((h) => h(payload));
    } catch (e) {
      // ignore
    }
  }

  on(type: string, handler: Handler) {
    const set = this.handlers.get(type) ?? new Set();
    set.add(handler);
    this.handlers.set(type, set);
    return () => set.delete(handler);
  }

  emit(type: string, payload: any) {
    const message = { type, payload };
    if (this.bc) {
      // BroadcastChannel will deliver the message to all contexts (including this one),
      // so don't call handlers directly here to avoid duplicate invocations.
      this.bc.postMessage(message);
    } else {
      // Fallback: directly invoke handlers when BroadcastChannel isn't available
      const set = this.handlers.get(type);
      set?.forEach((h) => h(payload));
    }
  }

  close() {
    this.bc?.close();
    this.handlers.clear();
  }
}

export const realtime = new Realtime();

// helper events: request, update, accept, complete, cancel
export function publishRequest(ride: Ride) {
  realtime.emit("request", ride);
}

export function publishUpdate(ride: Ride) {
  realtime.emit("update", ride);
}

export function publishAccept(ride: Ride) {
  realtime.emit("accept", ride);
}

export function publishComplete(ride: Ride) {
  realtime.emit("complete", ride);
}

export function publishCancel(ride: Ride) {
  realtime.emit("cancel", ride);
}

export function onRequest(handler: (r: Ride) => void) {
  return realtime.on("request", handler);
}

export function onUpdate(handler: (r: Ride) => void) {
  return realtime.on("update", handler);
}

export function onAccept(handler: (r: Ride) => void) {
  return realtime.on("accept", handler);
}

export function onComplete(handler: (r: Ride) => void) {
  return realtime.on("complete", handler);
}

export function onCancel(handler: (r: Ride) => void) {
  return realtime.on("cancel", handler);
}
