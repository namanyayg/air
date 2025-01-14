'use client';

import React from 'react';
import CoalMap from '@/components/map/CoalMap';
import NewsSection from '@/components/NewsSection';
import { Button } from '@/components/ui/button';
import { Share2 } from 'lucide-react';

export default function CoalPage() {
  return (
    <div className="min-h-screen bg-slate-50 w-full pb-12">
      <div className="max-w-3xl mx-auto">
        {/* Hero Section */}
        <div className="text-center pt-8 pb-12">
          <h1 className="font-serif text-4xl font-bold mb-4 text-slate-800 leading-tight">
            The Hidden Cost of Coal Power in India
          </h1>
          <p className="font-serif text-xl text-slate-600">
            Every breath we take is being affected by untreated coal power plants in our neighborhood.
          </p>
        </div>

        {/* Problem Section */}
        <div className="px-5 py-5 bg-white">
          <h2 className="font-serif text-2xl font-bold mb-6 text-slate-800">Understanding the Problem</h2>
          <div className="space-y-6">
            <p className="text-lg text-slate-600">
              Imagine breathing in smoke from 100s of cigarettes every day. That&apos;s what living near an untreated coal power plant feels like.
            </p>
            <p className="text-lg text-slate-600">
              These power plants release dangerous chemicals into the air we breathe, making our children sick and causing breathing problems for everyone.
            </p>
            <p className="text-lg text-slate-600">
              The red areas on the map show where these plants are located - the darker the red, the more pollution in that area.
            </p>
          </div>
        </div>

        {/* Map Section */}
        <div className="px-5 py-8">
          <div className="aspect-[4/3] w-full">
            <CoalMap />
          </div>
        </div>

        {/* Solution Section */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl font-bold mb-6 text-slate-800">What Can We Do?</h2>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-lg text-slate-600 mb-4">
              The solution is simple: Power plants need to install air cleaning equipment. The government has rules for this, but many plants don&apos;t follow them.
            </p>
            <p className="text-lg text-slate-600 mb-8">
              Your voice can make a difference. Sign our petition asking the government to enforce these rules strictly.
            </p>
            <div className="space-y-3">
              <Button size="lg" className="w-full bg-orange-600 hover:bg-orange-700 text-lg h-14">
                Sign the Petition
              </Button>
              <Button size="lg" variant="outline" className="w-full flex items-center justify-center gap-2 text-lg h-14 border-slate-200">
                <Share2 className="w-5 h-5" />
                Share This Page
              </Button>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="px-5 py-5 my-8 mb-12 bg-white">
          <h2 className="font-serif text-2xl font-bold mb-8 text-slate-800">Why Your Action Matters</h2>
          <div className="space-y-4">
            <div className="p-6 rounded-xl border border-slate-300">
              <h3 className="font-serif font-bold text-xl mb-2 text-slate-800">1. Create Awareness</h3>
              <p className="text-lg text-slate-600">When you share, more people learn about this problem.</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-300">
              <h3 className="font-serif font-bold text-xl mb-2 text-slate-800">2. Show Public Concern</h3>
              <p className="text-lg text-slate-600">More signatures mean stronger pressure on authorities.</p>
            </div>
            <div className="p-6 rounded-xl border border-slate-300">
              <h3 className="font-serif font-bold text-xl mb-2 text-slate-800">3. Save Lives</h3>
              <p className="text-lg text-slate-600">Clean air means healthier communities for everyone.</p>
            </div>
          </div>
        </div>

        {/* News Section */}
        <NewsSection />
      </div>
    </div>
  );
}