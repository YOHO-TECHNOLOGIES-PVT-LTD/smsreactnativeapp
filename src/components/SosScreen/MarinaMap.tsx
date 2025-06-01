import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31109.84723617997!2d80.27598539999999!3d13.0474877!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a5267d1126df05f%3A0xd1b67a0fa979a9f4!2sMarina%20Beach!5e0!3m2!1sen!2sin!4v1717052098230!5m2!1sen!2sin';

const html = `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>html,body{margin:0;padding:0;height:100%;}</style>
  </head>
  <body>
    <iframe
      src="${EMBED_URL}"
      width="100%"
      height="50%"
      frameborder="0"
      style="border:0;"
      allowfullscreen
      loading="lazy">
    </iframe>
  </body>
</html>
`;

const MarinaMap = () => (
  <View style={styles.container}>
    <WebView
      originWhitelist={['*']}
      source={{ html }}
      style={styles.map}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },

});

export default MarinaMap;
