'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import * as topojson from 'topojson-client';

export function D3WorldTourBg() {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove(); // Clear previous render

    // Set SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Adjust scale for better mobile visibility
    const isMobile = width < 768;
    const scaleFactor = isMobile ? 2.2 : 2.5;

    // Shift globe further down on mobile (approx 60% deeper) to expose more of the sphere
    const verticalOffset = isMobile ? height * 0.85 : height / 2;

    // Push globe to the left on desktop, keep centered on mobile
    const horizontalOffset = isMobile ? width / 2 : width * 0.35;

    const projection = d3.geoOrthographic()
      .scale(Math.min(width, height) / scaleFactor)
      .translate([horizontalOffset, verticalOffset])
      .rotate([40, -30, 0]) // Initial rotation to show Atlantic Ocean (between Virginia and Ghana)
      .precision(0.1);

    const path = d3.geoPath(projection);

    // Create globe sphere with dark metallic appearance
    svg.append('path')
      .datum({ type: 'Sphere' })
      .attr('class', 'sphere')
      .attr('d', path as any)
      .style('fill', '#0a0a0a')
      .style('stroke', '#d4af37')
      .style('stroke-width', '2px')
      .style('filter', 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.3))');

    // Graticule (grid lines) with subtle gold
    const graticule = d3.geoGraticule10();
    svg.append('path')
      .datum(graticule)
      .attr('class', 'graticule')
      .attr('d', path as any)
      .style('fill', 'none')
      .style('stroke', '#8b7355')
      .style('stroke-width', '0.5px')
      .style('opacity', '0.3');

    // Load world topology data
    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(response => response.json())
      .then((world: any) => {
        // Extract individual countries
        const countriesFeature = topojson.feature(world, world.objects.countries) as any;
        const countries = countriesFeature.features;

        // Country codes to highlight: USA (840), Ghana (288), Russia (643)
        const highlightCountries = ['840', '288', '643'];

        // Draw countries with dark fills and gold borders
        svg.append('g')
          .attr('class', 'countries')
          .selectAll('path')
          .data(countries)
          .enter()
          .append('path')
          .attr('d', path as any)
          .attr('class', (d: any) => {
            return highlightCountries.includes(d.id) ? 'country-highlight' : 'country';
          })
          .style('fill', (d: any) => {
            // Highlight specific countries with bronze/gold tones
            if (d.id === '840') return '#3d2817'; // USA - dark bronze
            if (d.id === '288') return '#2d1f0f'; // Ghana - darker bronze
            if (d.id === '643') return '#4a3520'; // Russia - medium bronze
            return '#1a1410'; // Default very dark
          })
          .style('stroke', (d: any) => {
            // Gold/bronze borders for highlighted countries
            if (highlightCountries.includes(d.id)) return '#d4af37';
            return '#5a4a3a';
          })
          .style('stroke-width', (d: any) => {
            return highlightCountries.includes(d.id) ? '1px' : '0.5px';
          })
          .style('opacity', 0.9);

        // Define tour locations with connections and country IDs
        const locations = [
          { 
            name: 'USA', 
            coordinates: [-77.4360, 37.5407], 
            countryId: '840',
            fact: 'GENIUS Act and CLARITY Act have created a more supportive regulatory environment, reviving builder and institutional confidence in digital assets.'
          },
          { 
            name: 'Ghana, Africa', 
            coordinates: [-1.2164, 7.9465], 
            countryId: '288',
            fact: 'Across Africa, Nigeria is dominant with nearly $59 billion in crypto transactions and leading innovation alongside South Africa.'
          },
          { 
            name: 'Moscow, Russia', 
            coordinates: [37.6173, 55.7558], 
            countryId: '643',
            fact: 'Russia is preparing for a digital ruble (CBDC), projected to add $3.2 billion to the economy annually starting with major banks in late 2026.'
          },
        ];

        // Create arcs layer
        const arcsGroup = svg.append('g').attr('class', 'arcs');

        let currentLocation = 0;

        // Get country paths for highlighting
        const countryPaths = svg.selectAll('path.country, path.country-highlight');

        function transition() {
          const from = locations[currentLocation];
          const to = locations[(currentLocation + 1) % locations.length];

          // Highlight active countries with golden pulsing effect
          countryPaths.each(function (d: any) {
            const element = d3.select(this as SVGPathElement);
            if (d.id === from.countryId || d.id === to.countryId) {
              // Pulse the active countries with gold/amber glow
              element
                .transition()
                .duration(800)
                .style('fill', '#d4af37')
                .style('stroke', '#ffd700')
                .style('stroke-width', '2.5px')
                .style('filter', 'drop-shadow(0 0 10px rgba(212, 175, 55, 0.8))')
                .transition()
                .duration(2000)
                .style('fill', d.id === '840' ? '#3d2817' : d.id === '288' ? '#2d1f0f' : '#4a3520')
                .style('stroke', '#d4af37')
                .style('stroke-width', '1px')
                .style('filter', 'none');
            }
          });

          // Create arc between current and next location
          const arcGenerator = d3.geoInterpolate(
            from.coordinates as [number, number],
            to.coordinates as [number, number]
          );

          // Generate points along the arc
          const arcPoints = d3.range(0, 1.01, 0.05).map(arcGenerator);

          // Create line generator for the arc
          const lineGenerator = d3.geoPath(projection);
          const arcLine = {
            type: 'LineString' as const,
            coordinates: arcPoints
          };

          // Add the arc path with golden light trail
          const arcPath = arcsGroup
            .append('path')
            .datum(arcLine)
            .attr('class', 'arc')
            .attr('d', lineGenerator as any)
            .style('fill', 'none')
            .style('stroke', '#ffd700')
            .style('stroke-width', '3px')
            .style('stroke-opacity', 0.9)
            .style('stroke-linecap', 'round')
            .style('filter', 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.8))');

          // Set up the initial state: line is hidden (we'll calculate totalLength after rotation)
          arcPath
            .style('stroke-dasharray', '10000 10000')
            .style('stroke-dashoffset', '10000');

          // Add animated dots at start and end points with gold theme
          const startDot = svg.append('circle')
            .attr('class', 'location-dot')
            .style('fill', '#d4af37')
            .style('opacity', 0)
            .attr('r', 6)
            .style('filter', 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.9))');

          const endDot = svg.append('circle')
            .attr('class', 'location-dot')
            .style('fill', '#ffd700')
            .style('opacity', 0)
            .attr('r', 6)
            .style('filter', 'drop-shadow(0 0 8px rgba(255, 215, 0, 0.9))');

          // Add SVG tooltip group (background rect + text)
          const tooltipGroup = svg.append('g')
            .attr('class', 'tooltip-group')
            .style('opacity', 0);

          const tooltipBg = tooltipGroup.append('rect')
            .attr('rx', 8)
            .attr('ry', 8)
            .style('fill', '#000000')
            .style('stroke', '#ffd700')
            .style('stroke-width', '2px')
            .style('filter', 'drop-shadow(0 0 15px rgba(255, 215, 0, 0.8))');

          const tooltipTitle = tooltipGroup.append('text')
            .style('fill', '#ffd700')
            .style('font-size', '18px')
            .style('font-weight', 'bold')
            .style('text-anchor', 'start')
            .style('filter', 'drop-shadow(0 0 5px rgba(255, 215, 0, 0.8))');

          const tooltipFact = tooltipGroup.append('text')
            .style('fill', '#ffd700')
            .style('font-size', '13px')
            .style('font-weight', 'normal')
            .style('text-anchor', 'start');

          // Add traveling particle that moves along the arc with amber glow
          const travelingDot = svg.append('circle')
            .attr('class', 'traveling-dot')
            .style('fill', '#ffb347')
            .style('opacity', 0)
            .attr('r', 5)
            .style('filter', 'drop-shadow(0 0 12px rgba(255, 179, 71, 1))');

          // Calculate midpoint for rotation
          const midpoint = arcGenerator(0.5);

          // Rotate globe to show the arc
          d3.transition()
            .duration(1500)
            .tween('rotate', function () {
              const currentRotate = projection.rotate();
              const targetRotate: [number, number, number] = [-midpoint[0], -midpoint[1], 0];
              const r = d3.interpolate(currentRotate, targetRotate);
              return function (t) {
                const interpolated = r(t);
                projection.rotate(interpolated);
                svg.selectAll('path').attr('d', path as any);

                // Update arc path
                arcPath.attr('d', lineGenerator as any);

                // Update dot positions
                const startProj = projection(from.coordinates as [number, number]);
                const endProj = projection(to.coordinates as [number, number]);

                if (startProj) {
                  startDot.attr('cx', startProj[0]).attr('cy', startProj[1]);
                }
                if (endProj) {
                  endDot.attr('cx', endProj[0]).attr('cy', endProj[1]);
                }
              };
            })
            .on('end', function () {
              // Show start dot
              startDot.transition().duration(300).style('opacity', 1);

              // Show traveling dot and animate it along the arc
              travelingDot.style('opacity', 1);

              // Recalculate totalLength AFTER rotation completes for accurate animation
              const totalLength = (arcPath.node() as SVGPathElement).getTotalLength();
              
              // Update stroke-dasharray with correct length
              arcPath
                .style('stroke-dasharray', `${totalLength} ${totalLength}`)
                .style('stroke-dashoffset', totalLength);

              // Animate the line being drawn from start to end
              arcPath
                .transition()
                .duration(1500)
                .ease(d3.easeCubicInOut)
                .styleTween('stroke-dashoffset', function () {
                  const interpolate = d3.interpolate(totalLength, 0);
                  return function (t) {
                    // Update arc path position as we animate
                    arcPath.attr('d', lineGenerator as any);

                    // Update dot positions
                    const startProj = projection(from.coordinates as [number, number]);
                    const endProj = projection(to.coordinates as [number, number]);

                    if (startProj) {
                      startDot.attr('cx', startProj[0]).attr('cy', startProj[1]);
                    }
                    if (endProj) {
                      endDot.attr('cx', endProj[0]).attr('cy', endProj[1]);
                    }

                    // Move traveling dot along the arc
                    const point = arcGenerator(t);
                    const projected = projection(point as [number, number]);
                    if (projected) {
                      travelingDot
                        .attr('cx', projected[0])
                        .attr('cy', projected[1]);
                    }

                    return interpolate(t).toString();
                  };
                })
                .on('end', function () {
                  // Show end dot when line reaches destination
                  endDot.transition().duration(300).style('opacity', 1);
                  // Hide traveling dot
                  travelingDot.transition().duration(300).style('opacity', 0);

                  // Show SVG tooltip
                  const endProj = projection(to.coordinates as [number, number]);
                  if (endProj) {
                    console.log('Showing tooltip for:', to.name, 'at position:', endProj);
                    
                    const padding = 16;
                    const maxWidth = isMobile ? 280 : 400;
                    const lineHeight = 18;
                    
                    // Set title
                    tooltipTitle.text(to.name);
                    
                    // Calculate positions first
                    const tooltipX = endProj[0];
                    const tooltipY = endProj[1] - 50;
                    
                    // Wrap fact text into multiple lines
                    const words = to.fact.split(' ');
                    let line = '';
                    const lines: string[] = [];
                    
                    // Clear previous tspans
                    tooltipFact.selectAll('tspan').remove();
                    
                    // Create tspans for wrapped text
                    words.forEach((word) => {
                      const testLine = line + word + ' ';
                      tooltipFact.text(testLine);
                      const testWidth = (tooltipFact.node() as SVGTextElement)?.getComputedTextLength() || 0;
                      
                      if (testWidth > maxWidth - padding * 2 && line !== '') {
                        lines.push(line.trim());
                        line = word + ' ';
                      } else {
                        line = testLine;
                      }
                    });
                    lines.push(line.trim());
                    
                    // Clear and rebuild fact text with tspans
                    tooltipFact.text('');
                    const factX = tooltipX - maxWidth / 2 + padding;
                    lines.forEach((lineText, i) => {
                      tooltipFact.append('tspan')
                        .attr('x', factX)
                        .attr('dy', i === 0 ? 0 : lineHeight)
                        .text(lineText);
                    });
                    
                    // Position title
                    tooltipTitle
                      .attr('x', tooltipX - maxWidth / 2 + padding)
                      .attr('y', tooltipY + padding + 15);
                    
                    // Position fact below title
                    tooltipFact
                      .attr('x', tooltipX - maxWidth / 2 + padding)
                      .attr('y', tooltipY + padding + 38);
                    
                    // Calculate background dimensions
                    const tooltipHeight = 40 + (lines.length * lineHeight) + padding;
                    
                    tooltipBg
                      .attr('x', tooltipX - maxWidth / 2)
                      .attr('y', tooltipY)
                      .attr('width', maxWidth)
                      .attr('height', tooltipHeight);
                    
                    // Fade in the tooltip
                    tooltipGroup
                      .transition()
                      .duration(500)
                      .style('opacity', 1);
                  }
                });
            })
            .transition()
            .delay(5000) // Longer delay to read the crypto facts
            .on('start', function () {
              // Fade out the arc and dots
              arcPath.transition().duration(600).style('stroke-opacity', 0).remove();
              startDot.transition().duration(600).style('opacity', 0).remove();
              endDot.transition().duration(600).style('opacity', 0).remove();
              travelingDot.remove();

              // Hide SVG tooltip
              console.log('Hiding tooltip');
              tooltipGroup.transition().duration(500).style('opacity', 0).remove();
            })
            .on('end', () => {
              currentLocation = (currentLocation + 1) % locations.length;
              transition();
            });
        }

        // Start animation
        transition();
      })
      .catch(error => {
        console.error('Error loading world data:', error);
      });

    // Handle window resize
    function handleResize() {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.clientWidth;
      const newHeight = containerRef.current.clientHeight;

      svg.attr('width', newWidth).attr('height', newHeight);

      const isMobile = newWidth < 768;
      const scaleFactor = isMobile ? 2.2 : 2.5;
      const verticalOffset = isMobile ? newHeight * 0.85 : newHeight / 2;
      const horizontalOffset = isMobile ? newWidth / 2 : newWidth * 0.35;

      projection
        .scale(Math.min(newWidth, newHeight) / scaleFactor)
        .translate([horizontalOffset, verticalOffset]);

      svg.selectAll('path').attr('d', path as any);
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full"
      style={{
        zIndex: 1,
        opacity: 0.7,
      }}
    >
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ display: 'block' }}
      />
    </div>
  );
}

