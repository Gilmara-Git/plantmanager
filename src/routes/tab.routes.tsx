import React from 'react';
import { Platform } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const AppTab = createBottomTabNavigator();

import colors from '../styles/colors';
import { PlantSelect } from '../pages/PlantSelect';
import { MyPlants } from '../pages/MyPlants'
import { MaterialIcons } from '@expo/vector-icons';

const AuthRoutes = () => {

    return (
        <AppTab.Navigator
            tabBarOptions={{ 
                activeTintColor: colors.green,
                inactiveTintColor: colors.heading,
                labelPosition: 'beside-icon',
                style: {
                    paddingVertical: Platform.OS === 'ios'? 20: 0,
                    height: 88
                },
            }}>

                <AppTab.Screen
                    name='Nova Planta'
                    component={PlantSelect}
                    options={{
                        tabBarIcon: (({ size, color })=>(
                            <MaterialIcons
                                name='add-circle-outline'
                                size={size}
                                color={color}
                                />
                        ))
                    }} 
                    
                
                />

                <AppTab.Screen
                    name='Minas Plantas'
                    component={MyPlants}
                    options={{
                        tabBarIcon: (({ size, color })=>(
                            <MaterialIcons
                                name='format-list-bulleted'
                                size={size}
                                color={color}
                                />
                        ))
                    }} 
                    
                
                />


        </AppTab.Navigator>
    )
}


export default AuthRoutes;