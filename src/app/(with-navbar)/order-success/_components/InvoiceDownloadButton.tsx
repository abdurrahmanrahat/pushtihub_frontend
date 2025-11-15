"use client";

import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";

pdfMake.vfs = pdfFonts.vfs;

type TInvoiceButtonProps = {
  order: any;
};

export const InvoiceDownloadButton = ({ order }: TInvoiceButtonProps) => {
  const handleDownload = () => {
    const docDefinition: any = {
      content: [
        {
          text: "Invoice",
          style: "header",
          alignment: "center",
          margin: [0, 0, 0, 20],
        },
        {
          columns: [
            [
              { text: "Gadgetoria", style: "shopName" },
              {
                text: "Smart, Affordable & Problem-Solving Products",
                style: "subText",
              },
              { text: "Email: support@gadgetoria.com", style: "subText" },
              {
                text: "Phone: +880-1788888888",
                style: "subText",
                margin: [0, 0, 0, 20],
              },
            ],
            [
              {
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
                    text: `Payment: ${order.paymentMethod}`,
                    style: "rightText",
                  },
                  { text: `Status: ${order.status}`, style: "rightText" },
                ],
                alignment: "right",
              },
            ],
          ],
        },
        { text: "Bill To:", style: "sectionTitle", margin: [0, 10, 0, 5] },
        {
          table: {
            widths: ["*", "*"],
            body: [
              [
                {
                  text: `${order.fullName}\n${order.fullAddress}\n${order.country}\n${order.phone}`,
                  border: [true, true, true, true],
                  margin: [5, 5],
                },
                {
                  text: `Shipping Option: ${
                    order.shippingOption === "dhaka"
                      ? "Inside Dhaka (2-3 Days)"
                      : "Outside Dhaka (3-5 Days)"
                  }`,
                  border: [true, true, true, true],
                  margin: [5, 5],
                },
              ],
            ],
          },
          layout: "noHorizontalsLines",
        },
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
                { text: "Amount ($)", style: "tableHeader" },
              ],
              ...order.orderItems.map((item: any, i: number) => [
                i + 1,
                item.product.name,
                item.quantity,
                (item.product.sellingPrice * item.quantity).toFixed(2),
              ]),
            ],
          },
        },
        {
          text: "",
          margin: [0, 10, 0, 0],
        },
        {
          table: {
            widths: ["*", "auto"],
            body: [
              ["Subtotal", `$${order.subtotal.toFixed(2)}`],
              ["Shipping", `$${(order.total - order.subtotal).toFixed(2)}`],
              [
                { text: "Total", bold: true },
                { text: `$${order.total.toFixed(2)}`, bold: true },
              ],
            ],
          },
          layout: "lightHorizontalLines",
        },
        {
          text: "\nThank you for shopping with Gadgetoria!",
          alignment: "center",
          margin: [0, 20, 0, 0],
          italics: true,
          fontSize: 12,
        },
      ],
      styles: {
        header: { fontSize: 20, bold: true },
        shopName: { fontSize: 14, bold: true },
        subText: { fontSize: 10, color: "gray" },
        rightText: { fontSize: 10 },
        sectionTitle: { fontSize: 12, bold: true },
        tableHeader: { bold: true, fillColor: "#f2f2f2" },
      },
    };

    pdfMake
      .createPdf(docDefinition)
      .download(`${order.orderNumber}_invoice.pdf`);
  };

  return (
    <Button onClick={handleDownload} variant="outline">
      <FileDown className="h-4 w-4 mr-2" />
      Download Invoice
    </Button>
  );
};
