'use client'

import React from 'react'

export function SimpleLineChart({ data, width = 400, height = 200 }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  const maxValue = Math.max(...data.map(d => d.revenue))
  const minValue = Math.min(...data.map(d => d.revenue))
  const range = maxValue - minValue || 1

  const points = data.map((item, index) => {
    const x = (index / (data.length - 1)) * (width - 40) + 20
    const y = height - 40 - ((item.revenue - minValue) / range) * (height - 80)
    return `${x},${y}`
  }).join(' ')

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" strokeWidth="1" opacity="0.3"/>
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        
        {/* Line */}
        <polyline
          fill="none"
          stroke="#ef4444"
          strokeWidth="2"
          points={points}
        />
        
        {/* Data points */}
        {data.map((item, index) => {
          const x = (index / (data.length - 1)) * (width - 40) + 20
          const y = height - 40 - ((item.revenue - minValue) / range) * (height - 80)
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="4"
              fill="#ef4444"
              className="hover:r-6 transition-all cursor-pointer"
            >
              <title>{`${item.date}: $${item.revenue.toFixed(2)}`}</title>
            </circle>
          )
        })}
        
        {/* Y-axis labels */}
        <text x="10" y="25" fontSize="12" fill="#6b7280" textAnchor="middle">
          ${maxValue.toFixed(0)}
        </text>
        <text x="10" y={height - 15} fontSize="12" fill="#6b7280" textAnchor="middle">
          ${minValue.toFixed(0)}
        </text>
        
        {/* X-axis labels */}
        {data.length > 0 && (
          <>
            <text x="20" y={height - 5} fontSize="10" fill="#6b7280" textAnchor="start">
              {new Date(data[0].date).toLocaleDateString()}
            </text>
            <text x={width - 20} y={height - 5} fontSize="10" fill="#6b7280" textAnchor="end">
              {new Date(data[data.length - 1].date).toLocaleDateString()}
            </text>
          </>
        )}
      </svg>
    </div>
  )
}

export function SimpleBarChart({ data, width = 400, height = 200 }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="flex items-center justify-center h-48 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <p className="text-gray-500 dark:text-gray-400">No data available</p>
      </div>
    )
  }

  const entries = Object.entries(data)
  const maxValue = Math.max(...entries.map(([, value]) => value))
  const barWidth = (width - 40) / entries.length - 10

  return (
    <div className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        {entries.map(([key, value], index) => {
          const barHeight = (value / maxValue) * (height - 60)
          const x = 20 + index * (barWidth + 10)
          const y = height - 40 - barHeight

          return (
            <g key={key}>
              <rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                fill="#ef4444"
                className="hover:opacity-80 transition-opacity cursor-pointer"
              >
                <title>{`${key}: ${value}`}</title>
              </rect>
              <text
                x={x + barWidth / 2}
                y={height - 25}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
                className="capitalize"
              >
                {key}
              </text>
              <text
                x={x + barWidth / 2}
                y={y - 5}
                fontSize="10"
                fill="#6b7280"
                textAnchor="middle"
              >
                {value}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}