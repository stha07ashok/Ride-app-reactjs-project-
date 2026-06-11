import React, { useState } from "react";
import namlorides from "../images/namlorides.png";

export default function LandingPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your submit logic here
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans flex flex-col justify-between">
      {/* 2. Hero Section */}
      <main className="max-w-7xl w-full mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-8 pb-16">
        {/* Left Content */}
        <div className="lg:col-span-5 space-y-6">
          <p className="text-gray-500 font-semibold uppercase tracking-wider text-sm">
            Your Journey, Our Passion
          </p>
          <h1 className="text-5xl lg:text-6xl font-black  leading-tight">
            Namlo <br />
            Rides
          </h1>
          <p className="text-2xl text-gray-700 font-medium">
            Premium Ride Solutions
          </p>
          <div className="pt-4 flex items-center space-x-6">
            <button className="bg-black text-white px-8 py-3 rounded-md font-bold hover:bg-gray-800 transition shadow-[0_0_200px_rgba(234,179,8,1)] hover:scale-500 duration-500">
              Get Started
            </button>
            <button className="  font-bold underline underline-offset-4 hover:text-gray-600 transition">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Graphics (Car, Persons, Mobile) */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end relative ">
          {/* Replace the placeholder below with your uploaded asset path */}
          <img
            src={namlorides}
            alt="Namlo Rides Illustration"
            className="w-full max-w-2xl h-auto object-contain"
          />
        </div>
      </main>

      <hr className="border-gray-300 w-full shadow-lg" />

      {/* 3. Footer / Info Section */}
      <footer className="bg-white max-w-7xl w-full mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* About Info */}
        <div className="lg:col-span-5 space-y-6">
          <h2 className="text-2xl font-black text-black">About Namlo Rides,</h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-4">
              <span className="text-2xl mt-1">📰</span>
              <div>
                <h4 className="font-bold text-black">Our Story</h4>
                <p className="text-sm text-gray-500">(text description)</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl mt-1">🚖</span>
              <div>
                <h4 className="font-bold text-black">Our Fleet</h4>
                <p className="text-sm text-gray-500">(text description)</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <span className="text-2xl mt-1">👥</span>
              <div>
                <h4 className="font-bold text-black">Our Team</h4>
                <p className="text-sm text-gray-500">(text description)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form & Info */}
        <div className="lg:col-span-7 space-y-6 w-full">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h2 className="text-2xl font-black text-black">Contact Us</h2>
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 text-sm text-gray-700">
              <div className="flex items-center space-x-2">
                <span>📧</span>
                <a
                  href="mailto:info@namlo-rides.com"
                  className="hover:underline"
                >
                  info@namlo-rides.com
                </a>
              </div>
              <div className="flex items-center space-x-2">
                <span>📞</span>
                <a href="tel:+15551234567" className="hover:underline">
                  +1 (555) 123-4567
                </a>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input
                type="text"
                placeholder="Name"
                className="w-full bg-gray-100 border-none rounded p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email"
                className="w-full bg-gray-100 border-none rounded p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3 items-end">
              <input
                type="text"
                placeholder="Message"
                className="w-full bg-gray-100 border-none rounded p-3 text-sm focus:ring-2 focus:ring-yellow-500 outline-none"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
              />
              <button
                type="submit"
                className="w-full sm:w-auto bg-black text-yellow-500 font-bold px-6 py-3 rounded text-sm whitespace-nowrap hover:bg-gray-800 transition"
              >
                Send Message
              </button>
            </div>
          </form>

          {/* Copyright & Socials */}
          <div className="pt-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>© Copyright info - Lorem lived.</p>
            <div className="flex space-x-4 text-sm text-gray-700">
              <a href="#" className="hover:text-black">
                🐦
              </a>
              <a href="#" className="hover:text-black">
                👤
              </a>
              <a href="#" className="hover:text-black">
                📸
              </a>
              <a href="#" className="hover:text-black">
                💼
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
