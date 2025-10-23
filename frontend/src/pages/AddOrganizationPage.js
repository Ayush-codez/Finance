import React, { useState } from 'react';
import { Building, CheckCircle, Clock, FileText, Users, DollarSign } from 'lucide-react';
import AddOrganizationModal from '../components/AddOrganizationModal';

const AddOrganizationPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const benefits = [
    {
      icon: Users,
      title: "Reach More Customers",
      description: "Connect with thousands of loan seekers actively comparing options"
    },
    {
      icon: DollarSign,
      title: "Increase Loan Volume",
      description: "Boost your loan portfolio with qualified leads from our platform"
    },
    {
      icon: Building,
      title: "Build Brand Trust",
      description: "Establish credibility through verified organization status"
    },
    {
      icon: FileText,
      title: "Detailed Product Showcase",
      description: "Showcase your loan products with comprehensive details and features"
    }
  ];

  const steps = [
    {
      step: 1,
      title: "Submit Application",
      description: "Fill out our comprehensive organization form with your details"
    },
    {
      step: 2,
      title: "Document Verification",
      description: "We verify your credentials and licensing documentation"
    },
    {
      step: 3,
      title: "Review Process",
      description: "Our team reviews your application within 2-3 business days"
    },
    {
      step: 4,
      title: "Go Live",
      description: "Once approved, your organization appears on our platform"
    }
  ];

  const requirements = [
    "Valid business license or registration",
    "Minimum 2 years of operation",
    "Proper financial licensing (NBFC, Banking, etc.)",
    "Clear loan terms and eligibility criteria",
    "Competitive interest rates",
    "Good business reputation and reviews"
  ];

  return (
    <div className="add-organization-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>
                <Building className="hero-icon" />
                Join Our Lending Network
              </h1>
              <p className="hero-subtitle">
                Connect with thousands of loan seekers and grow your business. 
                Become a trusted partner in our comprehensive loan comparison platform.
              </p>
              <div className="hero-stats">
                <div className="stat">
                  <div className="stat-number">10,000+</div>
                  <div className="stat-label">Monthly Loan Seekers</div>
                </div>
                <div className="stat">
                  <div className="stat-number">500+</div>
                  <div className="stat-label">Partner Organizations</div>
                </div>
                <div className="stat">
                  <div className="stat-number">₹50Cr+</div>
                  <div className="stat-label">Loans Facilitated</div>
                </div>
              </div>
              <button 
                className="btn btn-success btn-lg"
                onClick={() => setIsModalOpen(true)}
              >
                Apply to Join Now
              </button>
            </div>
            <div className="hero-image">
              <div className="hero-card">
                <Building size={48} className="card-icon" />
                <h3>Trusted Partners</h3>
                <p>Join leading financial institutions already on our platform</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="benefits-section">
        <div className="container">
          <div className="section-header">
            <h2>Why Partner With Us?</h2>
            <p>Discover the advantages of joining our lending network</p>
          </div>
          <div className="benefits-grid">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <div key={index} className="benefit-card">
                  <div className="benefit-icon">
                    <IconComponent size={32} />
                  </div>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="how-it-works-section">
        <div className="container">
          <div className="section-header">
            <h2>How It Works</h2>
            <p>Simple 4-step process to join our platform</p>
          </div>
          <div className="steps-container">
            {steps.map((step, index) => (
              <div key={step.step} className="step-card">
                <div className="step-number">{step.step}</div>
                <div className="step-content">
                  <h3>{step.title}</h3>
                  <p>{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="step-connector" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="requirements-section">
        <div className="container">
          <div className="requirements-content">
            <div className="requirements-text">
              <h2>
                <CheckCircle className="section-icon" />
                Eligibility Requirements
              </h2>
              <p>
                To ensure quality and trust on our platform, we have specific requirements 
                for organizations looking to join our lending network.
              </p>
              <ul className="requirements-list">
                {requirements.map((requirement, index) => (
                  <li key={index} className="requirement-item">
                    <CheckCircle size={16} className="check-icon" />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="requirements-cta">
              <div className="cta-card">
                <Clock size={32} className="cta-icon" />
                <h3>Quick Review Process</h3>
                <p>
                  Our team reviews applications within 2-3 business days. 
                  Get started today and join our growing network of trusted lenders.
                </p>
                <button 
                  className="btn btn-success"
                  onClick={() => setIsModalOpen(true)}
                >
                  Submit Application
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="faq-section">
        <div className="container">
          <div className="section-header">
            <h2>Frequently Asked Questions</h2>
          </div>
          <div className="faq-grid">
            <div className="faq-item">
              <h3>Is there a fee to join?</h3>
              <p>No, joining our platform is completely free. We only succeed when you succeed.</p>
            </div>
            <div className="faq-item">
              <h3>How long does the approval process take?</h3>
              <p>Our review process typically takes 2-3 business days once we receive your complete application.</p>
            </div>
            <div className="faq-item">
              <h3>What types of organizations can apply?</h3>
              <p>Banks, NBFCs, credit unions, microfinance institutions, and other licensed financial organizations.</p>
            </div>
            <div className="faq-item">
              <h3>Can I update my organization details later?</h3>
              <p>Yes, you can update your organization profile and loan products anytime through our partner portal.</p>
            </div>
            <div className="faq-item">
              <h3>How do I manage my loan applications?</h3>
              <p>We provide a dedicated dashboard to manage applications, track performance, and communicate with customers.</p>
            </div>
            <div className="faq-item">
              <h3>What support do you provide?</h3>
              <p>We offer dedicated account management, technical support, and marketing assistance to all partners.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="final-cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Grow Your Lending Business?</h2>
            <p>
              Join hundreds of financial institutions already benefiting from our platform. 
              Start your application today and connect with qualified borrowers.
            </p>
            <button 
              className="btn btn-success btn-lg"
              onClick={() => setIsModalOpen(true)}
            >
              Start Your Application
            </button>
          </div>
        </div>
      </section>

      {/* Add Organization Modal */}
      <AddOrganizationModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />
    </div>
  );
};

export default AddOrganizationPage;