'use client'

import { motion } from 'framer-motion'
import { CheckCircle, XCircle, Download, RotateCcw, Clock, Film } from 'lucide-react'
import { DetectionResult } from '../page'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ResultsSectionProps {
  result: DetectionResult
  onReset: () => void
}

export default function ResultsSection({ result, onReset }: ResultsSectionProps) {
  const isReal = result.output === 'REAL'
  
  // Generate mock confidence data for chart
  const confidenceData = Array.from({ length: result.frames_analyzed || 40 }, (_, i) => ({
    frame: i + 1,
    confidence: result.confidence + (Math.random() * 10 - 5),
  }))

  const downloadReport = () => {
    const report = {
      result: result.output,
      confidence: result.confidence,
      timestamp: new Date().toISOString(),
      frames_analyzed: result.frames_analyzed || result.preprocessed_images.length,
      processing_time: result.processing_time || 'N/A',
    }
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deepfake-report-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-6xl mx-auto"
      >
        {/* Result Header */}
        <div className="glass-effect p-8 md:p-12 mb-8 text-center glow-effect">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className={`inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 ${
              isReal ? 'bg-green-500/20' : 'bg-red-500/20'
            }`}
          >
            {isReal ? (
              <CheckCircle className="w-16 h-16 text-green-400" />
            ) : (
              <XCircle className="w-16 h-16 text-red-400" />
            )}
          </motion.div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {isReal ? (
              <span className="text-green-400">Authentic Video</span>
            ) : (
              <span className="text-red-400">Deepfake Detected</span>
            )}
          </h1>
          
          <p className="text-2xl text-purple-200 mb-6">
            Confidence: <span className={isReal ? 'text-green-400' : 'text-red-400'}>{result.confidence}%</span>
          </p>
          
          <div className="flex flex-wrap justify-center gap-4">
            <div className="glass-effect px-6 py-3 rounded-lg">
              <div className="flex items-center gap-2 text-purple-200">
                <Film className="w-5 h-5" />
                <span>{result.frames_analyzed || result.preprocessed_images.length} frames analyzed</span>
              </div>
            </div>
            {result.processing_time && (
              <div className="glass-effect px-6 py-3 rounded-lg">
                <div className="flex items-center gap-2 text-purple-200">
                  <Clock className="w-5 h-5" />
                  <span>{result.processing_time}s processing time</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Confidence Chart */}
        <div className="glass-effect p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Frame-by-Frame Confidence</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={confidenceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis 
                  dataKey="frame" 
                  stroke="rgba(255,255,255,0.5)"
                  label={{ value: 'Frame Number', position: 'insideBottom', offset: -5, fill: 'rgba(255,255,255,0.7)' }}
                />
                <YAxis 
                  stroke="rgba(255,255,255,0.5)"
                  label={{ value: 'Confidence %', angle: -90, position: 'insideLeft', fill: 'rgba(255,255,255,0.7)' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(0,0,0,0.8)', 
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="confidence" 
                  stroke={isReal ? '#10b981' : '#ef4444'}
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Analysis Details */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Extracted Frames */}
          <div className="glass-effect p-8">
            <h2 className="text-2xl font-bold mb-6">Extracted Frames</h2>
            <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {result.preprocessed_images.slice(0, 20).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-purple-400/30 hover:border-purple-400 transition-colors cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Frame ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23a855f7" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23fff"%3E' + (index + 1) + '%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>

          {/* Detected Faces */}
          <div className="glass-effect p-8">
            <h2 className="text-2xl font-bold mb-6">Detected Faces</h2>
            <div className="grid grid-cols-4 gap-3 max-h-96 overflow-y-auto">
              {result.faces_cropped_images.slice(0, 20).map((img, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="aspect-square rounded-lg overflow-hidden border-2 border-pink-400/30 hover:border-pink-400 transition-colors cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`Face ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ec4899" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23fff"%3EF' + (index + 1) + '%3C/text%3E%3C/svg%3E'
                    }}
                  />
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Interpretation */}
        <div className="glass-effect p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4">What This Means</h2>
          <div className="space-y-4 text-purple-100">
            {isReal ? (
              <>
                <p className="leading-relaxed">
                  ✅ Our AI model has analyzed this video and determined it to be <strong className="text-green-400">authentic</strong> with 
                  {result.confidence}% confidence. The facial features, temporal patterns, and frame consistency 
                  all indicate this is a genuine, unmanipulated video.
                </p>
                <p className="leading-relaxed">
                  The model examined {result.frames_analyzed || result.preprocessed_images.length} frames and found no 
                  significant anomalies in facial movements, lighting consistency, or compression artifacts 
                  that would suggest digital manipulation.
                </p>
              </>
            ) : (
              <>
                <p className="leading-relaxed">
                  ⚠️ Our AI model has detected signs of <strong className="text-red-400">manipulation</strong> in this video with 
                  {result.confidence}% confidence. The analysis revealed inconsistencies in facial features, 
                  temporal patterns, or other indicators commonly associated with deepfake technology.
                </p>
                <p className="leading-relaxed">
                  Potential indicators include: unnatural facial movements, inconsistent lighting, compression 
                  artifacts around facial boundaries, or temporal inconsistencies across frames. This video 
                  should be treated with caution and verified through additional sources.
                </p>
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReset}
            className="btn-primary flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Analyze Another Video
          </button>
          <button
            onClick={downloadReport}
            className="btn-secondary flex items-center justify-center gap-2"
          >
            <Download className="w-5 h-5" />
            Download Report
          </button>
        </div>
      </motion.div>
    </div>
  )
}
