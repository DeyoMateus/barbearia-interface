//Centraliza como guardamos e recuperamos o slug da barbearia atual.
// Guardamos no localStorage porque, depois do login, a URL muda (vai para "/"),
// mas o navegador ainda precisa "lembrar" de qual barbearia veio o cadastro/login.

// src/utils/barbershopSlug.js
const STORAGE_KEY = "barbearia:slugAtual";

export function salvarBarbershopSlug(slug) {
  if (slug) {
    localStorage.setItem(STORAGE_KEY, slug);
  }
}

export function obterBarbershopSlug() {
  return localStorage.getItem(STORAGE_KEY);
}

export function limparBarbershopSlug() {
  localStorage.removeItem(STORAGE_KEY);
}
