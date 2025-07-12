import { useState } from "react";
// Removed Convex imports: useMutation, api
import { toast } from "sonner"; // Assuming sonner toast library is still used

export function ProductForm({ onSuccess }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    manufacturer: "",
    batchNumber: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Replaced useMutation with a plain async function for creating a product
  const createProduct = async (productData) => {
    try {
      // Assuming your backend endpoint for creating a product is POST /api/products
      const response = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });

      const result = await response.json(); // Parse the JSON response

      if (!response.ok) {
        // If the response status is not OK (e.g., 4xx or 5xx), throw an error
        throw new Error(result.message || "Failed to create product");
      }
      return result; // Return the result from the backend (should contain the new product and QR code)
    } catch (error) {
      console.error("Error creating product:", error);
      throw error; // Re-throw to be caught by the handleSubmit's try-catch block
    }
  };

  const categories = [
    "Food & Beverages",
    "Pharmaceuticals",
    "Electronics",
    "Textiles",
    "Automotive",
    "Cosmetics",
    "Agriculture",
    "Other"
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Call the new createProduct function
      const result = await createProduct(formData);
      // Assuming the backend returns the created product with a qrCode field
      toast.success(`Product created successfully! QR Code: ${result.qrCode}`);
      
      // Reset form fields after successful submission
      setFormData({
        name: "",
        description: "",
        category: "",
        manufacturer: "",
        batchNumber: "",
      });
      
      // Call the onSuccess callback passed from the parent component
      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error("Failed to create product: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Create New Product</h2>
        <p className="text-gray-600 mt-1">Add a new product to the traceability system</p>
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Enter product description"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => setFormData({
              name: "",
              description: "",
              category: "",
              manufacturer: "",
              batchNumber: "",
            })}
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
      </form>
    </div>
  );
}