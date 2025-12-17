
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-center">
      {title && (
        <h1 className="text-4xl md:text-6xl font-black text-center mb-12 drop-shadow-lg text-white">
          {title}
        </h1>
      )}
      <div className="w-full bg-white/10 backdrop-blur-md rounded-3xl p-6 md:p-10 shadow-2xl border border-white/20">
        {children}
      </div>
    </div>
  );
};

export default Layout;
