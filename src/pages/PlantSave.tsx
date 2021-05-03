import React , {useState} from 'react';
import { 
    Alert,
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    ScrollView,
    Platform,
} from 'react-native';


import { SvgFromUri } from 'react-native-svg';
import { getBottomSpace } from 'react-native-iphone-x-helper';
import { useNavigation, useRoute } from '@react-navigation/core';
import DateTimePicker, { Event } from '@react-native-community/datetimepicker';
import { isBefore, format } from 'date-fns';
import { IPlantProps, savePlant } from '../libs/storage';

import waterdrop  from '../assets/waterdrop.png';
import { Button } from '../components/Button';
import colors from '../styles/colors';
import fonts from '../styles/fonts';



interface IParams {
    plant: IPlantProps
}

export function PlantSave(){

    const [ selectedDateTime, setSelectedDateTime ] = useState(new Date());
    const [ showDatePicker, setShowDatePicker ] = useState(Platform.OS === 'ios');
 
    const routes =  useRoute();
    const { plant } = routes.params as IParams;

    const navigation = useNavigation();


    function handleChangeTime(event: Event, dateTime: Date | undefined ){
        if(Platform.OS === 'android'){
            setShowDatePicker(oldState => !oldState);
        }

        // verificando se a data e antiga
        if(dateTime && isBefore(dateTime, new Date())){
            //se o dateTime escolhida pelo usuario e anterior a nova dataset
            // o selectedDate colocamos nova data e alertamos o usuario a escolher uma data no futuro
            setSelectedDateTime(new Date()); 
            return Alert.alert('Escolha uma hora no futuro.⏰')
            
        }
        // verificando se a data existe
        if(dateTime)
            setSelectedDateTime(dateTime);

    }


    function handleOpenDatetimePickerForAndroid(){
        setShowDatePicker(oldState => !oldState );
    }
    
    async function handleSave(){

        try{
            await savePlant({
                ...plant,
                dateTimeNotification: selectedDateTime
            });

            navigation.navigate('Confirmation',
            { 
                title: 'Tudo certo',
                subtitle: 'Fique tranquilo que sempre vamos lembrar você de cuidar da sua plantinha com bastante amor.',
                buttonTitle: 'Muito Obrigado :D',
                icon: 'hug',
                nextScreen: 'MyPlants'
            });

         }catch{
            Alert.alert('Não foi possível salvar.😥')

        }
    }

    return (

        <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.plantInfo}>
                    <SvgFromUri 
                            uri={plant.photo}
                            width={150}
                            height={150} 
                    />

                    <Text style={styles.plantName}>
                            {plant.name}
                    </Text>

                        <Text style={styles.plantAbout}>
                            {plant.about}
                        </Text>
                </View>

                <View style={styles.controller}>
                    <View style={styles.tipContainer}>
                        <Image 
                        source={waterdrop}
                        style={styles.tipImage} />

                        <Text style={styles.tipText}>
                            {plant.water_tips}
                        </Text>
                    </View>

                    <Text style={styles.alertLabel}>
                        Escolha o melhor horário para ser lembrado:
                    </Text>

                    
                    { 
                    
                    showDatePicker && (<DateTimePicker
                    value={selectedDateTime}
                    mode='time'
                    display='spinner'
                    onChange={handleChangeTime}
                    />
                    )}


                    {
                        Platform.OS === 'android' && (
                            <TouchableOpacity
                            style={styles.dateTimePickerButton} 
                            onPress={handleOpenDatetimePickerForAndroid}
                            >
                                <Text style={styles.dateTimePickerText}>
                                    {`Mudar Horário ${format(selectedDateTime, 'HH:mm')} `}
                                </Text>
                            </TouchableOpacity>
                        )  
                    }
                    <Button
                        title='Cadastrar Planta'
                        onPress={handleSave}
                    />

                </View>
            </View>
        </ScrollView>
    )
}


const styles = StyleSheet.create({
    container:{
        flex: 1,
        justifyContent: 'space-between',
        backgroundColor: colors.shape
    },
    plantInfo:{
        flex:1,
        paddingHorizontal: 30,
        paddingVertical: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.shape
        
    },
    controller:{
        backgroundColor: colors.white,
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: getBottomSpace() || 20

    },
    plantName:{
        fontFamily: fonts.heading,
        fontSize: 24,
        color: colors.heading,
        marginTop: 15
    },
    plantAbout:{
        textAlign: 'center',
        fontFamily: fonts.text,
        color: colors.heading,
        fontSize:17,
        marginTop: 10
    },
    tipContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.blue_light,
        padding: 20,
        borderRadius: 20,
        position: 'relative',
        bottom: 60

    },
    tipImage:{
        width: 56,
        height: 56,

    },
    tipText:{
        flex:1,
        marginLeft: 20,
        fontFamily: fonts.text,
        color: colors.blue,
        fontSize: 17,
        textAlign: 'justify'

    },
    alertLabel:{
        textAlign: 'center',
        fontFamily: fonts.complement,
        color: colors.heading,
        fontSize: 12,
        marginBottom: 5
    },
    dateTimePickerButton: {

        width: '100%',
        alignItems: 'center',
        paddingVertical: 40,
        color: colors.heading,
        fontFamily: fonts.text
    },

    dateTimePickerText:{


    }

})