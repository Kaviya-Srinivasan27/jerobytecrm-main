import { useState } from "react";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "@/components/DashboardLayout";

interface Complaint {
  id: string;
  label: string;
  category: string;
}

export default function Services() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<"complaints" | "booking">(
    "complaints"
  );
  const [selectedComplaints, setSelectedComplaints] = useState<string[]>([]);
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const complaints: Complaint[] = [
    {
      id: "1",
      label: "Software Crash or Malfunction",
      category: "Technical",
    },
    {
      id: "2",
      label: "Performance Issues",
      category: "Technical",
    },
    {
      id: "3",
      label: "Connection Problems",
      category: "Technical",
    },
    {
      id: "4",
      label: "Data Loss or Corruption",
      category: "Data",
    },
    {
      id: "5",
      label: "License or Activation Error",
      category: "Licensing",
    },
    {
      id: "6",
      label: "Installation Failed",
      category: "Setup",
    },
    {
      id: "7",
      label: "Feature Request",
      category: "Support",
    },
    {
      id: "8",
      label: "Billing Issue",
      category: "Billing",
    },
  ];

  const toggleComplaint = (id: string) => {
    setSelectedComplaints((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  const handleBookService = (e: React.FormEvent) => {
    e.preventDefault();

    if (!address || !phone) {
      alert("Please fill in all required fields");
      return;
    }

    if (selectedComplaints.length === 0) {
      alert("Please select at least one complaint");
      return;
    }

    // Simulate booking
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setCurrentStep("complaints");
      setSelectedComplaints([]);
      setAddress("");
      setPhone("");
    }, 2000);
  };

  if (bookingSuccess) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl mx-auto">
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Service Booking Confirmed!
            </h2>
            <p className="text-gray-600 text-lg mb-8">
              Your service request has been submitted successfully. Our team
              will contact you shortly to schedule the service.
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-left mb-8">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Booking Reference:</strong> SVC-{Date.now()}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Selected Issues:</strong> {selectedComplaints.length}{" "}
                complaint(s)
              </p>
              <p className="text-sm text-gray-600">
                <strong>Estimated Time:</strong> 24-48 hours
              </p>
            </div>
            <Button
              onClick={() => navigate("/dashboard")}
              className="bg-primary hover:bg-blue-600 text-white font-medium rounded-lg"
            >
              Back to Dashboard
            </Button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Service Booking</h1>
            <p className="text-gray-600 mt-1">
              Report issues and book a service appointment
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-12">
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              currentStep === "complaints" || currentStep === "booking"
                ? "bg-primary"
                : "bg-gray-300"
            }`}
          ></div>
          <div
            className={`flex-1 h-2 rounded-full transition-colors ${
              currentStep === "booking" ? "bg-primary" : "bg-gray-300"
            }`}
          ></div>
        </div>

        {currentStep === "complaints" ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Select Issue(s)
            </h2>

            <div className="space-y-3 mb-8">
              {complaints.map((complaint) => (
                <label
                  key={complaint.id}
                  className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedComplaints.includes(complaint.id)}
                    onChange={() => toggleComplaint(complaint.id)}
                    className="w-5 h-5 rounded border-gray-300 text-primary cursor-pointer mt-0.5"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-gray-900">
                      {complaint.label}
                    </p>
                    <p className="text-sm text-gray-500">{complaint.category}</p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate("/dashboard")}
                variant="outline"
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                onClick={() => {
                  if (selectedComplaints.length === 0) {
                    alert("Please select at least one complaint");
                    return;
                  }
                  setCurrentStep("booking");
                }}
                className="flex-1 bg-secondary hover:bg-emerald-600 text-white font-medium"
              >
                Continue ({selectedComplaints.length} selected)
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 p-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Confirm Service Booking
            </h2>

            {/* Selected Issues Summary */}
            <div className="mb-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-gray-900 mb-3">
                Selected Issues:
              </h3>
              <div className="space-y-2">
                {selectedComplaints.map((id) => {
                  const complaint = complaints.find((c) => c.id === id);
                  return (
                    <div key={id} className="flex items-center gap-2 text-sm">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-gray-700">{complaint?.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Service Details Form */}
            <form onSubmit={handleBookService} className="space-y-6">
              <div className="space-y-2">
                <Label
                  htmlFor="address"
                  className="text-sm font-medium text-gray-700"
                >
                  Service Address *
                </Label>
                <Input
                  id="address"
                  type="text"
                  placeholder="Enter your service address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="h-10 rounded-lg border-gray-200"
                  required
                />
                <p className="text-xs text-gray-500">
                  We'll autofill this from your registered address next time
                </p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="phone"
                  className="text-sm font-medium text-gray-700"
                >
                  Contact Phone Number *
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="Your contact number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 rounded-lg border-gray-200"
                  required
                />
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-amber-800">
                  <strong>Note:</strong> Our service team will contact you
                  within 24 hours to confirm the appointment.
                </p>
              </div>

              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  onClick={() => setCurrentStep("complaints")}
                  variant="outline"
                  className="flex-1"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-secondary hover:bg-emerald-600 text-white font-medium rounded-lg transition-colors"
                >
                  Book Service
                </Button>
              </div>
            </form>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
