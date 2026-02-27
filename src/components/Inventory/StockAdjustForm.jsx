import React, { useState } from "react";
import { Box, TextField, Button, FormControl, InputLabel, Select, MenuItem, Typography, Alert, CircularProgress } from "@mui/material";

const StockAdjustForm = ({ item, onSubmit, onCancel }) => {

    const [formData, setFormData] = useState({
        quantity: "",
        operation: "add",
        reason: "",
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const validateForm = () => {
        
        const newErrors = {};

        if (!formData.quantity || formData.quantity <= 0) {
            newErrors.quantity = "Please enter a valid quantity";
        }

        if (formData.operation === "subtract" && item && formData.quantity > item.quantity) {
            newErrors.quantity = `Cannot subtract more than current stock (${item.quantity})`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setSubmitting(true);
        try {
            await onSubmit({
                quantity: parseInt(formData.quantity),
                operation: formData.operation,
                reason: formData.reason,
            });
        } catch (error) {
            console.error("Stock adjustment error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    if (!item) return null;

    return (
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
                <Typography variant="body2">
                    <strong>Current Stock:</strong> {item.quantity} units
                </Typography>
                <Typography variant="body2">
                    <strong>SKU:</strong> {item.sku}
                </Typography>
                <Typography variant="body2">
                    <strong>Product:</strong> {item.perfume?.name} ({item.size}ml)
                </Typography>
            </Alert>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Operation</InputLabel>
                <Select name="operation" value={formData.operation} onChange={handleChange} label="Operation">
                    <MenuItem value="add">Add Stock</MenuItem>
                    <MenuItem value="subtract">Remove Stock</MenuItem>
                </Select>
            </FormControl>

            <TextField fullWidth label="Quantity" name="quantity" type="number" value={formData.quantity} onChange={handleChange} error={!!errors.quantity} helperText={errors.quantity} sx={{ mb: 2 }} required />

            <TextField fullWidth label="Reason (Optional)" name="reason" value={formData.reason} onChange={handleChange} placeholder="e.g., New shipment, Damaged goods, Sale" sx={{ mb: 3 }} />

            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                <Button variant="outlined" onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
                <Button type="submit" variant="contained" disabled={submitting} startIcon={submitting && <CircularProgress size={20} />}>
                    {submitting ? "Adjusting..." : "Adjust Stock"}
                </Button>
            </Box>
        </Box>
    );
};

export default StockAdjustForm;
