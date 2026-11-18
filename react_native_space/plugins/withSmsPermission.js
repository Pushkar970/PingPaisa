const { withAndroidManifest } = require('@expo/config-plugins');

module.exports = function withSmsPermission(config) {
  return withAndroidManifest(config, async (cfg) => {
    const manifest = cfg.modResults.manifest;

    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    const perms = ['android.permission.READ_SMS'];

    perms.forEach((perm) => {
      const exists = manifest['uses-permission'].some(
        (p) => p?.$?.['android:name'] === perm,
      );
      if (!exists) {
        manifest['uses-permission'].push({ $: { 'android:name': perm } });
      }
    });

    return cfg;
  });
};
