import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Download,
  FileText,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";
import { generateInvoice } from "@/lib/invoiceGenerator";

interface Invoice {
  invoiceNo: string;
  date: string;
  total: number;
  items: {
    productId: string;
    name: string;
    price: number;
    quantity: number;
  }[];
}

interface Report {
  id: string;
  title: string;
  type: "product" | "service";
  date: string;
  fileSize: string;
}

export default function Invoices() {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<"invoices" | "reports">(
    "invoices"
  );
  const [invoices, setInvoices] = useState<Invoice[]>([]);

  useEffect(() => {
    const storedCustomer = localStorage.getItem("currentCustomer");
    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }

    const savedInvoices = localStorage.getItem("invoices");
    if (savedInvoices) {
      setInvoices(JSON.parse(savedInvoices));
    }
  }, []);

  const reports: Report[] = [
    {
      id: "1",
      title: "Q4 2024 Product Usage Report",
      type: "product",
      date: "2024-01-10",
      fileSize: "2.3 MB",
    },
    {
      id: "2",
      title: "Service History Report - 2024",
      type: "service",
      date: "2024-01-15",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      title: "Annual Performance Report",
      type: "product",
      date: "2024-01-20",
      fileSize: "3.1 MB",
    },
    {
      id: "4",
      title: "Service Quality Assessment",
      type: "service",
      date: "2024-02-01",
      fileSize: "1.2 MB",
    },
  ];

  const handleDownload = (invoice: Invoice) => {
    generateInvoice(invoice.items, "Kaviya", "ggg@gmail.com", invoice.invoiceNo);
  };

  if (!customer) {
    return (
      <DashboardLayout>
        <div className="text-center py-16">Loading...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Invoices & Reports
            </h1>
            <p className="text-gray-600 mt-1">
              Download your financial documents and reports
            </p>
          </div>
        </div>

        {/* Customer Type Info */}
        <div className="mb-8 p-4 rounded-lg border border-blue-200 bg-blue-50">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-blue-900 mb-1">Account Type:</p>
              <p className="text-blue-800">
                {customer.type === "both"
                  ? "You have access to both Product and Service documents"
                  : customer.type === "product"
                  ? "You have access to Product invoices and reports only"
                  : "You have access to Service invoices and reports only"}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-gray-200">
          <button
            onClick={() => setActiveTab("invoices")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "invoices"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Invoices
            <span className="ml-2 text-sm text-gray-500">
              ({invoices.length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab("reports")}
            className={`px-6 py-3 font-medium border-b-2 transition-colors ${
              activeTab === "reports"
                ? "text-primary border-primary"
                : "text-gray-600 border-transparent hover:text-gray-900"
            }`}
          >
            Reports
            <span className="ml-2 text-sm text-gray-500">
              ({reports.length})
            </span>
          </button>
        </div>

        {/* Content */}
        {activeTab === "invoices" ? (
          <div className="space-y-4">
            {invoices.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No invoices available</p>
              </div>
            ) : (
              invoices.map((invoice) => (
                <div
                  key={invoice.invoiceNo}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">
                          {invoice.invoiceNo}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700">
                          Product
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm mb-2">
                        Generated invoice for your order
                      </p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {invoice.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3">
                      <p className="text-2xl font-bold text-primary">
                        ₹{invoice.total.toLocaleString("en-IN")}
                      </p>
                      <Button
                        onClick={() => handleDownload(invoice)}
                        className="bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {reports.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No reports available</p>
              </div>
            ) : (
              reports.map((report) => (
                <div
                  key={report.id}
                  className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4 flex-col sm:flex-row">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <FileText className="w-5 h-5 text-primary" />
                        <h3 className="font-semibold text-gray-900">
                          {report.title}
                        </h3>
                        <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                          {report.type === "product" ? "Product" : "Service"}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                                                    {new Date(report.date).toLocaleDateString()}
                        </div>
                        <span>{report.fileSize}</span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleDownload(report as any)}
                      className="bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}