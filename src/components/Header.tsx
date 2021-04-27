import React,{ useState, useEffect }from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage'

import {

    StyleSheet,
    Text,
    View,
    Image

} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts';

import {  getStatusBarHeight } from 'react-native-iphone-x-helper'
import userImg from '../assets/gilmara.png'


export function Header(){
    const [ username, setUsername ] = useState<string>();

    useEffect(()=>{

        async function loadStorageUsername(){
            const user =  await AsyncStorage.getItem('@plantmanager:user')
            setUsername( user || '');
        }

        loadStorageUsername();

    }, [])


    return (

        <View style={styles.container}>
            <View>
                <Text style={styles.greeting}>Olá</Text>
                <Text style={styles.userName}>
                    {username}
                </Text>
            </View>
            <Image 
            source={userImg}
            style={styles.image}
            />

        </View>
    )
}



const styles = StyleSheet.create({

    container:{
        width: '100%',
        flexDirection: 'row', 
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 20,
        marginTop: getStatusBarHeight(),
      
    },
    greeting:{
        fontSize: 32,
        fontFamily: fonts.text,
        color: colors.heading
    },
    userName:{
        fontSize: 32,
        fontFamily: fonts.heading,
        color: colors.heading,
        lineHeight: 40

    },

    image:{
        width: 70,
        height: 70,
        borderRadius: 40,
        
    }
})