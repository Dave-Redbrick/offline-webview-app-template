import StaticServer from 'react-native-static-server';
import { Platform } from 'react-native';

class WebViewServer {
  private static instance: WebViewServer;
  private server: StaticServer | null = null;
  public url: string | null = null;

  private constructor() {}

  static getInstance(): WebViewServer {
    if (!WebViewServer.instance) {
      WebViewServer.instance = new WebViewServer();
    }
    return WebViewServer.instance;
  }

  async start() {
    if (this.server) return this.url;

    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      this.server = new StaticServer(8080, 'assets/web', { localOnly: true });
      this.url = await this.server.start();
      return this.url;
    }
    return null;
  }

  stop() {
    if (this.server) {
      this.server.stop();
      this.server = null;
      this.url = null;
    }
  }
}

export default WebViewServer.getInstance();
