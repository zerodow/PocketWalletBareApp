import { useState, useEffect, useCallback } from "react"
import { Platform, Alert, Linking } from "react-native"

export interface VoicePermissions {
  hasPermission: boolean
  requestPermission: () => Promise<boolean>
  permissionStatus: "granted" | "denied" | "undetermined"
  isLoading: boolean
}

/**
 * Hook for handling microphone permissions with proper error handling and user-friendly messages.
 * Supports both iOS and Android platforms.
 *
 * Note: This implementation requires expo-av to be installed for full functionality.
 * Currently provides a placeholder implementation that can be easily updated.
 */
export const useVoicePermissions = (): VoicePermissions => {
  const [permissionStatus, setPermissionStatus] = useState<"granted" | "denied" | "undetermined">(
    "undetermined",
  )
  const [isLoading, setIsLoading] = useState(false)

  const checkPermissionStatus = useCallback(async (): Promise<
    "granted" | "denied" | "undetermined"
  > => {
    try {
      if (Platform.OS === "android") {
        // For Android, we would use PermissionsAndroid
        // This is a placeholder implementation
        const { PermissionsAndroid } = require("react-native")
        const hasPermission = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        )
        return hasPermission ? "granted" : "undetermined"
      } else if (Platform.OS === "ios") {
        // For iOS, we would use expo-av Audio.getPermissionsAsync()
        // This is a placeholder implementation
        return "undetermined"
      }
      return "undetermined"
    } catch (error) {
      console.warn("Error checking microphone permission:", error)
      return "undetermined"
    }
  }, [])

  const handlePermissionDenied = useCallback(() => {
    Alert.alert(
      "Microphone Permission Required",
      "Voice input requires microphone access. You can enable this in your device settings.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Open Settings",
          onPress: () => {
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:")
            } else {
              Linking.openSettings()
            }
          },
        },
      ],
    )
  }, [])

  const requestPermission = useCallback(async (): Promise<boolean> => {
    setIsLoading(true)

    try {
      if (Platform.OS === "android") {
        // For Android, use PermissionsAndroid
        const { PermissionsAndroid } = require("react-native")
        const result = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
          {
            title: "Microphone Permission",
            message: "This app needs access to your microphone to record voice transactions.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          },
        )

        const granted = result === PermissionsAndroid.RESULTS.GRANTED
        setPermissionStatus(granted ? "granted" : "denied")

        if (!granted) {
          handlePermissionDenied()
        }

        return granted
      } else if (Platform.OS === "ios") {
        // For iOS, we would use expo-av Audio.requestPermissionsAsync()
        // This is a placeholder implementation that will be updated when expo-av is installed
        console.warn(
          "expo-av not installed. Please install expo-av for iOS microphone permissions.",
        )

        // Simulate permission request for development
        Alert.alert(
          "Permission Required",
          "Microphone access is needed to record voice transactions. This will be fully implemented when expo-av is installed.",
          [
            {
              text: "Cancel",
              onPress: () => {
                setPermissionStatus("denied")
                handlePermissionDenied()
              },
              style: "cancel",
            },
            {
              text: "Grant (Simulated)",
              onPress: () => {
                setPermissionStatus("granted")
              },
            },
          ],
        )

        // For development, assume granted
        setPermissionStatus("granted")
        return true
      }

      return false
    } catch (error) {
      console.error("Error requesting microphone permission:", error)
      setPermissionStatus("denied")
      handlePermissionDenied()
      return false
    } finally {
      setIsLoading(false)
    }
  }, [handlePermissionDenied])

  const checkAndUpdatePermissionStatus = useCallback(async () => {
    setIsLoading(true)
    try {
      const status = await checkPermissionStatus()
      setPermissionStatus(status)
    } catch (error) {
      console.error("Error checking permission status:", error)
      setPermissionStatus("undetermined")
    } finally {
      setIsLoading(false)
    }
  }, [checkPermissionStatus])

  // Check permission status on mount
  useEffect(() => {
    checkAndUpdatePermissionStatus()
  }, [checkAndUpdatePermissionStatus])

  const hasPermission = permissionStatus === "granted"

  return {
    hasPermission,
    requestPermission,
    permissionStatus,
    isLoading,
  }
}
