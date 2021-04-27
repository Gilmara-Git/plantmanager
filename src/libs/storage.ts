import AsyncStorage from '@react-native-async-storage/async-storage';
import { format } from 'date-fns';

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
    },
    dateTimeNotification: Date;
    

}


interface IStoragePlantProps { 
    [id: string]: { 
        data: IPlantProps;
    }

}


export async function savePlant(plant: IPlantProps) : Promise<void> {

    try{
        const data = await AsyncStorage.getItem('@plantmanager:plants');
        // estamos pegando tudo que esta salvo como texto, fazendo um objeto do tipo JSON e o tipo
        //dele tem que ser conforme a tipagem to IStoragePlantProps
        console.log('Estou no storage', data)
        const oldPlants = data ? (JSON.parse(data) as IStoragePlantProps) : {};
        
        const newPlant = {
            [plant.id] : {
                data:plant
            }
        }

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
        console.log('PlantsSorted no arquivo storage',plantsSorted)
        return plantsSorted;
        
    }catch(error){
        throw new Error(error);
    }
}