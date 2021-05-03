import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    FlatList, 
    ScrollView,
    Alert
    
} from 'react-native';

import waterdrop  from '../assets/waterdrop.png';
import colors from '../styles/colors'
import fonts from '../styles/fonts'

import { formatDistance } from 'date-fns';
import { pt } from 'date-fns/locale';

import { Header } from '../components/Header'
import { PlantCardSecondary } from '../components/PlantCardSecondary'
import { Load } from '../components/Load';

import { IPlantProps, removePlant, loadPlant } from '../libs/storage';

export function MyPlants(){
    const [ myPlants, setMyPlants ] = useState<IPlantProps[]>([]);
    const [loading, setLoading ] = useState(true);
    const [nextWatered, setNextWatered ] = useState<string>(); // nome da planta

    function handleRemove(plant: IPlantProps ){
        
        Alert.alert('Remover', `Deseja remover a ${plant.name}?`, [
                {
                    text: 'Não 🙏',
                    style: 'cancel'
                },

                { 
                    text: 'Sim 😪 ',
                    onPress: async () => {

                        try{


                               await removePlant(plant.id); // isso esta removendo do storage

                               setMyPlants((oldData) => 

                                oldData.filter((item)=> item.id !== plant.id)
                               );

                        }catch(error){

                            Alert.alert('Não foi possível remover sua planta! 🙄')
                        }
                    } 
                
                }
        ])      
    }

    
    
    useEffect(()=>{

        async function loadStorageData(){
            const plantsStoraged = await loadPlant();
            // console.log('PlantStorage posicao 0', plantsStoraged[0])
            
            //calcula qual a distancia de uma data para a outra
            const nextTime = formatDistance(
                new Date(plantsStoraged[0].dateTimeNotification).getTime(),
                new Date().getTime(),
                { locale: pt }
              
        );  
        // console.log('nextTime baMyPlants', nextTime)
        
            setNextWatered(
                    `Não esqueça de regar a ${plantsStoraged[0].name} a ${nextTime} horas.`
                    )  
                    
            setMyPlants(plantsStoraged);
            setLoading(false);   
    
    };

        loadStorageData();  

    }, [])

    
    if(loading) 
    return <Load />

    return (
        //Isso eu coloquei por minha conta
        // <ScrollView
        // showsVerticalScrollIndicator={false}
      
        // >
            <View style={styles.container}>
                <Header />

                <View style={styles.spotlight}>
                    <Image 
                    source={waterdrop}
                    style={styles.spotlightImage}
                    />
                    <Text style={styles.spotlightText}>
                        {nextWatered}
                    </Text>

                </View>


                <View style={styles.plants}>
                    <Text style={styles.plantsTitle}>
                        Próximas regadas
                    </Text>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                    >
                        <FlatList
                            data={myPlants}
                            keyExtractor={(item)=> String(item.id)}
                            renderItem={({ item }) =>(
                                <PlantCardSecondary
                                    data={item}
                                    handleRemove={()=> { handleRemove(item)}}
                                />
                            )}
                            showsVerticalScrollIndicator={false}
                            contentContainerStyle={ { flex: 1 }}

                        />
                    </ScrollView>

                </View>

            </View>
        // </ScrollView>

    )
}


const styles = StyleSheet.create({
    container: {
        flex:1,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 30,
        paddingTop:50,
        backgroundColor: colors.background
    },
    spotlight:{
        backgroundColor: colors.blue_light,
        paddingHorizontal: 20,
        borderRadius: 20,
        height: 110,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'

    },
    spotlightImage:{
        width: 60,
        height: 60

    },
    spotlightText:{
        flex: 1,
        color: colors.blue,
        paddingHorizontal: 20,
       
    },
    plants:{
        flex: 1,
        width: '100%'

    },
    plantsTitle:{
        fontSize: 24,
        fontFamily: fonts.heading,
        color: colors.heading,
        marginVertical: 20
    }
})