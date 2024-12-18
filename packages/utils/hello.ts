import { helloInner } from "./hello-inner"

const sayHello = (name: string): string => {
    return helloInner(name)
}

export default sayHello 
