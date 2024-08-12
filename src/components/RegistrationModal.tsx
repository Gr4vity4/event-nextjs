import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import { FormData, FormErrors, RegistrationModalProps } from "@/types";
import CloseIcon from "@mui/icons-material/Close";

const RegistrationModal = ({
  open,
  handleClose,
  eventId,
  onSubmitSuccess,
}: RegistrationModalProps) => {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    validateField(name, formData[name as keyof FormData]);
  };

  const validateField = (name: string, value: string) => {
    let error = "";
    if (!value.trim()) {
      error = "This field is required";
    } else if (name === "phoneNumber" && value.length < 10) {
      error = "Phone must be at least 10 characters";
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phoneNumber.trim())
      newErrors.phoneNumber = "Phone is required";
    if (formData.phoneNumber.length < 10)
      newErrors.phoneNumber = "Phone must be at least 10 characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      const preparedData = {
        ...formData,
        eventId,
      };
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/user-signup`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(preparedData),
          },
        );
        if (response.ok) {
          onSubmitSuccess();
        } else {
          // Handle error
          console.error("Registration failed", response);
          const errorData = await response.json();
          setApiError(
            errorData.message || "An error occurred. Please try again.",
          );
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setApiError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
        <Typography variant="h6" component="h2" mb={2}>
          Register for Event
        </Typography>
        {apiError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {apiError}
          </Alert>
        )}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            margin="normal"
            label="First Name"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.firstName && !!errors.firstName}
            helperText={touched.firstName && errors.firstName}
            inputProps={{ maxLength: 254 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Last Name"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.lastName && !!errors.lastName}
            helperText={touched.lastName && errors.lastName}
            inputProps={{ maxLength: 254 }}
          />
          <TextField
            fullWidth
            margin="normal"
            label="Phone"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            error={touched.phoneNumber && !!errors.phoneNumber}
            helperText={touched.phoneNumber && errors.phoneNumber}
            inputProps={{ maxLength: 30 }}
          />
          <Button
            type="submit"
            variant="contained"
            sx={{ width: "100%", mt: 2 }}
          >
            Submit
          </Button>
        </form>
      </Box>
    </Modal>
  );
};

export default RegistrationModal;
