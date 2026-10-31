import {useEffect,useState} from 'react';
import {seed} from '../data/seed';
const KEY='medcontrol-demo-v1';
export function useDatabase(){const [db,setDb]=useState(()=>{try{const saved=localStorage.getItem(KEY);return saved?{...seed,...JSON.parse(saved)}:seed;}catch{return seed;}});useEffect(()=>{localStorage.setItem(KEY,JSON.stringify(db));},[db]);const add=(table,item)=>setDb(prev=>({...prev,[table]:[item,...prev[table]]}));const update=(table,id,patch)=>setDb(prev=>({...prev,[table]:prev[table].map(x=>x.id===id?{...x,...patch}:x)}));const remove=(table,id)=>setDb(prev=>({...prev,[table]:prev[table].filter(x=>x.id!==id)}));const reset=()=>setDb(seed);return {db,add,update,remove,reset};}
