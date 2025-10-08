import { type FC, type ReactNode } from "react"
import { View, ViewStyle } from "react-native"
import Skeleton from "react-native-reanimated-skeleton"

type BoxProps = {
  width?: number
  height?: number
  radius?: number
  style?: ViewStyle | ViewStyle[]
}

export const SkeletonBox = ({ width = 200, height = 16, radius = 8, style }: BoxProps) => (
  <Skeleton isLoading={true} containerStyle={[{ width, height, borderRadius: radius }, style]}>
    <View style={{ width, height, borderRadius: radius }} />
  </Skeleton>
)

export const SkeletonLine = (props: Omit<BoxProps, "radius"> & { radius?: number }) => (
  <Skeleton
    isLoading={true}
    containerStyle={[
      { width: props.width ?? 120, height: props.height ?? 12, borderRadius: props.radius ?? 6 },
      props.style,
    ]}
  >
    <View
      style={{
        width: props.width ?? 120,
        height: props.height ?? 12,
        borderRadius: props.radius ?? 6,
      }}
    />
  </Skeleton>
)

export const SkeletonCircle = ({
  size = 28,
  style,
}: {
  size?: number
  style?: ViewStyle | ViewStyle[]
}) => (
  <Skeleton
    isLoading={true}
    containerStyle={[{ width: size, height: size, borderRadius: size / 2 }, style]}
  >
    <View style={{ width: size, height: size, borderRadius: size / 2 }} />
  </Skeleton>
)

export const SkeletonGroup: FC<{ show: boolean; children: ReactNode }> = ({ show, children }) => {
  if (!show) return <>{children}</>
  return <View>{children}</View>
}

// Export transaction-specific skeletons
export { TransactionItemSkeleton } from "./TransactionItemSkeleton"
export { TransactionListSkeleton } from "./TransactionListSkeleton"
