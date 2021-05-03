import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

import * as Notifications from 'expo-notifications'

export interface IPlantProps {
    
    id: string;
    name: string;
    about: string;
    water_tips: string;
    photo: string;
    environments: [string];
    frequency: {
    times: number;
    repeat_every: string;    
    };
    hour: string;
    dateTimeNotification: Date;
    

}


export interface IStoragePlantProps { 
    [id: string]: { 
        data: IPlantProps;
        notificationId : string;
    }

}


export async function savePlant(plant: IPlantProps) : Promise<void> {

    try{

        const nextTime = new Date(plant.dateTimeNotification);
        const now =  new Date();

        const { times, repeat_every } = plant.frequency; 
        if( repeat_every === 'week' ){
            const interval = Math.trunc(7/times); //7 dias na semana divido por times - trunc devolve numero inteiro
        
            nextTime.setDate(now.getDate() + interval);  // aqui lembrar o usuario a cada tanta frequencia     
        
         }else { 
            nextTime.setDate(now.getDate() + 1 ); // aqui e para lembrar o usuario todos os dias . O +1 e mais 1 dia
        }

         // Math.abs e para nao voltar valor negativo
        const seconds = Math.abs(
                        Math.ceil(now.getTime() - nextTime.getTime())/ 1000
        );
            // console.log('Sou a planta sendo salva',plant.name)
        const notificationId = await Notifications.scheduleNotificationAsync({
            content: {
                title: 'Heey,🌱',
                body: `Esta na hora de aguar a sua ${plant.name}`,
                sound: true,
                priority: Notifications.AndroidNotificationPriority.HIGH,
                data:{
                    plant
                },
            },
                trigger: {
                    seconds: seconds < 60 ? 60 : seconds,
                    repeats: true
                }
        })

        // console.log('Notification criada', notificationId)
        // acima o objeto de data { plant} e um pay load (dados da planta na notificacao)

        const data = await AsyncStorage.getItem('@plantmanager:plants');
        // estamos pegando tudo que esta salvo como texto, fazendo um objeto do tipo JSON e o tipo
        //dele tem que ser conforme a tipagem to IStoragePlantProps
        // console.log('Estou no storage', data)
        const oldPlants = data ? (JSON.parse(data) as IStoragePlantProps) : {};
        
        const newPlant = {
            [plant.id] : {
                data:plant,
                notificationId
            }
        }

            // console.log('formato newPlant', newPlant)
        await AsyncStorage.setItem('@plantmanager:plants',
        JSON.stringify({
            ...newPlant,
            ...oldPlants
        }));
    }catch(error){
        throw new Error(error);
    }
}

// esta funcao e para fazer o carregamento das planteas cadastradas no Storage

export async function loadPlant() : Promise<IPlantProps[]> {

    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');       
        const plants = data ? (JSON.parse(data) as IStoragePlantProps): {};

        const plantsSorted = Object
        .keys(plants)
        .map((plant)=> {
            // console.log('Estou no arquivo storage', plants[plant].data)
            return { 
                ...plants[plant].data, 
                hour: format(new Date(plants[plant].data.dateTimeNotification), 'HH:mm')
            }
        })
        .sort((a, b)=>
            Math.floor(
                new Date(a.dateTimeNotification).getTime() /1000 -
                Math.floor(new Date(b.dateTimeNotification).getTime() /1000)
            )
        );
        // console.log('PlantsSorted no arquivo storage',plantsSorted)
        return plantsSorted;
        
    }catch(error){
        throw new Error(error);
    }
}

export async function removePlant(id:string) : Promise<void>{
    
    const data = await AsyncStorage.getItem('@plantmanager: plants');
    const plants =  data ? (JSON.parse(data) as IStoragePlantProps) : {};
    
     //console.log(id)  
    // console.log('Plants antes de deletar',plants)    
    // console.log('notificationID',String(plants[id].notificationId))

    await Notifications.cancelScheduledNotificationAsync(plants[id].notificationId);

    delete plants[id];

    await AsyncStorage.setItem(
       '@plantmanager: plants', JSON.stringify(plants)
       );

}