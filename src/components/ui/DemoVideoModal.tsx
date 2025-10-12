'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Play, Maximize2, Volume2, VolumeX } from 'lucide-react'

interface DemoVideoModalProps {
  isOpen: boolean
  onClose: () => void
  role: 'agent' | 'broker' | 'title_company'
}

// Video URLs for each role - Update these with your actual video URLs
const DEMO_VIDEOS = {
  agent: {
    url: '/videos/agent-demo.mp4',
    thumbnail: '/images/agent-demo-thumbnail.jpg',
    title: 'Agent Dashboard Demo',
    description: 'See how real estate agents use CloseTrack to manage listings, track commissions, and close deals faster.',
    duration: '3:24'
  },
  broker: {
    url: '/videos/broker-demo.mp4',
    thumbnail: '/images/broker-demo-thumbnail.jpg',
    title: 'Broker Dashboard Demo',
    description: 'Discover how brokers manage their team, track office performance, and scale their business with CloseTrack.',
    duration: '4:12'
  },
  title_company: {
    url: '/videos/title-company-demo.mp4',
    thumbnail: '/images/title-company-demo-thumbnail.jpg',
    title: 'Title Company Dashboard Demo',
    description: 'Learn how title companies streamline closings, manage documents, and complete title searches efficiently.',
    duration: '3:45'
  }
}

export default function DemoVideoModal({ isOpen, onClose, role }: DemoVideoModalProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null)
  const [showPlaceholder, setShowPlaceholder] = useState(true)

  const video = DEMO_VIDEOS[role]

  useEffect(() => {
    if (!isOpen) {
      setIsPlaying(false)
      if (videoElement) {
        videoElement.pause()
        videoElement.currentTime = 0
      }
    }
  }, [isOpen, videoElement])

  useEffect(() => {
    // Check if video file exists
    if (videoElement) {
      videoElement.addEventListener('error', () => {
        setShowPlaceholder(true)
      })
      videoElement.addEventListener('loadeddata', () => {
        setShowPlaceholder(false)
      })
    }
  }, [videoElement])

  const handlePlay = () => {
    if (videoElement) {
      if (isPlaying) {
        videoElement.pause()
      } else {
        videoElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleMute = () => {
    if (videoElement) {
      videoElement.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleFullscreen = () => {
    if (videoElement) {
      if (videoElement.requestFullscreen) {
        videoElement.requestFullscreen()
      }
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="relative w-full max-w-5xl bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
          >
            <X className="h-6 w-6 text-white" />
          </button>

          {/* Video Header */}
          <div className="absolute top-0 left-0 right-0 z-10 bg-gradient-to-b from-black/70 to-transparent p-6">
            <h3 className="text-2xl font-bold text-white mb-2">{video.title}</h3>
            <p className="text-gray-300 text-sm">{video.description}</p>
          </div>

          {/* Video Player */}
          <div className="relative aspect-video bg-black">
            {showPlaceholder ? (
              /* Placeholder when video doesn't exist */
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-blue-900 to-purple-900 text-white p-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Play className="h-12 w-12 text-white" />
                  </div>
                  <h4 className="text-3xl font-bold mb-4">Demo Video Coming Soon!</h4>
                  <p className="text-xl text-gray-300 mb-6 max-w-2xl">
                    We're creating an amazing demo video for the {video.title.replace(' Demo', '')}. 
                  </p>
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-xl mx-auto">
                    <p className="text-lg font-semibold mb-3">What you'll see in the demo:</p>
                    <ul className="text-left space-y-2">
                      {role === 'agent' && (
                        <>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Managing active listings and client pipeline</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Tracking commissions and deal progress</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Automating deadlines and client communications</span>
                          </li>
                        </>
                      )}
                      {role === 'broker' && (
                        <>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Monitoring team performance and office metrics</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Managing agents and tracking office revenue</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Analyzing market trends and business growth</span>
                          </li>
                        </>
                      )}
                      {role === 'title_company' && (
                        <>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Processing title searches and closing documents</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Managing escrow and coordinating closings</span>
                          </li>
                          <li className="flex items-start space-x-2">
                            <span className="text-emerald-400 mt-1">✓</span>
                            <span>Resolving title issues and tracking deadlines</span>
                          </li>
                        </>
                      )}
                    </ul>
                  </div>
                  <p className="text-gray-400 mt-6">
                    In the meantime, <button onClick={onClose} className="text-blue-400 hover:text-blue-300 underline">sign up for free</button> to explore the live dashboard!
                  </p>
                </motion.div>
              </div>
            ) : (
              <>
                <video
                  ref={setVideoElement}
                  src={video.url}
                  poster={video.thumbnail}
                  className="w-full h-full"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  controls={false}
                >
                  Your browser does not support the video tag.
                </video>

                {/* Custom Video Controls */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {/* Play/Pause Button */}
                      <button
                        onClick={handlePlay}
                        className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors backdrop-blur-sm"
                      >
                        {isPlaying ? (
                          <div className="w-5 h-5 border-l-2 border-r-2 border-white" />
                        ) : (
                          <Play className="h-5 w-5 text-white ml-0.5" />
                        )}
                      </button>

                      {/* Mute Button */}
                      <button
                        onClick={handleMute}
                        className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                      >
                        {isMuted ? (
                          <VolumeX className="h-5 w-5 text-white" />
                        ) : (
                          <Volume2 className="h-5 w-5 text-white" />
                        )}
                      </button>

                      {/* Duration */}
                      <span className="text-white text-sm font-medium">
                        {video.duration}
                      </span>
                    </div>

                    {/* Fullscreen Button */}
                    <button
                      onClick={handleFullscreen}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <Maximize2 className="h-5 w-5 text-white" />
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Video Info Footer */}
          <div className="bg-gray-800 p-6 border-t border-gray-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400 mb-2">Ready to get started?</p>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                  Start Free Trial →
                </button>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-400 mb-1">Questions about CloseTrack?</p>
                <a
                  href="mailto:info.closetrackapp@gmail.com"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  Contact Sales
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}

