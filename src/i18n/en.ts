// Translation keys for English locale
const en = {
  common: {
    ok: 'OK!',
    cancel: 'Cancel',
    back: 'Back',
    logOut: 'Log Out',
  },
  tabs: {
    home: 'Home',
    transactions: 'Transactions',
    add: 'Add',
    analytics: 'Analytics',
    settings: 'Settings',
  },
  errorScreen: {
    title: 'Something went wrong!',
    friendlySubtitle: 'An error has occurred. Please try again.',
    reset: 'RESET APP',
    traceTitle: 'Error from %{name} stack',
  },
  loginScreen: {
    title: 'Welcome Back',
    subtitle: 'Sign in to access your Pocket Wallet',
    emailLabel: 'Email',
    emailPlaceholder: 'Email',
    emailRequired: 'Email is required',
    passwordLabel: 'Password',
    passwordPlaceholder: 'Password',
    passwordRequired: 'Password is required',
    signInButton: 'Sign In',
    signingInButton: 'Signing In...',
    quickDemoButton: 'Quick Demo Login',
    loginFailed: 'Login failed',
    helpText:
      'Mock Authentication: Enter any non-empty email and password to login',
  },
  registerScreen: {
    title: 'Register',
    subtitle:
      'User registration placeholder - implement your registration form here',
  },
  homeScreen: {
    title: 'Home Screen',
    subtitle:
      'Main dashboard placeholder - implement your home screen content here',
    iconExamples: 'Icon Examples:',
    ioniconLabel: 'Ionicons (default):',
    assetIconLabel: 'Asset icons:',
    localIconLabel: 'Local icons:',
    // New HomeScreen translations
    totalBalance: 'Total Balance',
    budget: 'budget',
    dailyBudget: 'Daily budget',
    daysLeft: 'days left',
    transactions: 'Transactions',
    seeAll: 'See All',
    today: 'Today',
    loadingTransactions: 'Loading transactions...',
    noTransactionsToday: 'No transactions today',
    tapToAddTransaction: 'Tap + to add your first transaction',
  },
  dashboardScreen: {
    title: 'Dashboard',
    subtitle: 'Track your spending and income',
    // KPI Cards
    totalIncome: 'TOTAL INCOME',
    totalExpense: 'TOTAL EXPENSE',
    savings: 'SAVINGS',
    // Charts
    dailySpending: 'Daily Spending',
    categoryBreakdown: 'Category Breakdown',
    // Empty states
    noExpenses: 'No expenses yet',
    startAddingTransactions: 'Start adding transactions to see statistics',
    noData: 'No data available',
    noDataForMonth: 'No transactions for {{month}}',
    addTransaction: 'Add Transaction',
    // Monthly summary
    monthlySummary: 'Monthly Summary',
    increased: 'Increased ',
    decreased: 'Decreased ',
    savingsRate: 'Savings rate',
    // Error states
    error: 'Error',
    retry: 'Try Again',
    // Currency formatting
    billion: ' billion',
    million: ' million',
    thousand: ' thousand',
  },
  quickAddScreen: {
    title: 'Quick Add',
    subtitle:
      'Quick transaction entry placeholder - implement your add transaction form here',
  },
  transactionListScreen: {
    title: 'Transactions',
    subtitle:
      'Transaction history placeholder - implement your transaction list here',
    // Date formatting
    today: 'Today',
    yesterday: 'Yesterday',
    // Loading states
    loadingMore: 'Loading more...',
    // Empty state
    emptyTitle: 'No transactions yet',
    emptySubtitle: 'Tap the + button to add your first transaction',
    addTransactionButton: 'Add Transaction',
    // Currency formatting
    currencyLocale: 'en-US',
    currencySymbol: '$',
    incomePrefix: '+',
    expensePrefix: '-',
  },
  settingsScreen: {
    title: 'Settings',
    subtitle: 'Manage your app preferences and data',
    // App Preferences
    appPreferences: 'App Preferences',
    theme: 'Theme',
    themeSystem: 'System',
    themeLight: 'Light',
    themeDark: 'Dark',
    language: 'Language',
    languageEnglish: 'English',
    languageVietnamese: 'Tiếng Việt',
    currency: 'Currency',
    defaultTransactionType: 'Default Transaction Type',
    transactionTypeIncome: 'Income',
    transactionTypeExpense: 'Expense',
    // Privacy & Security
    privacySecurity: 'Privacy & Security',
    appLock: 'App Lock (Coming Soon)',
    // Data Management
    dataManagement: 'Data Management',
    dataStats: 'Categories: {{categoryCount}} • Transactions: {{txCount}}',
    clearCache: 'Clear Cache',
    resetApp: 'Reset App',
    // Sync
    sync: 'Sync (Coming Soon)',
    syncDescription: 'Multi-device sync feature coming soon.',
    // About
    about: 'About',
    appInfo: '{{name}} • v{{version}} ({{build}})',
    // Alerts
    languageChanged: 'Language set to {{language}}',
    currencyChanged: 'Currency set to {{currency}}',
    clearCacheTitle: 'Clear Cache',
    clearCacheMessage: 'This will clear temporary data only.',
    clearCacheSuccess: 'Cache cleared.',
    resetAppTitle: 'Reset App',
    resetAppMessage:
      'This will permanently delete all local data. Make sure to back up first.',
    resetAppSuccess: 'Reset complete. Please restart the app.',
  },
  transactionDetailScreen: {
    title: 'Transaction Detail',
    subtitle: 'Transaction details placeholder - ID: {{transactionId}}',
    description: 'Implement your transaction detail view here',
  },
  trashScreen: {
    title: 'Trash',
    subtitle:
      'Deleted items placeholder - implement your trash/recycle bin here',
  },
  categoryListScreen: {
    title: 'Categories',
    subtitle:
      'Category management placeholder - implement your category list here',
  },
  categoryEditScreen: {
    titleEdit: 'Edit Category',
    titleAdd: 'Add Category',
    subtitle: 'Category editing placeholder - Type: {{type}}',
    description: 'Implement your category form here',
    typeIncome: 'Income',
    typeExpense: 'Expense',
  },
};

export default en;
export type Translations = typeof en;
