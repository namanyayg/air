'use client';

import React from 'react'
import IndiaMap from '@/components/map/main'

export default function CoalPage() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Coal Power Plants in India</h1>
      <IndiaMap
        regionData={{
          Maharashtra: {
            value: 10,
          },
        }}
        hoverComponent={({ value }) => (
          <div className="bg-white shadow-lg rounded p-2">
            <p className="font-semibold">{value.name}</p>
            <p>Coal Plants: {value.value}</p>
          </div>
        )}
        mapLayout={{
          title: '',
          legendTitle: 'Number of Plants',
          startColor: '#FFDAB9',
          endColor: '#FF6347',
          hoverTitle: 'Plants',
          noDataColor: '#f5f5f5',
          borderColor: '#8D8D8D',
          hoverBorderColor: '#8D8D8D',
          hoverColor: '#e5e5e5',
        }}
      />
    </div>
  )
}