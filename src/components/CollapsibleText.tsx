import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, Pressable, Animated, LayoutChangeEvent } from 'react-native';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface CollapsibleTextProps {
  title: string;
  content: string;
  initialCollapsed?: boolean; // Defaults to true
  duration?: number; // Duration in milliseconds, defaults to 200ms
  className?: string; // Optional className for styling
}

export const CollapsibleText: React.FC<CollapsibleTextProps> = ({
  title,
  content,
  initialCollapsed = true,
  duration = 200,
  className = '',
}) => {
  const [isExpanded, setIsExpanded] = useState(!initialCollapsed);
  const [contentHeight, setContentHeight] = useState<number | null>(null);

  const animation = useRef(new Animated.Value(initialCollapsed ? 0 : 1)).current;

  const toggleExpand = useCallback(() => {
    setIsExpanded((prev) => !prev);
  }, []);

  // Effect to run the animation whenever isExpanded changes
  useEffect(() => {
    // Only animate if contentHeight has been measured
    if (contentHeight === null) return;

    Animated.timing(animation, {
      toValue: isExpanded ? 1 : 0, // Animate to 1 for expanded, 0 for collapsed
      duration, // Animation duration
      useNativeDriver: false, // Height animation requires useNativeDriver: false
    }).start();
  }, [isExpanded, animation, contentHeight, duration]);

  // Callback to measure the natural height of the content when it first renders
  const onLayout = useCallback(
    (event: LayoutChangeEvent) => {
      // Set contentHeight only once to avoid re-measuring on every render
      if (contentHeight === null) {
        setContentHeight(event.nativeEvent.layout.height);
      }
    },
    [contentHeight]
  );

  // Interpolate the animation value to control the height of the content
  const heightInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [0, contentHeight || 0], // Height goes from 0 to measured contentHeight
  });

  // Interpolate for opacity, making content fully visible only when expanded
  const opacityInterpolation = animation.interpolate({
    inputRange: [0, 0.5, 1], // Stays transparent for the first half of expansion
    outputRange: [0, 0, 1],
  });

  // Interpolate for chevron icon rotation
  const rotateInterpolation = animation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'], // Rotates 180 degrees when expanded
  });

  return (
    <View className={`overflow-hidden p-4 ${className}`}>
      <Pressable onPress={toggleExpand} className={`flex-row items-center justify-between ${isExpanded ? 'mb-3' : ''}`}>
        <Text className="flex-1 text-base font-semibold">{title}</Text>
        <Animated.View style={{ transform: [{ rotate: rotateInterpolation }] }}>
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        </Animated.View>
      </Pressable>
      {contentHeight === null && (
        <View style={{ position: 'absolute', opacity: 0 }} onLayout={onLayout}>
          <Text className="text-gray-700">{content}</Text>
        </View>
      )}
      <Animated.View
        style={{
          height: heightInterpolation,
          opacity: opacityInterpolation,
          overflow: 'hidden',
        }}>
        <Text className="text-gray-700 text-justify">{content}</Text>
      </Animated.View>
    </View>
  );
};
