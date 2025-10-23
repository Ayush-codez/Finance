import React, { useState } from 'react';
import { X, Building, Mail, Phone, Globe, MapPin, DollarSign, FileText, User, Briefcase } from 'lucide-react';

const AddOrganizationModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    // Organization Details
    organizationName: '',
    organizationType: '',
    registrationNumber: '',
    establishedYear: '',
    
    // Contact Information
    contactPerson: '',
    designation: '',
    email: '',
    phone: '',
    website: '',
    
    // Address
    address: '',
    city: '',
    state: '',
    country: '',
    zipCode: '',
    
    // Loan Products
    loanTypes: [],
    minLoanAmount: '',
    maxLoanAmount: '',
    interestRateRange: '',
    
    // Additional Information
    description: '',
    specialPrograms: '',
    eligibilityCriteria: '',
    
    // Documents
    license: null,
    certificate: null
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const organizationTypes = [
    'Bank',
    'NBFC (Non-Banking Financial Company)',
    'Credit Union',
    'Government Agency',
    'Microfinance Institution',
    'Peer-to-Peer Lending Platform',
    'Fintech Company',
    'Other'
  ];

  const loanTypeOptions = [
    'Personal Loan',
    'Business Loan',
    'Home Loan',
    'Car Loan',
    'Education Loan',
    'Agricultural Loan',
    'Microfinance',
    'Startup Funding',
    'Equipment Financing',
    'Working Capital',
    'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value, type, files } = e.target;
    
    if (type === 'file') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleLoanTypeChange = (loanType) => {
    setFormData(prev => ({
      ...prev,
      loanTypes: prev.loanTypes.includes(loanType)
        ? prev.loanTypes.filter(type => type !== loanType)
        : [...prev.loanTypes, loanType]
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields validation with improved messages
    if (!formData.organizationName.trim()) {
      newErrors.organizationName = 'Organization name is required and cannot be empty';
    } else if (formData.organizationName.trim().length < 2) {
      newErrors.organizationName = 'Organization name must be at least 2 characters long';
    } else if (formData.organizationName.trim().length > 100) {
      newErrors.organizationName = 'Organization name must be less than 100 characters';
    }

    if (!formData.organizationType) {
      newErrors.organizationType = 'Please select an organization type';
    }

    if (!formData.contactPerson.trim()) {
      newErrors.contactPerson = 'Contact person name is required';
    } else if (formData.contactPerson.trim().length < 2) {
      newErrors.contactPerson = 'Contact person name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s\.]+$/.test(formData.contactPerson.trim())) {
      newErrors.contactPerson = 'Contact person name should only contain letters, spaces, and periods';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required';
    } else {
      // Enhanced email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address (e.g., contact@company.com)';
      } else if (formData.email.length > 100) {
        newErrors.email = 'Email address must be less than 100 characters';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else {
      // Enhanced phone validation
      const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,15}$/;
      const digitsOnly = formData.phone.replace(/[^0-9]/g, '');
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Please enter a valid phone number (10-15 digits)';
      } else if (digitsOnly.length < 10 || digitsOnly.length > 15) {
        newErrors.phone = 'Phone number must contain 10-15 digits';
      }
    }

    if (!formData.address.trim()) {
      newErrors.address = 'Street address is required';
    } else if (formData.address.trim().length < 10) {
      newErrors.address = 'Please enter a complete address (minimum 10 characters)';
    } else if (formData.address.trim().length > 200) {
      newErrors.address = 'Address must be less than 200 characters';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'City name is required';
    } else if (formData.city.trim().length < 2) {
      newErrors.city = 'City name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.city.trim())) {
      newErrors.city = 'City name should only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.country.trim()) {
      newErrors.country = 'Country name is required';
    } else if (formData.country.trim().length < 2) {
      newErrors.country = 'Country name must be at least 2 characters long';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.country.trim())) {
      newErrors.country = 'Country name should only contain letters, spaces, hyphens, and apostrophes';
    }

    if (formData.loanTypes.length === 0) {
      newErrors.loanTypes = 'Please select at least one loan type that your organization offers';
    }

    // Optional field validations
    if (formData.website && formData.website.trim()) {
      const urlRegex = /^https?:\/\/.+\..+/;
      if (!urlRegex.test(formData.website.trim())) {
        newErrors.website = 'Please enter a valid website URL (e.g., https://www.company.com)';
      }
    }

    if (formData.registrationNumber && formData.registrationNumber.trim()) {
      if (formData.registrationNumber.trim().length < 3) {
        newErrors.registrationNumber = 'Registration number must be at least 3 characters long';
      } else if (formData.registrationNumber.trim().length > 50) {
        newErrors.registrationNumber = 'Registration number must be less than 50 characters';
      }
    }

    if (formData.establishedYear && formData.establishedYear.trim()) {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1800 || year > currentYear) {
        newErrors.establishedYear = `Please enter a valid year between 1800 and ${currentYear}`;
      }
    }

    if (formData.zipCode && formData.zipCode.trim()) {
      const zipRegex = /^[a-zA-Z0-9\s\-]{3,10}$/;
      if (!zipRegex.test(formData.zipCode.trim())) {
        newErrors.zipCode = 'Please enter a valid ZIP/postal code (3-10 characters)';
      }
    }

    // Loan amount validations
    if (formData.minLoanAmount && formData.maxLoanAmount) {
      const minAmount = parseInt(formData.minLoanAmount);
      const maxAmount = parseInt(formData.maxLoanAmount);
      
      if (minAmount >= maxAmount) {
        newErrors.minLoanAmount = 'Minimum loan amount must be less than maximum amount';
        newErrors.maxLoanAmount = 'Maximum loan amount must be greater than minimum amount';
      }
      
      if (minAmount < 1000) {
        newErrors.minLoanAmount = 'Minimum loan amount should be at least ₹1,000';
      }
      
      if (maxAmount > 100000000) {
        newErrors.maxLoanAmount = 'Maximum loan amount seems unreasonably high';
      }
    }

    // Text field length validations
    if (formData.description && formData.description.trim().length > 1000) {
      newErrors.description = 'Organization description must be less than 1000 characters';
    }

    if (formData.specialPrograms && formData.specialPrograms.trim().length > 500) {
      newErrors.specialPrograms = 'Special programs description must be less than 500 characters';
    }

    if (formData.eligibilityCriteria && formData.eligibilityCriteria.trim().length > 500) {
      newErrors.eligibilityCriteria = 'Eligibility criteria must be less than 500 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const submitData = new FormData();
      
      // Append all form data
      Object.keys(formData).forEach(key => {
        if (key === 'loanTypes') {
          submitData.append(key, JSON.stringify(formData[key]));
        } else if (formData[key] instanceof File) {
          submitData.append(key, formData[key]);
        } else if (formData[key]) {
          submitData.append(key, formData[key]);
        }
      });

      const response = await fetch('/api/organizations/submit', {
        method: 'POST',
        body: submitData
      });

      if (response.ok) {
        setSubmitSuccess(true);
        setTimeout(() => {
          onClose();
          setSubmitSuccess(false);
          setFormData({
            organizationName: '',
            organizationType: '',
            registrationNumber: '',
            establishedYear: '',
            contactPerson: '',
            designation: '',
            email: '',
            phone: '',
            website: '',
            address: '',
            city: '',
            state: '',
            country: '',
            zipCode: '',
            loanTypes: [],
            minLoanAmount: '',
            maxLoanAmount: '',
            interestRateRange: '',
            description: '',
            specialPrograms: '',
            eligibilityCriteria: '',
            license: null,
            certificate: null
          });
        }, 2000);
      } else {
        throw new Error('Failed to submit organization');
      }
    } catch (error) {
      console.error('Error submitting organization:', error);
      setErrors({ submit: 'Failed to submit organization. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  if (submitSuccess) {
    return (
      <div className="modal-overlay">
        <div className="modal-content success-modal">
          <div className="success-content">
            <div className="success-icon">✅</div>
            <h2>Application Submitted Successfully!</h2>
            <p>Thank you for your submission. We'll review your organization details and get back to you within 2-3 business days.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content add-org-modal">
        <div className="modal-header">
          <h2>
            <Building size={24} />
            Add Your Organization
          </h2>
          <button onClick={onClose} className="modal-close-btn">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="add-org-form">
          {/* Organization Details Section */}
          <div className="form-section">
            <h3><Building size={20} /> Organization Details</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="organizationName">Organization Name *</label>
                <input
                  id="organizationName"
                  name="organizationName"
                  type="text"
                  value={formData.organizationName}
                  onChange={handleInputChange}
                  placeholder="Enter organization name"
                  className={errors.organizationName ? 'error' : ''}
                />
                {errors.organizationName && <span className="error-message">{errors.organizationName}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="organizationType">Organization Type *</label>
                <select
                  id="organizationType"
                  name="organizationType"
                  value={formData.organizationType}
                  onChange={handleInputChange}
                  className={errors.organizationType ? 'error' : ''}
                >
                  <option value="">Select type</option>
                  {organizationTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
                {errors.organizationType && <span className="error-message">{errors.organizationType}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="registrationNumber">Registration Number</label>
                <input
                  id="registrationNumber"
                  name="registrationNumber"
                  type="text"
                  value={formData.registrationNumber}
                  onChange={handleInputChange}
                  placeholder="Company/License registration number"
                />
              </div>

              <div className="form-group">
                <label htmlFor="establishedYear">Established Year</label>
                <input
                  id="establishedYear"
                  name="establishedYear"
                  type="number"
                  min="1800"
                  max={new Date().getFullYear()}
                  value={formData.establishedYear}
                  onChange={handleInputChange}
                  placeholder="YYYY"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="form-section">
            <h3><User size={20} /> Contact Information</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contactPerson">Contact Person *</label>
                <input
                  id="contactPerson"
                  name="contactPerson"
                  type="text"
                  value={formData.contactPerson}
                  onChange={handleInputChange}
                  placeholder="Full name"
                  className={errors.contactPerson ? 'error' : ''}
                />
                {errors.contactPerson && <span className="error-message">{errors.contactPerson}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="designation">Designation</label>
                <input
                  id="designation"
                  name="designation"
                  type="text"
                  value={formData.designation}
                  onChange={handleInputChange}
                  placeholder="Job title"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <div className="input-with-icon">
                  <Mail size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="contact@example.com"
                    className={errors.email ? 'error' : ''}
                  />
                </div>
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="phone">Phone Number *</label>
                <div className="input-with-icon">
                  <Phone size={20} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                    className={errors.phone ? 'error' : ''}
                  />
                </div>
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="website">Website</label>
              <div className="input-with-icon">
                <Globe size={20} />
                <input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleInputChange}
                  placeholder="https://www.example.com"
                  className={errors.website ? 'error' : ''}
                />
              </div>
              {errors.website && <span className="error-message">{errors.website}</span>}
            </div>
          </div>

          {/* Address Section */}
          <div className="form-section">
            <h3><MapPin size={20} /> Address</h3>
            
            <div className="form-group">
              <label htmlFor="address">Street Address *</label>
              <input
                id="address"
                name="address"
                type="text"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Street address"
                className={errors.address ? 'error' : ''}
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="city">City *</label>
                <input
                  id="city"
                  name="city"
                  type="text"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className={errors.city ? 'error' : ''}
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="state">State/Province</label>
                <input
                  id="state"
                  name="state"
                  type="text"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="State or province"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="country">Country *</label>
                <input
                  id="country"
                  name="country"
                  type="text"
                  value={formData.country}
                  onChange={handleInputChange}
                  placeholder="Country"
                  className={errors.country ? 'error' : ''}
                />
                {errors.country && <span className="error-message">{errors.country}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="zipCode">ZIP/Postal Code</label>
                <input
                  id="zipCode"
                  name="zipCode"
                  type="text"
                  value={formData.zipCode}
                  onChange={handleInputChange}
                  placeholder="ZIP or postal code"
                />
              </div>
            </div>
          </div>

          {/* Loan Products Section */}
          <div className="form-section">
            <h3><DollarSign size={20} /> Loan Products</h3>
            
            <div className="form-group">
              <label>Loan Types Offered *</label>
              <div className="checkbox-grid">
                {loanTypeOptions.map(type => (
                  <label key={type} className="checkbox-item">
                    <input
                      type="checkbox"
                      checked={formData.loanTypes.includes(type)}
                      onChange={() => handleLoanTypeChange(type)}
                    />
                    <span>{type}</span>
                  </label>
                ))}
              </div>
              {errors.loanTypes && <span className="error-message">{errors.loanTypes}</span>}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="minLoanAmount">Minimum Loan Amount</label>
                <input
                  id="minLoanAmount"
                  name="minLoanAmount"
                  type="number"
                  value={formData.minLoanAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 10000"
                />
              </div>

              <div className="form-group">
                <label htmlFor="maxLoanAmount">Maximum Loan Amount</label>
                <input
                  id="maxLoanAmount"
                  name="maxLoanAmount"
                  type="number"
                  value={formData.maxLoanAmount}
                  onChange={handleInputChange}
                  placeholder="e.g., 5000000"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="interestRateRange">Interest Rate Range</label>
              <input
                id="interestRateRange"
                name="interestRateRange"
                type="text"
                value={formData.interestRateRange}
                onChange={handleInputChange}
                placeholder="e.g., 8.5% - 15.5%"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="form-section">
            <h3><FileText size={20} /> Additional Information</h3>
            
            <div className="form-group">
              <label htmlFor="description">Organization Description</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Brief description of your organization and services"
                rows="4"
              />
            </div>

            <div className="form-group">
              <label htmlFor="specialPrograms">Special Programs</label>
              <textarea
                id="specialPrograms"
                name="specialPrograms"
                value={formData.specialPrograms}
                onChange={handleInputChange}
                placeholder="Any special loan programs or offers"
                rows="3"
              />
            </div>

            <div className="form-group">
              <label htmlFor="eligibilityCriteria">Eligibility Criteria</label>
              <textarea
                id="eligibilityCriteria"
                name="eligibilityCriteria"
                value={formData.eligibilityCriteria}
                onChange={handleInputChange}
                placeholder="General eligibility requirements for your loans"
                rows="3"
              />
            </div>
          </div>

          {/* Documents Section */}
          <div className="form-section">
            <h3><Briefcase size={20} /> Documents</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="license">License Document</label>
                <input
                  id="license"
                  name="license"
                  type="file"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small>Upload your license/registration certificate (PDF, JPG, PNG)</small>
              </div>

              <div className="form-group">
                <label htmlFor="certificate">Certificate</label>
                <input
                  id="certificate"
                  name="certificate"
                  type="file"
                  onChange={handleInputChange}
                  accept=".pdf,.jpg,.jpeg,.png"
                />
                <small>Upload any relevant certificates (PDF, JPG, PNG)</small>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div className="error-message submit-error">
              {errors.submit}
            </div>
          )}

          {/* Submit Section */}
          <div className="form-actions">
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-success"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddOrganizationModal;