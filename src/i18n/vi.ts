// Translation keys for Vietnamese locale
const vi = {
  common: {
    ok: 'Đồng ý',
    cancel: 'Hủy',
    back: 'Quay lại',
    logOut: 'Đăng xuất',
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
    title: 'Bảng Điều Khiển',
    subtitle:
      'Mẫu bảng điều khiển phân tích - triển khai biểu đồ và thống kê của bạn tại đây',
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
  },
  settingsScreen: {
    title: 'Cài Đặt',
    subtitle:
      'Mẫu cài đặt ứng dụng - triển khai các tùy chọn cài đặt của bạn tại đây',
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
