import PDFDocument from "pdfkit";

export const generateInvoicePDF = (data: any): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument({
            size: "A4",
            margin: 50,
        });

        const chunks: Buffer[] = [];

        doc.on("data", (chunk) => {
            chunks.push(chunk);
        });

        doc.on("end", () => {
            resolve(Buffer.concat(chunks));
        });

        doc.on("error", (error) => {
            reject(error);
        });

        // =========================
        // HEADER
        // =========================

        doc
            .fontSize(24)
            .font("Helvetica-Bold")
            .text("PAYFLOW", {
                align: "center",
            });

        doc
            .moveDown(0.5)
            .fontSize(16)
            .font("Helvetica")
            .text("PAYMENT INVOICE", {
                align: "center",
            });

        doc.moveDown();

        drawDivider(doc);

        // =========================
        // INVOICE INFORMATION
        // =========================

        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Invoice Information");

        doc.moveDown(0.5);

        drawField(
            doc,
            "Reference",
            data.invoice.reference
        );

        drawField(
            doc,
            "Issued At",
            formatDate(data.invoice.issuedAt)
        );

        drawField(
            doc,
            "Status",
            data.invoice.status
        );

        doc.moveDown();

        drawDivider(doc);

        // =========================
        // CUSTOMER
        // =========================

        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Customer");

        doc.moveDown(0.5);

        drawField(
            doc,
            "Name",
            data.customer.name
        );

        drawField(
            doc,
            "Account Number",
            data.customer.accountNumber
        );

        doc.moveDown();

        drawDivider(doc);

        // =========================
        // PAYMENT DETAILS
        // =========================

        doc
            .fontSize(12)
            .font("Helvetica-Bold")
            .text("Payment Details");

        doc.moveDown(0.5);

        drawField(
            doc,
            "Utility",
            data.payment.utilityType
        );

        drawField(
            doc,
            "Vendor",
            data.payment.vendor
        );

        drawField(
            doc,
            "Paid At",
            formatDate(data.payment.paidAt)
        );

        drawField(
            doc,
            "Remarks",
            data.payment.remarks
        );

        doc.moveDown();

        // =========================
        // TOTAL
        // =========================

        drawDivider(doc);

        doc
            .moveDown(1)
            .fontSize(16)
            .font("Helvetica-Bold")
            .text(
                `TOTAL: NPR ${formatAmount(data.payment.amount)}`,
                {
                    align: "right",
                }
            );

        doc.moveDown(2);

        // =========================
        // FOOTER
        // =========================

        doc
            .fontSize(10)
            .font("Helvetica")
            .text(
                "Thank you for using PayFlow.",
                {
                    align: "center",
                }
            );

        doc
            .moveDown(0.5)
            .fontSize(8)
            .text(
                "This is a system-generated invoice.",
                {
                    align: "center",
                }
            );

        // Finish PDF
        doc.end();
    });
};


// ==================================
// HELPERS
// ==================================

const drawDivider = (doc: PDFKit.PDFDocument) => {
    doc
        .moveDown(0.5)
        .moveTo(50, doc.y)
        .lineTo(545, doc.y)
        .stroke()
        .moveDown(1);
};


const drawField = (
    doc: PDFKit.PDFDocument,
    label: string,
    value: string
) => {
    doc
        .fontSize(10)
        .font("Helvetica-Bold")
        .text(`${label}: `, {
            continued: true,
        })
        .font("Helvetica")
        .text(value);
};


const formatDate = (date: Date): string => {
    return new Intl.DateTimeFormat("en-NP", {
        dateStyle: "medium",
        timeStyle: "short",
    }).format(date);
};


const formatAmount = (amount: number): string => {
    return amount.toLocaleString("en-NP", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    });
};