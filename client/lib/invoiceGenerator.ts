import { jsPDF } from "jspdf";

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export function generateInvoice(
  cartItems: CartItem[],
  customerName: string,
  customerEmail: string,
  invoiceNo: string
) {
  const doc = new jsPDF();

  // Company Header
  doc.setFontSize(16);
  doc.text("JR Communications & Power Controls Pvt. Ltd.", 20, 20);
  doc.setFontSize(12);
  doc.text("G4, Royal Towers, A-20, 1st Cross West, Thillainagar,", 20, 28);
  doc.text("Tiruchirappalli 560001, Karnataka", 20, 34);
  doc.text("Mobile: 9442150005 | GSTIN: 29AAGCB1286Q000", 20, 40);
  doc.text("E-Mail: support@rpcupsindia.com", 20, 46);

  // Invoice Info
  doc.setFontSize(14);
  doc.text(`Invoice No: ${invoiceNo}`, 20, 60);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 60);

  // Customer Info
  doc.setFontSize(12);
  doc.text(`Customer: ${customerName}`, 20, 70);
  doc.text(`Email: ${customerEmail}`, 20, 76);

  // Table Header
  doc.setFontSize(12);
  doc.text("Description", 20, 90);
  doc.text("Qty", 120, 90);
  doc.text("Rate (Rs.)", 150, 90);
  doc.text("Amount (Rs.)", 180, 90);

  let y = 100;
  let total = 0;

  cartItems.forEach((item, index) => {
    const amount = item.price * item.quantity;
    total += amount;

    doc.text(`${index + 1}. ${item.name}`, 20, y);
    doc.text(item.quantity.toString(), 120, y);
    doc.text(item.price.toLocaleString("en-IN"), 150, y);
    doc.text(amount.toLocaleString("en-IN"), 180, y);
    y += 10;
  });

  // Subtotal & Total
  doc.setFontSize(12);
  doc.text("Sub Total", 150, y + 10);
  doc.text(total.toLocaleString("en-IN"), 180, y + 10);

  doc.setFontSize(14);
  doc.text("Net Total", 150, y + 20);
  doc.text(total.toLocaleString("en-IN"), 180, y + 20);

  // Amount in Words
  const amountInWords = convertNumberToWords(total);
  doc.setFontSize(10);
  doc.text(`Amount Chargeable (in words): ${amountInWords} Only`, 20, y + 40);

  // Payment Method
  doc.setFontSize(12);
  doc.text("Payment Method: Cash on Delivery", 20, y + 55);

  // Bank Details
  doc.setFontSize(10);
  doc.text("Company's Bank Details:", 20, y + 70);
  doc.text("Bank Name: HDFC Bank (India)", 20, y + 76);
  doc.text("A/c No: 50200095740775", 20, y + 82);
  doc.text("IFS Code: HDFC0000058", 20, y + 88);
  doc.text("Branch: Thillainagar, Trichy", 20, y + 94);

  // Declaration
  doc.setFontSize(10);
  doc.text(
    "We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.",
    20,
    y + 110,
    { maxWidth: 170 }
  );

  doc.text("CUSTOMER AUTHORISED SIGNATORY", 20, y + 130);
  doc.text("for JR Communications & Power Controls Pvt. Ltd.", 20, y + 136);

  // Save PDF
  doc.save(`Invoice_${invoiceNo}.pdf`);
}

// Utility: Convert number to words (simplified)
function convertNumberToWords(amount: number): string {
  // For brevity, just return the number string. You can expand with a full converter.
  return amount.toString();
}