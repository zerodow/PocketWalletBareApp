# Money Management App — Đặc tả Tính năng (Feature List)

_Cập nhật: 2025-09-01_

> **Chú giải mức độ ưu tiên**  
> 🟢 **MVP** (phải có) • 🟡 **V1** (nên có sớm) • 🔵 **V2+** (nâng cao)

---

## Mục lục

- [EPIC 1 — Quản lý Thu/Chi & Ngân sách](#epic-1--quản-lý-thuchi--ngân-sách)
- [EPIC 2 — Chỉ số & Phân tích so sánh](#epic-2--chỉ-số--phân-tích-so-sánh)
- [EPIC 3 — Quản lý Tài sản & Phân bổ](#epic-3--quản-lý-tài-sản--phân-bổ)
- [EPIC 4 — Chia tiền điện/nước & hóa đơn chung (ở trọ)](#epic-4--chia-tiền-điệnnước--hóa-đơn-chung-ở-trọ)
- [EPIC 5 — Bảo hành vật dụng](#epic-5--bảo-hành-vật-dụng)
- [EPIC 6 — Nhập/Xuất dữ liệu & Tự động hoá](#epic-6--nhậpxuất-dữ-liệu--tự-động-hoá)
- [EPIC 7 — Tài khoản, Quyền riêng tư, Cài đặt](#epic-7--tài-khoản-quyền-riêng-tư-cài-đặt)
- [EPIC 8 — Trải nghiệm & Giao diện](#epic-8--trải-nghiệm--giao-diện)
- [Công thức & định nghĩa](#công-thức--định-nghĩa)
- [Mô hình dữ liệu cốt lõi (rút gọn)](#mô-hình-dữ-liệu-cốt-lõi-rút-gọn)
- [KPI sản phẩm](#kpi-sản-phẩm)
- [Phân kỳ triển khai đề xuất](#phân-kỳ-triển-khai-đề-xuất)
- [IA (Information Architecture) gợi ý](#ia-information-architecture-gợi-ý)

---

## EPIC 1 — Quản lý Thu/Chi & Ngân sách

### 1) Ghi chép giao dịch 🟢

- Thêm/sửa/xóa giao dịch (thu, chi, chuyển giữa ví/tài khoản).
- Trường: số tiền, ngày, danh mục, tiểu mục, ghi chú, ảnh hóa đơn, nhãn (tags).
- **AC**: Có thể thêm giao dịch trong ≤ 10 giây; hỗ trợ VNĐ & đa tiền tệ.

### 2) Danh mục & phân loại 🟢

- Danh mục cố định (Ăn uống, Nhà ở, Đi lại, Hóa đơn, Thu nhập lương…), cho phép tùy biến.
- Gợi ý danh mục theo từ khóa ghi chú (rule-based, sau này AI).
- **AC**: ≥ 20 danh mục mẫu; có thể thêm/sửa; gợi ý danh mục xuất hiện trong biểu mẫu.

### 3) Giao dịch định kỳ 🟡

- Lập lịch tự động (tiền nhà, Internet, gửi tiết kiệm định kỳ…).
- **AC**: Tạo rule lặp theo ngày/tuần/tháng; có màn hình nhắc trước khi ghi sổ.

### 4) Ngân sách (Budget) 🟡

- Đặt hạn mức theo danh mục/tháng; nhắc khi đạt 80%/100%.
- **AC**: Hiển thị tiến độ & số dư có thể chi còn lại.

### 5) Bảng điều khiển (Dashboard) 🟢

- Tổng quan tháng: Tổng thu, Tổng chi, Chênh lệch, Tỷ lệ tiết kiệm, Top danh mục chi.
- **AC**: Tải trong ≤ 2 giây; có biểu đồ cột theo ngày và donut theo danh mục.

---

## EPIC 2 — Chỉ số & Phân tích so sánh

### 1) Chỉ số cốt lõi 🟢

- Tỷ lệ tiết kiệm = `(Thu - Chi) / Thu`.
- Tỷ trọng chi cố định (%) = `Chi cố định / Tổng chi`.
- Tỷ trọng chi phát sinh (%) = `Chi biến đổi / Tổng chi`.
- **AC**: Tính theo tháng và YTD; hiển thị xu hướng 3–6 tháng.

### 2) Thống kê theo ngày/tháng 🟢

- Biểu đồ chi tiêu theo ngày (heatmap), theo tháng (bar line).
- **AC**: So sánh M/M, Y/Y; highlight tháng vượt ngân sách.

### 3) So sánh tùy biến 🟡

- So sánh 2 khoảng thời gian, 2 danh mục, hoặc “trước & sau” một sự kiện.
- **AC**: Chọn khoảng tùy ý; kết quả xuất CSV.

### 4) Dự báo dòng tiền đơn giản 🔵

- Ước tính chi/thu tháng tới dựa trên trung bình 3–6 tháng + định kỳ.
- **AC**: Hiển thị khoảng ước tính (min–max).

---

## EPIC 3 — Quản lý Tài sản & Phân bổ

### 1) Tài khoản & Tài sản 🟢

- Ví/Tài khoản: tiền mặt, tài khoản ngân hàng, ví điện tử, khoản tiết kiệm, đầu tư (nhập tay).
- Tài sản ròng (Net worth) = `Tổng tài sản – Tổng nợ`.
- **AC**: Hỗ trợ nhiều tài khoản; chuyển tiền nội bộ không làm “thu/chi” ảo.

### 2) Phân bổ tài sản (%) 🟡

- Nhóm: Tiền mặt, Tiết kiệm, Đầu tư (cổ phiếu/quỹ), Khác.
- **AC**: Biểu đồ phân bổ & chênh lệch so với mục tiêu.

### 3) “Runway” khi nghỉ việc 🟡

**Mục tiêu**: Ước tính số **tháng sống được** cho `N` người.  
**Định nghĩa**:

- Tài sản thanh khoản = Tiền mặt + TK thanh toán + Tiết kiệm có thể rút sớm – phí phạt ước tính.
- Chi phí cơ bản/tháng = Chi cố định + Chi biến đổi **kịch bản tối giản** (ví dụ 80% TB 3 tháng).
- **Runway (tháng)** = `Tài sản thanh khoản / (Chi phí cơ bản/tháng × N)`  
  **AC**: Nhập N (người phụ thuộc), hệ số tối giản (0.8–1.0), xem 2 kịch bản: “Hiện tại” & “Thắt lưng buộc bụng”.

### 4) Tháp tài sản 🔵

- 4 tầng gợi ý: Quỹ khẩn cấp → An toàn (tiết kiệm, bảo hiểm) → Tăng trưởng (cổ phiếu/quỹ) → Mạo hiểm.
- **AC**: Hiển thị mức khuyến nghị theo mục tiêu & khẩu vị rủi ro.

### 5) Tư vấn phân bổ (AI) 🔵

- Đề xuất tỉ lệ mục tiêu theo tuổi, mục tiêu, thời gian, mức chịu rủi ro.
- **AC**: Đưa ra lý do & khoảng khuyến nghị, người dùng có thể nhận/từ chối áp dụng.

---

## EPIC 4 — Chia tiền điện/nước & hóa đơn chung (ở trọ)

### 1) Chia tiền hóa đơn 🟢

**Input**: loại hóa đơn, kỳ, tổng tiền, phí cố định, số người, **số ngày ở** từng người, **trọng số** (ví dụ phòng điều hòa).  
**Công thức chia flat**:

- `Điểm chia mỗi người = Số ngày ở × Trọng số`
- `Tỷ lệ = Điểm chia / Tổng điểm`
- `Tiền mỗi người = Tỷ lệ × (Tổng tiền – Phí cố định) + (Phí cố định / Số người)`  
  **AC**: Xuất bảng chia; sao chép link chia sẻ hoặc xuất ảnh/PDF.

### 2) Công tơ & bậc thang (tuỳ chọn) 🟡

- Nhập chỉ số đầu–cuối; đơn giá bậc thang; phân bổ theo điểm chia (ước lượng).
- **AC**: Gợi ý phần công bằng khi có bậc thang.

### 3) Sổ nợ chia sẻ 🟡

- Tự tạo “công nợ” giữa các thành viên; đánh dấu đã trả.
- **AC**: Gửi nhắc thanh toán qua link.

---

## EPIC 5 — Bảo hành vật dụng

### 1) Quản lý bảo hành 🟢

- Trường: tên vật dụng, nhóm, ngày mua, thời hạn (tháng), nơi bảo hành, số serial, ảnh hóa đơn.
- **AC**: Tự tính ngày hết hạn; hiển thị trạng thái (Còn X ngày/Hết hạn).

### 2) Nhắc hết hạn 🟢

- Nhắc trước 30/7/1 ngày (push/in-app/email tuỳ chọn).
- **AC**: Có thể tắt/điều chỉnh mốc nhắc.

### 3) Tìm kiếm & lọc 🟡

- Lọc theo nhóm, trạng thái, nơi mua.
- **AC**: Tìm theo tên/serial trong ≤ 1s.

---

## EPIC 6 — Nhập/Xuất dữ liệu & Tự động hoá

### 1) Nhập CSV 🟢

- Mẫu CSV chuẩn (giao dịch, tài khoản).
- **AC**: Map cột linh hoạt; xem trước & hoàn tác.

### 2) Xuất CSV/Excel 🟢

- Giao dịch, báo cáo, chia tiền, bảo hành.
- **AC**: Chọn phạm vi thời gian & trường.

### 3) Nhận diện hoá đơn/ảnh (OCR) 🔵

- Trích số tiền, ngày, nơi mua, danh mục gợi ý.
- **AC**: Độ chính xác ≥ 80% với hoá đơn in rõ.

### 4) Tự động gợi ý phân loại (ML) 🔵

- Học từ lịch sử; highlight bất thường.
- **AC**: Gợi ý hiển thị ngay trong form thêm giao dịch.

---

## EPIC 7 — Tài khoản, Quyền riêng tư, Cài đặt

### 1) Tài khoản & Hồ sơ 🟢

- Ngôn ngữ, tiền tệ, chu kỳ lương (mùng 1/15), số người phụ thuộc mặc định.
- **AC**: Thay đổi áp dụng cho thống kê mới.

### 2) Bảo mật & Sao lưu 🟢

- Đăng nhập an toàn; mã PIN/biometrics; sao lưu thủ công & tự động (mã hoá).
- **AC**: Khôi phục được dữ liệu từ file sao lưu.

### 3) Thông báo & nhắc việc 🟢

- Ngân sách chạm ngưỡng, giao dịch định kỳ, bảo hành, công nợ chia sẻ.
- **AC**: Bật/tắt theo kênh & tần suất.

---

## EPIC 8 — Trải nghiệm & Giao diện

### 1) Luồng Onboarding 🟢

- Thiết lập ban đầu: tiền tệ, thu nhập trung bình, các khoản cố định, tài khoản/khởi tạo ví.
- **AC**: Hoàn tất trong ≤ 3 phút; có dữ liệu mẫu để tham khảo.

### 2) Tìm kiếm nhanh & bộ lọc 🟢

- Lọc theo ngày/danh mục/ghi chú/số tiền.
- **AC**: Kết quả tức thời.

### 3) Hiệu năng & Offline-first 🟡

- Dùng được khi offline; đồng bộ khi có mạng.
- **AC**: Tất cả thao tác cơ bản chạy không mạng.

---

## Công thức & định nghĩa

- **Savings rate (Tỷ lệ tiết kiệm)** = `(Thu – Chi) / Thu`.
- **Fixed vs Variable**: danh mục gắn cờ “Cố định” (tiền nhà, Internet…) → dùng cho **Tỷ trọng chi cố định**.
- **Runway** (tháng, cho N người) = `Tài sản thanh khoản / (Chi phí cơ bản/tháng × N)`.
- **Phân bổ tài sản (%)** theo nhóm = `Giá trị nhóm / Tổng tài sản tài chính`.
- **So sánh tháng**: `Chênh lệch = Tháng hiện tại – Trung bình 3 tháng trước` (hiển thị %).

---

## Mô hình dữ liệu cốt lõi (rút gọn)

- **User**: id, tên, tiền tệ, chu kỳ lương, người phụ thuộc mặc định.
- **Account**: id, user_id, loại (cash/bank/e-wallet/saving/investment), số dư.
- **Category**: id, tên, loại (thu/chi), cờ cố định.
- **Transaction**: id, account_id, loại (in/out/transfer), số tiền, ngày, category_id, note, tags, attachment.
- **Budget**: id, user_id, category_id, số tiền/tháng, ngưỡng cảnh báo.
- **AssetAllocationTarget**: nhóm, % mục tiêu.
- **SharedBill**: id, loại, kỳ, tổng tiền, phí cố định.
- **SharedMember**: bill_id, tên, số ngày ở, trọng số, tiền phải trả.
- **WarrantyItem**: id, tên, nhóm, ngày mua, thời hạn_tháng, nơi_bảo_hành, serial, ảnh, ngày_hết_hạn.

---

## KPI sản phẩm

- Tỷ lệ thêm giao dịch/ngày/người dùng.
- % giao dịch có danh mục (tự động vs thủ công).
- Tỷ lệ người dùng đặt ngân sách & nhận cảnh báo.
- Số lượng hóa đơn chia/ tháng; tỷ lệ thanh toán đủ 100%.
- % vật dụng có nhắc bảo hành & xử lý trước hạn.
- Tỷ lệ quay lại ngày 7/30.

---

## Phân kỳ triển khai đề xuất

- **MVP (🟢)**: EPIC 1 (các mục 🟢), EPIC 2.1 & 2.2, EPIC 4.1, EPIC 5.1–5.2, EPIC 6.1–6.2, EPIC 7 (🟢), EPIC 8.1–8.2.
- **V1 (🟡)**: Giao dịch định kỳ, Ngân sách, Công tơ/bậc thang, Sổ nợ chia sẻ, Offline-first cơ bản, Phân bổ tài sản %, Runway.
- **V2+ (🔵)**: Dự báo & AI (OCR, phân loại ML, tư vấn phân bổ, tháp tài sản nâng cao).

---

## IA (Information Architecture) gợi ý

- **Trang chủ** (Dashboard) • **Giao dịch** • **Ngân sách** • **Tài sản** • **Chia hóa đơn** • **Bảo hành** • **Báo cáo** • **Cài đặt**

---

_Gợi ý bước tiếp theo_: Tạo **wireframe MVP** và **mẫu CSV** để import nhanh.
