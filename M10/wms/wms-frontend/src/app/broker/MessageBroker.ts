type Listener = (message: object) => void;

export class MessageBroker {
  private channels: Record<string, Listener[]> = {};

  subscribe(topic: string, listener: Listener): () => void {
    if (!this.channels[topic]) {
      this.channels[topic] = [];
    }
    this.channels[topic].push(listener);

    // Return closure to unsubscribe
    return () => {
      this.channels[topic] = this.channels[topic].filter(l => l !== listener);
      if (this.channels[topic].length === 0) {
        delete this.channels[topic];
      }
    };
  }

  publish(topic: string, message: object): void {
    if (!this.channels[topic]) return;
    for (const listener of this.channels[topic]) {
      listener(message);
    }
  }
}
