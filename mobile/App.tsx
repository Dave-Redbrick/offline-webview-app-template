import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';
import WebViewServer from './WebViewServer';

export default function App() {
  const [url, setUrl] = useState<string | null>(null);

  useEffect(() => {
    WebViewServer.start().then((u) => setUrl(u));

    return () => {
      WebViewServer.stop();
    };
  }, []);

  if (!url) {
    return (
      <View style={styles.loading}>
        <Text>서버 시작 중...</Text>
      </View>
    );
  }

  return (
    <WebView
      source={{ uri: url }}
      style={styles.webview}
      originWhitelist={['*']}
      allowFileAccess
    />
  );
}

const styles = StyleSheet.create({
  webview: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
