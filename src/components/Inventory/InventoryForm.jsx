import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, MenuItem, FormControl, InputLabel, Select, FormHelperText, CircularProgress, Autocomplete } from "@mui/material";
import axios from "axios";

const InventoryForm = ({ initialData, onSubmit, onCancel }) => {

    const [formData, setFormData] = useState({
        perfume: "",
        size: "",
        sku: "",
        batchNumber: "",
        costPrice: "",
        sellingPrice: "",
        discountPercent: 0,
        quantity: 0,
        reorderLevel: 5,
        manufactureDate: "",
        expiryDate: "",
        warehouseLocation: "Main Store",
    });
    const [perfumes, setPerfumes] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const sizeOptions = [10, 20, 30, 50, 75, 100, 125, 150, 200];

    useEffect(() => {
        fetchPerfumes();
        if (initialData) {
            setFormData({
                ...initialData,
                perfume: initialData.perfume?._id || initialData.perfume,
                manufactureDate: initialData.manufactureDate ? new Date(initialData.manufactureDate).toISOString().split("T")[0] : "",
                expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split("T")[0] : "",
            });
        }
    }, [initialData]);

    const fetchPerfumes = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/perfumeMasters?limit=100");
            setPerfumes(response.data.data);
        } catch (error) {
            console.error("Error fetching perfumes:", error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.perfume) newErrors.perfume = "Perfume is required";
        if (!formData.size) newErrors.size = "Size is required";
        if (!formData.sku) newErrors.sku = "SKU is required";
        if (!formData.batchNumber) newErrors.batchNumber = "Batch number is required";
        if (!formData.costPrice || formData.costPrice <= 0) newErrors.costPrice = "Valid cost price is required";
        if (!formData.sellingPrice || formData.sellingPrice <= 0) newErrors.sellingPrice = "Valid selling price is required";
        if (formData.discountPercent < 0 || formData.discountPercent > 100) {
            newErrors.discountPercent = "Discount must be between 0 and 100";
        }
        if (formData.quantity < 0) newErrors.quantity = "Quantity cannot be negative";
        if (formData.reorderLevel < 0) newErrors.reorderLevel = "Reorder level cannot be negative";
        if (formData.expiryDate && new Date(formData.expiryDate) < new Date()) {
            newErrors.expiryDate = "Expiry date cannot be in the past";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await onSubmit(formData);
        } catch (error) {
            console.error("Form submission error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const calculateProfit = () => {
        const cost = parseFloat(formData.costPrice) || 0;
        const selling = parseFloat(formData.sellingPrice) || 0;
        const discount = parseFloat(formData.discountPercent) || 0;
        const discountedPrice = selling * (1 - discount / 100);
        const profit = discountedPrice - cost;
        const margin = cost > 0 ? (profit / cost) * 100 : 0;
        return { profit: profit.toFixed(2), margin: margin.toFixed(1) };
    };

    const { profit, margin } = calculateProfit();

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
                {/* Perfume Selection */}
                <Grid item xs={12}>
                    <Autocomplete
                        options={perfumes}
                        getOptionLabel={(option) => (option.name ? `${option.name} (${option.brand})` : "")}
                        value={perfumes.find((p) => p._id === formData.perfume) || null}
                        onChange={(event, newValue) => {
                            setFormData((prev) => ({
                                ...prev,
                                perfume: newValue ? newValue._id : "",
                            }));
                            if (errors.perfume) {
                                setErrors((prev) => ({ ...prev, perfume: "" }));
                            }
                        }}
                        renderInput={(params) => <TextField {...params} label="Select Perfume" error={!!errors.perfume} helperText={errors.perfume} required />}
                        loading={loading}
                    />
                </Grid>

                {/* Size */}
                <Grid item xs={6}>
                    <FormControl fullWidth error={!!errors.size} required>
                        <InputLabel>Size (ml)</InputLabel>
                        <Select name="size" value={formData.size} onChange={handleChange} label="Size (ml)">
                            {sizeOptions.map((size) => (
                                <MenuItem key={size} value={size}>
                                    {size} ml
                                </MenuItem>
                            ))}
                        </Select>
                        {errors.size && <FormHelperText>{errors.size}</FormHelperText>}
                    </FormControl>
                </Grid>

                {/* SKU */}
                <Grid item xs={6}>
                    <TextField fullWidth label="SKU" name="sku" value={formData.sku} onChange={handleChange} error={!!errors.sku} helperText={errors.sku} required />
                </Grid>

                {/* Batch Number */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Batch Number" name="batchNumber" value={formData.batchNumber} onChange={handleChange} error={!!errors.batchNumber} helperText={errors.batchNumber} required />
                </Grid>

                {/* Cost Price */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Cost Price" name="costPrice" type="number" value={formData.costPrice} onChange={handleChange} error={!!errors.costPrice} helperText={errors.costPrice} InputProps={{ startAdornment: "₹" }} required />
                </Grid>

                {/* Selling Price */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Selling Price" name="sellingPrice" type="number" value={formData.sellingPrice} onChange={handleChange} error={!!errors.sellingPrice} helperText={errors.sellingPrice} InputProps={{ startAdornment: "₹" }} required />
                </Grid>

                {/* Discount */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Discount %" name="discountPercent" type="number" value={formData.discountPercent} onChange={handleChange} error={!!errors.discountPercent} helperText={errors.discountPercent} InputProps={{ endAdornment: "%" }} />
                </Grid>

                {/* Profit Calculator */}
                <Grid item xs={12}>
                    <Box
                        sx={{
                            bgcolor: "#f5f5f5",
                            p: 1.5,
                            borderRadius: 1,
                            display: "flex",
                            justifyContent: "space-around",
                        }}
                    >
                        <Typography variant="body2">
                            Expected Profit: <strong>₹{profit}</strong>
                        </Typography>
                        <Typography variant="body2">
                            Margin: <strong>{margin}%</strong>
                        </Typography>
                    </Box>
                </Grid>

                {/* Quantity */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} error={!!errors.quantity} helperText={errors.quantity} />
                </Grid>

                {/* Reorder Level */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Reorder Level" name="reorderLevel" type="number" value={formData.reorderLevel} onChange={handleChange} error={!!errors.reorderLevel} helperText={errors.reorderLevel} />
                </Grid>

                {/* Manufacture Date */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Manufacture Date" name="manufactureDate" type="date" value={formData.manufactureDate} onChange={handleChange} InputLabelProps={{ shrink: true }} />
                </Grid>

                {/* Expiry Date */}
                <Grid item xs={6}>
                    <TextField fullWidth label="Expiry Date" name="expiryDate" type="date" value={formData.expiryDate} onChange={handleChange} error={!!errors.expiryDate} helperText={errors.expiryDate} InputLabelProps={{ shrink: true }} />
                </Grid>

                {/* Warehouse Location */}
                <Grid item xs={12}>
                    <TextField fullWidth label="Warehouse Location" name="warehouseLocation" value={formData.warehouseLocation} onChange={handleChange} />
                </Grid>

                {/* Form Actions */}
                <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end", mt: 2 }}>
                        <Button variant="outlined" onClick={onCancel} disabled={submitting}>
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting && <CircularProgress size={20} />}>
                            {submitting ? "Saving..." : initialData ? "Update" : "Create"}
                        </Button>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default InventoryForm;
