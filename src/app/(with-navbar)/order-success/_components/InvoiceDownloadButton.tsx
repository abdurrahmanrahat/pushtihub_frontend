"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { toast } from "sonner";
pdfMake.vfs = pdfFonts.vfs;

export const InvoiceDownloadButton = ({ order }: { order: any }) => {
  const handleDownload = () => {
    const customer = order.customerInfo;

    /* ----------------------------------------------------
       BUILD VARIANT LABELS FOR PDF (weight / size / color)
    ----------------------------------------------------- */
    const formatVariants = (selectedVariants: any[]) => {
      const map: Record<string, string> = {
        weight: "",
        size: "",
        color: "",
      };

      selectedVariants.forEach((v) => {
        map[v.type] = v.item.value;
      });

      let out = "";
      if (map.weight) out += `weight: ${map.weight}\n`;
      if (map.size) out += `size: ${map.size}\n`;
      if (map.color) out += `color: ${map.color}\n`;

      return out.trim();
    };

    /* ----------------------------------------------------
       PDF STRUCTURE
    ----------------------------------------------------- */
    const docDefinition: any = {
      content: [
        // TITLE
        {
          text: "Invoice",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },

        // HEADER DETAILS
        {
          columns: [
            [
              { text: "Pushtihub", style: "shopName" },
              { text: "Eat Healthy. Live Healthy.", style: "subText" },
              { text: "Email: contact.pushtihub@gmail.com", style: "subText" },
              {
                text: "Phone: +880 1332-641071",
                style: "subText",
                margin: [0, 0, 0, 20],
              },
            ],
            {
              alignment: "right",
              stack: [
                {
                  text: `Invoice No: ${order.orderNumber}`,
                  style: "rightText",
                },
                {
                  text: `Date: ${new Date(order.createdAt).toLocaleDateString(
                    "en-GB"
                  )}`,
                  style: "rightText",
                },
                {
                  text: `Payment Method: ${order.paymentDetails.method}`,
                  style: "rightText",
                },
                {
                  text: `Payment Number: ${
                    order.paymentDetails.phone || "N/A"
                  }`,
                  style: "rightText",
                },
                {
                  text: `Transaction ID: ${
                    order.paymentDetails.transactionId || "N/A"
                  }`,
                  style: "rightText",
                },
                { text: `Status: ${order.status}`, style: "rightText" },
              ],
            },
          ],
        },

        // BILLING DETAILS
        { text: "Bill To:", style: "sectionTitle", margin: [0, 15, 0, 5] },

        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  text: `${customer.fullName}\n${customer.fullAddress}\n${customer.country}\n${customer.phone}`,
                  margin: [5, 5],
                },
                {
                  text: `Shipping: ${
                    order.shippingOption === "dhaka"
                      ? "Inside Dhaka (1–2 Days)"
                      : "Outside Dhaka (2–4 Days)"
                  }`,
                  margin: [5, 5],
                },
              ],
            ],
          },
        },

        // ORDER ITEMS
        { text: "Order Items", style: "sectionTitle", margin: [0, 20, 0, 8] },

        {
          table: {
            headerRows: 1,
            widths: ["auto", "*", "auto", "auto"],
            body: [
              [
                { text: "SL", style: "tableHeader" },
                { text: "Product", style: "tableHeader" },
                { text: "Qty", style: "tableHeader" },
                { text: "Amount (TK)", style: "tableHeader" },
              ],

              ...order.orderItems.map((item: any, i: number) => {
                const variantText = formatVariants(item.selectedVariants);

                return [
                  i + 1,
                  `${item.product.name}\n${variantText}`,
                  item.quantity,
                  (item.unitSellingPrice * item.quantity).toFixed(2),
                ];
              }),
            ],
          },
        },

        // TOTAL SECTION
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Subtotal", `TK ${order.subtotal.toFixed(2)}`],
              ["Shipping", `TK ${order.shippingCost.toFixed(2)}`],
              [
                { text: "Total", bold: true },
                { text: `TK ${order.total.toFixed(2)}`, bold: true },
              ],
            ],
          },
          layout: "lightHorizontalLines",
          margin: [0, 10, 0, 0],
        },

        // THANK YOU MESSAGE
        {
          text: "\nThank you for choosing Pushtihub!",
          alignment: "center",
          margin: [0, 20, 0, 0],
          italics: true,
        },
      ],

      // PDF STYLES
      styles: {
        header: { fontSize: 22, bold: true },
        shopName: { fontSize: 14, bold: true },
        subText: { fontSize: 10, color: "gray" },
        rightText: { fontSize: 10 },
        sectionTitle: { fontSize: 12, bold: true },
        tableHeader: { fontSize: 11, bold: true, fillColor: "#f2f2f2" },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`${order.orderNumber}_invoice.pdf`);

    toast.success("Invoice download successfully! Check your file.");
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <FileDown className="h-4 w-4 mr-2" />
      Download Invoice
    </Button>
  );
};
