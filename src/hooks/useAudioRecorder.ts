import { useState, useCallback, useEffect, useRef } from "react"
import { Platform, Alert } from "react-native"

export interface AudioRecorder {
  isRecording: boolean
  duration: number
  audioUri?: string
  error?: string
  startRecording: () => Promise<void>
  stopRecording: () => Promise<string | undefined>
  clearRecording: () => void
}

/**
 * Hook for handling audio recording functionality with start/stop controls and error handling.
 *
 * Dependencies: This hook requires expo-av to be installed for full functionality.
 * Currently provides a placeholder implementation that simulates recording behavior.
 *
 * @returns AudioRecorder interface with recording controls and state
 */
export const useAudioRecorder = (): AudioRecorder => {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [audioUri, setAudioUri] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  // Refs for cleanup and tracking
  const recordingRef = useRef<any>(null)
  const durationIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)

  // Clear any existing error when starting new operations
  const clearError = useCallback(() => {
    setError(undefined)
  }, [])

  // Generate unique filename for recordings
  const generateRecordingFilename = useCallback(() => {
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    return `recording_${timestamp}_${random}.m4a`
  }, [])

  // Start duration tracking
  const startDurationTracking = useCallback(() => {
    startTimeRef.current = Date.now()
    durationIntervalRef.current = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      setDuration(elapsed)
    }, 1000)
  }, [])

  // Stop duration tracking
  const stopDurationTracking = useCallback(() => {
    if (durationIntervalRef.current) {
      clearInterval(durationIntervalRef.current)
      durationIntervalRef.current = null
    }
  }, [])

  // Start recording function
  const startRecording = useCallback(async () => {
    try {
      clearError()

      if (isRecording) {
        console.warn("Recording already in progress")
        return
      }

      // TODO: Replace with actual expo-av implementation when installed
      if (Platform.OS === "ios" || Platform.OS === "android") {
        // Placeholder implementation - simulate expo-av Recording setup
        console.warn("expo-av not installed. Simulating recording start.")

        // In real implementation, this would be:
        // import { Audio } from 'expo-av'
        // const { recording } = await Audio.Recording.createAsync(
        //   Audio.RecordingOptionsPresets.HIGH_QUALITY
        // )
        // recordingRef.current = recording

        // For now, simulate recording setup
        recordingRef.current = {
          // Mock recording object
          _isDoneRecording: false,
          getURI: () => `file:///tmp/claude/${generateRecordingFilename()}`,
          stopAndUnloadAsync: async () => {
            return { uri: `file:///tmp/claude/${generateRecordingFilename()}` }
          },
        }

        setIsRecording(true)
        setDuration(0)
        setAudioUri(undefined)
        startDurationTracking()

        console.log("Recording started (simulated)")
      } else {
        throw new Error("Recording not supported on this platform")
      }
    } catch (error) {
      console.error("Failed to start recording:", error)
      setError(error instanceof Error ? error.message : "Failed to start recording")
      setIsRecording(false)
      stopDurationTracking()
    }
  }, [
    isRecording,
    clearError,
    generateRecordingFilename,
    startDurationTracking,
    stopDurationTracking,
  ])

  // Stop recording function
  const stopRecording = useCallback(async (): Promise<string | undefined> => {
    try {
      clearError()

      if (!isRecording || !recordingRef.current) {
        console.warn("No recording in progress")
        return undefined
      }

      stopDurationTracking()
      setIsRecording(false)

      // TODO: Replace with actual expo-av implementation when installed
      // In real implementation, this would be:
      // const result = await recordingRef.current.stopAndUnloadAsync()
      // const uri = recordingRef.current.getURI()

      // For now, simulate stopping recording
      const mockUri = recordingRef.current.getURI()
      recordingRef.current = null

      setAudioUri(mockUri)
      console.log("Recording stopped (simulated):", mockUri)

      return mockUri
    } catch (error) {
      console.error("Failed to stop recording:", error)
      setError(error instanceof Error ? error.message : "Failed to stop recording")
      setIsRecording(false)
      stopDurationTracking()
      return undefined
    }
  }, [isRecording, clearError, stopDurationTracking])

  // Clear recording data
  const clearRecording = useCallback(() => {
    setAudioUri(undefined)
    setDuration(0)
    setError(undefined)

    // TODO: In real implementation, also delete the audio file
    // if (audioUri) {
    //   FileSystem.deleteAsync(audioUri, { idempotent: true })
    // }
  }, [])

  // Cleanup function
  const cleanup = useCallback(async () => {
    try {
      stopDurationTracking()

      if (isRecording && recordingRef.current) {
        // Force stop recording if still in progress
        await recordingRef.current.stopAndUnloadAsync()
        recordingRef.current = null
      }

      setIsRecording(false)
      setDuration(0)
    } catch (error) {
      console.error("Error during cleanup:", error)
    }
  }, [isRecording, stopDurationTracking])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup()
    }
  }, [cleanup])

  // Auto-cleanup if recording runs too long (safety mechanism)
  useEffect(() => {
    if (duration > 300) {
      // 5 minutes max
      console.warn("Recording duration exceeded 5 minutes, auto-stopping")
      stopRecording()
      Alert.alert(
        "Recording Stopped",
        "Recording automatically stopped after 5 minutes for performance reasons.",
      )
    }
  }, [duration, stopRecording])

  return {
    isRecording,
    duration,
    audioUri,
    error,
    startRecording,
    stopRecording,
    clearRecording,
  }
}
