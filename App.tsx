import React from 'react';
import AppLoading from 'expo-app-loading'

import  Routes  from './src/routes';

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
  //Se a fonte nao estiver carregada. Da uma segurada na tela de splash com o AppLoading.
  // Apos o carregamento da fonte, vai para a Welcome
  if(!fontsLoaded)
  return <AppLoading />

  
  return (
   <Routes />
  )

}

