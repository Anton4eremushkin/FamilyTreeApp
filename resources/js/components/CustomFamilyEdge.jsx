// src/components/CustomFamilyEdge.jsx

import React from 'react';

/**
 * Генерация SVG path между родителем и ребёнком через общую точку.
 */
function createFamilyEdgePath({ sourceX, sourceY, spouseX, spouseY, targetX, targetY }) {
    const centerX = (sourceX + spouseX) / 2;
    const midY1 = (3 * sourceY + targetY) / 4;
    const midY2 = (sourceY + 3 * targetY) / 4;

    return [
        `M ${sourceX},${sourceY}`,      // К1
        `L ${sourceX},${midY1}`,        // вниз
        `L ${centerX},${midY1}`,        // к центру
        `L ${centerX},${midY2}`,        // вниз
        `L ${targetX},${midY2}`,        // к ребенку по X
        `L ${targetX},${targetY}`,      // вниз
    ].join(' ');
}

/**
 * Кастомный компонент ребра для генеалогии.
 */
const CustomFamilyEdge = ({
                              sourceX,
                              sourceY,
                              targetX,
                              targetY,
                              data,
                              markerEnd,
                          }) => {
    const edgePath = createFamilyEdgePath({
        sourceX,
        sourceY,
        spouseX: data.spouseX,
        spouseY: data.spouseY,
        targetX,
        targetY,
    });

    return (
        <path
            d={edgePath}
            stroke="#888"
            strokeWidth={2}
            fill="none"
            markerEnd={markerEnd}
            strokeLinecap="round"
            strokeLinejoin="round"
        />

    );
};

export default CustomFamilyEdge;
