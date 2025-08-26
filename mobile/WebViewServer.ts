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
      try {
        console.log('[WebViewServer] Starting server...'); // ◀️ 로그 추가

        this.server = new StaticServer(8080, 'web', {
          localOnly: true,
        });

        console.log(this.server); // ◀️ 서버 인스턴스 로그 추가

        this.url = await this.server.start();

        console.log('[WebViewServer] Server started at URL:', this.url); // ◀️ 로그 추가
        return this.url;
      } catch (error) {
        console.error('[WebViewServer] Error starting server:', error); // ◀️ 에러 로그 추가
      }
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
