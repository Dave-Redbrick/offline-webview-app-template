import React from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

// 1. 플랫폼에 따라 로컬 파일의 URI를 다르게 설정합니다.
const sourceUri = { uri: 'file:///android_asset/web/index.html' };

function App() {
  // 로드할 소스가 없다면 에러 메시지를 표시할 수 있습니다.
  if (!sourceUri) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>웹뷰를 로드할 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <WebView
      style={{ flex: 1 }}
      // 2. 위에서 설정한 sourceUri를 사용합니다.
      source={sourceUri}
      originWhitelist={['*']}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      allowFileAccess={true}
      allowFileAccessFromFileURLs={true}
      allowUniversalAccessFromFileURLs={true}
      onError={event => console.error('WebView Error:', event.nativeEvent)}
    />
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24, color: 'black' },
});

export default App;
