import React, { useState, useEffect } from "react";
// Dono API imports yahan hain
import { createStoreApi } from "../../../api/admin.api"; 
import { 
  getAllCategoriesApi, 
  getAllSubCategoriesApi, 
  getAllBrandsApi 
} from "../../../api/category.api"; // Yahan apni sahi path dein
import { showSuccess, showError } from "../../../utils/alertService";
import { FaStore, FaMapMarkerAlt, FaImage } from "react-icons/fa";

const StoreProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [brands, setBrands] = useState([]);

  const [formData, setFormData] = useState({
    name: "", address: "", description: "", phoneNumber: "",
    email: "", openingTime: "", closingTime: "", deliveryRadius: "",
    lat: "", lng: "", images: []
  });

  // Data Fetching
  useEffect(() => {
    const loadMasterData = async () => {
      try {
        const [cat, sub, brd] = await Promise.all([
          getAllCategoriesApi(),
          getAllSubCategoriesApi(),
          getAllBrandsApi()
        ]);
        if (cat?.success) setCategories(cat.data);
        if (sub?.success) setSubCategories(sub.data);
        if (brd?.success) setBrands(brd.data);
      } catch (err) {
        console.error("Data load error", err);
      }
    };
    loadMasterData();
  }, []);

  const handleChange = (e) => {
    if (e.target.name === "images") {
      setFormData({ ...formData, images: Array.from(e.target.files) });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    
    // Store create ka logic jo aapne diya tha
    Object.keys(formData).forEach((key) => {
      if (key === "images") {
        formData.images.forEach((file) => data.append("images", file));
      } else if (key === "lat" || key === "lng") {
        data.append("location", JSON.stringify({ lat: formData.lat, lng: formData.lng }));
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      setLoading(true);
      // createStoreApi intact hai
      const res = await createStoreApi(data);
      if (res?.success) {
        showSuccess("Store created successfully!");
      } else {
        showError(res?.message || "Failed to create store");
      }
    } catch (err) {
      showError("API Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    // ... JSX code jo aapka pehle tha
    <div className="p-6 bg-slate-50/50 min-h-screen">
       {/* UI code... */}
    </div>
  );
};

export default StoreProduct;