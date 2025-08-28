import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ChevronRight } from 'lucide-react';

const ContainerWaterVisualization = () => {
  // Example array for demonstration
  const heights = [1, 8, 6, 2, 5, 4, 8, 3, 7];
  const [left, setLeft] = useState(0);
  const [right, setRight] = useState(heights.length - 1);
  const [maxWater, setMaxWater] = useState(0);
  const [currentWater, setCurrentWater] = useState(0);
  const [step, setStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [history, setHistory] = useState([]);

  const calculateWater = (l, r) => {
    if (l >= r) return 0;
    return Math.min(heights[l], heights[r]) * (r - l);
  };

  const reset = () => {
    setLeft(0);
    setRight(heights.length - 1);
    setMaxWater(0);
    setCurrentWater(calculateWater(0, heights.length - 1));
    setStep(0);
    setIsPlaying(false);
    setHistory([{
      left: 0,
      right: heights.length - 1,
      water: calculateWater(0, heights.length - 1),
      maxWater: calculateWater(0, heights.length - 1),
      action: 'Initial state'
    }]);
  };

  useEffect(() => {
    reset();
  }, []);

  const nextStep = () => {
    if (left >= right) return;

    const water = calculateWater(left, right);
    const newMaxWater = Math.max(maxWater, water);
    
    let newLeft = left;
    let newRight = right;
    let action = '';

    if (heights[left] < heights[right]) {
      newLeft = left + 1;
      action = `Move left pointer (height ${heights[left]} < ${heights[right]})`;
    } else {
      newRight = right - 1;
      action = `Move right pointer (height ${heights[left]} >= ${heights[right]})`;
    }

    const newWater = calculateWater(newLeft, newRight);
    
    setLeft(newLeft);
    setRight(newRight);
    setCurrentWater(newWater);
    setMaxWater(newMaxWater);
    setStep(step + 1);
    
    setHistory(prev => [...prev, {
      left: newLeft,
      right: newRight,
      water: newWater,
      maxWater: Math.max(newMaxWater, newWater),
      action: action
    }]);
  };

  useEffect(() => {
    let interval;
    if (isPlaying && left < right) {
      interval = setInterval(() => {
        nextStep();
      }, 1500);
    } else {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, left, right, step]);

  const togglePlay = () => {
    if (left >= right) {
      reset();
      setTimeout(() => setIsPlaying(true), 100);
    } else {
      setIsPlaying(!isPlaying);
    }
  };

  const maxHeight = Math.max(...heights);
  const containerHeight = maxHeight * 40 + 60;

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      <div className="bg-white rounded-lg shadow-xl p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Container With Most Water - Two Pointer Approach
        </h1>
        
        {/* Controls */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={togglePlay}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            {isPlaying ? 'Pause' : left >= right ? 'Restart' : 'Play'}
          </button>
          
          <button
            onClick={nextStep}
            disabled={left >= right || isPlaying}
            className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
            Next Step
          </button>
          
          <button
            onClick={reset}
            className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            Reset
          </button>
        </div>

        {/* Current State Info */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 text-center">
          <div className="bg-blue-100 p-4 rounded-lg">
            <div className="text-blue-800 font-semibold">Left Pointer</div>
            <div className="text-2xl font-bold text-blue-600">{left}</div>
            <div className="text-sm text-blue-600">Height: {heights[left] || 0}</div>
          </div>
          <div className="bg-red-100 p-4 rounded-lg">
            <div className="text-red-800 font-semibold">Right Pointer</div>
            <div className="text-2xl font-bold text-red-600">{right}</div>
            <div className="text-sm text-red-600">Height: {heights[right] || 0}</div>
          </div>
          <div className="bg-green-100 p-4 rounded-lg">
            <div className="text-green-800 font-semibold">Current Water</div>
            <div className="text-2xl font-bold text-green-600">{currentWater}</div>
            <div className="text-sm text-green-600">
              {left < right ? `${Math.min(heights[left], heights[right])} × ${right - left}` : 'Done!'}
            </div>
          </div>
          <div className="bg-purple-100 p-4 rounded-lg">
            <div className="text-purple-800 font-semibold">Max Water</div>
            <div className="text-2xl font-bold text-purple-600">{maxWater}</div>
            <div className="text-sm text-purple-600">Best so far</div>
          </div>
        </div>

        {/* Visualization */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6 overflow-x-auto">
          <svg
            width="100%"
            height={containerHeight}
            viewBox={`0 0 ${heights.length * 80 + 40} ${containerHeight}`}
            className="w-full"
          >
            {/* Grid lines */}
            {Array.from({ length: maxHeight + 1 }, (_, i) => (
              <line
                key={i}
                x1={20}
                y1={containerHeight - 40 - (i * 40)}
                x2={heights.length * 80 + 20}
                y2={containerHeight - 40 - (i * 40)}
                stroke="#e5e7eb"
                strokeWidth="1"
                strokeDasharray="2,2"
              />
            ))}
            
            {/* Bars */}
            {heights.map((height, index) => (
              <g key={index}>
                <rect
                  x={40 + index * 80}
                  y={containerHeight - 40 - height * 40}
                  width={40}
                  height={height * 40}
                  fill={
                    index === left ? '#3b82f6' :
                    index === right ? '#ef4444' :
                    '#9ca3af'
                  }
                  stroke="#374151"
                  strokeWidth="2"
                />
                <text
                  x={40 + index * 80 + 20}
                  y={containerHeight - 40 - height * 40 - 10}
                  textAnchor="middle"
                  className="text-sm font-semibold fill-gray-700"
                >
                  {height}
                </text>
                <text
                  x={40 + index * 80 + 20}
                  y={containerHeight - 15}
                  textAnchor="middle"
                  className="text-sm fill-gray-600"
                >
                  {index}
                </text>
              </g>
            ))}
            
            {/* Water area */}
            {left < right && (
              <rect
                x={40 + left * 80 + 40}
                y={containerHeight - 40 - Math.min(heights[left], heights[right]) * 40}
                width={(right - left - 1) * 80}
                height={Math.min(heights[left], heights[right]) * 40}
                fill="rgba(59, 130, 246, 0.3)"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
            )}
            
            {/* Pointer labels */}
            {left < right && (
              <>
                <text
                  x={40 + left * 80 + 20}
                  y={containerHeight - 40 - heights[left] * 40 - 30}
                  textAnchor="middle"
                  className="text-sm font-bold fill-blue-600"
                >
                  LEFT
                </text>
                <text
                  x={40 + right * 80 + 20}
                  y={containerHeight - 40 - heights[right] * 40 - 30}
                  textAnchor="middle"
                  className="text-sm font-bold fill-red-600"
                >
                  RIGHT
                </text>
              </>
            )}
          </svg>
        </div>

        {/* Step explanation */}
        <div className="bg-gray-50 p-6 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">Current Step Explanation:</h3>
          <div className="text-gray-700">
            {left >= right ? (
              <p className="text-lg">
                🎉 <strong>Algorithm Complete!</strong> We've found the maximum water area of <strong>{maxWater}</strong> units.
              </p>
            ) : (
              <>
                <p className="mb-2">
                  <strong>Step {step + 1}:</strong> Comparing heights at positions {left} and {right}
                </p>
                <p className="mb-2">
                  Height[{left}] = {heights[left]}, Height[{right}] = {heights[right]}
                </p>
                <p className="mb-2">
                  Current water area = min({heights[left]}, {heights[right]}) × ({right} - {left}) = <strong>{currentWater}</strong>
                </p>
                <p className="text-blue-600 font-semibold">
                  {heights[left] < heights[right] 
                    ? `Since ${heights[left]} < ${heights[right]}, we'll move the LEFT pointer forward next`
                    : `Since ${heights[left]} >= ${heights[right]}, we'll move the RIGHT pointer backward next`
                  }
                </p>
              </>
            )}
          </div>
        </div>

        {/* Algorithm explanation */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-gray-800">How the Two-Pointer Algorithm Works:</h3>
          <div className="space-y-2 text-gray-700">
            <p><strong>1.</strong> Start with pointers at both ends of the array</p>
            <p><strong>2.</strong> Calculate water area using: min(height[left], height[right]) × (right - left)</p>
            <p><strong>3.</strong> Keep track of the maximum area seen so far</p>
            <p><strong>4.</strong> Move the pointer with the smaller height inward (this gives us the best chance to find a larger area)</p>
            <p><strong>5.</strong> Repeat until pointers meet</p>
            <p className="text-sm text-gray-600 italic mt-4">
              💡 <strong>Why move the smaller height?</strong> Moving the taller side can only decrease the area since the width gets smaller and the height is limited by the shorter side.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContainerWaterVisualization;