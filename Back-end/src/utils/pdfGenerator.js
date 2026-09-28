const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  shipping: "Đang giao",
  delivered: "Đã giao",
  cancelled: "Đã hủy",
};

const PAYMENT_LABELS = {
  cod: "Thu hộ tiền mặt (COD)",
  bank_transfer: "Chuyển khoản QR ngân hàng",
  bank: "Chuyển khoản QR ngân hàng",
  paypal: "PayPal / Thẻ trực tuyến",
};

function formatCurrency(val) {
  return `$${Number(val || 0).toFixed(2)}`;
}

function formatDate(val) {
  if (!val) return "—";
  const d = new Date(val);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const mins = String(d.getMinutes()).padStart(2, "0");
  return `${day}/${month}/${year} ${hours}:${mins}`;
}

/**
 * Generates invoice PDF stream for list of orders
 * @param {Array} orderItems - Array of order objects with product details
 * @param {Object} companyInfo - Company configuration from json file
 * @param {Map} productMap - Map of productId -> product object
 * @param {WritableStream} outputStream - Stream to pipe PDF into
 */
function generateInvoicePdf(orderItems, companyInfo, productMap, outputStream) {
  const doc = new PDFDocument({
    size: "A4",
    margin: 35,
    autoFirstPage: false,
    bufferPages: true,
  });

  doc.pipe(outputStream);

  // Register Vietnamese Fonts
  const fontRegular = path.join(__dirname, "../../assets/fonts/Roboto-Regular.ttf");
  const fontBold = path.join(__dirname, "../../assets/fonts/Roboto-Bold.ttf");

  doc.registerFont("Roboto", fontRegular);
  doc.registerFont("Roboto-Bold", fontBold);

  const logoPath = path.join(__dirname, "../../assets/logo.png");

  // Keep track of which order owns which page for header/footer/watermark rendering
  const orderPageMap = []; // Array of { pageIndex, order, isFirstPageOfOrder }

  orderItems.forEach((order) => {
    let isFirstPageOfOrder = true;

    // Start order on a new page
    doc.addPage();
    let currentOrderPageIndex = doc.bufferedPageRange().count - 1;
    orderPageMap.push({
      pageIndex: currentOrderPageIndex,
      order,
      isFirstPageOfOrder,
    });

    const leftMargin = 35;
    const rightMargin = 560; // A4 width 595 - 35
    const contentWidth = rightMargin - leftMargin;

    // Render Company Header (First page of order only)
    let y = 35;

    // Check if logo exists and is readable
    let logoRenderedWidth = 0;
    if (fs.existsSync(logoPath)) {
      try {
        doc.image(logoPath, leftMargin, y, { height: 51 });
        logoRenderedWidth = 55; // Height ~18mm, width ~55pt
      } catch (err) {
        console.error("Warning: Could not read logo file:", err.message);
        logoRenderedWidth = 0;
      }
    }

    // Company Info Block (Left side)
    const companyTextX = leftMargin + (logoRenderedWidth ? logoRenderedWidth + 10 : 0);
    const companyTextWidth = 280 - (logoRenderedWidth ? logoRenderedWidth + 10 : 0);

    doc.font("Roboto-Bold").fontSize(13).fillColor("#0b1c30");
    doc.text(companyInfo.name || "Lã Ngọc Huyền TECH MART", companyTextX, y, {
      width: companyTextWidth,
    });

    let textY = doc.y + 2;
    doc.font("Roboto").fontSize(8.5).fillColor("#475569");
    if (companyInfo.address) {
      doc.text(companyInfo.address, companyTextX, textY, { width: companyTextWidth });
      textY = doc.y + 1;
    }
    if (companyInfo.phone) {
      doc.text(companyInfo.phone, companyTextX, textY, { width: companyTextWidth });
      textY = doc.y + 1;
    }
    if (companyInfo.email) {
      doc.text(companyInfo.email, companyTextX, textY, { width: companyTextWidth });
      textY = doc.y + 1;
    }
    // Only print MST if non-empty
    if (companyInfo.taxCode && String(companyInfo.taxCode).trim() !== "") {
      doc.text(`MST: ${companyInfo.taxCode}`, companyTextX, textY, { width: companyTextWidth });
      textY = doc.y + 1;
    }

    // Header Right Side (HÓA ĐƠN, Mã đơn, Ngày đặt)
    doc.font("Roboto-Bold").fontSize(18).fillColor("#006948");
    doc.text("HÓA ĐƠN", 350, y, { width: 210, align: "right" });

    doc.font("Roboto-Bold").fontSize(10).fillColor("#0b1c30");
    doc.text(`Mã đơn: #SW-${order.id}`, 350, y + 24, { width: 210, align: "right" });

    doc.font("Roboto").fontSize(8.5).fillColor("#475569");
    doc.text(`Ngày đặt: ${formatDate(order.createdAt)}`, 350, y + 38, {
      width: 210,
      align: "right",
    });

    // Separator line below header
    y = Math.max(textY + 8, y + 58);
    doc.moveTo(leftMargin, y).lineTo(rightMargin, y).strokeColor("#cbd5e1").lineWidth(1).stroke();
    y += 12;

    // Customer & Order Information
    doc.font("Roboto-Bold").fontSize(10).fillColor("#0b1c30");
    doc.text("THÔNG TIN ĐƠN HÀNG & GIAO HÀNG", leftMargin, y);
    y += 16;

    doc.font("Roboto").fontSize(9).fillColor("#334155");

    const fullName = order.shippingInfo?.fullName || "—";
    const phone = order.shippingInfo?.phone || "—";
    const address = order.shippingInfo?.address || "—";
    const payMethod = PAYMENT_LABELS[order.paymentMethod] || order.paymentMethod || "COD";
    const statusText = STATUS_LABELS[order.status] || order.status || "Chờ xử lý";

    doc.font("Roboto-Bold").text("Họ tên người nhận: ", leftMargin, y, { continued: true });
    doc.font("Roboto").text(fullName);
    y += 14;

    doc.font("Roboto-Bold").text("Số điện thoại: ", leftMargin, y, { continued: true });
    doc.font("Roboto").text(phone);
    y += 14;

    doc.font("Roboto-Bold").text("Địa chỉ giao hàng: ", leftMargin, y, { continued: true });
    doc.font("Roboto").text(address);
    y += 14;

    doc.font("Roboto-Bold").text("Phương thức thanh toán: ", leftMargin, y, { continued: true });
    doc.font("Roboto").text(payMethod);
    y += 14;

    doc.font("Roboto-Bold").text("Trạng thái đơn hàng: ", leftMargin, y, { continued: true });
    doc.font("Roboto").text(statusText);
    y += 20;

    // Products Table Helper
    const colSTT = { x: 35, w: 35, align: "center" };
    const colName = { x: 70, w: 250, align: "left" };
    const colQty = { x: 320, w: 55, align: "center" };
    const colPrice = { x: 375, w: 90, align: "right" };
    const colTotal = { x: 465, w: 95, align: "right" };

    function renderTableHeader(startY) {
      doc.rect(leftMargin, startY, contentWidth, 22).fill("#f1f5f9");
      doc.font("Roboto-Bold").fontSize(9).fillColor("#1e293b");

      doc.text("STT", colSTT.x, startY + 6, { width: colSTT.w, align: colSTT.align });
      doc.text("Tên sản phẩm", colName.x, startY + 6, { width: colName.w, align: colName.align });
      doc.text("SL", colQty.x, startY + 6, { width: colQty.w, align: colQty.align });
      doc.text("Đơn giá", colPrice.x, startY + 6, { width: colPrice.w, align: colPrice.align });
      doc.text("Thành tiền", colTotal.x, startY + 6, { width: colTotal.w, align: colTotal.align });

      doc.moveTo(leftMargin, startY + 22).lineTo(rightMargin, startY + 22).strokeColor("#cbd5e1").lineWidth(1).stroke();
      return startY + 22;
    }

    y = renderTableHeader(y);

    const products = order.products || [];
    let computedTotalFromItems = 0;

    products.forEach((item, index) => {
      const pId = Number(item.productId);
      const product = productMap.get(pId);
      const title = item.title || product?.title || `Sản phẩm #${pId}`;
      const qty = Number(item.quantity) || 1;
      const price = item.price !== undefined ? Number(item.price) : product?.price || 0;
      const lineTotal = price * qty;
      computedTotalFromItems += lineTotal;

      // Check if page overflow will occur (A4 page bottom margin threshold ~730)
      if (y > 720) {
        doc.addPage();
        currentOrderPageIndex = doc.bufferedPageRange().count - 1;
        orderPageMap.push({
          pageIndex: currentOrderPageIndex,
          order,
          isFirstPageOfOrder: false,
        });

        y = 40;
        // Re-print table header on next page
        y = renderTableHeader(y);
      }

      const rowHeight = Math.max(20, doc.heightOfString(title, { width: colName.w }) + 8);

      doc.font("Roboto").fontSize(8.5).fillColor("#334155");

      doc.text(String(index + 1), colSTT.x, y + 5, { width: colSTT.w, align: colSTT.align });
      doc.text(title, colName.x, y + 5, { width: colName.w, align: colName.align });
      doc.text(String(qty), colQty.x, y + 5, { width: colQty.w, align: colQty.align });
      doc.text(formatCurrency(price), colPrice.x, y + 5, { width: colPrice.w, align: colPrice.align });
      doc.text(formatCurrency(lineTotal), colTotal.x, y + 5, { width: colTotal.w, align: colTotal.align });

      y += rowHeight;
      doc.moveTo(leftMargin, y).lineTo(rightMargin, y).strokeColor("#e2e8f0").lineWidth(0.5).stroke();
    });

    y += 10;

    // Check overflow for Total & Signatures
    if (y > 690) {
      doc.addPage();
      currentOrderPageIndex = doc.bufferedPageRange().count - 1;
      orderPageMap.push({
        pageIndex: currentOrderPageIndex,
        order,
        isFirstPageOfOrder: false,
      });
      y = 40;
    }

    // Total Amount Section (Lấy trực tiếp từ order.total trong DB)
    const finalTotal =
      order.total !== undefined && order.total !== null
        ? Number(order.total)
        : computedTotalFromItems;

    doc.font("Roboto-Bold").fontSize(11).fillColor("#0b1c30");
    doc.text("TỔNG TIỀN THANH TOÁN:", 250, y, { width: 180, align: "right" });
    doc.font("Roboto-Bold").fontSize(13).fillColor("#006948");
    doc.text(formatCurrency(finalTotal), 435, y - 1, { width: 125, align: "right" });

    y += 35;

    // Signature Area
    const sigY = y;
    doc.font("Roboto-Bold").fontSize(9.5).fillColor("#0b1c30");
    doc.text("NGƯỜI MUA HÀNG", leftMargin, sigY, { width: 200, align: "center" });
    doc.font("Roboto").fontSize(8).fillColor("#64748b");
    doc.text("(Ký, ghi rõ họ tên)", leftMargin, sigY + 12, { width: 200, align: "center" });

    doc.font("Roboto-Bold").fontSize(9.5).fillColor("#0b1c30");
    doc.text("NGƯỜI BÁN HÀNG", rightMargin - 200, sigY, { width: 200, align: "center" });
    doc.font("Roboto").fontSize(8).fillColor("#64748b");
    doc.text("(Ký, đóng dấu, ghi rõ họ tên)", rightMargin - 200, sigY + 12, {
      width: 200,
      align: "center",
    });
  });

  // Render footers and watermarks across all buffered pages
  const totalBufferedPages = doc.bufferedPageRange().count;

  for (let i = 0; i < totalBufferedPages; i++) {
    doc.switchToPage(i);

    const pageInfo = orderPageMap[i];
    const order = pageInfo?.order;

    // Draw Watermark if order is cancelled
    if (order && order.status === "cancelled") {
      doc.save();
      doc.font("Roboto-Bold").fontSize(65).fillColor("#ef4444").opacity(0.16);
      doc.rotate(-45, { origin: [297.5, 421] });
      doc.text("ĐÃ HỦY", 97.5, 390, { width: 400, align: "center" });
      doc.restore();
    }

    // Page Footer
    const footerY = 810;
    doc.moveTo(35, footerY - 8).lineTo(560, footerY - 8).strokeColor("#e2e8f0").lineWidth(0.5).stroke();

    doc.font("Roboto").fontSize(8).fillColor("#64748b");
    doc.text(`Cảm ơn quý khách đã mua hàng tại ${companyInfo.name || "Lã Ngọc Huyền TECH MART"}`, 35, footerY, {
      width: 380,
      align: "left",
    });

    doc.text(`Trang ${i + 1} / ${totalBufferedPages}`, 420, footerY, {
      width: 140,
      align: "right",
    });
  }

  doc.end();
}

module.exports = { generateInvoicePdf };
