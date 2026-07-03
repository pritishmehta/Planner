import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface TaskBreakdownChartProps {
  data: { category: string; percent: number; total: number; completed: number }[];
}

export function TaskBreakdownChart({ data }: TaskBreakdownChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clear previous chart
    d3.select(chartRef.current).selectAll('*').remove();

    const width = 300;
    const height = 300;
    const margin = 20;
    const radius = Math.min(width, height) / 2 - margin;

    const svg = d3.select(chartRef.current)
      .append('svg')
      .attr('viewBox', `0 0 ${width} ${height}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`);

    // Prepare data
    const validData = data.filter(d => d.total > 0);

    // Color scale using our minimal palette
    const color = d3.scaleOrdinal()
      .domain(validData.map(d => d.category))
      .range(['#A3B18A', '#E29578', '#6B705C', '#D4A373', '#CCD5AE', '#E9EDC9', '#FAEDCD']);

    const pie = d3.pie<any>().value(d => d.total - d.completed);
    const dataReady = pie(validData);

    const arc = d3.arc<any>()
      .innerRadius(radius * 0.5) // Donut chart
      .outerRadius(radius);

    svg.selectAll('path')
      .data(dataReady)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.category) as string)
      .attr('stroke', 'white')
      .style('stroke-width', '2px')
      .style('opacity', 0.8)
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });

    // Add labels
    svg.selectAll('text')
      .data(dataReady)
      .enter()
      .append('text')
      .text(d => d.data.total - d.data.completed > 0 ? d.data.category : '')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .style('text-anchor', 'middle')
      .style('font-size', '10px')
      .style('font-family', 'sans-serif')
      .style('fill', '#333')
      .style('text-transform', 'capitalize');

  }, [data]);

  return (
    <div className="w-full flex justify-center items-center">
      {data.filter(d => d.total > d.completed).length === 0 ? (
        <p className="text-sm text-gray-400 italic my-8">All caught up! No incomplete tasks.</p>
      ) : (
        <div ref={chartRef} className="w-[300px] h-[300px]" />
      )}
    </div>
  );
}
