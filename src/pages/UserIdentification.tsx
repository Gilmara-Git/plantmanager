import React, { useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Text,
    TextInput,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Platform,
    Keyboard, 
    Alert
} from 'react-native';

import colors from '../styles/colors';
import fonts from '../styles/fonts'

import { Button } from '../components/Button'
import { useNavigation } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function UserIdentification(){
    
    const [isFocused, setIsFocused ] = useState(false);
    const [isFilled, setIsFilled ] = useState(false);
    const [name, setName ] = useState<string>();
    
    const navigation = useNavigation();

    function handleInputBlur(){
        setIsFocused(false);
        setIsFilled(!!name); // pegando o name quando o usuario esta saind do campo 
        // se o usuario sair do input e tiver conteudo no name continua verdinho
        
    }

    function handleInputFocus(){
        setIsFocused(true);        
    }

    function handleInputChange(value: string){
        setIsFilled(!!value); 
        setName(value);      
    }



    async function handleSubmit(){
        if(!name)
        return Alert.alert('Me diz como chamar você? 🤔 ');

        try{
            await AsyncStorage.setItem('@plantmanager:user', name);
            
            navigation.navigate('Confirmation', { 
                title: 'Prontinho',
                subtitle: 'Agora vamos começar a regar suas plantinhas com muito cuidado.',
                buttonTitle: 'Começar',
                icon: 'smile',
                nextScreen: 'PlantSelect'
            });
         }catch{
            Alert.alert('Não foi possível salvar o seu nome. 🤔' );
         }
        }           
        
    return (

        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView 
            style={styles.container}
            behavior={ Platform.OS === 'ios' ? 'padding' : 'height' }
            >
                <TouchableWithoutFeedback
                onPress={Keyboard.dismiss}
                >
                    <View style={styles.content}>               
                        <View style={styles.form}>
                            <View style={styles.header}>
                                <Text style={styles.emoji}>
                                    { isFilled ? '👍' : '😊' }
                                </Text>

                                <Text style={ styles.title}>
                                    Como podemos chamar {'\n'} você ?
                                </Text>
                            </View>  
                            <TextInput 
                            style={[
                                styles.input,
                                (isFocused || isFilled) && { borderColor: colors.green }
                            ]}
                            placeholder='Digite seu nome'
                            onBlur={ handleInputBlur }
                            onFocus={ handleInputFocus }
                            onChangeText={ handleInputChange }
                            />
                        
                            <View style={styles.footer}>
                            <Button  
                            title = 'Confirmar'
                            onPress={handleSubmit} />
                            </View>

                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>


    )


};

const styles = StyleSheet.create({

    container: {

        flex:1,
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        width: '100%'
    },
    form: {
        flex:1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 54
    },
    header:{
        alignItems: 'center'

    },
    emoji: {
        fontSize: 44
    },
    input:{
        borderBottomWidth: 1,
        borderColor: colors.gray,
        color: colors.heading,
        width: '100%',
        fontSize: 18,
        marginTop: 50,
        padding: 10,
        textAlign: 'center'
    },
    title: {
        fontSize: 24,
        lineHeight: 32,
        textAlign: 'center',
        color: colors.heading,
        fontFamily: fonts.heading,
        marginTop:20
    },
    footer: {
        width: '100%',
        marginTop:40,
        paddingHorizontal: 20
        

    }
})