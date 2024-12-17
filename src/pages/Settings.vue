<script setup>
    import { ref } from 'vue';
    import { useConfigStore } from '../store/Config';

    const {ip,port} = useConfigStore();

    const IP = ref(ip);
    const PORT = ref(port);
    const save = () => {
        alert("Saved");
        useConfigStore().setIpPort(IP.value,PORT.value);
    }
</script>


<template >
    <div  class="container">
        <h3>Settings</h3>
        <div>
            <div class="">
                <span>IP</span>
            <input type="text" id="ip" v-model="IP"  placeholder=""/>
            </div>
            <div class="">
                <span>Port</span>   
            <input type="text" id="port" v-model="PORT"  placeholder=""/>

            </div>
        </div>
            <button @click="save">Save</button>
        </div>
</template>

<style>
    .container {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 50px;
    }
    input {
        margin: 10px;
        border-radius: 5px;
        padding: 6px;
        border: 1px solid rgb(134, 134, 134);
    }
    button {
        margin: 10px;
        background-color: rgb(115, 115, 231);
        color: white;
        border: none;
        padding: 10px;
        border-radius: 5px;

    }
    button:hover {
        background-color: rgb(67, 67, 235);
    }

</style>
