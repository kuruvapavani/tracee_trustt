import { useState } from "react";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid"; // for generating unique QR codes

export function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [qrCode, setQrCode] = useState(null);

  const categories = [
    "Food & Beverages",
    "Pharmaceuticals",
    "Electronics",
    "Textiles",
    "Automotive",
    "Cosmetics",
    "Agriculture",
    "Other",
  ];

  // Helper: Add step to backend
  const addStep = async (qrCode, stepType, description, location) => {
    const token = localStorage.getItem("token"); // Retrieve token for authenticated request
    if (!token) {
      throw new Error("Authentication token not found. Please log in.");
    }

    const response = await fetch(
      `${process.env.REACT_APP_BASE_URL}/api/products/${qrCode}/steps`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Add Authorization header
        },
        body: JSON.stringify({ stepType, description, location }),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.message || `Failed to add step: ${stepType}`);
    }
    return result;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const generatedQrCode = `QR-${uuidv4()}`;
    const token = localStorage.getItem("token"); // Retrieve token for authenticated request

    if (!token) {
      toast.error("Authentication token not found. Please log in.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create the product
      const response = await fetch(
        `${process.env.REACT_APP_BASE_URL}/api/products`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Corrected Authorization header
          },
          body: JSON.stringify({
            name: formData.name,
            description: formData.description,
            qrCode: generatedQrCode,
            category: formData.category, // Include category
            manufacturer: formData.manufacturer, // Include manufacturer
            batchNumber: formData.batchNumber, // Include batchNumber
          }),
        }
      );

      const product = await response.json();
      if (!response.ok) {
        throw new Error(product.message || "Failed to create product");
      }

      setQrCode(generatedQrCode);

      // Step 2: Add traceability steps
      const steps = [];

      for (const step of steps) {
        await addStep(
          generatedQrCode,
          step.stepType,
          step.description,
          step.location
        ); // Use generatedQrCode
      }

      toast.success(`Product created with QR Code: ${generatedQrCode}`);
      setFormData({
        name: "",
        description: "",
        category: "",
        manufacturer: "",
        batchNumber: "",
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
        <p className="text-gray-600 mt-1">
          Add a new product to the traceability system
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter product name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Manufacturer *
            </label>
            <input
              type="text"
              name="manufacturer"
              value={formData.manufacturer}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter manufacturer name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Batch Number *
            </label>
            <input
              type="text"
              name="batchNumber"
              value={formData.batchNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter batch number"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                name: "",
                description: "",
                category: "",
                manufacturer: "",
                batchNumber: "",
              })
            }
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </div>
            ) : (
              "Create Product"
            )}
          </button>
        </div>

        {qrCode && (
          <div className="mt-4 p-4 bg-green-50 text-green-800 rounded-lg font-medium">
            Product created! QR Code:{" "}
            <span className="font-bold">{qrCode}</span>
          </div>
        )}
      </form>
    </div>
  );
}
