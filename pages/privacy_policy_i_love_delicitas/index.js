import { useEffect } from "react"; export default function Page() { useEffect(() => { window.location.href = "./code.html"; }, []); return <div>Carregando...</div>; }
