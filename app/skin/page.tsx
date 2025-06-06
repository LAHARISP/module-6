'use client'; // Mark this file as a client component

import React, { useState, useEffect } from 'react';

const App = () => {
  const [currentContainer, setCurrentContainer] = useState(0);

  const containers = [
    { title: "Welcome to Silk and Sage", content: "Experience luxury like never before. A blend of timeless silk and natural sage." },
    { title: "Our Vision", content: "Silk and Sage strives to bring you the finest products that balance elegance with nature." },
    { title: "Handcrafted Quality", content: "Each piece is handcrafted with precision and love, ensuring a lasting legacy." },
    { title: "Sustainability", content: "We are committed to sustainability, ensuring every product is eco-friendly and ethically sourced." },
    { title: "Customer Satisfaction", content: "Your satisfaction is our priority. We provide exceptional customer service." }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentContainer((prev) => (prev + 1) % containers.length);
    }, 5000); // Change container every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="relative min-h-screen bg-cover bg-center" style={{ backgroundImage: 'url(/images/background.jpg)' }}>
      <div className="absolute inset-0 bg-white opacity-50"></div> {/* White translucent overlay */}
      
      <div className="absolute top-5 left-5">
        <button
          onClick={handleGoBack}
          className="text-white bg-gray-800 px-4 py-2 rounded-full hover:bg-gray-600"
        >
          Go Back
        </button>
      </div>

      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-8 max-w-md bg-gray-100 bg-opacity-75 rounded-xl shadow-xl">
          <h2 className="text-3xl font-semibold text-gray-800">{containers[currentContainer].title}</h2>
          <p className="text-lg text-gray-600 mt-4">{containers[currentContainer].content}</p>
        </div>
      </div>
    </div>
  );
};

export default App;
