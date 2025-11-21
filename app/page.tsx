'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, Video, Brain, Shield, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { toast } from 'react-hot-toast'
import ReactPlayer from 'react-player'

interface DetectionResult {
  output: 'REAL' | 'FAKE'
  confidence: number
  preprocessed_images: string[]
  faces_cropped_images: string[]
  original_video: string
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null)
  const [sequenceLength, setSequenceLength] = useState(40)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<DetectionResult | null>(null)

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/*': ['.mp4', '.avi', '.mov', '.mkv']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024, // 100MB
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFile(acceptedFiles[0])
        setResult(null)
      }
    }
  })

  const handleUpload = async () => {
    if (!file) {
      toast.error('Please select a video file first')
      return
    }

    setIsProcessing(true)
    const formData = new FormData()
    formData.append('upload_video_file', file)
    formData.append('sequence_length', sequenceLength.toString())

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Processing failed')
      }

      const data = await response.json()
      setResult(data)
      toast.success('Video processed successfully!')
    } catch (error) {
      toast.error('Failed to process video. Please try again.')
      console.error(error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <div className="flex justify-center items-center mb-6">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center"
          >
            <Brain className="w-8 h-8 text-white" />
          </motion.div>
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
          Deepfake Detection
        </h1>
        <p className="text-xl text-purple-200 max-w-2xl mx-auto">
          Advanced AI-powered system to detect manipulated videos using cutting-edge deep learning technology
        </p>
      </motion.div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-6xl mx-auto"
      >
        <div className="glass-effect p-6 text-center">
          <Shield className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">High Accuracy</h3>
          <p className="text-purple-200 text-sm">93% accuracy with advanced ResNeXt + LSTM architecture</p>
        </div>
        <div className="glass-effect p-6 text-center">
          <Zap className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Fast Processing</h3>
          <p className="text-purple-200 text-sm">Quick analysis with real-time face detection</p>
        </div>
        <div className="glass-effect p-6 text-center">
          <Video className="w-12 h-12 text-purple-400 mx-auto mb-4" />
          <h3 className="text-white font-semibold mb-2">Multi-format Support</h3>
          <p className="text-purple-200 text-sm">Supports MP4, AVI, MOV, and more video formats</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {!result ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-effect p-8 glow-effect"
          >
            {/* Upload Area */}
            <div
              {...getRootProps()}
              className={`upload-zone cursor-pointer ${
                isDragActive ? 'border-purple-400 bg-purple-400/10' : ''
              }`}
            >
              <input {...getInputProps()} />
              <Upload className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">
                {isDragActive ? 'Drop your video here' : 'Upload Video for Analysis'}
              </h3>
              <p className="text-purple-200 mb-4">
                Drag and drop or click to select a video file
              </p>
              <p className="text-sm text-purple-300">
                Supported formats: MP4, AVI, MOV, MKV (Max 100MB)
              </p>
            </div>

            {/* File Preview */}
            {file && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-white/5 rounded-lg"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-white font-medium">{file.name}</p>
                    <p className="text-purple-200 text-sm">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setFile(null)
                      setResult(null)
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <XCircle className="w-6 h-6" />
                  </button>
                </div>

                {/* Sequence Length Selector */}
                <div className="mb-6">
                  <label className="block text-white font-medium mb-2">
                    Sequence Length: {sequenceLength} frames
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    step="10"
                    value={sequenceLength}
                    onChange={(e) => setSequenceLength(Number(e.target.value))}
                    className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <div className="flex justify-between text-xs text-purple-300 mt-1">
                    <span>10</span>
                    <span>20</span>
                    <span>40</span>
                    <span>60</span>
                    <span>80</span>
                    <span>100</span>
                  </div>
                </div>

                {/* Process Button */}
                <button
                  onClick={handleUpload}
                  disabled={isProcessing}
                  className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Processing Video...
                    </>
                  ) : (
                    'Analyze Video'
                  )}
                </button>
              </motion.div>
            )}
          </motion.div>
        ) : (
          /* Results */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-effect p-8 glow-effect"
          >
            {/* Result Header */}
            <div className="text-center mb-8">
              <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
                result.output === 'REAL' ? 'bg-green-500/20' : 'bg-red-500/20'
              }`}>
                {result.output === 'REAL' ? (
                  <CheckCircle className="w-12 h-12 text-green-400" />
                ) : (
                  <XCircle className="w-12 h-12 text-red-400" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-white mb-2">
                {result.output === 'REAL' ? 'Authentic Video' : 'Deepfake Detected'}
              </h2>
              <p className={`text-xl ${
                result.output === 'REAL' ? 'text-green-400' : 'text-red-400'
              }`}>
                Confidence: {result.confidence}%
              </p>
            </div>

            {/* Video Player */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-white mb-4">Original Video</h3>
              <div className="rounded-lg overflow-hidden bg-black/30">
                <ReactPlayer
                  url={result.original_video}
                  controls
                  width="100%"
                  height="400px"
                />
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Preprocessed Frames */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Extracted Frames</h3>
                <div className="flex gap-2 overflow-x-auto pb-4">
                  {result.preprocessed_images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Frame ${index + 1}`}
                      className="w-20 h-16 object-cover rounded border border-purple-400/30 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>

              {/* Cropped Faces */}
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Detected Faces</h3>
                <div className="flex gap-2 overflow-x-auto pb-4">
                  {result.faces_cropped_images.map((img, index) => (
                    <img
                      key={index}
                      src={img}
                      alt={`Face ${index + 1}`}
                      className="w-16 h-16 object-cover rounded border border-purple-400/30 flex-shrink-0"
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Analyze Another Button */}
            <button
              onClick={() => {
                setFile(null)
                setResult(null)
              }}
              className="w-full mt-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
            >
              Analyze Another Video
            </button>
          </motion.div>
        )}
      </div>
    </div>
  )
}