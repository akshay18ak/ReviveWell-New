import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Landing.css';

const Landing = () => {
  return (
    <div className="landing-container">
      {/* Background Shapes */}
      <div className="shape shape1"></div>
      <div className="shape shape2"></div>
      <div className="shape shape3"></div>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1>Welcome to ReviveWell</h1>
          <p className="hero-subtitle">Your Journey to Better Health Starts Here</p>
          <div className="cta-buttons">
            <Link to="/register" className="cta-button primary">Get Started</Link>
            <Link to="/login" className="cta-button secondary">Login</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/images/healthcare-hero.png" alt="Healthcare illustration" />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose ReviveWell?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">🏥</div>
            <h3>Expert Care</h3>
            <p>Connect with qualified healthcare professionals</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Easy Access</h3>
            <p>Book appointments and consultations online</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Health Tracking</h3>
            <p>Monitor your progress and health metrics</p>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="cta-section">
        <h2>Ready to Take Control of Your Health?</h2>
        <p>Join thousands of satisfied users who have transformed their healthcare journey with ReviveWell</p>
        <Link to="/register" className="cta-button primary large">Join ReviveWell Today</Link>
      </section>
    </div>
  );
};

export default Landing;
