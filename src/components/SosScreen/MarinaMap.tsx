import React from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

const EMBED_URL =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1944.1720238824046!2d80.18278093519574!3d12.949822861828878!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525fc59f87dbd3%3A0x5c81dab0c9af94da!2sPatron%20International!5e0!3m2!1sen!2sin!4v1750313647179!5m2!1sen!2sin';

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
      height="100%"
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
    <WebView originWhitelist={['*']} source={{ html }} style={styles.map} />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
});

export default MarinaMap;
