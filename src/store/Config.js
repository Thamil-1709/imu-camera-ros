import { defineStore } from "pinia";


export const useConfigStore = defineStore("Config",{
    state:()=>{
        return {
            ip:localStorage.getItem('ip') || 'localhost',
            port : localStorage.getItem('port') || '3000'

        }
    },actions:{
        setIpPort(ip,port){
            this.port = port
            this.ip = ip
            localStorage.setItem('ip',ip)
            localStorage.setItem('port',port)
        }
    }
    
});