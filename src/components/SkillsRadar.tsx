'use client'

import { Skill } from '@/lib/data'

interface SkillsRadarProps {
  skills: Skill[]
}

export default function SkillsRadar({ skills }: SkillsRadarProps) {
  const maxScore = 10
  const size = 200
  const center = size / 2
  const radius = 80
  
  // Calculate angle for each skill
  const angleStep = (2 * Math.PI) / skills.length
  
  const getPoint = (index: number, value: number) => {
    const angle = angleStep * index - Math.PI / 2 // Start from top
    const r = (value / maxScore) * radius
    return {
      x: center + r * Math.cos(angle),
      y: center + r * Math.sin(angle)
    }
  }

  // Generate grid lines
  const gridLevels = [2, 4, 6, 8, 10]
  
  // Generate axis lines and labels
  const axes = skills.map((skill, index) => {
    const angle = angleStep * index - Math.PI / 2
    const endX = center + radius * Math.cos(angle)
    const endY = center + radius * Math.sin(angle)
    
    return {
      skill,
      startX: center,
      startY: center,
      endX,
      endY,
      labelX: center + (radius + 20) * Math.cos(angle),
      labelY: center + (radius + 20) * Math.sin(angle)
    }
  })

  // Generate polygon points
  const polygonPoints = skills.map((skill, index) => {
    const point = getPoint(index, skill.score)
    return `${point.x},${point.y}`
  }).join(' ')

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size + 40} className="overflow-visible">
        {/* Grid circles */}
        {gridLevels.map((level) => (
          <circle
            key={level}
            cx={center}
            cy={center}
            r={(level / maxScore) * radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted/30"
          />
        ))}
        
        {/* Axis lines */}
        {axes.map((axis, index) => (
          <line
            key={index}
            x1={axis.startX}
            y1={axis.startY}
            x2={axis.endX}
            y2={axis.endY}
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted/30"
          />
        ))}
        
        {/* Data polygon */}
        <polygon
          points={polygonPoints}
          fill="hsl(221.2 83.2% 53.3%)"
          fillOpacity="0.3"
          stroke="hsl(221.2 83.2% 53.3%)"
          strokeWidth="2"
        />
        
        {/* Data points */}
        {skills.map((skill, index) => {
          const point = getPoint(index, skill.score)
          return (
            <circle
              key={index}
              cx={point.x}
              cy={point.y}
              r="4"
              fill="hsl(221.2 83.2% 53.3%)"
            />
          )
        })}
        
        {/* Labels */}
        {axes.map((axis, index) => (
          <text
            key={index}
            x={axis.labelX}
            y={axis.labelY}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs fill-current"
          >
            {axis.skill.name}
          </text>
        ))}
        
        {/* Score labels */}
        {axes.map((axis, index) => {
          const point = getPoint(index, axis.skill.score)
          return (
            <text
              key={`score-${index}`}
              x={point.x}
              y={point.y - 10}
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-xs font-semibold fill-primary"
            >
              {axis.skill.score}
            </text>
          )
        })}
      </svg>
      
      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-2 justify-center">
        {skills.map((skill) => (
          <div key={skill.name} className="flex items-center gap-1 text-xs">
            <div className="w-3 h-3 rounded-full bg-primary" />
            <span>{skill.name}: {skill.score}/10</span>
          </div>
        ))}
      </div>
    </div>
  )
}
