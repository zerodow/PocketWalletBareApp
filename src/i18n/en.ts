// Translation keys for English locale
const en = {
  common: {
    ok: "OK!",
    cancel: "Cancel",
    back: "Back",
    logOut: "Log Out",
  },
  errorScreen: {
    title: "Something went wrong!",
    friendlySubtitle: "An error has occurred. Please try again.",
    reset: "RESET APP",
    traceTitle: "Error from %{name} stack",
  },
  loginScreen: {
    title: "Welcome Back",
    subtitle: "Sign in to access your Pocket Wallet",
    emailLabel: "Email",
    emailPlaceholder: "Email",
    emailRequired: "Email is required",
    passwordLabel: "Password",
    passwordPlaceholder: "Password",
    passwordRequired: "Password is required",
    signInButton: "Sign In",
    signingInButton: "Signing In...",
    quickDemoButton: "Quick Demo Login",
    loginFailed: "Login failed",
    helpText: "Mock Authentication: Enter any non-empty email and password to login",
  },
}

export default en
export type Translations = typeof en
