import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
    stages: [
        { duration: '10s', target: 50 },  // Incrementar hasta 50 usuarios en 10 segundos
        { duration: '20s', target: 50 },  // Mantener 50 usuarios durante 20 segundos
        { duration: '10s', target: 0 },   // Disminuir a 0 usuarios en 10 segundos
    ],
};

export default function () {
    const res = http.get('http://localhost:3000/api/v1'); // Cambia la URL si es necesario
    check(res, { 'status es 200': (r) => r.status === 200 });
    sleep(1);
}
