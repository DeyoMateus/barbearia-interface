import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../services/api";

export function SuperAdminRegister() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [clientPhone, setClientPhone] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    async function handleRegister(e) {
        e.preventDefault();
        try {
            await api.post("/super/bootstrap", {
                name,
                email,
                password,
                client_phone: clientPhone
            });
            alert("SuperAdmin criado com sucesso! Faça login para continuar.");
            navigate("/super/sessions");
        } catch (err) {
            alert("Erro: " + (err.response?.data?.error || err.message));
        }
    }

    return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center text-white p-4">
            <form onSubmit={handleRegister} className="bg-gray-900 p-8 rounded-lg border border-gray-800 w-full max-w-md">
                <h1 className="text-2xl font-bold mb-6 text-amber-500">Configuração Inicial - SuperAdmin</h1>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Nome</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">E-mail</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-400 mb-2">Telefone</label>
                    <input
                        type="text"
                        value={clientPhone}
                        onChange={(e) => setClientPhone(e.target.value)} // 👈 Atualizando o estado correto
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
                        required
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm text-gray-400 mb-2">Senha</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded text-white"
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-amber-600 hover:bg-amber-500 transition-colors p-3 rounded font-bold text-black"
                >
                    Criar SuperAdmin
                </button>
            </form>
        </div>
    );
}