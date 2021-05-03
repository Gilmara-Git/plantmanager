import React, { useEffect } from 'react';
import AppLoading from 'expo-app-loading';
import  Routes  from './src/routes';

import * as Notifications from 'expo-notifications';
import { IPlantProps } from './src/libs/storage';


import {
  useFonts,
  Jost_400Regular,
  Jost_600SemiBold
} from '@expo-google-fonts/jost';


export default function App(){
  const [ fontsLoaded ] = useFonts({
    Jost_400Regular,
    Jost_600SemiBold
  });


useEffect(()=>{

  const subscription = Notifications.addNotificationReceivedListener(
    async notification => {
      const data = notification.request.content.data.plant as IPlantProps
      console.log('Norification chegando', data);
    }
  );

    return () => subscription.remove();

  // async function notification(){
  //   const data = await Notifications.getAllScheduledNotificationsAsync();
  //   console.log('###### notificacoes agendadas',data)

  // }
  // async function notifications(){

  //   // await Notifications.cancelAllScheduledNotificationsAsync(); // cancelando todas notificacoes
  //   const data = await Notifications.getAllScheduledNotificationsAsync();  // pegando notificacoes mas nao tera mais nada
  //   console.log('###### notificacoes agendadas',data)
  // }

}, [])



  //Se a fonte nao estiver carregada. Da uma segurada na tela de splash com o AppLoading.
  // Apos o carregamento da fonte, vai para a Welcome
  if(!fontsLoaded)
  return <AppLoading />

  
  return (
   <Routes />
  )

}

