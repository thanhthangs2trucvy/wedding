export const PatternUtils = {
  isURL(text) {
    // Sử dụng biểu thức chính quy để kiểm tra xem text có phải là URL không
    const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;
    return urlPattern.test(text);
  },
  isGS25URL(url) {
    const gs25Pattern = /^https?:\/\/(?:www\.)?gs25\.com\.vn/i;
    return gs25Pattern.test(url);
  }
}
