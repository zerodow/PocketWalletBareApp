// Translation keys for Vietnamese locale
const vi = {
  common: {
    ok: 'Đồng ý',
    cancel: 'Hủy',
    back: 'Quay lại',
    logOut: 'Đăng xuất',
  },
  tabs: {
    home: 'Trang Chủ',
    transactions: 'Giao Dịch',
    add: 'Thêm',
    analytics: 'Thống Kê',
    settings: 'Cài Đặt',
  },
  errorScreen: {
    title: 'Đã xảy ra lỗi!',
    friendlySubtitle: 'Có lỗi xảy ra. Vui lòng thử lại.',
    reset: 'ĐẶT LẠI ỨNG DỤNG',
    traceTitle: 'Lỗi từ ngăn xếp %{name}',
  },
  loginScreen: {
    title: 'Chào Mừng Trở Lại',
    subtitle: 'Đăng nhập để truy cập Ví Của Bạn',
    emailLabel: 'Email',
    emailPlaceholder: 'Email',
    emailRequired: 'Email là bắt buộc',
    passwordLabel: 'Mật khẩu',
    passwordPlaceholder: 'Mật khẩu',
    passwordRequired: 'Mật khẩu là bắt buộc',
    signInButton: 'Đăng Nhập',
    signingInButton: 'Đang Đăng Nhập...',
    quickDemoButton: 'Đăng Nhập Demo Nhanh',
    loginFailed: 'Đăng nhập thất bại',
    helpText:
      'Xác thực giả lập: Nhập bất kỳ email và mật khẩu không trống để đăng nhập',
  },
  registerScreen: {
    title: 'Đăng Ký',
    subtitle:
      'Mẫu đăng ký người dùng - triển khai biểu mẫu đăng ký của bạn tại đây',
  },
  homeScreen: {
    title: 'Màn Hình Chính',
    subtitle:
      'Mẫu bảng điều khiển chính - triển khai nội dung màn hình chính của bạn tại đây',
    iconExamples: 'Ví Dụ Biểu Tượng:',
    ioniconLabel: 'Ionicons (mặc định):',
    assetIconLabel: 'Biểu tượng tài sản:',
    localIconLabel: 'Biểu tượng cục bộ:',
    // New HomeScreen translations
    totalBalance: 'Tổng Số Dư',
    budget: 'ngân sách',
    dailyBudget: 'Ngân sách hàng ngày',
    daysLeft: 'ngày còn lại',
    transactions: 'Giao Dịch',
    seeAll: 'Xem Tất Cả',
    today: 'Hôm Nay',
    loadingTransactions: 'Đang tải giao dịch...',
    noTransactionsToday: 'Không có giao dịch hôm nay',
    tapToAddTransaction: 'Nhấn + để thêm giao dịch đầu tiên',
  },
  dashboardScreen: {
    title: 'Tổng Quan',
    subtitle: 'Theo dõi chi tiêu và thu nhập của bạn',
    // KPI Cards
    totalIncome: 'TỔNG THU NHẬP',
    totalExpense: 'TỔNG CHI TIÊU',
    savings: 'TIẾT KIỆM',
    // Charts
    dailySpending: 'Chi Tiêu Hàng Ngày',
    categoryBreakdown: 'Phân Tích Theo Danh Mục',
    // Empty states
    noExpenses: 'Chưa có chi tiêu',
    startAddingTransactions: 'Bắt đầu thêm giao dịch để xem thống kê',
    noData: 'Chưa có dữ liệu',
    noDataForMonth: 'Tháng {{month}} chưa có giao dịch nào',
    addTransaction: 'Thêm Giao Dịch',
    // Monthly summary
    monthlySummary: 'Tổng Kết Tháng',
    increased: 'Tăng ',
    decreased: 'Giảm ',
    savingsRate: 'Tỷ lệ tiết kiệm',
    // Error states
    error: 'Lỗi',
    retry: 'Thử Lại',
    // Currency formatting
    billion: ' tỷ',
    million: ' triệu',
    thousand: ' nghìn',
  },
  quickAddScreen: {
    title: 'Thêm Nhanh',
    subtitle:
      'Mẫu nhập giao dịch nhanh - triển khai biểu mẫu thêm giao dịch của bạn tại đây',
  },
  transactionListScreen: {
    title: 'Giao Dịch',
    subtitle:
      'Mẫu lịch sử giao dịch - triển khai danh sách giao dịch của bạn tại đây',
    // Date formatting
    today: 'Hôm nay',
    yesterday: 'Hôm qua',
    // Loading states
    loadingMore: 'Đang tải thêm...',
    // Empty state
    emptyTitle: 'Chưa có giao dịch nào',
    emptySubtitle: 'Nhấn nút + để thêm giao dịch đầu tiên',
    addTransactionButton: 'Thêm Giao Dịch',
    // Currency formatting
    currencyLocale: 'vi-VN',
    currencySymbol: '₫',
    incomePrefix: '+',
    expensePrefix: '-',
  },
  settingsScreen: {
    title: 'Cài Đặt',
    subtitle: 'Quản lý tùy chọn ứng dụng và dữ liệu',
    // App Preferences
    appPreferences: 'Tuỳ chọn ứng dụng',
    theme: 'Chủ đề',
    themeSystem: 'Hệ thống',
    themeLight: 'Sáng',
    themeDark: 'Tối',
    language: 'Ngôn ngữ',
    languageEnglish: 'English',
    languageVietnamese: 'Tiếng Việt',
    currency: 'Tiền tệ',
    defaultTransactionType: 'Loại GD mặc định',
    transactionTypeIncome: 'Thu',
    transactionTypeExpense: 'Chi',
    // Privacy & Security
    privacySecurity: 'Quyền riêng tư & Bảo mật',
    appLock: 'Khóa ứng dụng (Sắp ra mắt)',
    // Data Management
    dataManagement: 'Quản lý dữ liệu',
    dataStats: 'Hạng mục: {{categoryCount}} • Giao dịch: {{txCount}}',
    clearCache: 'Xoá cache',
    resetApp: 'Đặt lại ứng dụng',
    // Sync
    sync: 'Đồng bộ (Sắp ra mắt)',
    syncDescription: 'Tính năng đồng bộ đa thiết bị sẽ sớm có mặt.',
    // About
    about: 'Thông tin',
    appInfo: '{{name}} • v{{version}} ({{build}})',
    // Alerts
    languageChanged: 'Đã chọn ngôn ngữ {{language}}',
    currencyChanged: 'Đã chọn tiền tệ {{currency}}',
    clearCacheTitle: 'Xóa cache',
    clearCacheMessage: 'Thao tác này chỉ xóa dữ liệu tạm thời.',
    clearCacheSuccess: 'Đã xóa cache.',
    resetAppTitle: 'Đặt lại ứng dụng',
    resetAppMessage:
      'Thao tác này sẽ xóa vĩnh viễn tất cả dữ liệu cục bộ. Hãy sao lưu trước.',
    resetAppSuccess: 'Đặt lại hoàn tất. Vui lòng khởi động lại ứng dụng.',
  },
  transactionDetailScreen: {
    title: 'Chi Tiết Giao Dịch',
    subtitle: 'Mẫu chi tiết giao dịch - ID: {{transactionId}}',
    description: 'Triển khai chế độ xem chi tiết giao dịch của bạn tại đây',
  },
  trashScreen: {
    title: 'Thùng Rác',
    subtitle:
      'Mẫu các mục đã xóa - triển khai thùng rác/tái chế của bạn tại đây',
  },
  categoryListScreen: {
    title: 'Danh Mục',
    subtitle:
      'Mẫu quản lý danh mục - triển khai danh sách danh mục của bạn tại đây',
  },
  categoryEditScreen: {
    titleEdit: 'Chỉnh Sửa Danh Mục',
    titleAdd: 'Thêm Danh Mục',
    subtitle: 'Mẫu chỉnh sửa danh mục - Loại: {{type}}',
    description: 'Triển khai biểu mẫu danh mục của bạn tại đây',
    typeIncome: 'Thu Nhập',
    typeExpense: 'Chi Phí',
  },
};

export default vi;
export type TranslationsVi = typeof vi;
