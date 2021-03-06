class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(eventName, fn, options) {
    if (!this.events.has(eventName)) {
      this.events.set(eventName, []);
    }

    this.events.get(eventName).push({ fn, options });
  }

  off(eventName, fn) {
    const handlers = this.events
      .get(eventName)
      .filter((handler) => handler.fn !== fn);

    this.events.set(eventName, handlers);
  }

  clear() {
    this.events.clear();
  }

  delete(eventName) {
    this.events.delete(eventName);
  }

  emit(eventName, payload = null) {
    const handlers = this.events.get(eventName) || [];

    handlers.forEach((handler) => {
      handler.fn.call(null, payload);

      if (handler.options && handler.options.once) {
        this.off(eventName, handler.fn);
      }
    });
  }
}

const event = new EventEmitter();

export default event;
