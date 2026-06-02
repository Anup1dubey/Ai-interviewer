'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts';

interface ScoreChartProps {
  technicalScore: number;
  communicationScore: number;
  problemSolvingScore: number;
  confidenceScore: number;
}

export function ScoreChart({
  technicalScore,
  communicationScore,
  problemSolvingScore,
  confidenceScore,
}: ScoreChartProps) {
  const data = [
    { category: 'Technical', score: technicalScore },
    { category: 'Communication', score: communicationScore },
    { category: 'Problem Solving', score: problemSolvingScore },
    { category: 'Confidence', score: confidenceScore },
  ];

  return (
    <ResponsiveContainer width="100%" height={260}>
      <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
        <PolarGrid stroke="var(--border)" strokeOpacity={0.8} />
        <PolarAngleAxis
          dataKey="category"
          tick={{ fill: 'var(--muted-foreground)', fontSize: 11, fontWeight: 500 }}
        />
        <Radar
          name="Score"
          dataKey="score"
          stroke="var(--primary)"
          fill="var(--primary)"
          fillOpacity={0.15}
          strokeWidth={2}
          dot={{ fill: 'var(--primary)', r: 3 }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
