const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

// 1. 기본 설정을 불러옵니다.
const defaultConfig = getDefaultConfig(__dirname);

// 2. 기본 설정에서 assetExts 배열을 가져옵니다.
const {
  resolver: { assetExts },
} = defaultConfig;

// 3. 커스텀 설정을 정의합니다.
const config = {
  resolver: {
    // assetExts에 'html'과 'css'만 추가합니다. 'js'는 절대 넣으면 안 됩니다.
    assetExts: [...assetExts, 'html', 'css'],
  },
};

// 4. 기본 설정과 커스텀 설정을 병합하여 내보냅니다.
module.exports = mergeConfig(defaultConfig, config);
