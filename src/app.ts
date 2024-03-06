import { Server } from "./presentation/server";

(async() => { //función anonima asincrona autoinvocada
    main();
})();

function main(){
    Server.start();
}

