'use client';

import React from 'react';

const NEWS_ARTICLES = [
  {
    title: "Coal Pollution Kills Indians",
    source: "Air Clim",
    url: "https://www.airclim.org/acidnews/coal-pollution-kills-indians",
  },
  {
    title: "Thermal Power Plants Emit 240 Times More Air Pollution Than Stubble Burning",
    source: "Down To Earth",
    url: "https://www.downtoearth.org.in/pollution/thermal-power-plants-emit-240-times-more-air-pollution-than-stubble-burning-crea",
  },
  {
    title: "Clean up Indian coal-fired power plants could saved lives",
    source: "The Guardian",
    url: "https://www.theguardian.com/environment/2024/apr/19/clean-up-indian-coal-fired-power-plants-could-saved-lives",
  },
  {
    title: "Pollution from Coal Burning",
    source: "Drishti IAS",
    url: "https://www.drishtiias.com/daily-news-analysis/pollution-from-coal-burning-ieaccc",
  },
];

export default function NewsSection() {
  return (
    <section>
      <h2 className="font-serif text-2xl font-bold mb-8 text-slate-800">Latest News & Research</h2>
      <div className="space-y-4">
        {NEWS_ARTICLES.map((article, index) => (
          <a
            key={index}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <h3 className="font-serif text-lg font-semibold mb-2 text-slate-800">{article.title}</h3>
            <p className="text-sm text-slate-500">Source: {article.source}</p>
          </a>
        ))}
      </div>
    </section>
  );
} 