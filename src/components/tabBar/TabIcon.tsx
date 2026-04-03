import React, { ForwardRefExoticComponent, RefAttributes, SVGProps } from 'react';
import { View } from 'react-native';

const TabBarIcon = ({
  Icon,
  focused,
}: {
  Icon: ForwardRefExoticComponent<
    Omit<SVGProps<SVGSVGElement>, 'ref'> & {
      title?: string;
      titleId?: string;
    } & RefAttributes<SVGSVGElement>
  >;
  focused: boolean;
}) => {
  return (
    <View
      className={`mb-2 flex items-center justify-center rounded-lg p-1.5 ${focused ? 'bg-primary' : 'bg-gray-200'}`}>
      <Icon color={focused ? 'white' : 'gray'} style={{ height: 15 }} />
    </View>
  );
};

export default TabBarIcon;
