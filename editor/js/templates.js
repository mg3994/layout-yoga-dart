/**
 * Preset Responsive Layout Templates
 */
const PRESET_TEMPLATES = {
  loginScreen: {
    version: "1.0.0",
    screenName: "LoginScreen",
    dartModule: "LoginController",
    root: {
      id: "rootLoginContainer",
      type: "Container",
      props: { backgroundColor: "#0f172a" },
      style: {
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "stretch",
        flexGrow: 1,
        padding: 24,
        rowGap: 16
      },
      children: [
        {
          id: "appLogoText",
          type: "Text",
          props: { text: "Welcome Back ⚡", textColor: "#ffffff", fontSize: 24 },
          style: { alignSelf: "center", margin: 12 }
        },
        {
          id: "emailInput",
          type: "TextInput",
          props: { placeholder: "Email Address", borderRadius: 8 },
          bindings: { onChanged: "onEmailInputChanged" },
          style: { height: 48 }
        },
        {
          id: "passwordInput",
          type: "TextInput",
          props: { placeholder: "Password", borderRadius: 8 },
          bindings: { onChanged: "onPasswordInputChanged" },
          style: { height: 48 }
        },
        {
          id: "loginButton",
          type: "Button",
          props: { text: "Sign In with DartNative", backgroundColor: "#6366f1", textColor: "#ffffff", borderRadius: 8 },
          bindings: { onClick: "handleLoginPress" },
          style: { height: 48, justifyContent: "center", alignItems: "center" }
        }
      ]
    }
  },

  settingsMenu: {
    version: "1.0.0",
    screenName: "SettingsScreen",
    dartModule: "SettingsController",
    root: {
      id: "rootSettingsContainer",
      type: "Container",
      props: { backgroundColor: "#f8fafc" },
      style: {
        flexDirection: "column",
        flexGrow: 1,
        padding: 16,
        rowGap: 12
      },
      children: [
        {
          id: "settingsHeader",
          type: "Text",
          props: { text: "Account Settings", textColor: "#0f172a", fontSize: 20 },
          style: { margin: 8 }
        },
        {
          id: "profileTile",
          type: "Container",
          props: { backgroundColor: "#ffffff", borderRadius: 10 },
          style: { flexDirection: "row", alignItems: "center", padding: 14, columnGap: 12 },
          children: [
            {
              id: "profileIcon",
              type: "Text",
              props: { text: "👤", fontSize: 20 },
              style: {}
            },
            {
              id: "profileLabel",
              type: "Text",
              props: { text: "Edit Profile Info", textColor: "#334155", fontSize: 16 },
              style: { flexGrow: 1 }
            }
          ]
        },
        {
          id: "notificationsTile",
          type: "Container",
          props: { backgroundColor: "#ffffff", borderRadius: 10 },
          style: { flexDirection: "row", alignItems: "center", padding: 14, columnGap: 12 },
          children: [
            {
              id: "notiIcon",
              type: "Text",
              props: { text: "🔔", fontSize: 20 },
              style: {}
            },
            {
              id: "notiLabel",
              type: "Text",
              props: { text: "Push Notifications", textColor: "#334155", fontSize: 16 },
              style: { flexGrow: 1 }
            }
          ]
        }
      ]
    }
  }
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = PRESET_TEMPLATES;
}
